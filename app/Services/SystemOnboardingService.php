<?php
// Legacy SystemOnBoardingService see app/Services/System for refactored workflow

namespace App\Services;

use App\Repositories\SystemOnboardingRepository;
use Illuminate\Support\Facades\DB;

class SystemOnboardingService
{
    protected SystemOnboardingRepository $repo;

    public function __construct(SystemOnboardingRepository $repo)
    {
        $this->repo = $repo;
    }

    public function start(array $payload, int $userId)
    {
        $data = [
            'status' => 'in_progress',
            'started_at' => now(),
            'checklist_json' => json_encode($payload['checklist'] ?? []),
        ];

        $id = $this->repo->create(array_merge($data, ['skipped_by' => null]));

        // Seed minimal system defaults if provided
        if (!empty($payload['company_name'])) {
            // If a generic settings table exists, persist minimal company metadata
            if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                DB::table('settings')->updateOrInsert(['key' => 'company.name'], ['value' => $payload['company_name'], 'updated_at' => now()]);
                DB::table('settings')->updateOrInsert(['key' => 'company.contact_email'], ['value' => $payload['contact_email'] ?? '', 'updated_at' => now()]);
                DB::table('settings')->updateOrInsert(['key' => 'company.timezone'], ['value' => $payload['timezone'] ?? '', 'updated_at' => now()]);
                DB::table('settings')->updateOrInsert(['key' => 'company.currency'], ['value' => $payload['currency'] ?? '', 'updated_at' => now()]);
            }
        }

        return $id;
    }

    public function complete(int $id)
    {
        return $this->repo->update($id, [
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function skip(int $userId, ?string $reason = null)
    {
        $id = $this->repo->create([
            'status' => 'skipped',
            'skipped_at' => now(),
            'skipped_by' => $userId,
            'checklist_json' => json_encode([]),
        ]);

        DB::table('onboarding_skips')->insert([
            'user_id' => $userId,
            'skipped_at' => now(),
            'reason' => $reason,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $id;
    }
}
