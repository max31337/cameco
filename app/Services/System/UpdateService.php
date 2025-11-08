<?php

namespace App\Services\System;

use App\Models\SystemSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UpdateService
{
    private const CACHE_KEY = 'system_updates';
    private const CACHE_TTL = 300; // 5 minutes

    /**
     * Check for available updates from remote repository
     */
    public function checkForUpdates(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            try {
                $currentVersion = $this->getCurrentVersion();
                $updateUrl = config('app.update_url', env('UPDATE_CHECK_URL'));

                if (!$updateUrl) {
                    return [
                        'available' => false,
                        'current_version' => $currentVersion,
                        'message' => 'Update check URL not configured',
                    ];
                }

                $response = Http::timeout(10)->get($updateUrl, [
                    'current_version' => $currentVersion,
                    'app_key' => config('app.key'),
                ]);

                if (!$response->successful()) {
                    Log::warning('Failed to check for updates', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);

                    return [
                        'available' => false,
                        'current_version' => $currentVersion,
                        'message' => 'Failed to contact update server',
                    ];
                }

                $data = $response->json();

                return [
                    'available' => $data['update_available'] ?? false,
                    'current_version' => $currentVersion,
                    'latest_version' => $data['latest_version'] ?? null,
                    'release_date' => $data['release_date'] ?? null,
                    'download_url' => $data['download_url'] ?? null,
                    'changelog' => $data['changelog'] ?? [],
                    'patch_notes' => $data['patch_notes'] ?? '',
                    'is_security_update' => $data['is_security_update'] ?? false,
                    'minimum_php_version' => $data['minimum_php_version'] ?? '8.1',
                    'file_size' => $data['file_size'] ?? null,
                    'checksum' => $data['checksum'] ?? null,
                ];
            } catch (\Exception $e) {
                Log::error('Error checking for updates', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                return [
                    'available' => false,
                    'current_version' => $this->getCurrentVersion(),
                    'message' => 'Error checking for updates: ' . $e->getMessage(),
                ];
            }
        });
    }

    /**
     * Get current application version
     */
    public function getCurrentVersion(): string
    {
        return config('app.version', '1.0.0');
    }

    /**
     * Download update package
     */
    public function downloadUpdate(string $downloadUrl, string $checksum): array
    {
        try {
            $filename = 'updates/' . basename(parse_url($downloadUrl, PHP_URL_PATH));

            // Download file
            $response = Http::timeout(300)->get($downloadUrl);

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'message' => 'Failed to download update',
                ];
            }

            // Store file
            Storage::disk('local')->put($filename, $response->body());
            $filepath = Storage::disk('local')->path($filename);

            // Verify checksum
            $downloadedChecksum = hash_file('sha256', $filepath);
            if ($downloadedChecksum !== $checksum) {
                Storage::disk('local')->delete($filename);
                return [
                    'success' => false,
                    'message' => 'Checksum verification failed',
                ];
            }

            return [
                'success' => true,
                'filepath' => $filepath,
                'filename' => $filename,
            ];
        } catch (\Exception $e) {
            Log::error('Error downloading update', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Error downloading update: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get update history
     */
    public function getUpdateHistory(int $limit = 10): array
    {
        try {
            $history = SystemSetting::where('key', 'LIKE', 'update_history_%')
                ->orderBy('updated_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(function ($setting) {
                    $value = is_string($setting->value) ? json_decode($setting->value, true) : $setting->value;
                    return [
                        'version' => $value['version'] ?? 'Unknown',
                        'date' => $setting->updated_at->format('Y-m-d H:i:s'),
                        'status' => $value['status'] ?? 'unknown',
                        'message' => $value['message'] ?? '',
                    ];
                })
                ->toArray();

            return $history;
        } catch (\Exception $e) {
            Log::error('Error fetching update history', [
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Record update attempt
     */
    public function recordUpdate(string $version, string $status, string $message = ''): void
    {
        try {
            SystemSetting::updateOrCreate(
                ['key' => 'update_history_' . time()],
                [
                    'value' => json_encode([
                        'version' => $version,
                        'status' => $status,
                        'message' => $message,
                        'timestamp' => now()->toDateTimeString(),
                    ]),
                    'category' => 'updates',
                ]
            );

            if ($status === 'completed') {
                SystemSetting::updateOrCreate(
                    ['key' => 'current_version'],
                    [
                        'value' => $version,
                        'category' => 'system',
                    ]
                );
            }

            // Clear cache
            Cache::forget(self::CACHE_KEY);
        } catch (\Exception $e) {
            Log::error('Error recording update', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Clear update cache
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
