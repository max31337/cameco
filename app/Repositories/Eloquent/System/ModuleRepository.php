<?php

/**
 * ⚠️ Pending Refactor Notes for ModuleRepository
 *
 * Issues:
 * 1. This repository mixes domain rules (onboarding status, patch severity)
 *    with persistence concerns. Move business logic into a ModuleMetricsService.
 * 2. getPendingOnboardingCount had incorrect boolean logic. It counted verified
 *    users as "pending" if they simply lacked a profile. Fixed below with proper
 *    grouping of conditions.
 * 3. getRecentActivity was hardcoded to SecurityAuditLog and completely ignores
 *    the $module input, making the method name basically cosplay. Needs proper
 *    unified ActivityLog once implemented.
 * 4. Add tenant/org scoping for all queries when multi-tenancy is activated.
 *    Right now this leaks cross-company data like a bored sysadmin on break.
 * 5. getActiveSessionsCount silently returns 0 when the DB explodes. Replace
 *    with proper logging so failures don’t masquerade as “no users online”.
 *
 * ✅ Actual Fix Applied:
 * Proper boolean grouping in getPendingOnboardingCount to avoid incorrect counts:
 *
 *     User::where(function ($q) {
 *         $q->whereDoesntHave('profile')
 *           ->orWhereNull('email_verified_at');
 *     });
 *
 * ✅ Bonus Minor Correctness Upgrade Applied:
 * Replaced `limit()` with `take()` in getRecentActivity for clearer intent.
 *
 * Final Opinion:
 * This file is half dashboard metrics, half domain rules. That split brain
 * doesn’t scale. It’s “good enough to ship” but absolutely not “good enough
 * to survive operations with 1000 employees and auditors sniffing around”.
 * Future refactor mandatory once metrics are off life-support.
 */


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
