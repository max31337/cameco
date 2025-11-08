<?php

namespace App\Repositories\Eloquent\HR;

use App\Models\Profile;
use App\Repositories\Contracts\HR\ProfileRepositoryInterface;

class ProfileRepository implements ProfileRepositoryInterface
{
    /**
     * Get all profiles with pagination.
     */
    public function all(int $perPage = 15)
    {
        return Profile::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Find a profile by ID.
     */
    public function find(int $id)
    {
        return Profile::with('user')->find($id);
    }

    /**
     * Find a profile by user ID.
     */
    public function findByUserId(int $userId)
    {
        return Profile::with('user')
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Create a new profile.
     */
    public function create(array $data)
    {
        return Profile::create($data);
    }

    /**
     * Update an existing profile.
     */
    public function update(int $id, array $data)
    {
        $profile = Profile::findOrFail($id);
        $profile->update($data);
        return $profile->fresh('user');
    }

    /**
     * Delete a profile.
     */
    public function delete(int $id)
    {
        $profile = Profile::findOrFail($id);
        return $profile->delete();
    }

    /**
     * Search profiles by name or contact.
     */
    public function search(string $query, int $perPage = 15)
    {
        return Profile::with('user')
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                  ->orWhere('last_name', 'like', "%{$query}%")
                  ->orWhere('middle_name', 'like', "%{$query}%")
                  ->orWhere('contact_number', 'like', "%{$query}%");
            })
            ->paginate($perPage);
    }
}
