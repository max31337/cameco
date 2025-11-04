<?php

namespace App\Services\System;

use App\Repositories\SystemOnboardingRepository;
use Illuminate\Support\Facades\DB;

/**
 * SYSTEM ONBOARDING WORKFLOW ORCHESTRATOR
 *
 * This service drives the full onboarding domain flow:
 *
 * PHASE 1: Super Admin configures core system identity
 *   - Authentication + access control
 *   - Module licensing/enablement
 *   - Global identifiers (company name, timezone, currency)
 *   Role: super_admin → always the starting owner
 *
 * PHASE 2: Office Admin configures organization structure
 *   - Departments, sites, business units
 *   - Office-level settings (work hours, calendars)
 *   Role transitions enforced by SystemRoleDelegationService
 *
 * PHASE 3: HR Manager completes workforce setup
 *   - HR policies, employment settings
 *   - Payroll + leave configurations
 *
 * PHASE 4: Onboarding complete
 *   - System locked into operational mode
 *   - Live HRIS usage enabled
 *
 * This class:
 *   - Creates onboarding record
 *   - Delegates role transitions
 *   - Delegates configuration storage
 *   - Marks workflow complete
 */
class SystemOnboardingService
{
    protected SystemOnboardingRepository $repo;
    protected SystemConfigService $config;
    protected SystemRoleDelegationService $delegation;

    public function __construct(
        SystemOnboardingRepository $repo,
        SystemConfigService $config,
        SystemRoleDelegationService $delegation
    ) {
        $this->repo = $repo;
        $this->config = $config;
        $this->delegation = $delegation;
    }

    /**
     * Create onboarding entry and store minimal system settings.
     * Must be called by Super Admin only.
     */
    public function initializeSystem(array $payload, int $userId): int
    {
        return DB::transaction(function () use ($payload, $userId) {
            $id = $this->repo->create([
                'status'              => 'not_started',
                'current_owner_role'  => 'super_admin',
                'metadata_json'       => json_encode($payload),
                'created_by'          => $userId,
                'started_at'          => now(),
            ]);

            $this->config->applyInitialSystemSettings($payload);

            return $id;
        });
    }

    public function transition(int $id, string $nextRole): void
    {
        $this->delegation->transitionToRole($id, $nextRole);
    }

    public function complete(int $id): void
    {
        $this->repo->update($id, [
            'status'        => 'completed',
            'completed_at'  => now(),
        ]);
    }
}
