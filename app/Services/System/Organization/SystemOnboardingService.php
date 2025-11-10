<?php

namespace App\Services\System\Organization;

use App\Repositories\Contracts\System\Organization\SystemOnboardingRepositoryInterface;
use App\Services\System\Organization\SystemConfigService;
use App\Services\System\Organization\SystemRoleDelegation;
use Illuminate\Support\Facades\DB;

/**
 * SYSTEM ONBOARDING WORKFLOW ORCHESTRATOR
 *
 * Drives end-to-end onboarding phases:
 *
 * PHASE 1: Super Admin → System identity + global access config
 * PHASE 2: Office Admin → Organization structure setup
 * PHASE 3: HR Manager → Workforce + payroll configuration
 * PHASE 4: Completion → System becomes operational
 *
 * Responsibilities:
 * - Create workflow entry
 * - Apply initial config
 * - Delegate role transitions
 * - Mark workflow complete
 */

class SystemOnboardingService
{
    protected SystemOnboardingRepositoryInterface $repo;
    protected SystemConfigService $config;
    protected SystemRoleDelegation $delegation;

    public function __construct(
        SystemOnboardingRepositoryInterface $repo,
        SystemConfigService $config,
        SystemRoleDelegation $delegation
    ) {
        $this->repo = $repo;
        $this->config = $config;
        $this->delegation = $delegation;
    }

    /**
     * Create a new onboarding workflow (Super Admin only).
     *
     * @return int Onboarding record ID
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

            // Apply initial foundation settings (identity, region, core modules)
            $this->config->applyInitialSystemSettings($payload);

            return $id;
        });
    }

    /**
     * Move onboarding forward by delegating workflow owner change.
     */
    public function transition(int $id, string $nextRole): void
    {
        $this->delegation->transitionToRole($id, $nextRole);
    }

    /**
     * Lock workflows and enable operational mode.
     */
    public function complete(int $id): void
    {
        $this->repo->update($id, [
            'status'        => 'completed',
            'completed_at'  => now(),
        ]);
    }
}
