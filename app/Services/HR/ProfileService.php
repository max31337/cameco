<?php

namespace App\Services\HR;

use App\Repositories\Contracts\HR\ProfileRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class ProfileService
{
    protected ProfileRepositoryInterface $profileRepository;

    public function __construct(ProfileRepositoryInterface $profileRepository)
    {
        $this->profileRepository = $profileRepository;
    }

    /**
     * Create a new profile.
     */
    public function createProfile(array $data): array
    {
        DB::beginTransaction();

        try {
            // Validate profile data
            $this->validateProfileData($data);

            // Create profile
            $profile = $this->profileRepository->create($data);

            DB::commit();

            Log::info('Profile created successfully', [
                'profile_id' => $profile->id,
                'user_id' => $profile->user_id ?? null,
            ]);

            return [
                'success' => true,
                'profile' => $profile,
                'message' => 'Profile created successfully'
            ];
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Profile creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Profile creation failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Update an existing profile.
     */
    public function updateProfile(int $profileId, array $data): array
    {
        DB::beginTransaction();

        try {
            // Validate profile data
            $this->validateProfileData($data, $profileId);

            // Update profile
            $profile = $this->profileRepository->update($profileId, $data);

            DB::commit();

            Log::info('Profile updated successfully', [
                'profile_id' => $profileId,
            ]);

            return [
                'success' => true,
                'profile' => $profile,
                'message' => 'Profile updated successfully'
            ];
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Profile update failed', [
                'profile_id' => $profileId,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Profile update failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Delete a profile.
     */
    public function deleteProfile(int $profileId): array
    {
        DB::beginTransaction();

        try {
            $profile = $this->profileRepository->find($profileId);

            if (!$profile) {
                return [
                    'success' => false,
                    'message' => 'Profile not found'
                ];
            }

            $this->profileRepository->delete($profileId);

            DB::commit();

            Log::info('Profile deleted successfully', [
                'profile_id' => $profileId,
            ]);

            return [
                'success' => true,
                'message' => 'Profile deleted successfully'
            ];
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Profile deletion failed', [
                'profile_id' => $profileId,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Profile deletion failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get profile by user ID.
     */
    public function getProfileByUserId(int $userId): ?object
    {
        return $this->profileRepository->findByUserId($userId);
    }

    /**
     * Search profiles.
     */
    public function searchProfiles(string $query, int $perPage = 15)
    {
        return $this->profileRepository->search($query, $perPage);
    }

    /**
     * Validate profile data.
     */
    protected function validateProfileData(array $data, ?int $profileId = null): void
    {
        // Required fields for creation
        if ($profileId === null) {
            $requiredFields = ['first_name', 'last_name', 'date_of_birth'];

            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    throw new Exception("Field '{$field}' is required");
                }
            }
        }

        // Validate date of birth if provided
        if (isset($data['date_of_birth'])) {
            $dob = strtotime($data['date_of_birth']);
            if (!$dob) {
                throw new Exception('Invalid date of birth format');
            }

            // Must be at least 18 years old
            $age = (int)((time() - $dob) / (365.25 * 24 * 60 * 60));
            if ($age < 18) {
                throw new Exception('Employee must be at least 18 years old');
            }

            // Cannot be more than 100 years old
            if ($age > 100) {
                throw new Exception('Invalid date of birth');
            }
        }

        // Validate contact number format if provided
        if (isset($data['contact_number']) && !empty($data['contact_number'])) {
            if (!preg_match('/^[0-9+\-\s()]+$/', $data['contact_number'])) {
                throw new Exception('Invalid contact number format');
            }
        }

        // Validate emergency contact number format if provided
        if (isset($data['emergency_contact_number']) && !empty($data['emergency_contact_number'])) {
            if (!preg_match('/^[0-9+\-\s()]+$/', $data['emergency_contact_number'])) {
                throw new Exception('Invalid emergency contact number format');
            }
        }
    }
}
