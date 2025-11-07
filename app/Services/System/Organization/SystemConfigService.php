<?php

namespace App\Services\System\Organization;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * SYSTEM CONFIGURATION STORAGE HANDLER
 *
 * Handles minimal system metadata required BEFORE business operation begins:
 *   - Company name
 *   - Email contact
 *   - Timezone
 *   - Currency
 *
 * NOTE:
 *   This is NOT HR policy storage.
 *   HR rules only appear during HR Manager onboarding phase.
 *
 * This service handles persistence only, not business rules.
 */
class SystemConfigService
{
    public function applyInitialSystemSettings(array $payload): void
    {
        if (!Schema::hasTable('settings')) {
            return;
        }

        $mapping = [
            'company.name'          => $payload['company_name'] ?? null,
            'company.contact_email' => $payload['contact_email'] ?? null,
            'company.timezone'      => $payload['timezone'] ?? null,
            'company.currency'      => $payload['currency'] ?? null,
        ];

        foreach ($mapping as $key => $value) {
            if ($value === null) continue;

            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }
    }
}
