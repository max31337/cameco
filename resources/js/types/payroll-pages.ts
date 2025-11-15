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
 */
export interface PendingPeriod {
    id: number;
    name: string;                          // "November 2025 - 2nd Half"
    period_type: 'semi_monthly' | 'monthly';
    start_date: string;
    end_date: string;
    pay_date: string;
    status: 'draft' | 'calculating' | 'calculated' | 'reviewing' | 'approved';
    status_label: string;
    status_color: 'blue' | 'yellow' | 'green';
    total_employees: number;
    total_gross_pay: number;
    total_deductions: number;
    total_net_pay: number;
    formatted_net_pay: string;             // "₱4,250,000.00"
    progress_percentage: number;
    actions: string[];                     // ['review', 'recalculate', 'approve', etc.]
}

/**
 * Widget 3: Recent Activity (timeline item)
 */
export interface RecentActivity {
    id: number;
    type: 'period_calculated' | 'adjustment_created' | 'government_report_generated' | 'payroll_approved' | 'bank_file_generated' | 'payslips_generated' | 'remittance_paid' | 'attendance_imported' | 'component_updated' | 'period_created';
    icon: string;                          // 'calculator', 'edit', 'file-text', 'check-circle', etc.
    icon_color: 'blue' | 'yellow' | 'green' | 'purple' | 'gray';
    title: string;                         // "Payroll Calculated"
    description: string;                   // "November 2025 - 2nd Half calculated for 125 employees"
    user: string;                          // "Maria Santos"
    timestamp: string;                     // ISO datetime
    relative_time: string;                 // "2 hours ago"
}

/**
 * Widget 4: Critical Alert (alert item)
 */
export interface CriticalAlert {
    id: number;
    type: 'overdue_remittance' | 'calculation_error' | 'upcoming_deadline' | 'variance_alert' | 'bank_file_pending';
    severity: 'error' | 'warning' | 'info';
    icon: string;                          // 'alert-circle', 'x-circle', 'clock', 'trending-up', etc.
    title: string;                         // "SSS Remittance Overdue"
    message: string;                       // Full alert description
    action_label: string;                  // "Pay Now", "Review Errors", "View Details"
    action_url: string;                    // "/payroll/government/sss/pay"
    days_overdue?: number;
    amount?: string;
    deadline?: string;
    created_at: string;
    affected_employees?: number;
    period?: string;
    days_until_due?: number;
    variance_percentage?: string;
    variance_amount?: string;
    pay_date?: string;
    days_until_pay_date?: number;
}

/**
 * Widget 5: Government Compliance Data (4 agency cards)
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
    status: 'paid' | 'overdue' | 'pending';
    status_label: string;                  // "PAID", "OVERDUE", "DUE IN 3 DAYS"
    status_color: 'green' | 'red' | 'yellow';
    days_overdue?: number;
    days_until_due?: number;
    amount: number;
    formatted_amount: string;              // "₱145,230.00"
    employee_share?: number;
    employer_share?: number;
    report_generated: boolean;
    report_type: string;                   // "R3", "RF1", "MCRF", "1601C"
    payment_reference?: string | null;     // "PH-2025-11-001234"
    paid_date?: string;
    actions: string[];                     // ['pay_now', 'view_report', 'view_receipt']
}

/**
 * Widget 6: Quick Action (action button)
 */
export interface QuickAction {
    id: string;
    label: string;                         // "Create Payroll Period"
    icon: string;                          // 'plus-circle', 'upload', 'file-text', 'list', 'download'
    color: 'blue' | 'green' | 'purple' | 'gray' | 'orange';
    url: string;                           // "/payroll/periods/create"
    description: string;                   // "Start a new payroll period"
}
