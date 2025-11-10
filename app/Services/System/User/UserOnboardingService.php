<?php

namespace App\Services\System\User;

use App\Repositories\Eloquent\System\User\UserOnboardingRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;
use App\Models\User;

class UserOnboardingService
{
    protected UserOnboardingRepository $repo;

    public function __construct(UserOnboardingRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Get the latest onboarding row for a user (or null)
     */
    public function getForUser(int $userId)
    {
        return $this->repo->findByUser($userId);
    }

    /**
     * Start or update onboarding for a user
     */
    public function start(int $userId, array $data = [])
    {
        $payload = array_merge([
            'status' => 'in_progress',
            'started_at' => now(),
        ], $data);

        // Normalize checklist_json if provided as array
        if (isset($payload['checklist_json']) && is_array($payload['checklist_json'])) {
            // ensure stored as JSON string in DB layer or repository expects raw array; repository stores as-is
            $payload['checklist_json'] = json_encode($payload['checklist_json']);
        }

        $result = $this->repo->createOrUpdateByUser($userId, $payload);

        // After persisting, compute percent complete from checklist and auto-complete if 100%
        try {
            $checklist = null;
            if (isset($payload['checklist_json'])) {
                $raw = $payload['checklist_json'];
                if (is_string($raw)) {
                    $decoded = json_decode($raw, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $checklist = $decoded;
                    }
                } elseif (is_array($raw)) {
                    $checklist = $raw;
                }
            } elseif (! empty($result->checklist_json)) {
                $raw = $result->checklist_json;
                if (is_string($raw)) {
                    $decoded = json_decode($raw, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $checklist = $decoded;
                    }
                } elseif (is_array($raw)) {
                    $checklist = $raw;
                }
            }

            if (is_array($checklist) && count($checklist) > 0) {
                // Expect checklist as array of items with boolean 'done' or 'checked' property
                $total = count($checklist);
                $completed = 0;
                foreach ($checklist as $it) {
                    if (is_array($it)) {
                        $done = $it['done'] ?? $it['completed'] ?? $it['checked'] ?? false;
                        if ($done) {
                            $completed++;
                        }
                    }
                }

                $percent = (int) round(($completed / $total) * 100);

                if ($percent >= 100) {
                    // mark complete if not already
                    if (isset($result->status) && $result->status !== 'completed') {
                        $this->repo->markComplete($userId);
                    }
                }
            }
        } catch (Throwable $e) {
            // best-effort: log but don't break
            Log::warning('Failed computing onboarding percent', ['exception' => $e]);
        }

        return $result;
    }

    /**
     * Mark a user's onboarding as completed
     */
    public function complete(int $userId)
    {
        return $this->repo->markComplete($userId);
    }

    /**
     * Mark a user's onboarding as skipped and record an audit row
     */
    public function skip(int $userId, ?int $actorId = null, ?string $reason = null)
    {
        $result = $this->repo->markSkipped($userId, $actorId);

        // record skip in onboarding_skips audit table; don't let audit failures break the skip
        try {
            DB::table('onboarding_skips')->insert([
                'user_id' => $actorId ?? $userId,
                'skipped_at' => now(),
                'reason' => $reason,
                'scope' => 'user',
                'user_onboarding_id' => $result->id ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (Throwable $e) {
            // Log and continue — audit is best-effort
            Log::warning('Failed to record onboarding skip audit', ['exception' => $e]);
        }

        return $result;
    }

    /**
     * Generate a default checklist for a user from their profile and account state.
     * Returns an array of items: ['key' => 'name', 'label' => 'Set full name', 'done' => bool]
     */
    public function generateChecklistForUser(User $user): array
    {
        $profile = null;
        try {
            $profile = $user->profile;
        } catch (Throwable $e) {
            $profile = null;
        }

        $items = [];

        // Full name (first + last)
        $hasName = false;
        if ($profile) {
            $first = trim((string) ($profile->first_name ?? ''));
            $last = trim((string) ($profile->last_name ?? ''));
            $hasName = ($first !== '' || $last !== '');
        }
        if (! $hasName) {
            // fallback to users.name
            $hasName = !empty($user->name);
        }
        $items[] = [
            'key' => 'name',
            'label' => 'Set full name',
            'done' => $hasName,
        ];

        // Email verification
        $items[] = [
            'key' => 'verify_email',
            'label' => 'Verify email',
            'done' => !empty($user->email_verified_at),
        ];

        // Contact number
        $hasPhone = $profile && !empty($profile->contact_number);
        $items[] = [
            'key' => 'phone',
            'label' => 'Add contact number',
            'done' => (bool) $hasPhone,
        ];

        // Address
        $hasAddress = $profile && !empty($profile->address);
        $items[] = [
            'key' => 'address',
            'label' => 'Add address',
            'done' => (bool) $hasAddress,
        ];

        // Emergency contact
        $hasEmergency = $profile && !empty($profile->emergency_contact);
        $items[] = [
            'key' => 'emergency_contact',
            'label' => 'Add emergency contact',
            'done' => (bool) $hasEmergency,
        ];

        return $items;
    }
}
