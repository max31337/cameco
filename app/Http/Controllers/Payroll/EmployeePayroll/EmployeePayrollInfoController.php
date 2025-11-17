<?php

namespace App\Http\Controllers\Payroll\EmployeePayroll;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeePayrollInfoController extends Controller
{
    /**
     * Display a listing of employee payroll information.
     */
    public function index(Request $request)
    {
        // Get filter parameters
        $search = $request->get('search', '');
        $salaryType = $request->get('salary_type', '');
        $paymentMethod = $request->get('payment_method', '');
        $taxStatus = $request->get('tax_status', '');
        $status = $request->get('status', 'all');

        // Mock employee payroll data
        $mockEmployees = $this->getMockEmployeePayrollData();

        // Apply filters
        $filtered = collect($mockEmployees);

        if ($search) {
            $searchLower = strtolower($search);
            $filtered = $filtered->filter(function ($emp) use ($searchLower) {
                return str_contains(strtolower($emp['employee_name']), $searchLower) ||
                       str_contains(strtolower($emp['employee_number']), $searchLower);
            });
        }

        if ($salaryType) {
            $filtered = $filtered->where('salary_type', $salaryType);
        }

        if ($paymentMethod) {
            $filtered = $filtered->where('payment_method', $paymentMethod);
        }

        if ($taxStatus) {
            $filtered = $filtered->where('tax_status', $taxStatus);
        }

        if ($status !== 'all') {
            $filtered = $filtered->where('is_active', $status === 'active');
        }

        return Inertia::render('Payroll/EmployeePayroll/Info/Index', [
            'employees' => $filtered->values()->toArray(),
            'filters' => [
                'search' => $search,
                'salary_type' => $salaryType,
                'payment_method' => $paymentMethod,
                'tax_status' => $taxStatus,
                'status' => $status,
            ],
            'available_salary_types' => [
                ['value' => 'monthly', 'label' => 'Monthly'],
                ['value' => 'daily', 'label' => 'Daily'],
                ['value' => 'hourly', 'label' => 'Hourly'],
                ['value' => 'contractual', 'label' => 'Contractual'],
                ['value' => 'project_based', 'label' => 'Project-Based'],
            ],
            'available_payment_methods' => [
                ['value' => 'bank_transfer', 'label' => 'Bank Transfer'],
                ['value' => 'cash', 'label' => 'Cash'],
                ['value' => 'check', 'label' => 'Check'],
            ],
            'available_tax_statuses' => [
                ['value' => 'Z', 'label' => 'Zero/Exempt (Z)'],
                ['value' => 'S', 'label' => 'Single (S)'],
                ['value' => 'ME', 'label' => 'Married Employee (ME)'],
                ['value' => 'S1', 'label' => 'Single w/ 1 Dependent (S1)'],
                ['value' => 'ME1', 'label' => 'Married w/ 1 Dependent (ME1)'],
                ['value' => 'S2', 'label' => 'Single w/ 2 Dependents (S2)'],
                ['value' => 'ME2', 'label' => 'Married w/ 2 Dependents (ME2)'],
                ['value' => 'S3', 'label' => 'Single w/ 3 Dependents (S3)'],
                ['value' => 'ME3', 'label' => 'Married w/ 3 Dependents (ME3)'],
                ['value' => 'S4', 'label' => 'Single w/ 4+ Dependents (S4)'],
                ['value' => 'ME4', 'label' => 'Married w/ 4+ Dependents (ME4)'],
            ],
            'available_departments' => [
                ['id' => 1, 'name' => 'Operations'],
                ['id' => 2, 'name' => 'Finance'],
                ['id' => 3, 'name' => 'Human Resources'],
                ['id' => 4, 'name' => 'Information Technology'],
                ['id' => 5, 'name' => 'Marketing'],
            ],
        ]);
    }

    /**
     * Show the form for creating a new employee payroll info.
     */
    public function create()
    {
        return Inertia::render('Payroll/EmployeePayroll/Info/Create', [
            'available_salary_types' => [
                ['value' => 'monthly', 'label' => 'Monthly'],
                ['value' => 'daily', 'label' => 'Daily'],
                ['value' => 'hourly', 'label' => 'Hourly'],
                ['value' => 'contractual', 'label' => 'Contractual'],
                ['value' => 'project_based', 'label' => 'Project-Based'],
            ],
            'available_payment_methods' => [
                ['value' => 'bank_transfer', 'label' => 'Bank Transfer'],
                ['value' => 'cash', 'label' => 'Cash'],
                ['value' => 'check', 'label' => 'Check'],
            ],
            'available_tax_statuses' => [
                ['value' => 'Z', 'label' => 'Zero/Exempt (Z)'],
                ['value' => 'S', 'label' => 'Single (S)'],
                ['value' => 'ME', 'label' => 'Married Employee (ME)'],
            ],
        ]);
    }

    /**
     * Store a newly created employee payroll info in storage.
     */
    public function store(Request $request)
    {
        // Mock implementation - just redirect back
        return redirect()->route('payroll.employee-payroll-info.index')
            ->with('success', 'Employee payroll information created successfully.');
    }

    /**
     * Display the specified employee payroll info.
     */
    public function show($id)
    {
        // Mock implementation
        $mockEmployees = $this->getMockEmployeePayrollData();
        $employee = collect($mockEmployees)->firstWhere('id', $id);

        if (!$employee) {
            abort(404);
        }

        return Inertia::render('Payroll/EmployeePayroll/Info/Show', [
            'employee' => $employee,
        ]);
    }

    /**
     * Show the form for editing the specified employee payroll info.
     */
    public function edit($id)
    {
        $mockEmployees = $this->getMockEmployeePayrollData();
        $employee = collect($mockEmployees)->firstWhere('id', $id);

        if (!$employee) {
            abort(404);
        }

        return Inertia::render('Payroll/EmployeePayroll/Info/Edit', [
            'employee' => $employee,
            'available_salary_types' => [
                ['value' => 'monthly', 'label' => 'Monthly'],
                ['value' => 'daily', 'label' => 'Daily'],
                ['value' => 'hourly', 'label' => 'Hourly'],
                ['value' => 'contractual', 'label' => 'Contractual'],
                ['value' => 'project_based', 'label' => 'Project-Based'],
            ],
            'available_payment_methods' => [
                ['value' => 'bank_transfer', 'label' => 'Bank Transfer'],
                ['value' => 'cash', 'label' => 'Cash'],
                ['value' => 'check', 'label' => 'Check'],
            ],
            'available_tax_statuses' => [
                ['value' => 'Z', 'label' => 'Zero/Exempt (Z)'],
                ['value' => 'S', 'label' => 'Single (S)'],
                ['value' => 'ME', 'label' => 'Married Employee (ME)'],
                ['value' => 'S1', 'label' => 'Single w/ 1 Dependent (S1)'],
                ['value' => 'ME1', 'label' => 'Married w/ 1 Dependent (ME1)'],
            ],
        ]);
    }

    /**
     * Update the specified employee payroll info in storage.
     */
    public function update(Request $request, $id)
    {
        // Mock implementation - just redirect back
        return redirect()->route('payroll.employee-payroll-info.index')
            ->with('success', 'Employee payroll information updated successfully.');
    }

    /**
     * Remove the specified employee payroll info from storage.
     */
    public function destroy($id)
    {
        // Mock implementation - just redirect back
        return redirect()->route('payroll.employee-payroll-info.index')
            ->with('success', 'Employee payroll information deleted successfully.');
    }

    /**
     * Get mock employee payroll data
     */
    private function getMockEmployeePayrollData()
    {
        $now = date('Y-m-d');
        return [
            [
                'id' => 1,
                'employee_id' => 1,
                'employee_name' => 'Maria Santos',
                'employee_number' => 'EMP001',
                'department' => 'Operations',
                'position' => 'Operations Manager',
                'salary_type' => 'monthly',
                'salary_type_label' => 'Monthly',
                'basic_salary' => 45000.00,
                'daily_rate' => null,
                'hourly_rate' => null,
                'payment_method' => 'bank_transfer',
                'payment_method_label' => 'Bank Transfer',
                'tax_status' => 'ME',
                'tax_status_label' => 'Married Employee (ME)',
                'rdo_code' => 'NCR-01',
                'withholding_tax_exemption' => 0.00,
                'is_tax_exempt' => false,
                'is_substituted_filing' => false,
                'sss_number' => '00-1234567-8',
                'philhealth_number' => '00112233445566',
                'pagibig_number' => '121912-012-3456789',
                'tin_number' => '123-456-789-001',
                'sss_bracket' => 'E4',
                'is_sss_voluntary' => false,
                'philhealth_is_indigent' => false,
                'pagibig_employee_rate' => 1.00,
                'bank_name' => 'BDO',
                'bank_code' => '006',
                'bank_account_number' => '0100123456789',
                'bank_account_name' => 'Maria Santos',
                'is_entitled_to_rice' => true,
                'is_entitled_to_uniform' => true,
                'is_entitled_to_laundry' => true,
                'is_entitled_to_medical' => true,
                'is_active' => true,
                'status_label' => 'Active',
                'effective_date' => '2024-01-01',
                'end_date' => null,
                'created_at' => '2024-01-01T08:00:00Z',
                'updated_at' => '2024-01-01T08:00:00Z',
            ],
            [
                'id' => 2,
                'employee_id' => 2,
                'employee_name' => 'Juan Dela Cruz',
                'employee_number' => 'EMP002',
                'department' => 'Finance',
                'position' => 'Senior Accountant',
                'salary_type' => 'monthly',
                'salary_type_label' => 'Monthly',
                'basic_salary' => 38000.00,
                'daily_rate' => null,
                'hourly_rate' => null,
                'payment_method' => 'bank_transfer',
                'payment_method_label' => 'Bank Transfer',
                'tax_status' => 'S',
                'tax_status_label' => 'Single (S)',
                'rdo_code' => 'NCR-02',
                'withholding_tax_exemption' => 0.00,
                'is_tax_exempt' => false,
                'is_substituted_filing' => false,
                'sss_number' => '00-9876543-2',
                'philhealth_number' => '00112233445567',
                'pagibig_number' => '121912-012-3456790',
                'tin_number' => '123-456-789-002',
                'sss_bracket' => 'E3',
                'is_sss_voluntary' => false,
                'philhealth_is_indigent' => false,
                'pagibig_employee_rate' => 1.00,
                'bank_name' => 'Metrobank',
                'bank_code' => '003',
                'bank_account_number' => '1400123456789',
                'bank_account_name' => 'Juan Dela Cruz',
                'is_entitled_to_rice' => true,
                'is_entitled_to_uniform' => true,
                'is_entitled_to_laundry' => false,
                'is_entitled_to_medical' => true,
                'is_active' => true,
                'status_label' => 'Active',
                'effective_date' => '2023-06-15',
                'end_date' => null,
                'created_at' => '2023-06-15T08:00:00Z',
                'updated_at' => '2024-11-01T08:00:00Z',
            ],
            [
                'id' => 3,
                'employee_id' => 3,
                'employee_name' => 'Anna Garcia',
                'employee_number' => 'EMP003',
                'department' => 'Human Resources',
                'position' => 'HR Specialist',
                'salary_type' => 'monthly',
                'salary_type_label' => 'Monthly',
                'basic_salary' => 32000.00,
                'daily_rate' => null,
                'hourly_rate' => null,
                'payment_method' => 'bank_transfer',
                'payment_method_label' => 'Bank Transfer',
                'tax_status' => 'S1',
                'tax_status_label' => 'Single w/ 1 Dependent (S1)',
                'rdo_code' => 'NCR-03',
                'withholding_tax_exemption' => 125000.00,
                'is_tax_exempt' => false,
                'is_substituted_filing' => false,
                'sss_number' => '00-5555555-5',
                'philhealth_number' => '00112233445568',
                'pagibig_number' => '121912-012-3456791',
                'tin_number' => '123-456-789-003',
                'sss_bracket' => 'E2',
                'is_sss_voluntary' => false,
                'philhealth_is_indigent' => false,
                'pagibig_employee_rate' => 1.00,
                'bank_name' => 'PNB',
                'bank_code' => '002',
                'bank_account_number' => '2100123456789',
                'bank_account_name' => 'Anna Garcia',
                'is_entitled_to_rice' => true,
                'is_entitled_to_uniform' => true,
                'is_entitled_to_laundry' => true,
                'is_entitled_to_medical' => true,
                'is_active' => true,
                'status_label' => 'Active',
                'effective_date' => '2023-03-01',
                'end_date' => null,
                'created_at' => '2023-03-01T08:00:00Z',
                'updated_at' => '2024-10-15T08:00:00Z',
            ],
            [
                'id' => 4,
                'employee_id' => 4,
                'employee_name' => 'Pedro Lopez',
                'employee_number' => 'EMP004',
                'department' => 'Operations',
                'position' => 'Machine Operator',
                'salary_type' => 'daily',
                'salary_type_label' => 'Daily',
                'basic_salary' => null,
                'daily_rate' => 650.00,
                'hourly_rate' => null,
                'payment_method' => 'cash',
                'payment_method_label' => 'Cash',
                'tax_status' => 'S',
                'tax_status_label' => 'Single (S)',
                'rdo_code' => 'NCR-04',
                'withholding_tax_exemption' => 0.00,
                'is_tax_exempt' => true,
                'is_substituted_filing' => false,
                'sss_number' => '00-3333333-3',
                'philhealth_number' => '00112233445569',
                'pagibig_number' => '121912-012-3456792',
                'tin_number' => null,
                'sss_bracket' => 'E1',
                'is_sss_voluntary' => false,
                'philhealth_is_indigent' => true,
                'pagibig_employee_rate' => 1.00,
                'bank_name' => null,
                'bank_code' => null,
                'bank_account_number' => null,
                'bank_account_name' => null,
                'is_entitled_to_rice' => true,
                'is_entitled_to_uniform' => true,
                'is_entitled_to_laundry' => true,
                'is_entitled_to_medical' => true,
                'is_active' => true,
                'status_label' => 'Active',
                'effective_date' => '2022-08-10',
                'end_date' => null,
                'created_at' => '2022-08-10T08:00:00Z',
                'updated_at' => '2024-09-20T08:00:00Z',
            ],
            [
                'id' => 5,
                'employee_id' => 5,
                'employee_name' => 'Rosa Reyes',
                'employee_number' => 'EMP005',
                'department' => 'Information Technology',
                'position' => 'IT Specialist',
                'salary_type' => 'monthly',
                'salary_type_label' => 'Monthly',
                'basic_salary' => 55000.00,
                'daily_rate' => null,
                'hourly_rate' => null,
                'payment_method' => 'bank_transfer',
                'payment_method_label' => 'Bank Transfer',
                'tax_status' => 'ME2',
                'tax_status_label' => 'Married w/ 2 Dependents (ME2)',
                'rdo_code' => 'NCR-05',
                'withholding_tax_exemption' => 250000.00,
                'is_tax_exempt' => false,
                'is_substituted_filing' => true,
                'sss_number' => '00-2222222-2',
                'philhealth_number' => '00112233445570',
                'pagibig_number' => '121912-012-3456793',
                'tin_number' => '123-456-789-004',
                'sss_bracket' => 'E4',
                'is_sss_voluntary' => false,
                'philhealth_is_indigent' => false,
                'pagibig_employee_rate' => 2.00,
                'bank_name' => 'DBP',
                'bank_code' => '008',
                'bank_account_number' => '0800123456789',
                'bank_account_name' => 'Rosa Reyes',
                'is_entitled_to_rice' => true,
                'is_entitled_to_uniform' => false,
                'is_entitled_to_laundry' => true,
                'is_entitled_to_medical' => true,
                'is_active' => true,
                'status_label' => 'Active',
                'effective_date' => '2023-01-01',
                'end_date' => null,
                'created_at' => '2023-01-01T08:00:00Z',
                'updated_at' => '2024-11-10T08:00:00Z',
            ],
            [
                'id' => 6,
                'employee_id' => 6,
                'employee_name' => 'Carlos Morales',
                'employee_number' => 'EMP006',
                'department' => 'Operations',
                'position' => 'Quality Control Officer',
                'salary_type' => 'hourly',
                'salary_type_label' => 'Hourly',
                'basic_salary' => null,
                'daily_rate' => null,
                'hourly_rate' => 250.00,
                'payment_method' => 'bank_transfer',
                'payment_method_label' => 'Bank Transfer',
                'tax_status' => 'Z',
                'tax_status_label' => 'Zero/Exempt (Z)',
                'rdo_code' => null,
                'withholding_tax_exemption' => 0.00,
                'is_tax_exempt' => true,
                'is_substituted_filing' => false,
                'sss_number' => '00-1111111-1',
                'philhealth_number' => '00112233445571',
                'pagibig_number' => '121912-012-3456794',
                'tin_number' => null,
                'sss_bracket' => 'E2',
                'is_sss_voluntary' => false,
                'philhealth_is_indigent' => true,
                'pagibig_employee_rate' => 1.00,
                'bank_name' => 'BDO',
                'bank_code' => '006',
                'bank_account_number' => '0100123456790',
                'bank_account_name' => 'Carlos Morales',
                'is_entitled_to_rice' => true,
                'is_entitled_to_uniform' => true,
                'is_entitled_to_laundry' => false,
                'is_entitled_to_medical' => false,
                'is_active' => false,
                'status_label' => 'Inactive',
                'effective_date' => '2021-05-20',
                'end_date' => '2024-10-31',
                'created_at' => '2021-05-20T08:00:00Z',
                'updated_at' => '2024-10-31T08:00:00Z',
            ],
        ];
    }
}
