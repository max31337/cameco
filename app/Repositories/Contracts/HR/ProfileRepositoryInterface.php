<?php

namespace App\Repositories\Contracts\HR;

interface ProfileRepositoryInterface
{
    /**
     * Get all profiles with pagination.
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function all(int $perPage = 15);

    /**
     * Find a profile by ID.
     *
     * @param int $id
     * @return \App\Models\Profile|null
     */
    public function find(int $id);

    /**
     * Find a profile by user ID.
     *
     * @param int $userId
     * @return \App\Models\Profile|null
     */
    public function findByUserId(int $userId);

    /**
     * Create a new profile.
     *
     * @param array $data
     * @return \App\Models\Profile
     */
    public function create(array $data);

    /**
     * Update an existing profile.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Profile
     */
    public function update(int $id, array $data);

    /**
     * Delete a profile.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id);

    /**
     * Search profiles by name or contact.
     *
     * @param string $query
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function search(string $query, int $perPage = 15);
}
