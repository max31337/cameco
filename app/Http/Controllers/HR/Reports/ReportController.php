<?php

namespace App\Http\Controllers\HR\Reports;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Department;
use App\Services\HR\HRAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Display employee statistics and reports.
     */
    public function employees(Request $request): Response
    {
        $this->authorize('viewAny', Employee::class);

        // Placeholder data for frontend development (will be replaced with real data in ISSUE-9 Phase 4)
        $summary = [
            'total_employees' => 45,
            'active_employees' => 38,
            'inactive_employees' => 5,
            'terminated_employees' => 2,
            'on_leave_employees' => 3,
            'average_tenure_years' => 4.5,
        ];

        $byDepartment = [
            [
                'department_id' => 1,
                'department_name' => 'Engineering',
                'employee_count' => 15,
                'percentage' => 33.33,
            ],
            [
                'department_id' => 2,
                'department_name' => 'Sales',
                'employee_count' => 12,
                'percentage' => 26.67,
            ],
            [
                'department_id' => 3,
                'department_name' => 'Human Resources',
                'employee_count' => 8,
                'percentage' => 17.78,
            ],
            [
                'department_id' => 4,
                'department_name' => 'Finance',
                'employee_count' => 6,
                'percentage' => 13.33,
            ],
            [
                'department_id' => 5,
                'department_name' => 'Operations',
                'employee_count' => 4,
                'percentage' => 8.89,
            ],
        ];

        // Placeholder recent hires with mock data
        $recentHires = [];

        return Inertia::render('HR/Reports/Employees', [
            'summary' => $summary,
            'by_department' => $byDepartment,
            'by_status' => [
                ['status' => 'active', 'count' => 38, 'percentage' => 84.44],
                ['status' => 'inactive', 'count' => 5, 'percentage' => 11.11],
                ['status' => 'terminated', 'count' => 2, 'percentage' => 4.44],
            ],
            'recent_hires' => $recentHires,
            'headcount_trend' => [],
            'can_export' => auth()->user()->can('hr.employees.export'),
        ]);
    }

    /**
     * Display leave statistics and reports.
     */
    public function leave(Request $request): Response
    {
        $this->authorize('viewAny', Employee::class);

        // Leave statistics (placeholder - will be replaced with actual leave data from ISSUE-5)
        $summary = [
            'total_pending_requests' => 12,
            'total_approved_requests' => 45,
            'total_rejected_requests' => 3,
            'employees_on_leave' => 8,
            'leave_days_used_this_year' => 156,
            'leave_days_remaining_average' => 12.5,
        ];

        // Leave by type
        $byType = [
            [
                'leave_type' => 'Vacation Leave',
                'count' => 25,
                'percentage' => 37.88,
            ],
            [
                'leave_type' => 'Sick Leave',
                'count' => 12,
                'percentage' => 18.18,
            ],
            [
                'leave_type' => 'Emergency Leave',
                'count' => 5,
                'percentage' => 7.58,
            ],
            [
                'leave_type' => 'Maternity/Paternity Leave',
                'count' => 2,
                'percentage' => 3.03,
            ],
            [
                'leave_type' => 'Privilege Leave',
                'count' => 8,
                'percentage' => 12.12,
            ],
            [
                'leave_type' => 'Bereavement Leave',
                'count' => 3,
                'percentage' => 4.55,
            ],
            [
                'leave_type' => 'Special Leave',
                'count' => 11,
                'percentage' => 16.67,
            ],
        ];

        // Leave by status
        $byStatus = [
            [
                'status' => 'Pending',
                'count' => 12,
                'percentage' => 17.39,
            ],
            [
                'status' => 'Approved',
                'count' => 45,
                'percentage' => 65.22,
            ],
            [
                'status' => 'Rejected',
                'count' => 3,
                'percentage' => 4.35,
            ],
            [
                'status' => 'Cancelled',
                'count' => 9,
                'percentage' => 13.04,
            ],
        ];

        return Inertia::render('HR/Reports/Leave', [
            'summary' => $summary,
            'by_type' => $byType,
            'by_status' => $byStatus,
            'by_month' => [],
            'top_users' => [],
            'can_export' => auth()->user()->can('hr.leave.export'),
        ]);
    }

    /**
     * Display HR analytics dashboard.
     */
    public function analytics(Request $request): Response
    {
        $this->authorize('viewAny', Employee::class);

        // Inject and use HRAnalyticsService for real data
        $analyticsService = app(HRAnalyticsService::class);
        $metrics = $analyticsService->getDashboardMetrics();

        return Inertia::render('HR/Reports/Analytics', [
            'metrics' => $metrics,
        ]);
    }
}
