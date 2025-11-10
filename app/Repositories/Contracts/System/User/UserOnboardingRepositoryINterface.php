<?php

namespace App\Repositories\Contracts\System\User;

use App\Models\ScheduledJob;
use Illuminate\Database\Eloquent\Collection;

interface UserOnboardingRepositoryInterface
{
    /**
     * Create a new user onboarding record.
     *
     * @param array $data
     * @return int Inserted record ID
     */
    public function create(array $data): int;

    /**
     * Update an existing user onboarding record.
     *
     * @param int $id
     * @param array $data
     * @return int Number of affected rows
     */
    public function update(int $id, array $data): int;

    /**
     * Find the latest user onboarding record.
     *
     * @return object|null
     */
    public function findLatest(): ?object;

    /**
     * Find the role associated with a specific onboarding record.
     *
     * @param int $id
     * @return string|null
     */
    public function findRole(int $id): ?string;
}
