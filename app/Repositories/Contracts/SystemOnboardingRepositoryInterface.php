<?php

namespace App\Repositories\Contracts;

interface SystemOnboardingRepositoryInterface
{
    /**
     * Store a new onboarding workflow entry.
     */
    public function create(array $data);

    /**
     * Update onboarding workflow entry by ID.
     */
    public function update(int $id, array $data);

    /**
     * Retrieve latest onboarding workflow entry.
     */
    public function findLatest();
}
