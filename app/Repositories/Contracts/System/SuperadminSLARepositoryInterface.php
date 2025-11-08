<?php

namespace App\Repositories\Contracts\System;

use Illuminate\Support\Collection;

/**
 * Superadmin SLA Repository Interface
 * 
 * Defines contract for querying system SLA data (incidents, uptime, patches).
 * Used for tracking system service level agreements and compliance metrics.
 */
interface SuperadminSLARepositoryInterface
{
    /**
     * Get open incidents grouped by severity.
     *
     * @return array{critical: int, major: int, minor: int}
     */
    public function getOpenIncidentsBySeverity(): array;

    /**
     * Get incident metrics for a given time period.
     *
     * @param \DateTime $startDate
     * @param \DateTime $endDate
     * @return array{total: int, avg_response_time: float|null, avg_resolution_time: float|null}
     */
    public function getIncidentMetrics(\DateTime $startDate, \DateTime $endDate): array;

    /**
     * Calculate uptime percentage for a given period.
     *
     * @param \DateTime $startDate
     * @param \DateTime $endDate
     * @return array{uptime_percentage: float, total_checks: int, downtime_events: int, total_downtime_hours: float}
     */
    public function calculateUptimePercentage(\DateTime $startDate, \DateTime $endDate): array;

    /**
     * Get the latest uptime log entry.
     *
     * @return \App\Models\ApplicationUptimeLog|null
     */
    public function getLatestUptimeLog();

    /**
     * Get current uptime in hours (time since last downtime).
     *
     * @return float|null
     */
    public function getCurrentUptimeHours(): ?float;

    /**
     * Get the latest deployed patch.
     *
     * @return \App\Models\Patch|null
     */
    public function getLatestDeployedPatch();

    /**
     * Get count of pending patches.
     *
     * @return int
     */
    public function getPendingPatchesCount(): int;

    /**
     * Get the next scheduled patch.
     *
     * @return \App\Models\Patch|null
     */
    public function getNextScheduledPatch();

    /**
     * Get all pending patches.
     *
     * @return Collection
     */
    public function getPendingPatches(): Collection;

    /**
     * Get all open incidents.
     *
     * @return Collection
     */
    public function getOpenIncidents(): Collection;

    /**
     * Get recent downtime events.
     *
     * @param int $limit
     * @return Collection
     */
    public function getRecentDowntimeEvents(int $limit = 10): Collection;
}
