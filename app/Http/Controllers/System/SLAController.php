<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Services\System\SuperadminSLAService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Superadmin SLA Controller
 * 
 * Handles SLA metrics and monitoring for superadmin users.
 */
class SLAController extends Controller
{
    public function __construct(
        protected SuperadminSLAService $slaService
    ) {}

    /**
     * Display SLA metrics dashboard.
     */
    public function index(Request $request)
    {
        $slaMetrics = $this->slaService->getDashboardMetrics();

        return Inertia::render('System/SLAMonitoring', [
            'sla' => $slaMetrics,
        ]);
    }

    /**
     * Get uptime metrics.
     */
    public function uptime(Request $request)
    {
        return response()->json([
            'uptime' => $this->slaService->getUptimeMetrics(),
        ]);
    }

    /**
     * Get incident metrics and details.
     */
    public function incidents(Request $request)
    {
        return response()->json([
            'incidents' => $this->slaService->getDetailedIncidentReport(),
        ]);
    }

    /**
     * Get patch status and details.
     */
    public function patches(Request $request)
    {
        return response()->json([
            'patches' => $this->slaService->getDetailedPatchReport(),
        ]);
    }

    /**
     * Clear SLA metrics cache.
     */
    public function clearCache(Request $request)
    {
        $this->slaService->clearCache();

        return redirect()->back()->with('success', 'SLA metrics cache cleared successfully.');
    }
}
