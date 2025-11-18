<?php

namespace App\Http\Controllers\Payroll\EmployeePayroll;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Salary Component Controller
 * 
 * Manages salary components for payroll calculations
 * Supports CRUD operations with validation and filtering
 * 
 * @todo Integrate with SalaryComponent model when created
 * @todo Add proper validation rules
 * @todo Add authorization checks
 */
class SalaryComponentController extends Controller
{
    /**
     * Mock salary components data for development
     * @todo Replace with database queries
     */
    private function getMockComponents()
    {
        return [
            // System Components (Cannot be deleted)
            [
                'id' => 1,
                'name' => 'Basic Salary',
                'code' => 'BASIC',
                'component_type' => 'earning',
                'category' => 'regular',
                'calculation_method' => 'fixed_amount',
                'default_amount' => 50000,
                'default_percentage' => null,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => false,
                'is_taxable' => true,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => true,
                'affects_philhealth' => true,
                'affects_pagibig' => true,
                'affects_gross_compensation' => true,
                'display_order' => 1,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
            [
                'id' => 2,
                'name' => 'Overtime Regular',
                'code' => 'OT_REG',
                'component_type' => 'earning',
                'category' => 'overtime',
                'calculation_method' => 'percentage_of_basic',
                'default_amount' => null,
                'default_percentage' => 125,
                'reference_component_id' => null,
                'ot_multiplier' => 1.25,
                'is_premium_pay' => true,
                'is_taxable' => true,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => true,
                'affects_philhealth' => true,
                'affects_pagibig' => true,
                'affects_gross_compensation' => true,
                'display_order' => 5,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
            [
                'id' => 3,
                'name' => 'Overtime Restday',
                'code' => 'OT_RESTDAY',
                'component_type' => 'earning',
                'category' => 'overtime',
                'calculation_method' => 'percentage_of_basic',
                'default_amount' => null,
                'default_percentage' => 130,
                'reference_component_id' => null,
                'ot_multiplier' => 1.30,
                'is_premium_pay' => true,
                'is_taxable' => true,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => true,
                'affects_philhealth' => true,
                'affects_pagibig' => true,
                'affects_gross_compensation' => true,
                'display_order' => 6,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
            [
                'id' => 4,
                'name' => 'Night Differential',
                'code' => 'ND',
                'component_type' => 'earning',
                'category' => 'regular',
                'calculation_method' => 'percentage_of_basic',
                'default_amount' => null,
                'default_percentage' => 10,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => true,
                'is_taxable' => true,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => true,
                'affects_philhealth' => true,
                'affects_pagibig' => true,
                'affects_gross_compensation' => true,
                'display_order' => 7,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
            [
                'id' => 5,
                'name' => 'Rice Allowance',
                'code' => 'RICE',
                'component_type' => 'allowance',
                'category' => 'allowance',
                'calculation_method' => 'fixed_amount',
                'default_amount' => 2000,
                'default_percentage' => null,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => false,
                'is_taxable' => false,
                'is_deminimis' => true,
                'deminimis_limit_monthly' => 2000,
                'deminimis_limit_annual' => 24000,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => false,
                'affects_philhealth' => false,
                'affects_pagibig' => false,
                'affects_gross_compensation' => false,
                'display_order' => 10,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
            [
                'id' => 6,
                'name' => 'Uniform Allowance',
                'code' => 'UNIFORM',
                'component_type' => 'allowance',
                'category' => 'allowance',
                'calculation_method' => 'fixed_amount',
                'default_amount' => 500,
                'default_percentage' => null,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => false,
                'is_taxable' => false,
                'is_deminimis' => true,
                'deminimis_limit_monthly' => 500,
                'deminimis_limit_annual' => 6000,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => false,
                'affects_philhealth' => false,
                'affects_pagibig' => false,
                'affects_gross_compensation' => false,
                'display_order' => 11,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
            [
                'id' => 7,
                'name' => 'SSS Contribution',
                'code' => 'SSS',
                'component_type' => 'contribution',
                'category' => 'contribution',
                'calculation_method' => 'fixed_amount',
                'default_amount' => 1500,
                'default_percentage' => null,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => false,
                'is_taxable' => false,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => true,
                'affects_philhealth' => false,
                'affects_pagibig' => false,
                'affects_gross_compensation' => false,
                'display_order' => 20,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
            [
                'id' => 8,
                'name' => 'PhilHealth Contribution',
                'code' => 'PHILHEALTH',
                'component_type' => 'contribution',
                'category' => 'contribution',
                'calculation_method' => 'percentage_of_basic',
                'default_amount' => null,
                'default_percentage' => 3.63,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => false,
                'is_taxable' => false,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => false,
                'affects_philhealth' => true,
                'affects_pagibig' => false,
                'affects_gross_compensation' => false,
                'display_order' => 21,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
            [
                'id' => 9,
                'name' => 'Pag-IBIG Contribution',
                'code' => 'PAGIBIG',
                'component_type' => 'contribution',
                'category' => 'contribution',
                'calculation_method' => 'percentage_of_basic',
                'default_amount' => null,
                'default_percentage' => 2,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => false,
                'is_taxable' => false,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => false,
                'affects_philhealth' => false,
                'affects_pagibig' => true,
                'affects_gross_compensation' => false,
                'display_order' => 22,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
            [
                'id' => 10,
                'name' => 'Withholding Tax',
                'code' => 'WTAX',
                'component_type' => 'tax',
                'category' => 'tax',
                'calculation_method' => 'fixed_amount',
                'default_amount' => 5000,
                'default_percentage' => null,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => false,
                'is_taxable' => false,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => false,
                'affects_philhealth' => false,
                'affects_pagibig' => false,
                'affects_gross_compensation' => false,
                'display_order' => 23,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => true,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],

            // Custom Components (Can be deleted)
            [
                'id' => 11,
                'name' => 'Performance Bonus',
                'code' => 'PERF_BONUS',
                'component_type' => 'earning',
                'category' => 'regular',
                'calculation_method' => 'fixed_amount',
                'default_amount' => 5000,
                'default_percentage' => null,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => false,
                'is_taxable' => true,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => true,
                'affects_philhealth' => true,
                'affects_pagibig' => true,
                'affects_gross_compensation' => true,
                'display_order' => 8,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => false,
                'created_at' => '2025-02-01T00:00:00Z',
                'updated_at' => '2025-02-01T00:00:00Z',
            ],
            [
                'id' => 12,
                'name' => 'Transportation Allowance',
                'code' => 'TRANSPO',
                'component_type' => 'allowance',
                'category' => 'allowance',
                'calculation_method' => 'fixed_amount',
                'default_amount' => 1500,
                'default_percentage' => null,
                'reference_component_id' => null,
                'ot_multiplier' => null,
                'is_premium_pay' => false,
                'is_taxable' => true,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => true,
                'affects_philhealth' => true,
                'affects_pagibig' => true,
                'affects_gross_compensation' => true,
                'display_order' => 9,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => false,
                'created_at' => '2025-02-01T00:00:00Z',
                'updated_at' => '2025-02-01T00:00:00Z',
            ],
            [
                'id' => 13,
                'name' => 'Holiday Pay',
                'code' => 'HOLIDAY_PAY',
                'component_type' => 'earning',
                'category' => 'holiday',
                'calculation_method' => 'percentage_of_basic',
                'default_amount' => null,
                'default_percentage' => 200,
                'reference_component_id' => null,
                'ot_multiplier' => 2.00,
                'is_premium_pay' => true,
                'is_taxable' => true,
                'is_deminimis' => false,
                'deminimis_limit_monthly' => null,
                'deminimis_limit_annual' => null,
                'is_13th_month' => false,
                'is_other_benefits' => false,
                'affects_sss' => true,
                'affects_philhealth' => true,
                'affects_pagibig' => true,
                'affects_gross_compensation' => true,
                'display_order' => 12,
                'is_displayed_on_payslip' => true,
                'is_active' => true,
                'is_system_component' => false,
                'created_at' => '2025-01-01T00:00:00Z',
                'updated_at' => '2025-01-01T00:00:00Z',
            ],
        ];
    }

    /**
     * Get available component types
     */
    private function getAvailableComponentTypes()
    {
        return [
            ['value' => 'earning', 'label' => 'Earning'],
            ['value' => 'deduction', 'label' => 'Deduction'],
            ['value' => 'benefit', 'label' => 'Benefit'],
            ['value' => 'tax', 'label' => 'Tax'],
            ['value' => 'contribution', 'label' => 'Contribution'],
            ['value' => 'loan', 'label' => 'Loan'],
            ['value' => 'allowance', 'label' => 'Allowance'],
        ];
    }

    /**
     * Get available categories
     */
    private function getAvailableCategories()
    {
        return [
            ['value' => 'regular', 'label' => 'Regular'],
            ['value' => 'overtime', 'label' => 'Overtime'],
            ['value' => 'holiday', 'label' => 'Holiday'],
            ['value' => 'leave', 'label' => 'Leave'],
            ['value' => 'allowance', 'label' => 'Allowance'],
            ['value' => 'deduction', 'label' => 'Deduction'],
            ['value' => 'tax', 'label' => 'Tax'],
            ['value' => 'contribution', 'label' => 'Contribution'],
            ['value' => 'loan', 'label' => 'Loan'],
            ['value' => 'adjustment', 'label' => 'Adjustment'],
        ];
    }

    /**
     * Display a listing of salary components
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $components = $this->getMockComponents();
        $availableComponentTypes = $this->getAvailableComponentTypes();
        $availableCategories = $this->getAvailableCategories();
        $referenceComponents = collect($components)
            ->where('is_active', true)
            ->values()
            ->map(fn($c) => ['id' => $c['id'], 'name' => $c['name'], 'code' => $c['code']])
            ->toArray();

        return Inertia::render('Payroll/EmployeePayroll/Components/Index', [
            'components' => $components,
            'filters' => [
                'search' => $request->input('search'),
                'component_type' => $request->input('component_type'),
                'category' => $request->input('category'),
                'is_active' => $request->input('is_active'),
            ],
            'available_component_types' => $availableComponentTypes,
            'available_categories' => $availableCategories,
            'reference_components' => $referenceComponents,
        ]);
    }

    /**
     * Show the form for creating a new salary component
     *
     * @return void
     */
    public function create()
    {
        // @todo Implement create form if needed
        // For now, the creation is handled through modal in index
    }

    /**
     * Store a newly created salary component in storage
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'component_type' => 'required|in:earning,deduction,benefit,tax,contribution,loan,allowance',
            'category' => 'required|in:regular,overtime,holiday,leave,allowance,deduction,tax,contribution,loan,adjustment',
            'calculation_method' => 'required|in:fixed_amount,percentage_of_basic,percentage_of_gross,per_hour,per_day,per_unit,percentage_of_component',
            'default_amount' => 'nullable|numeric|min:0',
            'default_percentage' => 'nullable|numeric|min:0|max:1000',
            'reference_component_id' => 'nullable|integer',
            'ot_multiplier' => 'nullable|numeric|min:0',
            'is_premium_pay' => 'boolean',
            'is_taxable' => 'boolean',
            'is_deminimis' => 'boolean',
            'deminimis_limit_monthly' => 'nullable|numeric|min:0',
            'deminimis_limit_annual' => 'nullable|numeric|min:0',
            'is_13th_month' => 'boolean',
            'is_other_benefits' => 'boolean',
            'affects_sss' => 'boolean',
            'affects_philhealth' => 'boolean',
            'affects_pagibig' => 'boolean',
            'affects_gross_compensation' => 'boolean',
            'display_order' => 'integer|min:0',
            'is_displayed_on_payslip' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // @todo Create actual SalaryComponent record in database when model is created
        // For now, store in session for demo purposes
        session()->flash('success', 'Salary component created successfully!');
        
        return redirect()->back();
    }

    /**
     * Display the specified salary component
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $components = $this->getMockComponents();
        $component = collect($components)->firstWhere('id', (int)$id);

        if (!$component) {
            abort(404, 'Salary component not found');
        }

        return Inertia::render('Payroll/EmployeePayroll/Components/Show', [
            'component' => $component,
        ]);
    }

    /**
     * Show the form for editing the specified salary component
     *
     * @param  int  $id
     * @return void
     */
    public function edit($id)
    {
        // @todo Implement edit form if needed
        // For now, the editing is handled through modal in index
    }

    /**
     * Update the specified salary component in storage
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'component_type' => 'required|in:earning,deduction,benefit,tax,contribution,loan,allowance',
            'category' => 'required|in:regular,overtime,holiday,leave,allowance,deduction,tax,contribution,loan,adjustment',
            'calculation_method' => 'required|in:fixed_amount,percentage_of_basic,percentage_of_gross,per_hour,per_day,per_unit,percentage_of_component',
            'default_amount' => 'nullable|numeric|min:0',
            'default_percentage' => 'nullable|numeric|min:0|max:1000',
            'reference_component_id' => 'nullable|integer',
            'ot_multiplier' => 'nullable|numeric|min:0',
            'is_premium_pay' => 'boolean',
            'is_taxable' => 'boolean',
            'is_deminimis' => 'boolean',
            'deminimis_limit_monthly' => 'nullable|numeric|min:0',
            'deminimis_limit_annual' => 'nullable|numeric|min:0',
            'is_13th_month' => 'boolean',
            'is_other_benefits' => 'boolean',
            'affects_sss' => 'boolean',
            'affects_philhealth' => 'boolean',
            'affects_pagibig' => 'boolean',
            'affects_gross_compensation' => 'boolean',
            'display_order' => 'integer|min:0',
            'is_displayed_on_payslip' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // @todo Update actual SalaryComponent record in database
        // For now, return success response
        session()->flash('success', 'Salary component updated successfully!');
        
        return redirect()->back();
    }

    /**
     * Remove the specified salary component from storage
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $components = $this->getMockComponents();
        $component = collect($components)->firstWhere('id', (int)$id);

        if (!$component) {
            abort(404, 'Salary component not found');
        }

        // Prevent deletion of system components
        if ($component['is_system_component']) {
            session()->flash('error', 'System components cannot be deleted');
            return redirect()->back();
        }

        // @todo Delete actual SalaryComponent record from database
        // For now, return success response
        session()->flash('success', 'Salary component deleted successfully!');
        
        return redirect()->back();
    }
}
