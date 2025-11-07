<?php

namespace App\Repositories\Eloquent\System\Organization;

use App\Repositories\Contracts\System\Organization\SystemOnboardingRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SystemOnboardingRepository implements SystemOnboardingRepositoryInterface
{
    /**
     * The point of this implementation class:
     * Direct DB interaction for system onboarding flow.
     * Replace with different persistence strategy later without breaking controllers/services.
     */
    public function create(array $data)
    {
        return DB::table('system_onboarding')->insertGetId([
            ...$data,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function update(int $id, array $data)
    {
        return DB::table('system_onboarding')
            ->where('id', $id)
            ->update([
                ...$data,
                'updated_at' => now(),
            ]);
    }

    public function findLatest()
    {
        return DB::table('system_onboarding')
            ->orderByDesc('id')
            ->first();
    }
}
