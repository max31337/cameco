<?php

namespace App\Http\Controllers\System\SystemAdministration;

use App\Http\Controllers\Controller;
use App\Services\System\SystemHealthService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorageController extends Controller
{
    public function __construct(
        protected SystemHealthService $healthService
    ) {}

    /**
     * Display detailed storage analytics page
     */
    public function index(Request $request): Response
    {
        $storageMetrics = $this->healthService->getStorageMetrics();
        
        // Get storage breakdown by directory
        $directories = $this->getDirectoryBreakdown();
        
        // Get storage trends (last 30 days)
        $trends = $this->getStorageTrends();
        
        $data = [
            'storage' => $storageMetrics,
            'directories' => $directories,
            'trends' => $trends,
        ];

        return Inertia::render('System/Storage', $data);
    }

    /**
     * Get storage breakdown by major directories
     */
    protected function getDirectoryBreakdown(): array
    {
        $basePath = base_path();
        
        $directories = [
            [
                'name' => 'Database',
                'path' => 'database',
                'size_bytes' => $this->getDirectorySize($basePath . '/database'),
                'description' => 'Database files and migrations',
            ],
            [
                'name' => 'Storage',
                'path' => 'storage',
                'size_bytes' => $this->getDirectorySize($basePath . '/storage'),
                'description' => 'Uploaded files, logs, and cache',
            ],
            [
                'name' => 'Vendor',
                'path' => 'vendor',
                'size_bytes' => $this->getDirectorySize($basePath . '/vendor'),
                'description' => 'Composer dependencies',
            ],
            [
                'name' => 'Public',
                'path' => 'public',
                'size_bytes' => $this->getDirectorySize($basePath . '/public'),
                'description' => 'Public assets and uploads',
            ],
            [
                'name' => 'Node Modules',
                'path' => 'node_modules',
                'size_bytes' => $this->getDirectorySize($basePath . '/node_modules'),
                'description' => 'NPM dependencies',
            ],
        ];

        // Add formatted sizes
        foreach ($directories as &$dir) {
            $dir['size_formatted'] = $this->formatBytes($dir['size_bytes']);
        }

        // Sort by size descending
        usort($directories, fn($a, $b) => $b['size_bytes'] <=> $a['size_bytes']);

        return $directories;
    }

    /**
     * Get storage trends (mock data for now - can be replaced with actual historical data)
     */
    protected function getStorageTrends(): array
    {
        $trends = [];
        $basePath = base_path();
        $currentUsed = disk_total_space($basePath) - disk_free_space($basePath);
        
        // Generate last 30 days of mock trend data
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i);
            // Simulate gradual growth
            $variance = ($i * 0.02); // 2% growth per day backwards
            $usedBytes = $currentUsed * (1 - $variance);
            
            $trends[] = [
                'date' => $date->format('Y-m-d'),
                'used_bytes' => (int) $usedBytes,
                'used_formatted' => $this->formatBytes($usedBytes),
            ];
        }

        return $trends;
    }

    /**
     * Get directory size recursively
     */
    protected function getDirectorySize(string $path): int
    {
        if (!is_dir($path)) {
            return 0;
        }

        $size = 0;
        
        try {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::SELF_FIRST
            );

            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $size += $file->getSize();
                }
            }
        } catch (\Exception $e) {
            // Directory not accessible or doesn't exist
            return 0;
        }

        return $size;
    }

    /**
     * Format bytes to human readable format
     */
    protected function formatBytes(int $bytes): string
    {
        if ($bytes === 0) return '0 B';
        
        $k = 1024;
        $sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = floor(log($bytes) / log($k));
        
        return round($bytes / pow($k, $i), 2) . ' ' . $sizes[$i];
    }

    /**
     * Clean cache and temporary files
     */
    public function cleanup(Request $request): \Illuminate\Http\RedirectResponse
    {
        // Clear application cache
        \Artisan::call('cache:clear');
        \Artisan::call('view:clear');
        \Artisan::call('route:clear');
        \Artisan::call('config:clear');

        // Clear logs older than 30 days
        $logPath = storage_path('logs');
        $files = glob($logPath . '/*.log');
        $thirtyDaysAgo = now()->subDays(30)->timestamp;
        
        $deletedCount = 0;
        foreach ($files as $file) {
            if (filemtime($file) < $thirtyDaysAgo) {
                unlink($file);
                $deletedCount++;
            }
        }

        return redirect()->back()->with('success', "Cache cleared successfully. Deleted {$deletedCount} old log files.");
    }
}
