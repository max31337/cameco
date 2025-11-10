<?php

namespace App\Http\Controllers\System\Organization;

use App\Models\Position;
use App\Models\Department;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;
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
     * Seed default job positions with hierarchy
     * 
     * Only Super Admin can call this endpoint
     * Prevents duplicates - checks if positions already exist
     * Dynamically creates positions for existing departments
     * Accepts optional custom positions array from request
     */
    public function seedDefaults(Request $request)
    {
        // Check authorization - Super Admin only
        Gate::authorize('system.onboarding.initialize');

        // Prevent duplicate seeding
        if (Position::count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Positions already exist. Delete existing positions to seed again.']);
        }

        // Get all existing departments
        $departments = Department::all();
        if ($departments->isEmpty()) {
            return redirect()->back()->withErrors(['error' => 'No departments found. Please seed departments first.']);
        }

        // Build department map for quick lookup
        $departmentMap = $departments->keyBy('code')->map(fn($d) => $d->id);

        // Get custom positions from request, or use defaults
        $customPositions = [];
        if ($request->has('positions')) {
            try {
                $customPositions = json_decode($request->input('positions'), true) ?? [];
            } catch (\Exception $e) {
                $customPositions = [];
            }
        }

        // If no custom positions provided, use default template
        if (empty($customPositions)) {
            $positionTemplates = [
                // Executive Level (for EXEC or top-level dept)
                ['title' => 'Chief Executive Officer', 'level' => 'executive', 'department_codes' => ['EXEC'], 'reports_to_title' => null],
                ['title' => 'Chief Operating Officer', 'level' => 'executive', 'department_codes' => ['EXEC'], 'reports_to_title' => 'CEO'],
                ['title' => 'Chief Financial Officer', 'level' => 'executive', 'department_codes' => ['EXEC', 'FIN'], 'reports_to_title' => 'CEO'],
                ['title' => 'Chief Technology Officer', 'level' => 'executive', 'department_codes' => ['EXEC', 'IT'], 'reports_to_title' => 'CEO'],

                // Director Level
                ['title' => 'HR Director', 'level' => 'director', 'department_codes' => ['HR', 'HR-OPS', 'HR-REC'], 'reports_to_title' => 'COO'],
                ['title' => 'Finance Director', 'level' => 'director', 'department_codes' => ['FIN', 'FIN-AP', 'FIN-AR', 'FIN-PAY'], 'reports_to_title' => 'CFO'],
                ['title' => 'Operations Director', 'level' => 'director', 'department_codes' => ['OPS'], 'reports_to_title' => 'COO'],
                ['title' => 'Sales Director', 'level' => 'director', 'department_codes' => ['SALES'], 'reports_to_title' => 'COO'],
                ['title' => 'IT Director', 'level' => 'director', 'department_codes' => ['IT'], 'reports_to_title' => 'CTO'],

                // Manager Level
                ['title' => 'HR Manager', 'level' => 'manager', 'department_codes' => ['HR-OPS'], 'reports_to_title' => 'HR Director'],
                ['title' => 'Recruitment Manager', 'level' => 'manager', 'department_codes' => ['HR-REC'], 'reports_to_title' => 'HR Director'],
                ['title' => 'Payroll Manager', 'level' => 'manager', 'department_codes' => ['FIN-PAY'], 'reports_to_title' => 'Finance Director'],
                ['title' => 'Accounts Manager', 'level' => 'manager', 'department_codes' => ['FIN-AP'], 'reports_to_title' => 'Finance Director'],
                ['title' => 'IT Manager', 'level' => 'manager', 'department_codes' => ['IT'], 'reports_to_title' => 'IT Director'],
                ['title' => 'Operations Manager', 'level' => 'manager', 'department_codes' => ['OPS'], 'reports_to_title' => 'Operations Director'],

                // Senior Level
                ['title' => 'Senior Accountant', 'level' => 'senior', 'department_codes' => ['FIN-AP'], 'reports_to_title' => 'Accounts Manager'],
                ['title' => 'Senior HR Specialist', 'level' => 'senior', 'department_codes' => ['HR-OPS'], 'reports_to_title' => 'HR Manager'],
                ['title' => 'Senior Developer', 'level' => 'senior', 'department_codes' => ['IT'], 'reports_to_title' => 'IT Manager'],
                ['title' => 'Senior Sales Representative', 'level' => 'senior', 'department_codes' => ['SALES'], 'reports_to_title' => 'Sales Director'],

                // Mid Level
                ['title' => 'Accountant', 'level' => 'mid', 'department_codes' => ['FIN-AP'], 'reports_to_title' => 'Senior Accountant'],
                ['title' => 'HR Specialist', 'level' => 'mid', 'department_codes' => ['HR-OPS'], 'reports_to_title' => 'HR Manager'],
                ['title' => 'Developer', 'level' => 'mid', 'department_codes' => ['IT'], 'reports_to_title' => 'Senior Developer'],
                ['title' => 'Sales Representative', 'level' => 'mid', 'department_codes' => ['SALES'], 'reports_to_title' => 'Senior Sales Representative'],
                ['title' => 'Operations Coordinator', 'level' => 'mid', 'department_codes' => ['OPS'], 'reports_to_title' => 'Operations Manager'],

                // Junior Level
                ['title' => 'Junior Accountant', 'level' => 'junior', 'department_codes' => ['FIN-AP'], 'reports_to_title' => 'Accountant'],
                ['title' => 'HR Associate', 'level' => 'junior', 'department_codes' => ['HR-OPS'], 'reports_to_title' => 'HR Specialist'],
                ['title' => 'Junior Developer', 'level' => 'junior', 'department_codes' => ['IT'], 'reports_to_title' => 'Developer'],
                ['title' => 'Junior Sales Representative', 'level' => 'junior', 'department_codes' => ['SALES'], 'reports_to_title' => 'Sales Representative'],
                ['title' => 'Administrative Assistant', 'level' => 'junior', 'department_codes' => ['ADMIN', 'OPS'], 'reports_to_title' => 'Operations Manager'],
            ];
        } else {
            // Transform custom positions to proper format with multiple department code options
            $positionTemplates = array_map(function ($pos) {
                return [
                    'title' => $pos['title'] ?? '',
                    'level' => $pos['level'] ?? 'mid',
                    'department_codes' => [$pos['department_code'] ?? ''],
                    'reports_to_title' => $pos['reporting_to'] ?? null,
                ];
            }, $customPositions);
        }

        try {
            // Build a map of position titles to IDs as we create them
            $positionMap = [];
            $createdPositions = [];

            foreach ($positionTemplates as $template) {
                // Find which department code from the template actually exists
                $existingDeptCode = null;
                $departmentId = null;

                foreach ($template['department_codes'] as $code) {
                    if (isset($departmentMap[$code])) {
                        $existingDeptCode = $code;
                        $departmentId = $departmentMap[$code];
                        break;
                    }
                }

                // Skip this position if none of its possible departments exist
                if (!$departmentId) {
                    continue;
                }

                // Resolve reports_to_title to reports_to ID
                $reportsToId = null;
                if ($template['reports_to_title'] && isset($positionMap[$template['reports_to_title']])) {
                    $reportsToId = $positionMap[$template['reports_to_title']];
                }

                // Create the position
                $position = Position::create([
                    'title' => $template['title'],
                    'level' => $template['level'],
                    'department_id' => $departmentId,
                    'reports_to' => $reportsToId,
                    'is_active' => true,
                ]);

                // Store in map for later references
                $positionMap[$template['title']] = $position->id;
                $createdPositions[] = $position;
            }

            if (empty($createdPositions)) {
                return redirect()->back()->withErrors(['error' => 'No positions could be created with the existing departments.']);
            }

            // Log audit trail
            $this->auditLog(
                'seed_positions',
                'Seeded default job positions based on existing departments',
                'high',
                'System Onboarding',
                [
                    'total_positions' => count($createdPositions),
                    'position_titles' => array_column($createdPositions, 'title'),
                ]
            );

            // Redirect back with success message for Inertia
            return redirect()->back()->with('message', 'Default positions created successfully');

        } catch (\Exception $e) {
            // Log error
            $this->auditLog(
                'seed_positions_failed',
                'Failed to seed positions: ' . $e->getMessage(),
                'high',
                'System Onboarding',
                ['error' => $e->getMessage()]
            );

            // Redirect back with error for Inertia
            return redirect()->back()->withErrors(['error' => 'Failed to seed positions: ' . $e->getMessage()]);
        }
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
