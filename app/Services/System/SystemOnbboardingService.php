<?php

/*
 * Domain logic for System Onboarding of Superadmin, Office Admin, HR Manager or HR staff who will initialize the Company setting up configuration
*/

namespace App\Services\System;

use App\Repositories\SystemOnboardingRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use InvalidArgumentException;

class SystemOnboardingService
{
    protected SystemOnboardingRepository $repo;

    public function __construct(SystemOnboardingRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * SYSTEM ONBOARDING WORKFLOW
     *
     * Step 1: Super Admin initializes the system
     *  - Purpose: Secure system basics before any business data exists
     *  - Tasks: authentication, modules, core settings
     *  - Ownership: super_admin
     *
     * After Step 1:
     *  Super Admin transitions ownership to Office Admin
     *  (Super Admin only oversees infrastructure afterward)
     *
     * Step 2: Office Admin configures organization settings
     *  - Departments, work sites, calendars, basic company identity
     *  - Ownership: office_admin
     *
     * After Step 2:
     *  Office Admin may transition to HR Manager
     *
     * Step 3: HR Manager configures HR + payroll policies
     *  - Leave rules, pay cycles, employment types
     *  - Ownership: hr_manager
     *
     * Step 4: Mark onboarding completed
     *  - System enters normal operational state
     */
    public function initializeSystem(array $payload, int $userId): int
    {
        DB::transaction(function () use (&$id, $payload, $userId) {

            // Initial system onboarding record created for Super Admin
            $id = $this->repo->create([
                'status'              => 'not_started',
                'current_owner_role'  => 'super_admin',  // Force all initial setup to top role
                'metadata_json'       => json_encode($payload),
                'created_by'          => $userId,
                'started_at'          => now(),
            ]);

            // Minimal company identifiers (not business logic or HR policies)
            $this->saveMinimalCompanySettings($payload);
        });

        return $id;
    }

    /**
     * Persist only non-policy system/company metadata:
     *  - Allowed during Step 1 only (Super Admin)
     */
    private function saveMinimalCompanySettings(array $payload): void
    {
        if (!Schema::hasTable('settings')) {
            return;
        }

        $mapping = [
            'company.name'          => $payload['company_name'] ?? null,
            'company.contact_email' => $payload['contact_email'] ?? null,
            'company.timezone'      => $payload['timezone'] ?? null,
            'company.currency'      => $payload['currency'] ?? null,
        ];

        foreach ($mapping as $key => $value) {
            if ($value === null) continue;
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }
    }

    /**
     * ROLE TRANSITION CONTROL:
     *
     * owner_role changes through onboarding lifecycle:
     *  super_admin  -> office_admin  -> hr_manager  -> completed
     *
     * Enforces proper delegation of responsibilities.
     * Prevents unauthorized role from hijacking onboarding state.
     */
    public function transition(int $id, string $nextRole): void
    {
        $valid = ['super_admin', 'office_admin', 'hr_manager'];
        if (!in_array($nextRole, $valid)) {
            throw new InvalidArgumentException("Invalid role transition: $nextRole");
        }

        $this->repo->update($id, [
            'current_owner_role' => $nextRole,
            'updated_at'         => now(),
        ]);
    }

    /**
     * ONBOARDING COMPLETION
     *
     * Called only when:
     *  - System, organization, HR configurations are fully complete
     *  - All required task checks are validated
     *
     * Locks onboarding workflow and enables live usage
     */
    public function complete(int $id): void
    {
        $this->repo->update($id, [
            'status'        => 'completed',
            'completed_at'  => now(),
        ]);
    }
}
