<?php

namespace App\Repositories\Eloquent\System;

use App\Models\SystemIncident;
use App\Models\SystemPatch;
use App\Models\SystemUptimeLog;
use App\Repositories\Contracts\SLAMonitoringRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SLAMonitoringRepository implements SLAMonitoringRepositoryInterface
{
    /**
     * Get open incidents grouped by severity.
     */
    public function getOpenIncidentsBySeverity(): array
    {
        $incidents = SystemIncident::open()
            ->select('severity', DB::raw('count(*) as count'))
            ->groupBy('severity')
            ->get()
            ->pluck('count', 'severity')
            ->toArray();

        return [
            'critical' => $incidents['critical'] ?? 0,
            'major' => $incidents['major'] ?? 0,
            'minor' => $incidents['minor'] ?? 0,
        ];
    }

    /**
     * Get incident metrics for a given time period.
     */
    public function getIncidentMetrics(\DateTime $startDate, \DateTime $endDate): array
    {
        $incidents = SystemIncident::inDateRange($startDate, $endDate)->get();

        $total = $incidents->count();
        
        // Filter incidents that have response time data
        $incidentsWithResponseTime = $incidents->filter(function ($incident) {
            return $incident->response_time !== null;
        });

        // Filter incidents that have resolution time data
        $incidentsWithResolutionTime = $incidents->filter(function ($incident) {
            return $incident->resolution_time !== null;
        });

        $avgResponseTime = $incidentsWithResponseTime->count() > 0
            ? $incidentsWithResponseTime->avg('response_time')
            : null;

        $avgResolutionTime = $incidentsWithResolutionTime->count() > 0
            ? $incidentsWithResolutionTime->avg('resolution_time')
            : null;

        return [
            'total' => $total,
            'avg_response_time' => $avgResponseTime ? round($avgResponseTime, 2) : null,
            'avg_resolution_time' => $avgResolutionTime ? round($avgResolutionTime, 2) : null,
        ];
    }

    /**
     * Calculate uptime percentage for a given period.
     */
    public function calculateUptimePercentage(\DateTime $startDate, \DateTime $endDate): array
    {
        $logs = SystemUptimeLog::inDateRange($startDate, $endDate)->get();

        $totalChecks = $logs->count();
        
        if ($totalChecks === 0) {
            return [
                'uptime_percentage' => 100.0,
                'total_checks' => 0,
                'downtime_events' => 0,
                'total_downtime_hours' => 0.0,
            ];
        }

        $downtimeEvents = $logs->where('is_healthy', false);
        $downtimeCount = $downtimeEvents->count();

        // Calculate total downtime hours
        // Assuming each downtime event represents the duration until the next healthy check
        $totalDowntimeHours = 0.0;
        $sortedLogs = $logs->sortBy('checked_at')->values();

        foreach ($sortedLogs as $index => $log) {
            if (!$log->is_healthy && isset($sortedLogs[$index + 1])) {
                $nextLog = $sortedLogs[$index + 1];
                $downtime = $log->checked_at->diffInHours($nextLog->checked_at, true);
                $totalDowntimeHours += $downtime;
            }
        }

        $uptimePercentage = (($totalChecks - $downtimeCount) / $totalChecks) * 100;

        return [
            'uptime_percentage' => round($uptimePercentage, 2),
            'total_checks' => $totalChecks,
            'downtime_events' => $downtimeCount,
            'total_downtime_hours' => round($totalDowntimeHours, 2),
        ];
    }

    /**
     * Get the latest uptime log entry.
     */
    public function getLatestUptimeLog(): ?SystemUptimeLog
    {
        return SystemUptimeLog::latest('checked_at')->first();
    }

    /**
     * Get current uptime in hours (time since last downtime).
     */
    public function getCurrentUptimeHours(): ?float
    {
        $lastDowntime = SystemUptimeLog::downtime()
            ->latest('checked_at')
            ->first();

        if (!$lastDowntime) {
            // No downtime recorded, check first log entry
            $firstLog = SystemUptimeLog::oldest('checked_at')->first();
            
            if (!$firstLog) {
                return null;
            }

            return round($firstLog->checked_at->diffInHours(now(), true), 2);
        }

        return round($lastDowntime->checked_at->diffInHours(now(), true), 2);
    }

    /**
     * Get the latest deployed patch.
     */
    public function getLatestDeployedPatch(): ?SystemPatch
    {
        return SystemPatch::latestDeployed()->first();
    }

    /**
     * Get count of pending patches.
     */
    public function getPendingPatchesCount(): int
    {
        return SystemPatch::pending()->count();
    }

    /**
     * Get the next scheduled patch.
     */
    public function getNextScheduledPatch(): ?SystemPatch
    {
        return SystemPatch::scheduled()
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at', 'asc')
            ->first();
    }

    /**
     * Get all pending patches.
     */
    public function getPendingPatches(): Collection
    {
        return SystemPatch::pending()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get all open incidents.
     */
    public function getOpenIncidents(): Collection
    {
        return SystemIncident::open()
            ->with(['reporter', 'assignee'])
            ->orderBy('severity', 'asc')
            ->orderBy('detected_at', 'desc')
            ->get();
    }

    /**
     * Get recent downtime events.
     */
    public function getRecentDowntimeEvents(int $limit = 10): Collection
    {
        return SystemUptimeLog::downtime()
            ->latest('checked_at')
            ->limit($limit)
            ->get();
    }
}
