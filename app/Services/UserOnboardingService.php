<?php

namespace App\Services;

use App\Repositories\UserOnboardingRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

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

        return $this->repo->createOrUpdateByUser($userId, $payload);
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
}
