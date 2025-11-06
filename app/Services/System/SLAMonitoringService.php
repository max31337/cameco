<?php

namespace App\Services\System;

use App\Repositories\Contracts\SLAMonitoringRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class SLAMonitoringService
{
    public function __construct(
        protected SLAMonitoringRepositoryInterface $repository
    ) {}

    /**
     * Get comprehensive SLA metrics for the dashboard.
     *
     * @return array
     */
    public function getDashboardMetrics(): array
    {
        return Cache::remember('sla_dashboard_metrics', 300, function () {
            return [
                'uptime' => $this->getUptimeMetrics(),
                'incidents' => $this->getIncidentMetrics(),
                'patches' => $this->getPatchStatus(),
                'support' => $this->getSupportAvailability(),
            ];
        });
    }

    /**
     * Get uptime metrics for the current month.
     *
     * @return array
     */
    public function getUptimeMetrics(): array
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $uptimeData = $this->repository->calculateUptimePercentage(
            $startOfMonth->toDateTime(),
            $endOfMonth->toDateTime()
        );

        $currentUptimeHours = $this->repository->getCurrentUptimeHours();
        $lastDowntime = $this->repository->getRecentDowntimeEvents(1)->first();

        return [
            'current_uptime_hours' => $currentUptimeHours ?? 0,
            'uptime_percentage' => $uptimeData['uptime_percentage'] ?? 100.0,
            'last_downtime' => $lastDowntime?->checked_at?->toISOString(),
            'total_downtime_hours_this_month' => $uptimeData['total_downtime_hours'] ?? 0.0,
        ];
    }

    /**
     * Get incident metrics including open incidents and averages.
     *
     * @return array
     */
    public function getIncidentMetrics(): array
    {
        $openIncidents = $this->repository->getOpenIncidentsBySeverity();

        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $monthlyMetrics = $this->repository->getIncidentMetrics(
            $startOfMonth->toDateTime(),
            $endOfMonth->toDateTime()
        );

        // Format average times for display
        $avgResponseTime = $monthlyMetrics['avg_response_time']
            ? $this->formatMinutesToHumanReadable($monthlyMetrics['avg_response_time'])
            : 'N/A';

        $avgResolutionTime = $monthlyMetrics['avg_resolution_time']
            ? round($monthlyMetrics['avg_resolution_time'], 1) . ' hours'
            : 'N/A';

        return [
            'open_critical' => $openIncidents['critical'],
            'open_major' => $openIncidents['major'],
            'open_minor' => $openIncidents['minor'],
            'avg_response_time_critical' => $avgResponseTime,
            'avg_resolution_time_critical' => $avgResolutionTime,
            'incidents_this_month' => $monthlyMetrics['total'],
        ];
    }

    /**
     * Get patch deployment status.
     *
     * @return array
     */
    public function getPatchStatus(): array
    {
        $latestPatch = $this->repository->getLatestDeployedPatch();
        $pendingCount = $this->repository->getPendingPatchesCount();
        $nextScheduled = $this->repository->getNextScheduledPatch();

        return [
            'current_version' => $latestPatch?->version ?? '1.0.0',
            'latest_patch_date' => $latestPatch?->deployed_at?->toISOString() ?? now()->subDays(30)->toISOString(),
            'pending_patches' => $pendingCount,
            'next_scheduled_patch' => $nextScheduled?->scheduled_at?->toISOString() ?? now()->addDays(90)->toISOString(),
        ];
    }

    /**
     * Get support availability status.
     *
     * @return array
     */
    public function getSupportAvailability(): array
    {
        $now = now();
        
        // Check if current time is within business hours (Mon-Fri, 9AM-5PM)
        $isBusinessHours = $now->isWeekday() && 
                          $now->hour >= 9 && 
                          $now->hour < 17;

        // Calculate support end date (e.g., 2 years from deployment)
        // You might want to store this in system settings
        $supportEndDate = now()->addMonths(18); // 18 months remaining
        $daysUntilSupportEnd = now()->diffInDays($supportEndDate, false);

        return [
            'status' => $isBusinessHours ? 'available' : 'offline',
            'hours' => 'Mon-Fri, 9AM-5PM',
            'days_until_support_end' => (int) $daysUntilSupportEnd,
            'support_end_date' => $supportEndDate->toISOString(),
        ];
    }

    /**
     * Format minutes to human-readable format (e.g., "1.5 hours" or "45 minutes").
     *
     * @param float $minutes
     * @return string
     */
    protected function formatMinutesToHumanReadable(float $minutes): string
    {
        if ($minutes >= 60) {
            $hours = round($minutes / 60, 1);
            return $hours . ' hours';
        }

        return round($minutes, 0) . ' minutes';
    }

    /**
     * Clear the dashboard metrics cache.
     *
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget('sla_dashboard_metrics');
    }

    /**
     * Get detailed incident report.
     *
     * @return array
     */
    public function getDetailedIncidentReport(): array
    {
        $openIncidents = $this->repository->getOpenIncidents();

        return [
            'open_incidents' => $openIncidents->map(function ($incident) {
                return [
                    'id' => $incident->id,
                    'title' => $incident->title,
                    'severity' => $incident->severity,
                    'status' => $incident->status,
                    'detected_at' => $incident->detected_at?->toISOString(),
                    'response_time' => $incident->response_time,
                    'assigned_to' => $incident->assignee?->name,
                ];
            }),
            'summary' => $this->repository->getOpenIncidentsBySeverity(),
        ];
    }

    /**
     * Get detailed patch report.
     *
     * @return array
     */
    public function getDetailedPatchReport(): array
    {
        $pendingPatches = $this->repository->getPendingPatches();
        $latestPatch = $this->repository->getLatestDeployedPatch();

        return [
            'pending_patches' => $pendingPatches->map(function ($patch) {
                return [
                    'id' => $patch->id,
                    'version' => $patch->version,
                    'type' => $patch->type,
                    'scheduled_at' => $patch->scheduled_at?->toISOString(),
                    'description' => $patch->description,
                ];
            }),
            'latest_deployed' => $latestPatch ? [
                'version' => $latestPatch->version,
                'deployed_at' => $latestPatch->deployed_at?->toISOString(),
                'type' => $latestPatch->type,
            ] : null,
        ];
    }
}
