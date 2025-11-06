<?php

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
