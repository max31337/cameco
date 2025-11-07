<?php

namespace App\Http\Controllers\System\Organization;

use App\Models\Department;
use App\Models\User;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController
{
    use LogsSecurityAudits;

    /**
     * Display list of departments with hierarchy
     */
    public function index(): Response
    {
        $departments = Department::with(['parent', 'manager', 'children'])
            ->withCount('positions')
            ->get();

        // Build hierarchical structure
        $hierarchical = $departments
            ->filter(fn($d) => !$d->parent_id)
            ->map(fn($d) => $this->formatDepartmentTree($d));

        $stats = [
            'total' => $departments->count(),
            'active' => $departments->where('is_active', true)->count(),
            'inactive' => $departments->where('is_active', false)->count(),
            'with_manager' => $departments->whereNotNull('manager_id')->count(),
            'total_budget' => $departments->sum('budget'),
        ];

        return Inertia::render('System/Organization/Departments', [
            'departments' => $departments->map($this->formatDepartment()),
            'hierarchical' => $hierarchical,
            'managers' => User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['manager', 'director', 'admin']);
            })->select('id', 'name', 'email')->get(),
            'stats' => $stats,
        ]);
    }

    /**
     * Store a new department
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'unique:departments'],
            'code' => ['required', 'string', 'unique:departments'],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', 'exists:departments,id'],
            'manager_id' => ['nullable', 'exists:users,id'],
            'budget' => ['nullable', 'integer', 'min:0'],
        ]);

        $department = Department::create($validated);

        $this->auditLog(
            'department_created',
            "Created department: {$department->name} ({$department->code})",
            'high',
            'Department Management',
            ['department_id' => $department->id, 'department_name' => $department->name]
        );

        return response()->json($this->formatDepartment()($department), 201);
    }

    /**
     * Display department detail
     */
    public function show(Department $department): Response
    {
        return Inertia::render('System/Organization/DepartmentDetail', [
            'department' => $this->formatDepartment()($department->load(['parent', 'manager', 'children', 'positions'])),
        ]);
    }

    /**
     * Update department
     */
    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', Rule::unique('departments')->ignore($department->id)],
            'code' => ['required', 'string', Rule::unique('departments')->ignore($department->id)],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', 'exists:departments,id'],
            'manager_id' => ['nullable', 'exists:users,id'],
            'budget' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $department->update($validated);

        $this->auditLog(
            'department_updated',
            "Updated department: {$department->name} ({$department->code})",
            'medium',
            'Department Management',
            ['department_id' => $department->id]
        );

        return response()->json($this->formatDepartment()($department));
    }

    /**
     * Delete department
     */
    public function destroy(Department $department)
    {
        // Check if department has sub-departments or positions
        if ($department->children->count() > 0 || $department->positions->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete department with sub-departments or positions',
            ], 422);
        }

        $name = $department->name;
        $department->delete();

        $this->auditLog(
            'department_deleted',
            "Deleted department: {$name}",
            'high',
            'Department Management',
            ['department_id' => $department->id]
        );

        return response()->json(['message' => 'Department deleted']);
    }

    /**
     * Format department for response
     */
    private function formatDepartment()
    {
        return function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code,
                'description' => $department->description,
                'parent_id' => $department->parent_id,
                'parent_name' => $department->parent?->name,
                'manager_id' => $department->manager_id,
                'manager_name' => $department->manager?->name,
                'manager_email' => $department->manager?->email,
                'budget' => $department->budget,
                'is_active' => $department->is_active,
                'positions_count' => $department->positions_count ?? 0,
                'created_at' => $department->created_at,
                'updated_at' => $department->updated_at,
            ];
        };
    }

    /**
     * Format department tree for hierarchy view
     */
    private function formatDepartmentTree(Department $department, int $depth = 0): array
    {
        return [
            'id' => $department->id,
            'name' => $department->name,
            'code' => $department->code,
            'manager_name' => $department->manager?->name,
            'is_active' => $department->is_active,
            'positions_count' => $department->positions_count ?? 0,
            'depth' => $depth,
            'children' => $department->children
                ->map(fn($child) => $this->formatDepartmentTree($child, $depth + 1))
                ->values()
                ->all(),
        ];
    }
}
