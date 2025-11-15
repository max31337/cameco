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
