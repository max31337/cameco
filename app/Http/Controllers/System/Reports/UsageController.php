<?php

namespace App\Http\Controllers\System\Reports;

use App\Http\Controllers\Controller;
use App\Services\System\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class UsageController extends Controller
{
    public function __construct(protected AnalyticsService $analyticsService) {}

    /**
     * Display usage analytics dashboard
     */
    public function index(Request $request): Response
    {
        // Get date range from request
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : now()->subMonths(1);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : now();

        // Ensure from <= to
        if ($from > $to) {
            [$from, $to] = [$to, $from];
        }

        // Get all analytics data
        $activitySummary = $this->analyticsService->getUserActivitySummary($from, $to);
        $userLoginStats = $this->analyticsService->getUserLoginStats($from, $to);
        $mostUsedModules = $this->analyticsService->getMostUsedModules($from, $to);
        $activityHeatmap = $this->analyticsService->getUserActivityHeatmap($from, $to);
        $sessionStats = $this->analyticsService->getSessionDurationStats($from, $to);
        $activityByType = $this->analyticsService->getActivityByActionType($from, $to);

        $breadcrumbs = [
            ['title' => 'System', 'href' => '/system/dashboard'],
            ['title' => 'Reports', 'href' => '#'],
            ['title' => 'Usage Analytics', 'href' => '#'],
        ];

        return Inertia::render('System/Reports/Usage', [
            'activity_summary' => $activitySummary,
            'user_login_stats' => collect($userLoginStats)->take(20)->values()->toArray(),
            'most_used_modules' => $mostUsedModules,
            'activity_heatmap' => $activityHeatmap,
            'session_stats' => $sessionStats,
            'activity_by_type' => collect($activityByType)->take(15)->values()->toArray(),
            'from_date' => $from->format('Y-m-d'),
            'to_date' => $to->format('Y-m-d'),
            'breadcrumbs' => $breadcrumbs,
        ]);
    }
}
