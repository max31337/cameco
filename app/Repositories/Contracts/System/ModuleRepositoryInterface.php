<?php

namespace App\Repositories\Contracts\System;

interface ModuleRepositoryInterface
{
    /**
     * Get counts for all modules
     */
    public function getModuleCounts(): array;

    /**
     * Get active user sessions count
     */
    public function getActiveSessionsCount(): int;

    /**
     * Get failed backups count (last 7 days)
     */
    public function getFailedBackupsCount(): int;

    /**
     * Get pending employee onboarding count
     */
    public function getPendingOnboardingCount(): int;

    /**
     * Get recent activity for a module
     */
    public function getRecentActivity(string $module, int $limit = 5): array;

    /**
     * Get critical security events count (24h)
     */
    public function getCriticalSecurityEventsCount(): int;

    /**
     * Get pending user accounts count (not verified)
     */
    public function getPendingUsersCount(): int;
}
