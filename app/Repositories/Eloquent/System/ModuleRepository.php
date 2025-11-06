<?php

namespace App\Repositories\Eloquent\System;

use App\Models\SecurityAuditLog;
use App\Models\SystemBackupLog;
use App\Models\SystemPatchApproval;
use App\Models\User;
use App\Repositories\Contracts\System\ModuleRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ModuleRepository implements ModuleRepositoryInterface
{
    /**
     * Get counts for all modules
     */
    public function getModuleCounts(): array
    {
        return [
            'active_sessions' => $this->getActiveSessionsCount(),
            'failed_backups' => $this->getFailedBackupsCount(),
            'pending_patches' => SystemPatchApproval::pending()->count(),
            'security_patches' => SystemPatchApproval::pending()->security()->count(),
            'critical_events' => $this->getCriticalSecurityEventsCount(),
            'pending_users' => $this->getPendingUsersCount(),
            'pending_onboarding' => $this->getPendingOnboardingCount(),
        ];
    }

    /**
     * Get active user sessions count
     */
    public function getActiveSessionsCount(): int
    {
        try {
            return DB::table('sessions')
                ->where('last_activity', '>=', now()->subMinutes(30)->timestamp)
                ->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Get failed backups count (last 7 days)
     */
    public function getFailedBackupsCount(): int
    {
        return SystemBackupLog::failed()
            ->where('created_at', '>=', now()->subDays(7))
            ->count();
    }

    /**
     * Get pending employee onboarding count
     */
    public function getPendingOnboardingCount(): int
    {
        // This would check user_onboarding table when implemented
        // For now, return users without completed profiles
        return User::whereDoesntHave('profile')
            ->orWhereNull('email_verified_at')
            ->count();
    }

    /**
     * Get recent activity for a module
     */
    public function getRecentActivity(string $module, int $limit = 5): array
    {
        // This would query a general activity log table
        // For now, return security audit logs
        return SecurityAuditLog::with('user')
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get critical security events count (24h)
     */
    public function getCriticalSecurityEventsCount(): int
    {
        return SecurityAuditLog::critical()
            ->where('created_at', '>=', now()->subDay())
            ->count();
    }

    /**
     * Get pending user accounts count (not verified)
     */
    public function getPendingUsersCount(): int
    {
        return User::whereNull('email_verified_at')->count();
    }
}
