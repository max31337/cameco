<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class SystemOnboardingRepository
{
    public function create(array $data)
    {
        return DB::table('system_onboarding')->insertGetId(array_merge($data, [
            'created_at' => now(),
            'updated_at' => now(),
        ]));
    }

    public function update(int $id, array $data)
    {
        return DB::table('system_onboarding')->where('id', $id)->update(array_merge($data, [
            'updated_at' => now(),
        ]));
    }

    public function findLatest()
    {
        return DB::table('system_onboarding')->orderByDesc('id')->first();
    }
}