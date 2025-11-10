<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Services\HR\HRAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    protected HRAnalyticsService $analyticsService;

    public function __construct(HRAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Display the HR Analytics and Reports page.
     * 
     * Shows comprehensive HR analytics, charts, and detailed metrics.
     * Requires HR Manager or Superadmin role (enforced by middleware).
     */
    public function index(Request $request)
    {
        // Get all dashboard metrics from analytics service
        $metrics = $this->analyticsService->getDashboardMetrics();

        return Inertia::render('HR/Reports/Analytics', [
            'metrics' => $metrics,
        ]);
    }
}
