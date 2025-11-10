<?php

namespace App\Repositories\Eloquent\System\User;

use Illuminate\Support\Facades\DB;

class UserOnboardingRepository
{
    public function findByUser(int $userId)
    {
        return DB::table('user_onboardings')->where('user_id', $userId)->orderByDesc('id')->first();
    }

    public function createOrUpdateByUser(int $userId, array $data)
    {
        $existing = $this->findByUser($userId);

        $payload = array_merge($data, ['updated_at' => now()]);

        if ($existing) {
            DB::table('user_onboardings')->where('id', $existing->id)->update($payload);
            return DB::table('user_onboardings')->where('id', $existing->id)->first();
        }

        $id = DB::table('user_onboardings')->insertGetId(array_merge($payload, [
            'user_id' => $userId,
            'created_at' => now(),
        ]));

        return DB::table('user_onboardings')->where('id', $id)->first();
    }

    public function markComplete(int $userId)
    {
        $existing = $this->findByUser($userId);
        $now = now();

        if ($existing) {
            DB::table('user_onboardings')->where('id', $existing->id)->update([
                'status' => 'completed',
                'completed_at' => $now,
                'updated_at' => $now,
            ]);
            return DB::table('user_onboardings')->where('id', $existing->id)->first();
        }

        $id = DB::table('user_onboardings')->insertGetId([
            'user_id' => $userId,
            'status' => 'completed',
            'completed_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return DB::table('user_onboardings')->where('id', $id)->first();
    }

    public function markSkipped(int $userId, ?int $skippedBy = null)
    {
        $existing = $this->findByUser($userId);
        $now = now();

        if ($existing) {
            DB::table('user_onboardings')->where('id', $existing->id)->update([
                'status' => 'skipped',
                'skipped_at' => $now,
                'skipped_by' => $skippedBy,
                'updated_at' => $now,
            ]);
            return DB::table('user_onboardings')->where('id', $existing->id)->first();
        }

        $id = DB::table('user_onboardings')->insertGetId([
            'user_id' => $userId,
            'status' => 'skipped',
            'skipped_at' => $now,
            'skipped_by' => $skippedBy,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return DB::table('user_onboardings')->where('id', $id)->first();
    }
}
