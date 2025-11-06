<?php

namespace App\Services\System;

use App\Repositories\SystemOnboardingRepository;
use App\Services\System\Exceptions\InvalidRoleTransitionException;

/**
 * ROLE DELEGATION ENFORCER
 *
 * Controls onboarding hand-off between user roles.
 *
 * Allowed transitions:
 *   super_admin   → office_admin
 *   office_admin  → hr_manager
 *   hr_manager    → completed (workflow closure)
 *
 * Anything else is illegal and dangerous to business integrity.
 * This enforces correct business rule ordering.
 */
class SystemRoleDelegation
{
    protected SystemOnboardingRepository $repo;

    protected array $allowedTransitions = [
        'super_admin'   => 'office_admin',
        'office_admin'  => 'hr_manager',
        'hr_manager'    => 'completed',
    ];

    public function __construct(SystemOnboardingRepository $repo)
    {
        $this->repo = $repo;
    }

    public function transitionToRole(int $id, string $nextRole): void
    {
        $current = $this->repo->findRole($id);

        if (!isset($this->allowedTransitions[$current]) ||
            $this->allowedTransitions[$current] !== $nextRole) {
            throw new InvalidRoleTransitionException($current, $nextRole);
        }

        $this->repo->update($id, [
            'current_owner_role' => $nextRole,
            'updated_at'         => now(),
        ]);
    }
}
