<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the HR Manager Dashboard.
     * 
     * Shows key HR metrics, recent activity, and quick access to HR functions.
     * Requires HR Manager or Superadmin role (enforced by middleware).
     */
    public function index(Request $request)
    {
        // Placeholder metrics - will be replaced with real data in Phase 9
        $metrics = $this->getPlaceholderMetrics();

        return Inertia::render('HR/Dashboard', [
            'metrics' => $metrics,
        ]);
    }

    /**
     * Get placeholder metrics for dashboard.
     * 
     * These will be replaced with real data from EmployeeService and
     * HRAnalyticsService in Phase 9.
     */
    private function getPlaceholderMetrics(): array
    {
        return [
            'totalEmployees' => [
                'count' => 0,
                'trend' => 0, // percentage change from last month
                'label' => 'Total Employees',
            ],
            'activeEmployees' => [
                'count' => 0,
                'percentage' => 0, // percentage of total
                'label' => 'Active Employees',
            ],
            'departmentBreakdown' => [
                'data' => [],
                'label' => 'Employees by Department',
            ],
            'recentHires' => [
                'data' => [],
                'count' => 0,
                'label' => 'Recent Hires (Last 30 Days)',
            ],
            'pendingActions' => [
                'count' => 0,
                'label' => 'Pending Actions',
                'items' => [],
            ],
        ];
    }
}
