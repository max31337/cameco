/**
 * Payroll Module Page Props and Interfaces
 * 
 * This file contains TypeScript interfaces for all Payroll module pages,
 * ensuring type-safe props when rendering Inertia pages from Laravel controllers.
 */

// ============================================================================
// DASHBOARD PAGE TYPES
// ============================================================================

/**
 * Main Dashboard Page Props (Single Page with All Widget Data)
 * Passed from DashboardController@index() via Inertia
 */
export interface PayrollDashboardProps {
    summary: DashboardSummary;            // Widget 1: Summary Cards
    pendingPeriods: PendingPeriod[];      // Widget 2: Pending Periods Table
    recentActivities: RecentActivity[];   // Widget 3: Recent Activities Feed
    criticalAlerts: CriticalAlert[];      // Widget 4: Critical Alerts Panel
    complianceStatus: GovernmentComplianceData; // Widget 5: Government Compliance Tracker
    quickActions: QuickAction[];          // Widget 6: Quick Actions Panel
}

/**
 * Widget 1: Dashboard Summary (4 metric cards)
 */
export interface DashboardSummary {
    current_period: CurrentPeriod;
    total_employees: EmployeeMetric;
    net_payroll: PayrollMetric;
    pending_actions: PendingActionsMetric;
}

export interface CurrentPeriod {
    id: number;
    name: string;                          // "November 2025 - 2nd Half"
    period_type: 'semi_monthly' | 'monthly';
    start_date: string;                    // ISO date
    end_date: string;
    cutoff_date: string;
    pay_date: string;
    status: 'draft' | 'calculating' | 'calculated' | 'reviewing' | 'approved';
    status_label: string;                  // "Calculating", "Reviewing", etc.
    status_color: 'blue' | 'yellow' | 'green';
    total_employees: number;
    progress_percentage: number;           // 0-100
    days_until_pay: number;
}

export interface EmployeeMetric {
    active: number;                        // 125
    new_hires_this_period: number;         // +3
    separations_this_period: number;       // -1
    on_leave: number;                      // 5
    change_from_previous: string;          // "+2"
    change_percentage: string;             // "+1.6%"
}

export interface PayrollMetric {
    current_period: number;                // 4250000.00
    previous_period: number;               // 4040000.00
    difference: number;                    // 210000.00
    percentage_change: string;             // "+5.2%"
    trend: 'up' | 'down' | 'stable';
    formatted_current: string;             // "₱4,250,000.00"
    formatted_previous: string;            // "₱4,040,000.00"
}

export interface PendingActionsMetric {
    total: number;                         // 8
    periods_to_calculate: number;          // 1
    periods_to_review: number;             // 1
    periods_to_approve: number;            // 1
    adjustments_pending: number;           // 3
    government_reports_due: number;        // 2
}

/**
 * Widget 2: Pending Payroll Period (table row)
 * Phase 3.3: Full field specification for payroll period tracking
 */
export interface PendingPeriod {
    id: number;
    name: string;                          // "November 2025 - 2nd Half"
    period_type: 'semi_monthly' | 'monthly';
    period_type_label: string;             // "Semi-monthly"
    start_date: string;                    // ISO date
    end_date: string;                      // ISO date
    pay_date: string;                      // ISO date
    date_range: string;                    // "Nov 16-30"
    status: 'draft' | 'calculating' | 'calculated' | 'reviewing' | 'approved';
    status_label: string;                  // "Draft", "Calculating", "Calculated", etc.
    status_color: 'blue' | 'yellow' | 'green';
    employee_count: number;                // Employees in this period
    net_pay: number;                       // Total net pay amount
    formatted_net_pay: string;             // "₱4,250,000.00"
    total_gross_pay: number;               // For reference
    total_deductions: number;              // For reference
    progress_percentage: number;           // 0-100 for progress bar
    available_actions: string[];           // ['calculate', 'review', 'approve', 'adjust', etc.]
}

/**
 * Widget 3: Recent Activity (timeline item)
 * Phase 3.4: Full field specification for activity tracking with enhanced user info
 */
export interface RecentActivity {
    id: number;
    type: 'period_calculated' | 'adjustment_created' | 'government_report_generated' | 'payroll_approved' | 'bank_file_generated' | 'payslips_generated' | 'remittance_paid' | 'attendance_imported' | 'component_updated' | 'period_created';
    icon: string;                          // 'calculator', 'edit', 'file-text', 'check-circle', etc.
    icon_color: 'blue' | 'yellow' | 'green' | 'purple' | 'gray';
    title: string;                         // "Payroll Calculated"
    description: string;                   // "November 2025 - 2nd Half calculated for 125 employees"
    user_name: string;                     // "Maria Santos"
    user_role: string;                     // "Payroll Officer"
    timestamp: string;                     // ISO datetime
    relative_time: string;                 // "2 hours ago"
    metadata?: {
        period_name?: string;              // "November 2025 - 2nd Half"
        employee_count?: number;           // 125
        amount?: number;                   // 4250000.00
        formatted_amount?: string;         // "₱4,250,000.00"
        period_id?: number;
        affected_count?: number;
        report_type?: string;              // "R3", "RF1", etc.
        file_name?: string;
        reference_number?: string;
    };
}

/**
 * Widget 4: Critical Alert (alert item)
 * Phase 3.5: Full field specification for system and compliance alerts
 */
export interface CriticalAlert {
    id: number;
    type: 'overdue_remittance' | 'calculation_error' | 'upcoming_deadline' | 'variance_alert' | 'bank_file_pending' | 'compliance_issue' | 'data_validation_error';
    severity: 'critical' | 'warning' | 'info';
    title: string;                         // "SSS Remittance Overdue"
    message: string;                       // Full alert description
    icon: string;                          // 'alert-circle', 'x-circle', 'clock', 'trending-up', etc.
    action: string;                        // "Pay Now", "Review Errors", "View Details"
    action_url?: string;                   // "/payroll/government/sss/pay"
    can_dismiss: boolean;                  // Whether user can dismiss the alert
    created_at: string;                    // ISO datetime
    metadata?: {
        amount?: number;                   // 145230.00
        formatted_amount?: string;         // "₱145,230.00"
        deadline?: string;                 // ISO date
        days_overdue?: number;             // How many days overdue
        days_until_due?: number;           // How many days until due
        period?: string;                   // "October 2025"
        affected_employees?: number;       // Number of employees affected
        agency?: string;                   // "SSS", "PhilHealth", etc.
        error_count?: number;              // For calculation errors
        variance_percentage?: string;      // "2.5%"
        variance_amount?: string;          // "₱50,000.00"
        pay_date?: string;                 // ISO date
        days_until_pay_date?: number;
        report_type?: string;              // "R3", "RF1", etc.
        file_name?: string;
        reference_number?: string;
    };
}

/**
 * Widget 5: Government Compliance Data (4 agency cards)
 * Phase 3.6: Full field specification for government agency remittance tracking
 */
export interface GovernmentComplianceData {
    sss: GovernmentAgencyStatus;
    philhealth: GovernmentAgencyStatus;
    pagibig: GovernmentAgencyStatus;
    bir: GovernmentAgencyStatus;
}

export interface GovernmentAgencyStatus {
    name: 'SSS' | 'PhilHealth' | 'Pag-IBIG' | 'BIR';
    full_name: string;                     // "Social Security System"
    period: string;                        // "October 2025"
    due_date: string;                      // ISO date
    status: 'paid' | 'overdue' | 'pending' | 'calculating';
    status_label: string;                  // "PAID", "OVERDUE", "DUE IN 3 DAYS", "CALCULATING"
    status_color: 'green' | 'red' | 'yellow' | 'blue';
    remittance_amount: number;             // 145230.00
    formatted_amount: string;              // "₱145,230.00"
    compliance_deadline: string;           // ISO date for compliance deadline
    days_overdue?: number;                 // Negative if pending, positive if overdue
    days_until_due?: number;               // Days remaining until due
    employee_share?: number;               // Employee contribution
    employer_share?: number;               // Employer contribution
    report_type: string;                   // "R3", "RF1", "MCRF", "1601C"
    report_status: 'not_generated' | 'generated' | 'filed';
    report_generated_date?: string;        // ISO date when report was generated
    payment_reference?: string | null;     // "PH-2025-11-001234" or null if not paid
    paid_date?: string;                    // ISO date when payment was made
    payment_method?: string;               // "Bank Transfer", "Check", "ACH", etc.
    actions: string[];                     // ['pay_now', 'view_report', 'view_receipt', 'prepare_payment']
    // Additional tracking fields
    last_remittance_date?: string;         // Previous remittance date
    consecutive_on_time: number;           // Number of consecutive on-time payments
    compliance_score: number;              // 0-100 compliance percentage
}

/**
 * Widget 6: Quick Action (action button)
 * Phase 3.7: Full field specification for quick action buttons
 * Actions are categorized for semantic grouping and color coding
 */
export interface QuickAction {
    id: string | number;
    label: string;                         // "Create Payroll Period", "Upload Timesheet", "Generate Report"
    description: string;                   // "Start a new payroll period"
    icon: string;                          // 'plus-circle', 'upload', 'file-check', 'download', 'settings'
    category: 'processing' | 'compliance' | 'reporting' | 'admin';
    url: string;                           // "/payroll/periods/create", "/payroll/upload", "/payroll/reports"
    disabled?: boolean;                    // Optional: disable action if conditions not met
    badge?: string;                        // Optional: badge label like "New", "Beta", "Required"
    keyboard_shortcut?: string;            // Optional: for accessibility e.g., "Ctrl+K"
}

// ============================================================================
// PAYROLL PROCESSING PAGES TYPES (Phase 1-4)
// ============================================================================

/**
 * Phase 1.1 & 1.2: Payroll Periods Management
 * Complete payroll period entity for creation, editing, and display
 */
export interface PayrollPeriod {
    id: number;
    name: string;                          // "November 2025 - 1st Half", "Monthly - November 2025"
    period_type: 'weekly' | 'bi_weekly' | 'semi_monthly' | 'monthly';
    start_date: string;                    // ISO date
    end_date: string;                      // ISO date
    cutoff_date: string;                   // ISO date - DTR cutoff
    pay_date: string;                      // ISO date - when employees get paid
    status: 'draft' | 'importing' | 'calculating' | 'calculated' | 'reviewing' | 'approved' | 'bank_file_generated' | 'paid' | 'closed';
    total_employees: number;
    total_gross_pay: number;
    total_deductions: number;
    total_net_pay: number;
    total_employer_cost: number;
    processed_at?: string;
    approved_by?: string | null;           // User name
    approved_at?: string;
    finalized_by?: string | null;
    finalized_at?: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Create/Edit Payroll Period Form Data
 */
export interface PayrollPeriodFormData {
    name: string;
    period_type: 'weekly' | 'bi_weekly' | 'semi_monthly' | 'monthly';
    start_date: string;                    // ISO date string
    end_date: string;                      // ISO date string
    cutoff_date: string;                   // ISO date string
    pay_date: string;                      // ISO date string
}

/**
 * Payroll Periods Listing Page Props
 */
export interface PayrollPeriodsPageProps {
    periods: PayrollPeriod[];
    filters: {
        status?: string;
        period_type?: string;
        search?: string;
        year?: number;
    };
}

// ============================================================================
// Phase 1.3: Payroll Calculations
// ============================================================================

/**
 * Payroll Calculation Entity
 * Represents a payroll calculation run for a specific period
 */
export interface PayrollCalculation {
    id: number;
    payroll_period_id: number;
    payroll_period: PayrollPeriod;
    calculation_type: 'regular' | 'adjustment' | 'final' | 're-calculation';
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    total_employees: number;
    processed_employees: number;
    failed_employees: number;
    progress_percentage: number;           // 0-100
    total_gross_pay: number;
    total_deductions: number;
    total_net_pay: number;
    calculation_date: string;
    started_at?: string;
    completed_at?: string;
    error_message?: string;
    calculated_by?: string;                // User name
    created_at: string;
    updated_at: string;
}

/**
 * Employee Calculation Detail
 * Individual employee's payroll calculation breakdown
 */
export interface EmployeeCalculation {
    id: number;
    employee_id: number;
    employee_name: string;
    employee_number: string;
    department: string;
    position: string;
    calculation_id: number;
    status: 'pending' | 'calculated' | 'failed' | 'adjusted';
    basic_pay: number;
    earnings: Record<string, number>;      // { "overtime": 5000, "holiday_pay": 2000 }
    deductions: Record<string, number>;    // { "sss": 1500, "philhealth": 800 }
    gross_pay: number;
    total_deductions: number;
    net_pay: number;
    error_message?: string;
    calculated_at?: string;
}

/**
 * Payroll Calculations Page Props
 */
export interface PayrollCalculationsPageProps {
    calculations: PayrollCalculation[];
    available_periods: PayrollPeriod[];
    filters: {
        period_id?: number;
        status?: string;
        calculation_type?: string;
    };
}

// ============================================================================
// Phase 1.4: Payroll Adjustments
// ============================================================================

/**
 * Payroll Adjustment Entity
 * Manual adjustments to employee payroll
 */
export interface PayrollAdjustment {
    id: number;
    payroll_period_id: number;
    payroll_period: PayrollPeriod;
    employee_id: number;
    employee_name: string;
    employee_number: string;
    department: string;
    adjustment_type: 'earning' | 'deduction' | 'correction' | 'backpay' | 'refund';
    adjustment_category: string;           // e.g., "Overtime Correction", "Tax Refund"
    amount: number;
    reason: string;
    reference_number?: string;
    status: 'pending' | 'approved' | 'rejected' | 'applied' | 'cancelled';
    requested_by: string;                  // User name
    requested_at: string;
    reviewed_by?: string;
    reviewed_at?: string;
    review_notes?: string;
    applied_at?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Adjustment Form Data for Create/Edit
 */
export interface PayrollAdjustmentFormData {
    payroll_period_id: number;
    employee_id: number;
    adjustment_type: 'earning' | 'deduction' | 'correction' | 'backpay' | 'refund';
    adjustment_category: string;
    amount: number;
    reason: string;
    reference_number?: string;
}

/**
 * Payroll Adjustments Page Props
 */
export interface PayrollAdjustmentsPageProps {
    adjustments: PayrollAdjustment[];
    available_periods: PayrollPeriod[];
    available_employees: Array<{
        id: number;
        name: string;
        employee_number: string;
        department: string;
    }>;
    filters: {
        period_id?: number;
        employee_id?: number;
        status?: string;
        adjustment_type?: string;
    };
}

// ============================================================================
// Phase 2: EMPLOYEE PAYROLL MANAGEMENT
// ============================================================================

/**
 * Employee Payroll Info Entity
 * Stores salary information, tax details, government numbers, and bank info
 */
export interface EmployeePayrollInfo {
    id: number;
    employee_id: number;
    employee_name: string;
    employee_number: string;
    department: string;
    position: string;
    
    // Salary Information
    salary_type: 'monthly' | 'daily' | 'hourly' | 'contractual' | 'project_based';
    salary_type_label: string;
    basic_salary: number;
    daily_rate?: number;
    hourly_rate?: number;
    payment_method: 'bank_transfer' | 'cash' | 'check';
    payment_method_label: string;
    
    // Tax Information
    tax_status: string;                    // Z, S, ME, S1, ME1, etc.
    tax_status_label: string;              // "Single", "Married Employee", etc.
    rdo_code?: string;                     // BIR Revenue District Office code
    withholding_tax_exemption: number;     // Exemption amount
    is_tax_exempt: boolean;
    is_substituted_filing: boolean;
    
    // Government Numbers
    sss_number?: string;
    philhealth_number?: string;
    pagibig_number?: string;
    tin_number?: string;
    
    // Government Contribution Settings
    sss_bracket?: string;
    is_sss_voluntary: boolean;
    philhealth_is_indigent: boolean;
    pagibig_employee_rate: number;         // 1 or 2 percent
    
    // Bank Information
    bank_name?: string;
    bank_code?: string;
    bank_account_number?: string;
    bank_account_name?: string;
    
    // De Minimis Benefits Entitlements
    is_entitled_to_rice: boolean;
    is_entitled_to_uniform: boolean;
    is_entitled_to_laundry: boolean;
    is_entitled_to_medical: boolean;
    
    // Status
    is_active: boolean;
    status_label: string;                  // "Active", "Inactive"
    
    // Effective Dates
    effective_date: string;                // ISO date
    end_date?: string;
    
    // Timestamps
    created_at: string;
    updated_at: string;
}

/**
 * Employee Payroll Info Form Data
 */
export interface EmployeePayrollInfoFormData {
    employee_id: number;
    salary_type: 'monthly' | 'daily' | 'hourly' | 'contractual' | 'project_based';
    basic_salary: number;
    daily_rate?: number;
    hourly_rate?: number;
    payment_method: 'bank_transfer' | 'cash' | 'check';
    tax_status: string;
    rdo_code?: string;
    withholding_tax_exemption?: number;
    is_tax_exempt: boolean;
    is_substituted_filing: boolean;
    sss_number?: string;
    philhealth_number?: string;
    pagibig_number?: string;
    tin_number?: string;
    sss_bracket?: string;
    is_sss_voluntary: boolean;
    philhealth_is_indigent: boolean;
    pagibig_employee_rate: number;
    bank_name?: string;
    bank_code?: string;
    bank_account_number?: string;
    bank_account_name?: string;
    is_entitled_to_rice: boolean;
    is_entitled_to_uniform: boolean;
    is_entitled_to_laundry: boolean;
    is_entitled_to_medical: boolean;
    effective_date: string;
    end_date?: string;
    is_active: boolean;
}

/**
 * Payroll Info Filter Criteria
 */
export interface EmployeePayrollInfoFilters {
    search?: string;                       // Search by name or employee number
    salary_type?: string;
    payment_method?: string;
    tax_status?: string;
    status?: 'active' | 'inactive' | 'all';
}

/**
 * Employee Payroll Info Page Props
 */
export interface EmployeePayrollInfoPageProps {
    employees: EmployeePayrollInfo[];
    filters: EmployeePayrollInfoFilters;
    available_salary_types: Array<{ value: string; label: string }>;
    available_payment_methods: Array<{ value: string; label: string }>;
    available_tax_statuses: Array<{ value: string; label: string }>;
    available_departments: Array<{ id: number; name: string }>;
}

// ============================================================================
// PHASE 2.2: SALARY COMPONENTS
// ============================================================================

/**
 * Salary Component Entity
 * Represents a reusable salary component for payroll calculations
 * Examples: Basic Salary, Overtime, Rice Allowance, SSS, Withholding Tax, etc.
 */
export interface SalaryComponent {
    id: number;
    name: string;                          // "Basic Salary", "Overtime Regular", "Rice Allowance"
    code: string;                          // "BASIC", "OT_REG", "RICE" (unique)
    component_type: 'earning' | 'deduction' | 'benefit' | 'tax' | 'contribution' | 'loan' | 'allowance';
    category: 'regular' | 'overtime' | 'holiday' | 'leave' | 'allowance' | 'deduction' | 'tax' | 'contribution' | 'loan' | 'adjustment';
    
    // Calculation Settings
    calculation_method: 'fixed_amount' | 'percentage_of_basic' | 'percentage_of_gross' | 'per_hour' | 'per_day' | 'per_unit' | 'percentage_of_component';
    default_amount?: number;               // For fixed amount calculations
    default_percentage?: number;           // For percentage calculations
    reference_component_id?: number;       // For percentage of component calculations
    
    // Overtime and Premium Settings
    ot_multiplier?: number;                // 1.25, 1.30, 1.50, 2.00, 2.60
    is_premium_pay: boolean;
    
    // Tax Treatment
    is_taxable: boolean;
    is_deminimis: boolean;
    deminimis_limit_monthly?: number;
    deminimis_limit_annual?: number;
    is_13th_month: boolean;
    is_other_benefits: boolean;
    
    // Government Contribution Settings
    affects_sss: boolean;
    affects_philhealth: boolean;
    affects_pagibig: boolean;
    affects_gross_compensation: boolean;
    
    // Display Settings
    display_order: number;
    is_displayed_on_payslip: boolean;
    is_active: boolean;
    is_system_component: boolean;          // Cannot be deleted
    
    created_at: string;
    updated_at: string;
}

/**
 * Create/Edit Salary Component Form Data
 */
export interface SalaryComponentFormData {
    name: string;
    code: string;
    component_type: 'earning' | 'deduction' | 'benefit' | 'tax' | 'contribution' | 'loan' | 'allowance';
    category: 'regular' | 'overtime' | 'holiday' | 'leave' | 'allowance' | 'deduction' | 'tax' | 'contribution' | 'loan' | 'adjustment';
    
    calculation_method: 'fixed_amount' | 'percentage_of_basic' | 'percentage_of_gross' | 'per_hour' | 'per_day' | 'per_unit' | 'percentage_of_component';
    default_amount?: number;
    default_percentage?: number;
    reference_component_id?: number;
    
    ot_multiplier?: number;
    is_premium_pay: boolean;
    
    is_taxable: boolean;
    is_deminimis: boolean;
    deminimis_limit_monthly?: number;
    deminimis_limit_annual?: number;
    is_13th_month: boolean;
    is_other_benefits: boolean;
    
    affects_sss: boolean;
    affects_philhealth: boolean;
    affects_pagibig: boolean;
    affects_gross_compensation: boolean;
    
    display_order: number;
    is_displayed_on_payslip: boolean;
    is_active: boolean;
}

/**
 * Salary Component Filter Criteria
 */
export interface SalaryComponentFilters {
    search?: string;                       // Search by name or code
    component_type?: string;
    category?: string;
    is_active?: boolean | 'all';
    is_system?: boolean | 'all';
}

/**
 * Salary Components Listing Page Props
 */
export interface SalaryComponentsPageProps {
    components: SalaryComponent[];
    filters: SalaryComponentFilters;
    available_component_types: Array<{ value: string; label: string }>;
    available_categories: Array<{ value: string; label: string }>;
    reference_components: Array<{ id: number; name: string; code: string }>;
}
