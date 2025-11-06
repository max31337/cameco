<?php

namespace App\Repositories\Contracts\System;

interface SystemHealthRepositoryInterface
{
    /**
     * Get the latest health log
     */
    public function getLatestHealthLog(): ?object;

    /**
     * Get the latest backup log
     */
    public function getLatestBackup(): ?object;

    /**
     * Get backup success rate (last 30 days)
     */
    public function getBackupSuccessRate(): float;

    /**
     * Get pending patch approvals count
     */
    public function getPendingPatchesCount(): int;

    /**
     * Get security patches pending approval
     */
    public function getSecurityPatchesPending(): int;

    /**
     * Get critical security events (last 24 hours)
     */
    public function getCriticalSecurityEventsCount(): int;

    /**
     * Get failed login attempts (last 24 hours)
     */
    public function getFailedLoginAttemptsCount(): int;

    /**
     * Get recent security events
     */
    public function getRecentSecurityEvents(int $limit = 5): array;

    /**
     * Create a new health log entry
     */
    public function createHealthLog(array $data): object;

    /**
     * Get health log history (last N days)
     */
    public function getHealthHistory(int $days = 7): array;

    /**
     * Get health logs collection (last N days)
     */
    public function getHealthLogs(int $days = 7): \Illuminate\Database\Eloquent\Collection;

    /**
     * Get backup history (last N days)
     */
    public function getBackupHistory(int $days = 30): array;
}
