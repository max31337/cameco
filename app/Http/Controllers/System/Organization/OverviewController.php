<?php

namespace App\Http\Controllers\System\Organization;

use App\Models\Department;
use App\Models\Position;
use App\Models\SecurityAuditLog;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class OverviewController extends \App\Http\Controllers\Controller
{
    use LogsSecurityAudits;

    /**
     * Display organization overview dashboard with company info, metrics, and onboarding status
     */
    public function index(Request $request): Response
    {
        // Get site_id and country from request (default to site 1, PH)
        $siteId = $request->input('site_id', 1);
        $country = $request->input('country', 'PH');
        
        // Cache key for overview data
        $cacheKey = "org_overview_{$siteId}_{$country}";
        
        // Try to get from cache (60s TTL)
        $data = Cache::remember($cacheKey, 60, function () use ($siteId, $country) {
            return $this->buildOverviewData($siteId, $country);
        });

        return Inertia::render('System/Organization/Overview', $data);
    }

    /**
     * Build all overview data
     */
    private function buildOverviewData(int $siteId, string $country): array
    {
        $departments = Department::with(['manager', 'children', 'positions'])
            ->withCount('positions')
            ->get();

        $positions = Position::with('department')->get();

        // Department summary
        $departmentSummary = [
            'total' => $departments->count(),
            'active' => $departments->where('is_active', true)->count(),
            'inactive' => $departments->where('is_active', false)->count(),
            'with_manager' => $departments->whereNotNull('manager_id')->count(),
            'total_budget' => $departments->sum('budget'),
            'templates' => $this->getDepartmentTemplates($country),
        ];

        // Position summary
        $positionsByLevel = $positions->groupBy('level')->map(fn($group) => $group->count());
        $salaryStats = [
            'min' => $positions->min('min_salary'),
            'max' => $positions->max('max_salary'),
            'avg_min' => round($positions->avg('min_salary')),
            'avg_max' => round($positions->avg('max_salary')),
        ];
        
        $positionSummary = [
            'total' => $positions->count(),
            'active' => $positions->where('is_active', true)->count(),
            'by_level' => $positionsByLevel->toArray(),
            'salary_ranges' => $salaryStats,
            'currency' => $this->getCurrency($country),
            'top_roles' => $positions->groupBy('title')
                ->map(fn($group) => ['title' => $group->first()->title, 'count' => $group->count()])
                ->sortByDesc('count')
                ->take(5)
                ->values()
                ->toArray(),
        ];

        // Company info
        $company = [
            'name' => config('app.name', 'Company Name'),
            'site_id' => 1,
            'country' => $country,
            'timezone' => $this->getTimezone($country),
            'currency' => $this->getCurrency($country),
            'environment' => config('app.env'),
        ];

        // Onboarding checklist
        $onboardingChecklist = $this->getOnboardingChecklist($country);

        // Recent audit events
        $recentAuditEvents = SecurityAuditLog::latest()
            ->limit(10)
            ->get()
            ->map(fn($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'user_name' => $log->user?->name ?? 'System',
                'timestamp' => $log->created_at->diffForHumans(),
                'details' => json_decode($log->details ?? '{}', true),
            ])
            ->toArray();

        // Onboarding progress
        $totalItems = count($onboardingChecklist);
        $completedItems = count(array_filter($onboardingChecklist, fn($item) => $item['status'] === 'completed'));
        $onboardingProgress = $totalItems > 0 ? round(($completedItems / $totalItems) * 100) : 0;

        // Alerts and recommendations
        $alerts = $this->generateAlerts($departmentSummary, $positionSummary, $onboardingChecklist, $country);

        return [
            'company' => $company,
            'department_summary' => $departmentSummary,
            'position_summary' => $positionSummary,
            'onboarding_checklist' => $onboardingChecklist,
            'onboarding_progress' => $onboardingProgress,
            'recent_audit_events' => $recentAuditEvents,
            'alerts' => $alerts,
            'supported_countries' => ['PH' => 'Philippines', 'US' => 'United States', 'SG' => 'Singapore', 'MY' => 'Malaysia'],
        ];
    }

    /**
     * Get department templates for a country
     */
    private function getDepartmentTemplates(string $country): array
    {
        return match($country) {
            'PH' => [
                ['name' => 'Engineering', 'code' => 'ENG', 'manager_placeholder' => 'CTO'],
                ['name' => 'Human Resources', 'code' => 'HR', 'manager_placeholder' => 'HR Manager'],
                ['name' => 'Finance', 'code' => 'FIN', 'manager_placeholder' => 'Finance Manager'],
                ['name' => 'Operations', 'code' => 'OPS', 'manager_placeholder' => 'Operations Manager'],
                ['name' => 'Sales', 'code' => 'SALES', 'manager_placeholder' => 'Sales Manager'],
            ],
            default => [
                ['name' => 'Engineering', 'code' => 'ENG'],
                ['name' => 'Operations', 'code' => 'OPS'],
                ['name' => 'Finance', 'code' => 'FIN'],
            ],
        };
    }

    /**
     * Get onboarding checklist for country
     */
    private function getOnboardingChecklist(string $country): array
    {
        $checklist = [
            [
                'id' => 'departments',
                'title' => 'Seed Default Departments',
                'description' => 'Create core company departments',
                'status' => Department::count() > 0 ? 'completed' : 'pending',
                'country_scoped' => false,
                'action_link' => '/system/organization/departments',
                'action_label' => 'View Departments',
            ],
            [
                'id' => 'positions',
                'title' => 'Seed Job Positions',
                'description' => 'Create job titles and hierarchy',
                'status' => Position::count() > 0 ? 'completed' : 'pending',
                'country_scoped' => false,
                'action_link' => '/system/organization/positions',
                'action_label' => 'View Positions',
            ],
            [
                'id' => 'roles',
                'title' => 'Configure Roles & Permissions',
                'description' => 'Set up security roles and permissions',
                'status' => 'pending',
                'country_scoped' => false,
                'action_link' => '/system/security/roles',
                'action_label' => 'Manage Roles',
            ],
        ];

        // Add country-specific items
        if ($country === 'PH') {
            $checklist[] = [
                'id' => 'statutory_ph',
                'title' => 'Configure Philippine Statutory Setup',
                'description' => 'SSS, PhilHealth, Pag-IBIG, BIR tax settings',
                'status' => 'pending',
                'country_scoped' => true,
                'action_link' => '/system/organization/settings?country=PH',
                'action_label' => 'Configure',
            ];
            $checklist[] = [
                'id' => 'payroll_schedule',
                'title' => 'Set Payroll Schedule (Semi-monthly)',
                'description' => '15th and end of month (Philippine standard)',
                'status' => 'pending',
                'country_scoped' => true,
                'action_link' => '/system/organization/payroll-schedules',
                'action_label' => 'Configure',
            ];
        }

        return $checklist;
    }

    /**
     * Get currency for country
     */
    private function getCurrency(string $country): string
    {
        return match($country) {
            'PH' => 'PHP',
            'US' => 'USD',
            'SG' => 'SGD',
            'MY' => 'MYR',
            default => 'USD',
        };
    }

    /**
     * Get timezone for country
     */
    private function getTimezone(string $country): string
    {
        return match($country) {
            'PH' => 'Asia/Manila (UTC+8)',
            'US' => 'America/New_York (UTC-5)',
            'SG' => 'Asia/Singapore (UTC+8)',
            'MY' => 'Asia/Kuala_Lumpur (UTC+8)',
            default => 'UTC',
        };
    }

    /**
     * Generate alerts and recommendations
     */
    private function generateAlerts(array $deptSummary, array $posSummary, array $checklist, string $country): array
    {
        $alerts = [];

        // Check for missing departments
        if ($deptSummary['total'] === 0) {
            $alerts[] = [
                'type' => 'warning',
                'title' => 'No Departments Found',
                'message' => 'Create default departments to organize your company structure.',
                'action' => 'Create Departments',
                'action_link' => '/system/organization/departments',
            ];
        }

        // Check for missing positions
        if ($posSummary['total'] === 0) {
            $alerts[] = [
                'type' => 'warning',
                'title' => 'No Positions Defined',
                'message' => 'Add job positions to manage roles and hierarchy.',
                'action' => 'Add Positions',
                'action_link' => '/system/organization/positions',
            ];
        }

        // Check for incomplete onboarding
        $pendingItems = array_filter($checklist, fn($item) => $item['status'] === 'pending');
        if (count($pendingItems) > 0) {
            $alerts[] = [
                'type' => 'info',
                'title' => 'Onboarding Incomplete',
                'message' => count($pendingItems) . ' configuration tasks remaining.',
                'action' => 'View Checklist',
                'action_link' => '#onboarding-checklist',
            ];
        }

        // Country-specific alerts
        if ($country === 'PH') {
            $alerts[] = [
                'type' => 'info',
                'title' => 'Philippine Setup Required',
                'message' => 'Configure SSS, PhilHealth, and Pag-IBIG for compliance.',
                'action' => 'Configure',
                'action_link' => '/system/organization/settings?country=PH',
            ];
        }

        return $alerts;
    }
}
