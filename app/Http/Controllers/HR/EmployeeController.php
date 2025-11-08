<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Http\Requests\HR\StoreEmployeeRequest;
use App\Http\Requests\HR\UpdateEmployeeRequest;
use App\Services\HR\EmployeeService;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    use LogsSecurityAudits;

    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    /**
     * Display a listing of employees.
     */
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'department_id' => $request->input('department_id'),
            'status' => $request->input('status'),
            'employment_type' => $request->input('employment_type'),
            'sort_by' => $request->input('sort'),
            'sort_order' => $request->input('direction'),
        ];

        $employees = $this->employeeService->searchEmployees(
            filters: $filters,
            perPage: $request->input('per_page', 15)
        );

        // Get all departments for the filter dropdown
        $departments = \App\Models\Department::select('id', 'name')
            ->orderBy('name')
            ->get();

        // Get employee statistics
        $statistics = \App\Models\Employee::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        // Get grand total of all employees (unfiltered)
        $grandTotal = \App\Models\Employee::count();

        return Inertia::render('HR/Employees/Index', [
            'employees' => $employees,
            'filters' => $filters,
            'departments' => $departments,
            'statistics' => $statistics,
            'grandTotal' => $grandTotal,
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create()
    {
        // Get all departments for dropdown
        $departments = \App\Models\Department::select('id', 'name')
            ->orderBy('name')
            ->get();

        // Get all positions for dropdown
        $positions = \App\Models\Position::select('id', 'title as name', 'department_id')
            ->orderBy('title')
            ->get();

        // Get all active employees who can be supervisors
        $supervisors = \App\Models\Employee::with('profile:id,first_name,last_name')
            ->where('status', 'active')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'employee_number' => $employee->employee_number,
                    'name' => $employee->profile->first_name . ' ' . $employee->profile->last_name,
                ];
            });

        return Inertia::render('HR/Employees/Create', [
            'departments' => $departments,
            'positions' => $positions,
            'supervisors' => $supervisors,
        ]);
    }

    /**
     * Store a newly created employee.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $validated = $request->validated();
        
        // Log the validated data
        \Log::debug('Employee creation - validated data:', $validated);
        
        $result = $this->employeeService->createEmployee($validated);

        if ($result['success']) {
            // Log security audit
            $this->logAudit(
                eventType: 'employee_created',
                severity: 'info',
                details: [
                    'employee_id' => $result['employee']->id,
                    'employee_number' => $result['employee']->employee_number,
                    'profile_id' => $result['employee']->profile_id,
                    'department_id' => $result['employee']->department_id,
                ]
            );

            return redirect()
                ->route('hr.employees.show', $result['employee']->id)
                ->with('success', $result['message']);
        }

        return back()
            ->withErrors(['error' => $result['message']])
            ->withInput();
    }

    /**
     * Display the specified employee.
     */
    public function show(int $id)
    {
        $employee = $this->employeeService->getEmployeeById($id);

        if (!$employee) {
            abort(404, 'Employee not found');
        }

        return Inertia::render('HR/Employees/Show', [
            'employee' => $employee,
        ]);
    }

    /**
     * Show the form for editing the specified employee.
     */
    public function edit(int $id)
    {
        $employee = $this->employeeService->getEmployeeById($id);

        if (!$employee) {
            abort(404, 'Employee not found');
        }

        // Get all departments for dropdown
        $departments = \App\Models\Department::select('id', 'name')
            ->orderBy('name')
            ->get();

        // Get all positions for dropdown
        $positions = \App\Models\Position::select('id', 'title as name', 'department_id')
            ->orderBy('title')
            ->get();

        // Get all active employees who can be supervisors (excluding current employee)
        $supervisors = \App\Models\Employee::with('profile:id,first_name,last_name')
            ->where('status', 'active')
            ->where('id', '!=', $id)
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'employee_number' => $employee->employee_number,
                    'name' => $employee->profile->first_name . ' ' . $employee->profile->last_name,
                ];
            });

        return Inertia::render('HR/Employees/Edit', [
            'employee' => $employee,
            'departments' => $departments,
            'positions' => $positions,
            'supervisors' => $supervisors,
        ]);
    }

    /**
     * Update the specified employee.
     */
    public function update(UpdateEmployeeRequest $request, int $id)
    {
        $result = $this->employeeService->updateEmployee($id, $request->validated());

        if ($result['success']) {
            // Log security audit
            $this->logAudit(
                eventType: 'employee_updated',
                severity: 'info',
                details: [
                    'employee_id' => $result['employee']->id,
                    'employee_number' => $result['employee']->employee_number,
                    'updated_fields' => array_keys($request->validated()),
                ]
            );

            return redirect()
                ->route('hr.employees.show', $id)
                ->with('success', $result['message']);
        }

        return back()
            ->withErrors(['error' => $result['message']])
            ->withInput();
    }

    /**
     * Archive (soft delete) the specified employee.
     */
    public function destroy(int $id)
    {
        $employee = $this->employeeService->getEmployeeById($id);

        if (!$employee) {
            abort(404, 'Employee not found');
        }

        $result = $this->employeeService->archiveEmployee(
            employeeId: $id,
            reason: request()->input('reason', 'Archived by HR Manager'),
            terminationDate: request()->input('termination_date', now()->format('Y-m-d'))
        );

        if ($result['success']) {
            // Log security audit
            $this->logAudit(
                eventType: 'employee_archived',
                severity: 'info',
                details: [
                    'employee_id' => $id,
                    'employee_number' => $employee->employee_number,
                    'reason' => request()->input('reason'),
                ]
            );

            return redirect()
                ->route('hr.employees.index')
                ->with('success', $result['message']);
        }

        return back()
            ->withErrors(['error' => $result['message']]);
    }

    /**
     * Restore an archived employee.
     */
    public function restore(int $id)
    {
        $result = $this->employeeService->restoreEmployee($id);

        if ($result['success']) {
            // Log security audit
            $this->logAudit(
                eventType: 'employee_restored',
                severity: 'info',
                details: [
                    'employee_id' => $result['employee']->id,
                    'employee_number' => $result['employee']->employee_number,
                ]
            );

            return redirect()
                ->route('hr.employees.show', $id)
                ->with('success', $result['message']);
        }

        return back()
            ->withErrors(['error' => $result['message']]);
    }
}
