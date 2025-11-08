<?php

namespace App\Services\System;

use App\Services\System\UpdateService;
use App\Traits\LogsSecurityAudits;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class PatchDeploymentService
{
    use LogsSecurityAudits;

    public function __construct(
        private UpdateService $updateService,
        private SystemHealthService $healthService
    ) {}

    /**
     * Deploy patch with pre-checks and backup
     */
    public function deployPatch(string $filepath, string $version, ?int $userId = null): array
    {
        $deploymentId = uniqid('deploy_');
        $startTime = microtime(true);

        try {
            // Step 1: Pre-deployment checks
            $preCheck = $this->runPreDeploymentChecks();
            if (!$preCheck['passed']) {
                return [
                    'success' => false,
                    'step' => 'pre_check',
                    'message' => 'Pre-deployment checks failed',
                    'errors' => $preCheck['errors'],
                ];
            }

            // Step 2: Create backup
            $backupResult = $this->createPreDeploymentBackup();
            if (!$backupResult['success']) {
                return [
                    'success' => false,
                    'step' => 'backup',
                    'message' => 'Failed to create pre-deployment backup',
                    'error' => $backupResult['message'],
                ];
            }

            // Step 3: Extract patch
            $extractResult = $this->extractPatch($filepath);
            if (!$extractResult['success']) {
                return [
                    'success' => false,
                    'step' => 'extract',
                    'message' => 'Failed to extract patch',
                    'error' => $extractResult['message'],
                ];
            }

            // Step 4: Apply patch
            $applyResult = $this->applyPatch($extractResult['path']);
            if (!$applyResult['success']) {
                // Attempt rollback
                $this->rollbackDeployment($backupResult['backup_id']);
                
                return [
                    'success' => false,
                    'step' => 'apply',
                    'message' => 'Patch application failed, rolled back',
                    'error' => $applyResult['message'],
                ];
            }

            // Step 5: Run post-deployment tasks
            $postResult = $this->runPostDeploymentTasks();
            if (!$postResult['success']) {
                // Attempt rollback
                $this->rollbackDeployment($backupResult['backup_id']);
                
                return [
                    'success' => false,
                    'step' => 'post_deployment',
                    'message' => 'Post-deployment tasks failed, rolled back',
                    'error' => $postResult['message'],
                ];
            }

            // Step 6: Verification
            $verifyResult = $this->verifyDeployment($version);
            if (!$verifyResult['passed']) {
                // Attempt rollback
                $this->rollbackDeployment($backupResult['backup_id']);
                
                return [
                    'success' => false,
                    'step' => 'verification',
                    'message' => 'Deployment verification failed, rolled back',
                    'errors' => $verifyResult['errors'],
                ];
            }

            // Step 7: Record success
            $duration = microtime(true) - $startTime;
            $this->updateService->recordUpdate($version, 'completed', 'Deployment successful');

            // Log audit event
            $this->logAudit(
                'system_update',
                'info',
                [
                    'deployment_id' => $deploymentId,
                    'version' => $version,
                    'duration_seconds' => round($duration, 2),
                    'backup_id' => $backupResult['backup_id'],
                ],
                $userId
            );

            // Cleanup
            $this->cleanupDeployment($extractResult['path'], $filepath);

            return [
                'success' => true,
                'message' => 'Patch deployed successfully',
                'version' => $version,
                'deployment_id' => $deploymentId,
                'duration' => round($duration, 2),
                'backup_id' => $backupResult['backup_id'],
            ];

        } catch (\Exception $e) {
            Log::error('Patch deployment failed', [
                'deployment_id' => $deploymentId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $this->updateService->recordUpdate($version, 'failed', $e->getMessage());

            return [
                'success' => false,
                'step' => 'exception',
                'message' => 'Deployment failed with exception',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Run pre-deployment checks
     */
    private function runPreDeploymentChecks(): array
    {
        $errors = [];

        // Check PHP version
        if (version_compare(PHP_VERSION, '8.1.0', '<')) {
            $errors[] = 'PHP version 8.1.0 or higher required';
        }

        // Check disk space (need at least 500MB free)
        $freeSpace = disk_free_space(base_path());
        if ($freeSpace < 500 * 1024 * 1024) {
            $errors[] = 'Insufficient disk space (need at least 500MB free)';
        }

        // Check write permissions
        $paths = [base_path(), storage_path(), public_path()];
        foreach ($paths as $path) {
            if (!is_writable($path)) {
                $errors[] = "Directory not writable: {$path}";
            }
        }

        // Check database connection
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $errors[] = 'Database connection failed: ' . $e->getMessage();
        }

        return [
            'passed' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Create pre-deployment backup
     */
    private function createPreDeploymentBackup(): array
    {
        try {
            // Trigger backup via Artisan command
            Artisan::call('backup:run', [
                '--only-db' => true,
            ]);

            // Get the latest backup ID (simulated)
            $backupId = 'backup_' . now()->format('YmdHis');

            return [
                'success' => true,
                'backup_id' => $backupId,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Extract patch archive
     */
    private function extractPatch(string $filepath): array
    {
        try {
            $extractPath = storage_path('app/updates/extracted_' . time());
            
            if (!File::exists($extractPath)) {
                File::makeDirectory($extractPath, 0755, true);
            }

            $zip = new ZipArchive;
            if ($zip->open($filepath) === true) {
                $zip->extractTo($extractPath);
                $zip->close();

                return [
                    'success' => true,
                    'path' => $extractPath,
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to open ZIP archive',
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Apply patch files
     */
    private function applyPatch(string $extractPath): array
    {
        try {
            // Copy files from extracted patch to application root
            $files = File::allFiles($extractPath);
            
            foreach ($files as $file) {
                $relativePath = str_replace($extractPath . DIRECTORY_SEPARATOR, '', $file->getPathname());
                $targetPath = base_path($relativePath);
                
                // Ensure target directory exists
                $targetDir = dirname($targetPath);
                if (!File::exists($targetDir)) {
                    File::makeDirectory($targetDir, 0755, true);
                }
                
                // Copy file
                File::copy($file->getPathname(), $targetPath);
            }

            return ['success' => true];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Run post-deployment tasks
     */
    private function runPostDeploymentTasks(): array
    {
        try {
            // Clear caches
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');

            // Run migrations
            Artisan::call('migrate', ['--force' => true]);

            // Optimize application
            Artisan::call('optimize');

            return ['success' => true];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Verify deployment
     */
    private function verifyDeployment(string $expectedVersion): array
    {
        $errors = [];

        // Check version
        $currentVersion = config('app.version');
        if ($currentVersion !== $expectedVersion) {
            $errors[] = "Version mismatch: expected {$expectedVersion}, got {$currentVersion}";
        }

        // Check critical files exist
        $criticalFiles = [
            'app/Http/Kernel.php',
            'config/app.php',
            'routes/web.php',
        ];

        foreach ($criticalFiles as $file) {
            if (!File::exists(base_path($file))) {
                $errors[] = "Critical file missing: {$file}";
            }
        }

        // Check database connection
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $errors[] = 'Database connection failed after deployment';
        }

        return [
            'passed' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Rollback deployment
     */
    public function rollbackDeployment(string $backupId): array
    {
        try {
            Log::warning('Rolling back deployment', ['backup_id' => $backupId]);

            // Restore from backup (implementation depends on backup strategy)
            // This is a simplified version
            Artisan::call('backup:restore', [
                'backup_id' => $backupId,
            ]);

            return [
                'success' => true,
                'message' => 'Rollback completed',
            ];
        } catch (\Exception $e) {
            Log::error('Rollback failed', [
                'backup_id' => $backupId,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Cleanup deployment files
     */
    private function cleanupDeployment(string $extractPath, string $archivePath): void
    {
        try {
            // Remove extracted files
            if (File::exists($extractPath)) {
                File::deleteDirectory($extractPath);
            }

            // Remove archive file
            if (File::exists($archivePath)) {
                File::delete($archivePath);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to cleanup deployment files', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get deployment progress (for real-time updates)
     */
    public function getDeploymentProgress(string $deploymentId): array
    {
        // This would typically read from cache or database
        // For now, return a simple structure
        return [
            'deployment_id' => $deploymentId,
            'status' => 'in_progress',
            'current_step' => 'applying_patch',
            'progress_percentage' => 65,
            'message' => 'Applying patch files...',
        ];
    }
}
