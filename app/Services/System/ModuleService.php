<?php

/**
 * TODO: CONFIG EXTRACT AND BADGE DEC0UPLING
 *
 * This service currently acts as a hard-coded module registry mixed with UI state
 * (badge counts, enabled flags, route metadata). This is not domain logic and should
 * not live in a service layer long-term.
 *
 * Refactor plan:
 *  - Move module definitions (id/title/description/icon/route/category/enabled)
 *    into a database table or dedicated configuration structure
 *  - Expose a lightweight endpoint to retrieve module metadata without counts
 *  - Fetch badge/alert metrics separately (async) via dedicated stats endpoints
 *  - Scope cache keys per tenant/org once multi-tenancy is enabled
 *  - Eventually remove ModuleService entirely and replace with
 *    ModulesConfigRepository + ModuleMetricsService
 *
 * This file is temporary to keep UI functional during early development.
 * will rip it out once feature flags and dynamic module management exist.
 */

namespace App\Services\System;

use App\Repositories\Contracts\System\ModuleRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class ModuleService
{
    public function __construct(
        protected ModuleRepositoryInterface $repository
    ) {}

    /**
     * Get the complete module grid with badges and counts
     */
    public function getModuleGrid(): array
    {
        $counts = Cache::remember('module_counts', now()->addMinutes(5), function () {
            return $this->repository->getModuleCounts();
        });

        return [
            'system_administration' => $this->getSystemAdministrationModules($counts),
            'security_access' => $this->getSecurityAccessModules($counts),
            'organization' => $this->getOrganizationModules($counts),
            'hr_operations' => $this->getHROperationsModules($counts),
            'monitoring' => $this->getMonitoringModules($counts),
        ];
    }

    /**
     * Get System & Server Administration modules
     */
    protected function getSystemAdministrationModules(array $counts): array
    {
        return [
            [
                'id' => 'system_health',
                'title' => 'System Health',
                'description' => 'Monitor server resources and performance',
                'icon' => 'Activity',
                'route' => '/system/health',
                'badge' => $counts['critical_events'] > 0 ? [
                    'count' => $counts['critical_events'],
                    'variant' => 'destructive',
                    'label' => 'Critical',
                ] : null,
                'enabled' => true,
                'category' => 'system',
            ],
            [
                'id' => 'active_sessions',
                'title' => 'Active Sessions',
                'description' => 'View current user activity and sessions',
                'icon' => 'Users',
                'route' => '/system/sessions',
                'badge' => [
                    'count' => $counts['active_sessions'],
                    'variant' => 'default',
                    'label' => 'Active',
                ],
                'enabled' => true,
                'category' => 'system',
            ],
            [
                'id' => 'backups',
                'title' => 'Backup Management',
                'description' => 'Configure and monitor system backups',
                'icon' => 'Database',
                'route' => '/system/backups',
                'badge' => $counts['failed_backups'] > 0 ? [
                    'count' => $counts['failed_backups'],
                    'variant' => 'destructive',
                    'label' => 'Failed',
                ] : null,
                'enabled' => true,
                'category' => 'system',
            ],
            [
                'id' => 'audit_logs',
                'title' => 'Audit Logs',
                'description' => 'Review system events and changes',
                'icon' => 'ScrollText',
                'route' => '/system/audit',
                'badge' => null,
                'enabled' => true,
                'category' => 'system',
            ],
            [
                'id' => 'patches',
                'title' => 'Update Management',
                'description' => 'Manage system patches and updates',
                'icon' => 'Download',
                'route' => '/system/patches',
                'badge' => $counts['security_patches'] > 0 ? [
                    'count' => $counts['security_patches'],
                    'variant' => 'warning',
                    'label' => 'Security',
                ] : ($counts['pending_patches'] > 0 ? [
                    'count' => $counts['pending_patches'],
                    'variant' => 'default',
                    'label' => 'Pending',
                ] : null),
                'enabled' => true,
                'category' => 'system',
            ],
        ];
    }

    /**
     * Get Security & Access modules
     */
    protected function getSecurityAccessModules(array $counts): array
    {
        return [
            [
                'id' => 'roles',
                'title' => 'Role Management',
                'description' => 'Configure roles and permissions',
                'icon' => 'Shield',
                'route' => '/system/security/roles',
                'badge' => null,
                'enabled' => true,
                'category' => 'security',
            ],
            [
                'id' => 'users',
                'title' => 'User Lifecycle',
                'description' => 'Manage user accounts and access',
                'icon' => 'UserCog',
                'route' => '/system/users',
                'badge' => $counts['pending_users'] > 0 ? [
                    'count' => $counts['pending_users'],
                    'variant' => 'warning',
                    'label' => 'Pending',
                ] : null,
                'enabled' => true,
                'category' => 'security',
            ],
            [
                'id' => 'password_policy',
                'title' => 'Password Policies',
                'description' => 'Configure password requirements',
                'icon' => 'Key',
                'route' => '/system/security/password-policy',
                'badge' => null,
                'enabled' => true,
                'category' => 'security',
            ],
            [
                'id' => 'two_factor',
                'title' => 'Two-Factor Auth',
                'description' => '2FA enforcement and settings',
                'icon' => 'Smartphone',
                'route' => '/system/security/two-factor',
                'badge' => null,
                'enabled' => true,
                'category' => 'security',
            ],
            [
                'id' => 'ip_control',
                'title' => 'IP Access Control',
                'description' => 'Manage IP allowlist and blocklist',
                'icon' => 'Network',
                'route' => '/system/security/ip-control',
                'badge' => null,
                'enabled' => false, // Coming soon
                'category' => 'security',
            ],
        ];
    }

    /**
     * Get Organization Control modules
     */
    protected function getOrganizationModules(array $counts): array
    {
        return [
            [
                'id' => 'departments',
                'title' => 'Departments',
                'description' => 'Manage organizational structure',
                'icon' => 'Building2',
                'route' => '/hr/departments',
                'badge' => null,
                'enabled' => false,
                'category' => 'organization',
            ],
            [
                'id' => 'positions',
                'title' => 'Positions',
                'description' => 'Define job titles and hierarchy',
                'icon' => 'Briefcase',
                'route' => '/hr/positions',
                'badge' => null,
                'enabled' => false,
                'category' => 'organization',
            ],
            [
                'id' => 'payroll_schedules',
                'title' => 'Payroll Schedules',
                'description' => 'Configure pay period settings',
                'icon' => 'Calendar',
                'route' => '/hr/payroll/schedules',
                'badge' => null,
                'enabled' => false,
                'category' => 'organization',
            ],
            [
                'id' => 'shift_management',
                'title' => 'Shift Management',
                'description' => 'Manage shift rules and calendar',
                'icon' => 'Clock',
                'route' => '/hr/shifts',
                'badge' => null,
                'enabled' => false,
                'category' => 'organization',
            ],
            [
                'id' => 'workforce_planning',
                'title' => 'Workforce Planning',
                'description' => 'Schedule and capacity management',
                'icon' => 'Users2',
                'route' => '/hr/workforce',
                'badge' => null,
                'enabled' => false,
                'category' => 'organization',
            ],
        ];
    }

    /**
     * Get HR Operations modules
     */
    protected function getHROperationsModules(array $counts): array
    {
        return [
            [
                'id' => 'employees',
                'title' => 'Employee Records',
                'description' => 'Master employee database',
                'icon' => 'UserCheck',
                'route' => '/hr/employees',
                'badge' => $counts['pending_onboarding'] > 0 ? [
                    'count' => $counts['pending_onboarding'],
                    'variant' => 'warning',
                    'label' => 'Onboarding',
                ] : null,
                'enabled' => false,
                'category' => 'hr',
            ],
            [
                'id' => 'appraisals',
                'title' => 'Appraisal Config',
                'description' => 'Performance review settings',
                'icon' => 'Star',
                'route' => '/hr/appraisals/config',
                'badge' => null,
                'enabled' => false,
                'category' => 'hr',
            ],
            [
                'id' => 'performance_metrics',
                'title' => 'Performance Metrics',
                'description' => 'Evaluation criteria management',
                'icon' => 'TrendingUp',
                'route' => '/hr/performance/metrics',
                'badge' => null,
                'enabled' => false,
                'category' => 'hr',
            ],
            [
                'id' => 'review_cycles',
                'title' => 'Review Cycles',
                'description' => 'Appraisal period management',
                'icon' => 'RotateCw',
                'route' => '/hr/reviews/cycles',
                'badge' => null,
                'enabled' => false,
                'category' => 'hr',
            ],
        ];
    }

    /**
     * Get Monitoring & Reporting modules
     */
    protected function getMonitoringModules(array $counts): array
    {
        return [
            [
                'id' => 'usage_analytics',
                'title' => 'Usage Analytics',
                'description' => 'System usage statistics',
                'icon' => 'BarChart3',
                'route' => '/system/analytics',
                'badge' => null,
                'enabled' => false,
                'category' => 'monitoring',
            ],
            [
                'id' => 'security_reports',
                'title' => 'Security Reports',
                'description' => 'Security event analysis',
                'icon' => 'ShieldAlert',
                'route' => '/system/reports/security',
                'badge' => null,
                'enabled' => false,
                'category' => 'monitoring',
            ],
            [
                'id' => 'payroll_logs',
                'title' => 'Payroll Logs',
                'description' => 'Payroll generation history',
                'icon' => 'FileText',
                'route' => '/hr/payroll/logs',
                'badge' => null,
                'enabled' => false,
                'category' => 'monitoring',
            ],
            [
                'id' => 'compliance',
                'title' => 'Compliance Reports',
                'description' => 'Workforce compliance tracking',
                'icon' => 'ClipboardCheck',
                'route' => '/hr/compliance',
                'badge' => null,
                'enabled' => false,
                'category' => 'monitoring',
            ],
        ];
    }

    /**
     * Get module statistics
     */
    public function getModuleStats(string $moduleId): array
    {
        // Return detailed stats for a specific module
        return match ($moduleId) {
            'system_health' => [
                'status' => 'healthy',
                'metrics' => [],
            ],
            default => [],
        };
    }

    /**
     * Get pending actions count for a module
     */
    public function getPendingActionsCount(string $moduleId): int
    {
        $counts = $this->repository->getModuleCounts();
        
        return match ($moduleId) {
            'patches' => $counts['pending_patches'],
            'users' => $counts['pending_users'],
            'employees' => $counts['pending_onboarding'],
            default => 0,
        };
    }
}
