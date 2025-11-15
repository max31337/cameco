<?php

namespace App\Http\Controllers\Payroll;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display payroll dashboard with all widget data in single response
     */
    public function index(): Response
    {
        return Inertia::render('Payroll/Dashboard', [
            'summary' => $this->getSummaryMetrics(),
            'pendingPeriods' => $this->getPendingPeriods(),
            'recentActivities' => $this->getRecentActivities(),
            'criticalAlerts' => $this->getCriticalAlerts(),
            'complianceStatus' => $this->getComplianceStatus(),
            'quickActions' => $this->getQuickActions(),
        ]);
    }

    /**
     * Mock data for summary metrics
     */
    private function getSummaryMetrics(): array
    {
        return [
            'current_period' => [
                'id' => 1,
                'name' => 'November 2025 - 2nd Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-11-16',
                'end_date' => '2025-11-30',
                'cutoff_date' => '2025-11-30',
                'pay_date' => '2025-12-05',
                'status' => 'calculating',
                'status_label' => 'Calculating',
                'status_color' => 'blue',
                'total_employees' => 125,
                'progress_percentage' => 45,
                'days_until_pay' => 20,
            ],
            'total_employees' => [
                'active' => 125,
                'new_hires_this_period' => 3,
                'separations_this_period' => 1,
                'on_leave' => 5,
                'change_from_previous' => '+2',
                'change_percentage' => '+1.6%',
            ],
            'net_payroll' => [
                'current_period' => 4250000.00,
                'previous_period' => 4040000.00,
                'difference' => 210000.00,
                'percentage_change' => '+5.2%',
                'trend' => 'up',
                'formatted_current' => '₱4,250,000.00',
                'formatted_previous' => '₱4,040,000.00',
            ],
            'pending_actions' => [
                'total' => 8,
                'periods_to_calculate' => 1,
                'periods_to_review' => 1,
                'periods_to_approve' => 1,
                'adjustments_pending' => 3,
                'government_reports_due' => 2,
            ],
        ];
    }

    /**
     * Mock data for pending payroll periods
     */
    private function getPendingPeriods(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'November 2025 - 2nd Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-11-16',
                'end_date' => '2025-11-30',
                'pay_date' => '2025-12-05',
                'status' => 'calculating',
                'status_label' => 'Calculating',
                'status_color' => 'blue',
                'total_employees' => 125,
                'total_gross_pay' => 5250000.00,
                'total_deductions' => 1000000.00,
                'total_net_pay' => 4250000.00,
                'formatted_net_pay' => '₱4,250,000.00',
                'progress_percentage' => 45,
                'actions' => ['review', 'recalculate'],
            ],
            [
                'id' => 2,
                'name' => 'November 2025 - 1st Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-15',
                'pay_date' => '2025-11-20',
                'status' => 'reviewing',
                'status_label' => 'Under Review',
                'status_color' => 'yellow',
                'total_employees' => 123,
                'total_gross_pay' => 5100000.00,
                'total_deductions' => 980000.00,
                'total_net_pay' => 4120000.00,
                'formatted_net_pay' => '₱4,120,000.00',
                'progress_percentage' => 75,
                'actions' => ['approve', 'adjust'],
            ],
            [
                'id' => 3,
                'name' => 'October 2025 - 2nd Half',
                'period_type' => 'semi_monthly',
                'start_date' => '2025-10-16',
                'end_date' => '2025-10-31',
                'pay_date' => '2025-11-05',
                'status' => 'approved',
                'status_label' => 'Approved - Awaiting Payment',
                'status_color' => 'green',
                'total_employees' => 122,
                'total_gross_pay' => 5050000.00,
                'total_deductions' => 960000.00,
                'total_net_pay' => 4090000.00,
                'formatted_net_pay' => '₱4,090,000.00',
                'progress_percentage' => 100,
                'actions' => ['generate_payslips', 'generate_bank_file'],
            ],
        ];
    }

    /**
     * Mock data for recent activities
     */
    private function getRecentActivities(): array
    {
        return [
            [
                'id' => 1,
                'type' => 'period_calculated',
                'icon' => 'calculator',
                'icon_color' => 'blue',
                'title' => 'Payroll Calculated',
                'description' => 'November 2025 - 1st Half payroll calculated for 123 employees',
                'user' => 'Maria Reyes',
                'timestamp' => '2025-11-15 14:30:00',
                'relative_time' => '2 hours ago',
            ],
            [
                'id' => 2,
                'type' => 'adjustment_created',
                'icon' => 'edit',
                'icon_color' => 'yellow',
                'title' => 'Adjustment Created',
                'description' => 'Manual adjustment for overtime hours - Employee #EMP-2024-056',
                'user' => 'Maria Reyes',
                'timestamp' => '2025-11-15 11:15:00',
                'relative_time' => '5 hours ago',
            ],
            [
                'id' => 3,
                'type' => 'government_report_generated',
                'icon' => 'file-text',
                'icon_color' => 'green',
                'title' => 'Government Report Generated',
                'description' => 'PhilHealth RF1 report for October 2025 generated successfully',
                'user' => 'Maria Reyes',
                'timestamp' => '2025-11-15 09:45:00',
                'relative_time' => '7 hours ago',
            ],
            [
                'id' => 4,
                'type' => 'payroll_approved',
                'icon' => 'check-circle',
                'icon_color' => 'green',
                'title' => 'Payroll Approved',
                'description' => 'October 2025 - 2nd Half payroll approved by HR Manager',
                'user' => 'Juan Dela Cruz',
                'timestamp' => '2025-11-14 16:20:00',
                'relative_time' => '1 day ago',
            ],
            [
                'id' => 5,
                'type' => 'bank_file_generated',
                'icon' => 'download',
                'icon_color' => 'purple',
                'title' => 'Bank File Generated',
                'description' => 'BPI ATM payroll file generated for 85 employees',
                'user' => 'Maria Reyes',
                'timestamp' => '2025-11-14 14:00:00',
                'relative_time' => '1 day ago',
            ],
            [
                'id' => 6,
                'type' => 'payslips_generated',
                'icon' => 'file',
                'icon_color' => 'blue',
                'title' => 'Payslips Generated',
                'description' => '122 payslips generated for October 2025 - 2nd Half',
                'user' => 'Maria Reyes',
                'timestamp' => '2025-11-14 10:30:00',
                'relative_time' => '1 day ago',
            ],
            [
                'id' => 7,
                'type' => 'remittance_paid',
                'icon' => 'credit-card',
                'icon_color' => 'green',
                'title' => 'Remittance Paid',
                'description' => 'PhilHealth contributions for October 2025 paid (₱125,450.00)',
                'user' => 'Maria Reyes',
                'timestamp' => '2025-11-12 15:45:00',
                'relative_time' => '3 days ago',
            ],
            [
                'id' => 8,
                'type' => 'attendance_imported',
                'icon' => 'upload',
                'icon_color' => 'blue',
                'title' => 'Attendance Imported',
                'description' => 'Attendance data imported for November 1-15, 2025',
                'user' => 'Maria Reyes',
                'timestamp' => '2025-11-11 09:00:00',
                'relative_time' => '4 days ago',
            ],
            [
                'id' => 9,
                'type' => 'component_updated',
                'icon' => 'settings',
                'icon_color' => 'gray',
                'title' => 'Salary Component Updated',
                'description' => 'Rice Allowance increased to ₱2,000/month',
                'user' => 'Maria Reyes',
                'timestamp' => '2025-11-10 14:20:00',
                'relative_time' => '5 days ago',
            ],
            [
                'id' => 10,
                'type' => 'period_created',
                'icon' => 'plus-circle',
                'icon_color' => 'green',
                'title' => 'Payroll Period Created',
                'description' => 'November 2025 - 2nd Half period created',
                'user' => 'Maria Reyes',
                'timestamp' => '2025-11-10 10:00:00',
                'relative_time' => '5 days ago',
            ],
        ];
    }

    /**
     * Mock data for critical alerts
     */
    private function getCriticalAlerts(): array
    {
        return [
            [
                'id' => 1,
                'type' => 'overdue_remittance',
                'severity' => 'error',
                'icon' => 'alert-circle',
                'title' => 'SSS Remittance Overdue',
                'message' => 'SSS contributions for October 2025 are 5 days overdue. Please remit immediately to avoid penalties.',
                'action_label' => 'Pay Now',
                'action_url' => '/payroll/government/sss/remittances',
                'days_overdue' => 5,
                'amount' => '₱145,230.00',
                'deadline' => '2025-11-10',
                'created_at' => '2025-11-10 00:00:00',
            ],
            [
                'id' => 2,
                'type' => 'calculation_error',
                'severity' => 'error',
                'icon' => 'x-circle',
                'title' => 'Calculation Errors Detected',
                'message' => '3 employees have negative net pay in November 2025 - 2nd Half. Review and adjust before approval.',
                'action_label' => 'Review Errors',
                'action_url' => '/payroll/calculations/errors',
                'affected_employees' => 3,
                'period' => 'November 2025 - 2nd Half',
                'created_at' => '2025-11-15 14:30:00',
            ],
            [
                'id' => 3,
                'type' => 'upcoming_deadline',
                'severity' => 'warning',
                'icon' => 'clock',
                'title' => 'Pag-IBIG Remittance Due Soon',
                'message' => 'Pag-IBIG contributions for October 2025 are due in 3 days (November 18, 2025).',
                'action_label' => 'Prepare Payment',
                'action_url' => '/payroll/government/pagibig/remittances',
                'days_until_due' => 3,
                'amount' => '₱52,840.00',
                'deadline' => '2025-11-18',
                'created_at' => '2025-11-15 08:00:00',
            ],
            [
                'id' => 4,
                'type' => 'variance_alert',
                'severity' => 'warning',
                'icon' => 'trending-up',
                'title' => 'Unusual Payroll Variance',
                'message' => 'November 2025 - 1st Half payroll is 12.5% higher than previous period. Please verify calculations.',
                'action_label' => 'View Comparison',
                'action_url' => '/payroll/periods/1/compare',
                'variance_percentage' => '+12.5%',
                'variance_amount' => '₱515,000.00',
                'created_at' => '2025-11-15 14:35:00',
            ],
            [
                'id' => 5,
                'type' => 'bank_file_pending',
                'severity' => 'info',
                'icon' => 'alert-triangle',
                'title' => 'Bank File Generation Pending',
                'message' => 'October 2025 - 2nd Half bank file not yet generated. Generate before pay date (Nov 20).',
                'action_label' => 'Generate Now',
                'action_url' => '/payroll/bank-files/generate',
                'period' => 'October 2025 - 2nd Half',
                'pay_date' => '2025-11-20',
                'days_until_pay_date' => 5,
                'created_at' => '2025-11-15 10:00:00',
            ],
        ];
    }

    /**
     * Mock data for compliance status
     */
    private function getComplianceStatus(): array
    {
        return [
            'sss' => [
                'name' => 'SSS',
                'full_name' => 'Social Security System',
                'period' => 'October 2025',
                'due_date' => '2025-11-10',
                'status' => 'overdue',
                'status_label' => 'Overdue',
                'status_color' => 'red',
                'days_overdue' => 5,
                'amount' => 145230.00,
                'formatted_amount' => '₱145,230.00',
                'employee_share' => 72615.00,
                'employer_share' => 72615.00,
                'report_generated' => true,
                'report_type' => 'R3',
                'payment_reference' => null,
                'actions' => ['pay_now', 'view_report'],
            ],
            'philhealth' => [
                'name' => 'PhilHealth',
                'full_name' => 'Philippine Health Insurance Corporation',
                'period' => 'October 2025',
                'due_date' => '2025-11-10',
                'status' => 'paid',
                'status_label' => 'Paid',
                'status_color' => 'green',
                'days_overdue' => 0,
                'amount' => 125450.00,
                'formatted_amount' => '₱125,450.00',
                'employee_share' => 62725.00,
                'employer_share' => 62725.00,
                'report_generated' => true,
                'report_type' => 'RF1',
                'payment_reference' => 'PH-2025-11-001234',
                'paid_date' => '2025-11-08',
                'actions' => ['view_receipt', 'view_report'],
            ],
            'pagibig' => [
                'name' => 'Pag-IBIG',
                'full_name' => 'Home Development Mutual Fund',
                'period' => 'October 2025',
                'due_date' => '2025-11-18',
                'status' => 'pending',
                'status_label' => 'Due in 3 days',
                'status_color' => 'yellow',
                'days_until_due' => 3,
                'amount' => 52840.00,
                'formatted_amount' => '₱52,840.00',
                'employee_share' => 26420.00,
                'employer_share' => 26420.00,
                'report_generated' => true,
                'report_type' => 'MCRF',
                'payment_reference' => null,
                'actions' => ['pay_now', 'view_report'],
            ],
            'bir' => [
                'name' => 'BIR',
                'full_name' => 'Bureau of Internal Revenue',
                'period' => 'October 2025',
                'due_date' => '2025-11-20',
                'status' => 'pending',
                'status_label' => 'Due in 5 days',
                'status_color' => 'yellow',
                'days_until_due' => 5,
                'amount' => 285600.00,
                'formatted_amount' => '₱285,600.00',
                'report_generated' => true,
                'report_type' => '1601C',
                'payment_reference' => null,
                'actions' => ['pay_now', 'view_report'],
            ],
        ];
    }

    /**
     * Mock data for quick actions
     */
    private function getQuickActions(): array
    {
        return [
            [
                'id' => 'create_period',
                'label' => 'Create Payroll Period',
                'icon' => 'plus-circle',
                'color' => 'blue',
                'url' => '/payroll/periods/create',
                'description' => 'Start a new payroll period',
            ],
            [
                'id' => 'import_attendance',
                'label' => 'Import Attendance',
                'icon' => 'upload',
                'color' => 'green',
                'url' => '/payroll/timekeeping/import',
                'description' => 'Import timekeeping data',
            ],
            [
                'id' => 'generate_reports',
                'label' => 'Government Reports',
                'icon' => 'file-text',
                'color' => 'purple',
                'url' => '/payroll/government/reports',
                'description' => 'Generate compliance reports',
            ],
            [
                'id' => 'payroll_register',
                'label' => 'Payroll Register',
                'icon' => 'list',
                'color' => 'gray',
                'url' => '/payroll/reports/register',
                'description' => 'View detailed payroll register',
            ],
            [
                'id' => 'export_summary',
                'label' => 'Export Summary',
                'icon' => 'download',
                'color' => 'orange',
                'url' => '/payroll/reports/export',
                'description' => 'Export payroll summary',
            ],
        ];
    }
}
