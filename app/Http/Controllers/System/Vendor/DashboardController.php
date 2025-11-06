<?php

namespace App\Http\Controllers\System\Vendor;

use App\Http\Controllers\Controller;
use App\Services\System\Vendor\RemoteVendorSLAService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected RemoteVendorSLAService $slaService
    ) {}

    /**
     * Show the vendor dashboard with SLA metrics.
     */
    public function index(Request $request)
    {
        // Get SLA metrics from the service
        $slaMetrics = null;
        try {
            $slaMetrics = $this->slaService->getDashboardMetrics();
        } catch (\Exception $e) {
            // Fallback to placeholder data if service fails
            $slaMetrics = $this->generatePlaceholderSLAMetrics();
        }

        $data = [
            'sla' => $slaMetrics,
            'vendor' => [
                'name' => $request->user()?->name ?? 'Vendor Account',
                'email' => $request->user()?->email ?? 'vendor@cameco.com',
            ],
        ];

        return Inertia::render('System/Vendor/Dashboard', $data);
    }

    /**
     * Generate placeholder SLA metrics for demonstration purposes.
     */
    private function generatePlaceholderSLAMetrics(): array
    {
        // Calculate if support hours are currently active (Mon-Fri, 9AM-5PM)
        $now = now();
        $isBusinessHours = $now->isWeekday() && 
                          $now->hour >= 9 && 
                          $now->hour < 17;

        // Simulate deployment date (2 years of support from deployment)
        $deploymentDate = now()->subMonths(6); // Deployed 6 months ago
        $supportEndDate = $deploymentDate->copy()->addMonths(24);
        $daysUntilSupportEnd = now()->diffInDays($supportEndDate, false);

        return [
            'uptime' => [
                'current_uptime_hours' => 720, // 30 days continuous uptime
                'uptime_percentage' => 99.9,
                'last_downtime' => null,
                'total_downtime_hours_this_month' => 0.5,
            ],
            'incidents' => [
                'open_critical' => 0,
                'open_major' => 0,
                'open_minor' => 2,
                'avg_response_time_critical' => '45 minutes',
                'avg_resolution_time_critical' => '6 hours',
                'incidents_this_month' => 5,
            ],
            'patches' => [
                'current_version' => '1.0.0',
                'latest_patch_date' => now()->subDays(15)->toISOString(),
                'pending_patches' => 0,
                'next_scheduled_patch' => now()->addDays(75)->toISOString(), // Quarterly patches
            ],
            'support' => [
                'status' => $isBusinessHours ? 'available' : 'offline',
                'hours' => 'Mon-Fri, 9AM-5PM',
                'days_until_support_end' => (int) $daysUntilSupportEnd,
                'support_end_date' => $supportEndDate->toISOString(),
            ],
        ];
    }
}
