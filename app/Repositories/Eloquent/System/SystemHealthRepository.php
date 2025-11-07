<?php

/**
 * ⚠️ Pending Refactor Notes for SystemHealthRepository
 *
 * Issues:
 * 1. This repository is doing too much. Health metrics, backup stats, security event counts…
 *    It became the orphanage of every “system-related number we can show on a dashboard”.
 *    Split into: HealthRepository + BackupRepository + SecurityMetricsRepository later.
 *
 * 2. getRecentSecurityEvents should eventually use a unified Activity/EventLog table.
 *    SecurityAuditLog is only one source. Dashboard will lie by omission if other systems fail silently.
 *
 * 3. Backup success rate triggers two nearly identical queries. Merge into a single aggregate
 *    grouping query to avoid redundant load and improve scale.
 *
 * 4. Every metric fetch needs tenant-aware conditions once multi-tenancy is enabled.
 *    Right now this exposes all organization data to whoever queries it. Legal nightmares pending.
 *
 * 5. Recent fetch methods return arrays instead of DTOs. Once SigNoz or OpenTelemetry integration
 *    kicks in, return lightweight metric objects instead of pouring entire DB rows directly into the UI.
 *
 * ✅ Actual Fix Suggested (but not fully implemented yet):
 * Replace `limit()` with `take()` for consistency and readability across Laravel metric fetchers:
 *
 *    ->latest()->take($limit)
 *
 * ✅ Bonus Minor Correctness Upgrades To Apply Soon:
 * - Collapse duplicate queries in getBackupSuccessRate using SUM(CASE…) grouping.
 * - Cache read-heavy metrics behind `Cache::remember()` for dashboards refreshing every few seconds.
 *
 * Final Opinion:
 * This code isn’t broken. It’s just awkward, overworked and deserves a better life.
 * Perfectly fine for early HRIS deployments with <1000 employees. Will cry into the logs when
 * SLA dashboards start getting refreshed every 10 seconds by executives who love blinking charts.
 */

namespace App\Repositories\Eloquent\System;

use App\Models\SecurityAuditLog;
use App\Models\SystemBackupLog;
use App\Models\SystemHealthLog;
use App\Models\SystemPatchApproval;
use App\Repositories\Contracts\System\SystemHealthRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SystemHealthRepository implements SystemHealthRepositoryInterface
{
    /**
     * Get the latest health log
     */
    public function getLatestHealthLog(): ?object
    {
        return SystemHealthLog::latest()->first();
    }

    /**
     * Get the latest backup log
     */
    public function getLatestBackup(): ?object
    {
        return SystemBackupLog::latest()->first();
    }

    /**
     * Get backup success rate (last 30 days)
     */
    public function getBackupSuccessRate(): float
    {
        $thirtyDaysAgo = now()->subDays(30);
        
        $total = SystemBackupLog::where('created_at', '>=', $thirtyDaysAgo)
            ->whereIn('status', ['completed', 'failed'])
            ->count();

        if ($total === 0) {
            return 0;
        }

        $successful = SystemBackupLog::where('created_at', '>=', $thirtyDaysAgo)
            ->where('status', 'completed')
            ->count();

        return round(($successful / $total) * 100, 2);
    }

    /**
     * Get pending patch approvals count
     */
    public function getPendingPatchesCount(): int
    {
        return SystemPatchApproval::pending()->count();
    }

    /**
     * Get security patches pending approval
     */
    public function getSecurityPatchesPending(): int
    {
        return SystemPatchApproval::pending()
            ->security()
            ->count();
    }

    /**
     * Get critical security events (last 24 hours)
     */
    public function getCriticalSecurityEventsCount(): int
    {
        return SecurityAuditLog::critical()
            ->recent()
            ->count();
    }

    /**
     * Get failed login attempts (last 24 hours)
     */
    public function getFailedLoginAttemptsCount(): int
    {
        return SecurityAuditLog::failedLogins()
            ->recent()
            ->count();
    }

    /**
     * Get recent security events
     */
    public function getRecentSecurityEvents(int $limit = 5): array
    {
        return SecurityAuditLog::with('user')
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Create a new health log entry
     */
    public function createHealthLog(array $data): object
    {
        return SystemHealthLog::create($data);
    }

    /**
     * Get health log history (last N days)
     */
    public function getHealthHistory(int $days = 7): array
    {
        return SystemHealthLog::where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'asc')
            ->get()
            ->toArray();
    }

    /**
     * Get health logs collection (last N days)
     */
    public function getHealthLogs(int $days = 7): \Illuminate\Database\Eloquent\Collection
    {
        return SystemHealthLog::where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Get backup history (last N days)
     */
    public function getBackupHistory(int $days = 30): array
    {
        return SystemBackupLog::where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'desc')
            ->get()
            ->toArray();
    }
}
