<?php

namespace App\Http\Controllers\System\Organization;

use App\Models\Position;
use App\Models\Department;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PositionController
{
    use LogsSecurityAudits;

    /**
     * Display list of positions with hierarchy
     */
    public function index(Request $request): Response
    {
        $query = Position::with(['department', 'reportsTo', 'directReports']);

        // Filter by department if provided
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->get('department_id'));
        }

        // Filter by level if provided
        if ($request->filled('level')) {
            $query->where('level', $request->get('level'));
        }

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $positions = $query->paginate(50);

        $departments = Department::active()
            ->select('id', 'name', 'code')
            ->orderBy('name')
            ->get();

        $levels = ['junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive'];

        $stats = [
            'total' => Position::count(),
            'active' => Position::where('is_active', true)->count(),
            'by_level' => Position::select('level')
                ->selectRaw('count(*) as count')
                ->groupBy('level')
                ->pluck('count', 'level'),
            'with_reports' => Position::whereHas('directReports')->count(),
        ];

        return Inertia::render('System/Organization/Positions', [
            'positions' => $positions->through($this->formatPosition()),
            'departments' => $departments,
            'levels' => $levels,
            'stats' => $stats,
            'filters' => [
                'department_id' => $request->get('department_id'),
                'level' => $request->get('level'),
                'search' => $request->get('search'),
            ],
        ]);
    }

    /**
     * Store a new position
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'unique:positions'],
            'description' => ['nullable', 'string'],
            'department_id' => ['required', 'exists:departments,id'],
            'reports_to' => ['nullable', 'exists:positions,id'],
            'level' => ['required', 'in:junior,mid,senior,lead,manager,director,executive'],
            'min_salary' => ['nullable', 'integer', 'min:0'],
            'max_salary' => ['nullable', 'integer', 'min:0'],
        ]);

        // Validate salary range
        if ($validated['min_salary'] && $validated['max_salary']) {
            if ($validated['min_salary'] > $validated['max_salary']) {
                return response()->json([
                    'message' => 'Min salary must be less than max salary',
                ], 422);
            }
        }

        $position = Position::create($validated);

        $this->auditLog(
            'position_created',
            "Created position: {$position->title}",
            'high',
            'Position Management',
            ['position_id' => $position->id, 'position_title' => $position->title]
        );

        return response()->json($this->formatPosition()($position->load(['department', 'reportsTo'])), 201);
    }

    /**
     * Display position detail
     */
    public function show(Position $position): Response
    {
        return Inertia::render('System/Organization/PositionDetail', [
            'position' => $this->formatPosition()($position->load(['department', 'reportsTo', 'directReports'])),
        ]);
    }

    /**
     * Update position
     */
    public function update(Request $request, Position $position)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', Rule::unique('positions')->ignore($position->id)],
            'description' => ['nullable', 'string'],
            'department_id' => ['required', 'exists:departments,id'],
            'reports_to' => ['nullable', 'exists:positions,id'],
            'level' => ['required', 'in:junior,mid,senior,lead,manager,director,executive'],
            'min_salary' => ['nullable', 'integer', 'min:0'],
            'max_salary' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        // Validate salary range
        if ($validated['min_salary'] && $validated['max_salary']) {
            if ($validated['min_salary'] > $validated['max_salary']) {
                return response()->json([
                    'message' => 'Min salary must be less than max salary',
                ], 422);
            }
        }

        $position->update($validated);

        $this->auditLog(
            'position_updated',
            "Updated position: {$position->title}",
            'medium',
            'Position Management',
            ['position_id' => $position->id]
        );

        return response()->json($this->formatPosition()($position->load(['department', 'reportsTo'])));
    }

    /**
     * Delete position
     */
    public function destroy(Position $position)
    {
        if ($position->directReports()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete position with direct reports',
            ], 422);
        }

        $title = $position->title;
        $position->delete();

        $this->auditLog(
            'position_deleted',
            "Deleted position: {$title}",
            'high',
            'Position Management',
            ['position_id' => $position->id]
        );

        return response()->json(['message' => 'Position deleted']);
    }

    /**
     * Format position for response
     */
    private function formatPosition()
    {
        return function ($position) {
            return [
                'id' => $position->id,
                'title' => $position->title,
                'description' => $position->description,
                'department_id' => $position->department_id,
                'department_name' => $position->department?->name,
                'reports_to' => $position->reports_to,
                'reports_to_title' => $position->reportsTo?->title,
                'level' => $position->level,
                'min_salary' => $position->min_salary,
                'max_salary' => $position->max_salary,
                'is_active' => $position->is_active,
                'direct_reports_count' => $position->directReports()->count(),
                'created_at' => $position->created_at,
                'updated_at' => $position->updated_at,
            ];
        };
    }
}
