<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Http\Requests\HR\StoreDepartmentRequest;
use App\Http\Requests\HR\UpdateDepartmentRequest;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Department::class);
        // Load departments with employee count
        $departments = Department::query()
            ->withCount('employees')
            ->orderBy('name')
            ->get()
            ->map(function (Department $dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => (string) ($dept->code ?? ''),
                    'description' => $dept->description,
                    'parent_id' => $dept->parent_id,
                    'is_active' => (bool) $dept->is_active,
                    'employee_count' => $dept->employees_count,
                ];
            });

        $stats = [
            'total' => Department::count(),
            'active' => Department::where('is_active', true)->count(),
            'inactive' => Department::where('is_active', false)->count(),
        ];

        return Inertia::render('HR/Departments/Index', [
            'departments' => $departments,
            'statistics' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        $data = $request->validated();
        // Normalize optional fields
        $data['parent_id'] = $data['parent_id'] ?? null;
        $data['description'] = $data['description'] ?? null;

        Department::create($data);

        return back()->with('success', 'Department created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartmentRequest $request, Department $department): RedirectResponse
    {
        $data = $request->validated();
        $data['parent_id'] = $data['parent_id'] ?? null;
        $data['description'] = $data['description'] ?? null;

        $department->update($data);

        return back()->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified resource from storage (soft delete / archive).
     */
    public function destroy(Department $department): RedirectResponse
    {
        // Optional: prevent delete if has active employees (simple guard)
        if (method_exists($department, 'employees') && $department->employees()->exists()) {
            return back()->with('error', 'Cannot archive department with employees.');
        }

        $department->delete();

        return back()->with('success', 'Department archived successfully.');
    }
}
