<?php

namespace App\Services\System;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * Vendor Contract Service
 * 
 * Manages vendor support contract information from configuration.
 * Contract details are stored in config/vendor.php and can be updated
 * via environment variables when renewing support.
 */
class VendorContractService
{
    /**
     * Get contract details with caching
     * 
     * @return array
     */
    public function getContractDetails(): array
    {
        $cacheKey = 'vendor_contract_details';
        $cacheDuration = config('app.env') === 'local' ? 60 : 3600; // 1 min local, 1 hour production

        return Cache::remember($cacheKey, $cacheDuration, function () {
            return $this->buildContractData();
        });
    }

    /**
     * Build contract data from config
     * 
     * @return array
     */
    protected function buildContractData(): array
    {
        $contract = config('vendor.contract', []);
        $supportLevel = $contract['level'] ?? 'basic';
        $levelDetails = config("vendor.levels.{$supportLevel}", []);

        // Calculate days remaining
        $endDate = Carbon::parse($contract['end_date'] ?? now());
        $daysRemaining = now()->diffInDays($endDate, false);
        $status = $daysRemaining > 0 ? 'active' : 'expired';

        return [
            'contract' => [
                'contract_number' => $contract['number'] ?? 'N/A',
                'start_date' => $contract['start_date'] ?? null,
                'end_date' => $contract['end_date'] ?? null,
                'days_remaining' => max(0, (int) $daysRemaining),
                'status' => $status,
                'support_level' => $supportLevel,
                'support_level_name' => $levelDetails['name'] ?? ucfirst($supportLevel) . ' Support',
                'response_time' => $levelDetails['response_time'] ?? 'N/A',
                'availability' => $levelDetails['availability'] ?? 'N/A',
                'channels' => $levelDetails['channels'] ?? [],
                'contact_email' => $contract['contact_email'] ?? config('mail.from.address'),
                'contact_phone' => $contract['contact_phone'] ?? null,
            ],
            'source' => 'config',
        ];
    }

    /**
     * Clear cached contract data
     * 
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget('vendor_contract_details');
    }
    
}
