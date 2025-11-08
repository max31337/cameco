<?php

namespace App\Services\System;

use App\Models\SystemSetting;
use App\Repositories\Contracts\System\SuperadminSLARepositoryInterface;
use App\Services\System\VendorContractService;
use Illuminate\Support\Facades\Cache;

/**
 * Superadmin SLA Service
 * 
 * Business logic for system SLA monitoring and metrics aggregation.
 * Provides superadmins with comprehensive system health and SLA metrics.
 */
class SuperadminSLAService
{
    public function __construct(
        protected SuperadminSLARepositoryInterface $repository,
        protected VendorContractService $contractService
    ) {}

    /**
     * Get comprehensive SLA metrics for the dashboard.
     *
     * @return array
     */
    public function getDashboardMetrics(): array
    {
        // Cache for 60 seconds in development, 300 seconds (5 minutes) in production
        $cacheTtl = config('app.env') === 'local' ? 60 : 300;
        
        return Cache::remember('superadmin_sla_dashboard_metrics', $cacheTtl, function () {
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
        $contractData = $this->contractService->getContractDetails();
        $contract = $contractData['contract'] ?? [];
        
        $now = now();
        
        // Check if current time is within business hours
        // Parse support hours from contract (e.g., "Mon-Fri, 9AM-5PM")
        $isBusinessHours = $now->isWeekday() && 
                          $now->hour >= 9 && 
                          $now->hour < 17;
        
        $daysRemaining = $contract['days_remaining'] ?? 0;
        $isExpired = $daysRemaining <= 0;
        $isExpiringSoon = $daysRemaining > 0 && $daysRemaining <= 90; // 90 days threshold

        return [
            'status' => $isExpired ? 'offline' : ($isBusinessHours ? 'available' : 'offline'),
            'hours' => $contract['availability'] ?? '24/7',
            'days_until_support_end' => max(0, $daysRemaining),
            'support_end_date' => $contract['end_date'] ?? null,
            'contract_number' => $contract['contract_number'] ?? 'N/A',
            'contract_status' => $contract['status'] ?? 'unknown',
            'support_level' => $contract['support_level'] ?? 'basic',
            'contact_email' => $contract['contact_email'] ?? config('mail.from.address'),
            'contact_phone' => $contract['contact_phone'] ?? null,
            'response_time' => $contract['response_time'] ?? 'N/A',
            'renewal_url' => config('app.url') . '/system/sla', // Link to SLA page
            'is_expiring_soon' => $isExpiringSoon,
            'is_expired' => $isExpired,
            'source' => $contractData['source'] ?? 'config',
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
        Cache::forget('superadmin_sla_dashboard_metrics');
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
