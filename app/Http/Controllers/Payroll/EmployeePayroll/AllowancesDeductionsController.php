<?php

namespace App\Http\Controllers\Payroll\EmployeePayroll;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AllowancesDeductionsController extends Controller
{
    /**
     * Display a listing of employee component assignments.
     */
    public function index(Request $request)
    {
        // TODO: Uncomment when actual database integration is ready
        // $this->authorize('viewAny', Employee::class);

        // Get filters
        $search = $request->input('search');
        $departmentId = $request->input('department_id');
        $status = $request->input('status', 'active');
        $componentType = $request->input('component_type');

        // Get all employees with their assigned components (mock data for now)
        $employees = $this->getMockEmployeeComponentAssignments($search, $departmentId, $status, $componentType);

        // Get all salary components for dropdowns
        $components = $this->getMockSalaryComponents();

        // Get departments for filters
        $departments = $this->getMockDepartments();

        // Get component types for filters
        $componentTypes = [
            ['id' => 'allowance', 'name' => 'Allowance'],
            ['id' => 'deduction', 'name' => 'Deduction'],
            ['id' => 'tax', 'name' => 'Tax'],
            ['id' => 'contribution', 'name' => 'Contribution'],
        ];

        return Inertia::render('Payroll/EmployeePayroll/AllowancesDeductions/Index', [
            'employeeComponents' => $employees,
            'components' => $components,
            'departments' => $departments,
            'componentTypes' => $componentTypes,
            'filters' => [
                'search' => $search ?? '',
                'department_id' => $departmentId ?? null,
                'status' => $status,
                'component_type' => $componentType ?? null,
            ],
        ]);
    }

    /**
     * Store a newly assigned component to an employee.
     */
    public function store(Request $request)
    {
        // TODO: Uncomment when actual database integration is ready
        // $this->authorize('create', Employee::class);
        // NOTE: Authorization disabled for mock data - enable when using real database

        $validated = $request->validate([
            'employee_id' => 'required|integer',
            'salary_component_id' => 'required|integer',
            'amount' => 'nullable|numeric|min:0',
            'percentage' => 'nullable|numeric|min:0|max:100',
            'units' => 'nullable|numeric|min:0',
            'frequency' => 'required|in:per_payroll,monthly,quarterly,semi_annual,annually,one_time',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after:effective_date',
            'is_prorated' => 'boolean',
            'requires_attendance' => 'boolean',
        ]);

        // Mock: Return success response
        return response()->json([
            'success' => true,
            'message' => 'Component assignment created successfully',
            'data' => [
                'id' => rand(1000, 9999),
                'employee_id' => $validated['employee_id'],
                'salary_component_id' => $validated['salary_component_id'],
                'amount' => $validated['amount'] ?? null,
                'percentage' => $validated['percentage'] ?? null,
                'frequency' => $validated['frequency'],
                'effective_date' => $validated['effective_date'],
                'end_date' => $validated['end_date'] ?? null,
                'is_active' => true,
                'created_at' => now(),
            ],
        ], 201);
    }

    /**
     * Update an employee component assignment.
     */
    public function update(Request $request, int $id)
    {
        // TODO: Uncomment when actual database integration is ready
        // $this->authorize('update', Employee::class);
        // NOTE: Authorization disabled for mock data - enable when using real database

        $validated = $request->validate([
            'amount' => 'nullable|numeric|min:0',
            'percentage' => 'nullable|numeric|min:0|max:100',
            'units' => 'nullable|numeric|min:0',
            'frequency' => 'required|in:per_payroll,monthly,quarterly,semi_annual,annually,one_time',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after:effective_date',
            'is_prorated' => 'boolean',
            'requires_attendance' => 'boolean',
        ]);

        // Mock: Return success response
        return response()->json([
            'success' => true,
            'message' => 'Component assignment updated successfully',
        ]);
    }

    /**
     * Delete an employee component assignment.
     */
    public function destroy(int $id)
    {
        $this->authorize('delete', Employee::class);

        // Mock: Return success response
        return response()->json([
            'success' => true,
            'message' => 'Component assignment deleted successfully',
        ]);
    }

    /**
     * Get component history for an employee.
     */
    public function history(Request $request, int $employeeId)
    {
        $this->authorize('viewAny', Employee::class);

        $componentId = $request->input('component_id');

        // Mock data
        $history = [
            [
                'id' => 1,
                'employee_id' => $employeeId,
                'component_id' => $componentId,
                'component_name' => 'Rice Allowance',
                'amount' => 2000,
                'percentage' => null,
                'frequency' => 'per_payroll',
                'effective_date' => '2025-01-01',
                'end_date' => '2025-10-31',
                'status' => 'expired',
                'changed_at' => '2025-10-31',
                'changed_by' => 'Admin User',
            ],
            [
                'id' => 2,
                'employee_id' => $employeeId,
                'component_id' => $componentId,
                'component_name' => 'Rice Allowance',
                'amount' => 2500,
                'percentage' => null,
                'frequency' => 'per_payroll',
                'effective_date' => '2025-11-01',
                'end_date' => null,
                'status' => 'active',
                'changed_at' => '2025-11-01',
                'changed_by' => 'Admin User',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $history,
        ]);
    }

    /**
     * Bulk assign components to multiple employees.
     */
    public function bulkAssign(Request $request)
    {
        $this->authorize('create', Employee::class);

        $validated = $request->validate([
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'integer',
            'salary_component_id' => 'required|integer',
            'amount' => 'nullable|numeric|min:0',
            'percentage' => 'nullable|numeric|min:0|max:100',
            'frequency' => 'required|in:per_payroll,monthly,quarterly,semi_annual,annually,one_time',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after:effective_date',
        ]);

        // Mock: Return success response with assignment count
        return response()->json([
            'success' => true,
            'message' => sprintf('%d components assigned successfully', count($validated['employee_ids'])),
            'assigned_count' => count($validated['employee_ids']),
        ], 201);
    }

    // =====================================================================
    // MOCK DATA METHODS
    // =====================================================================

    private function getMockEmployeeComponentAssignments($search = null, $departmentId = null, $status = 'active', $componentType = null)
    {
        $assignments = [
            // Employee 1: Maria Cruz
            [
                'id' => 1,
                'employee_id' => 1,
                'employee_number' => 'EMP-2024-0001',
                'first_name' => 'Maria',
                'last_name' => 'Cruz',
                'department' => 'HR',
                'department_id' => 1,
                'position' => 'HR Manager',
                'components' => [
                    [
                        'id' => 101,
                        'salary_component_id' => 1,
                        'component_name' => 'Rice Allowance',
                        'component_code' => 'RICE',
                        'component_type' => 'allowance',
                        'amount' => 2000,
                        'percentage' => null,
                        'units' => null,
                        'frequency' => 'per_payroll',
                        'effective_date' => '2025-01-15',
                        'end_date' => null,
                        'is_active' => true,
                        'is_prorated' => false,
                        'requires_attendance' => true,
                    ],
                    [
                        'id' => 102,
                        'salary_component_id' => 2,
                        'component_name' => 'Uniform Allowance',
                        'component_code' => 'UNIFORM',
                        'component_type' => 'allowance',
                        'amount' => 3000,
                        'percentage' => null,
                        'units' => null,
                        'frequency' => 'monthly',
                        'effective_date' => '2025-02-01',
                        'end_date' => null,
                        'is_active' => true,
                        'is_prorated' => false,
                        'requires_attendance' => true,
                    ],
                ],
                'total_allowances' => 5000,
                'total_deductions' => 0,
            ],
            // Employee 2: Ana Reyes
            [
                'id' => 2,
                'employee_id' => 2,
                'employee_number' => 'EMP-2024-0002',
                'first_name' => 'Ana',
                'last_name' => 'Reyes',
                'department' => 'HR',
                'department_id' => 1,
                'position' => 'HR Specialist',
                'components' => [
                    [
                        'id' => 201,
                        'salary_component_id' => 1,
                        'component_name' => 'Rice Allowance',
                        'component_code' => 'RICE',
                        'component_type' => 'allowance',
                        'amount' => 2000,
                        'percentage' => null,
                        'units' => null,
                        'frequency' => 'per_payroll',
                        'effective_date' => '2025-06-01',
                        'end_date' => null,
                        'is_active' => true,
                        'is_prorated' => false,
                        'requires_attendance' => true,
                    ],
                ],
                'total_allowances' => 2000,
                'total_deductions' => 0,
            ],
            // Employee 3: Roberto Fernandez
            [
                'id' => 3,
                'employee_id' => 3,
                'employee_number' => 'EMP-2024-0003',
                'first_name' => 'Roberto',
                'last_name' => 'Fernandez',
                'department' => 'IT',
                'department_id' => 2,
                'position' => 'IT Manager',
                'components' => [
                    [
                        'id' => 301,
                        'salary_component_id' => 1,
                        'component_name' => 'Rice Allowance',
                        'component_code' => 'RICE',
                        'component_type' => 'allowance',
                        'amount' => 2000,
                        'percentage' => null,
                        'units' => null,
                        'frequency' => 'per_payroll',
                        'effective_date' => '2025-03-20',
                        'end_date' => null,
                        'is_active' => true,
                        'is_prorated' => false,
                        'requires_attendance' => true,
                    ],
                    [
                        'id' => 302,
                        'salary_component_id' => 5,
                        'component_name' => 'Communication Allowance',
                        'component_code' => 'COMM',
                        'component_type' => 'allowance',
                        'amount' => 1500,
                        'percentage' => null,
                        'units' => null,
                        'frequency' => 'monthly',
                        'effective_date' => '2025-03-20',
                        'end_date' => null,
                        'is_active' => true,
                        'is_prorated' => false,
                        'requires_attendance' => false,
                    ],
                    [
                        'id' => 303,
                        'salary_component_id' => 10,
                        'component_name' => 'SSS Loan',
                        'component_code' => 'SSS_LOAN',
                        'component_type' => 'deduction',
                        'amount' => 500,
                        'percentage' => null,
                        'units' => null,
                        'frequency' => 'per_payroll',
                        'effective_date' => '2025-09-01',
                        'end_date' => '2026-02-28',
                        'is_active' => true,
                        'is_prorated' => false,
                        'requires_attendance' => false,
                    ],
                ],
                'total_allowances' => 3500,
                'total_deductions' => 500,
            ],
            // Employee 4: Carlos Ramos
            [
                'id' => 4,
                'employee_id' => 4,
                'employee_number' => 'EMP-2024-0004',
                'first_name' => 'Carlos',
                'last_name' => 'Ramos',
                'department' => 'IT',
                'department_id' => 2,
                'position' => 'Software Developer',
                'components' => [
                    [
                        'id' => 401,
                        'salary_component_id' => 1,
                        'component_name' => 'Rice Allowance',
                        'component_code' => 'RICE',
                        'component_type' => 'allowance',
                        'amount' => 2000,
                        'percentage' => null,
                        'units' => null,
                        'frequency' => 'per_payroll',
                        'effective_date' => '2025-02-14',
                        'end_date' => null,
                        'is_active' => true,
                        'is_prorated' => false,
                        'requires_attendance' => true,
                    ],
                ],
                'total_allowances' => 2000,
                'total_deductions' => 0,
            ],
            // Employee 5: Patricia Santos
            [
                'id' => 5,
                'employee_id' => 5,
                'employee_number' => 'EMP-2024-0005',
                'first_name' => 'Patricia',
                'last_name' => 'Santos',
                'department' => 'Finance',
                'department_id' => 3,
                'position' => 'Finance Manager',
                'components' => [
                    [
                        'id' => 501,
                        'salary_component_id' => 1,
                        'component_name' => 'Rice Allowance',
                        'component_code' => 'RICE',
                        'component_type' => 'allowance',
                        'amount' => 2000,
                        'percentage' => null,
                        'units' => null,
                        'frequency' => 'per_payroll',
                        'effective_date' => '2025-05-10',
                        'end_date' => null,
                        'is_active' => true,
                        'is_prorated' => false,
                        'requires_attendance' => true,
                    ],
                    [
                        'id' => 502,
                        'salary_component_id' => 6,
                        'component_name' => 'Medical Allowance',
                        'component_code' => 'MEDICAL',
                        'component_type' => 'allowance',
                        'amount' => 3000,
                        'percentage' => null,
                        'units' => null,
                        'frequency' => 'per_payroll',
                        'effective_date' => '2025-05-10',
                        'end_date' => null,
                        'is_active' => true,
                        'is_prorated' => true,
                        'requires_attendance' => true,
                    ],
                ],
                'total_allowances' => 5000,
                'total_deductions' => 0,
            ],
        ];

        // Apply filters
        $filtered = $assignments;

        if ($search) {
            $search = strtolower($search);
            $filtered = array_filter($filtered, function ($item) use ($search) {
                return strpos(strtolower($item['first_name'] . ' ' . $item['last_name']), $search) !== false
                    || strpos(strtolower($item['employee_number']), $search) !== false;
            });
        }

        if ($departmentId) {
            $filtered = array_filter($filtered, function ($item) use ($departmentId) {
                return $item['department_id'] == $departmentId;
            });
        }

        if ($componentType) {
            $filtered = array_filter($filtered, function ($item) use ($componentType) {
                return collect($item['components'])->contains('component_type', $componentType);
            });
        }

        return array_values($filtered);
    }

    private function getMockSalaryComponents()
    {
        return [
            [
                'id' => 1,
                'code' => 'RICE',
                'name' => 'Rice Allowance',
                'component_type' => 'allowance',
                'category' => 'allowance',
                'description' => 'Monthly rice allowance (de minimis)',
                'default_amount' => 2000,
                'is_taxable' => false,
                'is_deminimis' => true,
            ],
            [
                'id' => 2,
                'code' => 'UNIFORM',
                'name' => 'Uniform Allowance',
                'component_type' => 'allowance',
                'category' => 'allowance',
                'description' => 'Uniform allowance (de minimis)',
                'default_amount' => 3000,
                'is_taxable' => false,
                'is_deminimis' => true,
            ],
            [
                'id' => 3,
                'code' => 'LAUNDRY',
                'name' => 'Laundry Allowance',
                'component_type' => 'allowance',
                'category' => 'allowance',
                'description' => 'Laundry allowance (de minimis)',
                'default_amount' => 600,
                'is_taxable' => false,
                'is_deminimis' => true,
            ],
            [
                'id' => 4,
                'code' => 'COLA',
                'name' => 'COLA',
                'component_type' => 'allowance',
                'category' => 'allowance',
                'description' => 'Cost of Living Allowance',
                'default_amount' => 5000,
                'is_taxable' => true,
                'is_deminimis' => false,
            ],
            [
                'id' => 5,
                'code' => 'COMM',
                'name' => 'Communication Allowance',
                'component_type' => 'allowance',
                'category' => 'allowance',
                'description' => 'Communication/Phone allowance',
                'default_amount' => 1500,
                'is_taxable' => true,
                'is_deminimis' => false,
            ],
            [
                'id' => 6,
                'code' => 'MEDICAL',
                'name' => 'Medical Allowance',
                'component_type' => 'allowance',
                'category' => 'allowance',
                'description' => 'Medical allowance (de minimis)',
                'default_amount' => 3000,
                'is_taxable' => false,
                'is_deminimis' => true,
            ],
            [
                'id' => 10,
                'code' => 'SSS_LOAN',
                'name' => 'SSS Loan',
                'component_type' => 'deduction',
                'category' => 'loan',
                'description' => 'SSS salary loan deduction',
                'default_amount' => null,
                'is_taxable' => false,
                'is_deminimis' => false,
            ],
            [
                'id' => 11,
                'code' => 'PAGIBIG_LOAN',
                'name' => 'Pag-IBIG Loan',
                'component_type' => 'deduction',
                'category' => 'loan',
                'description' => 'Pag-IBIG salary loan deduction',
                'default_amount' => null,
                'is_taxable' => false,
                'is_deminimis' => false,
            ],
            [
                'id' => 12,
                'code' => 'COMPANY_LOAN',
                'name' => 'Company Loan',
                'component_type' => 'deduction',
                'category' => 'loan',
                'description' => 'Company salary loan deduction',
                'default_amount' => null,
                'is_taxable' => false,
                'is_deminimis' => false,
            ],
        ];
    }

    private function getMockDepartments()
    {
        return [
            ['id' => 1, 'code' => 'HR', 'name' => 'Human Resources'],
            ['id' => 2, 'code' => 'IT', 'name' => 'Information Technology'],
            ['id' => 3, 'code' => 'FIN', 'name' => 'Finance & Accounting'],
            ['id' => 4, 'code' => 'OPS', 'name' => 'Operations'],
            ['id' => 5, 'code' => 'SALES', 'name' => 'Sales'],
            ['id' => 6, 'code' => 'PROD', 'name' => 'Production'],
        ];
    }
}
