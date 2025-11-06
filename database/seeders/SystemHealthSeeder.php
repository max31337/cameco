<?php

namespace Database\Seeders;

use App\Models\SecurityAuditLog;
use App\Models\SystemBackupLog;
use App\Models\SystemHealthLog;
use App\Models\SystemPatchApproval;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemHealthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = User::where('email', 'superadmin@cameco.com')->first();

        // Create system health logs (last 7 days)
        for ($i = 6; $i >= 0; $i--) {
            $cpuUsage = rand(30, 85) + (rand(0, 100) / 100);
            $memoryUsage = rand(40, 80) + (rand(0, 100) / 100);
            $diskUsage = rand(45, 75) + (rand(0, 100) / 100);

            $status = 'healthy';
            if ($cpuUsage > 85 || $memoryUsage > 90 || $diskUsage > 90) {
                $status = 'critical';
            } elseif ($cpuUsage > 70 || $memoryUsage > 75 || $diskUsage > 80) {
                $status = 'warning';
            }

            SystemHealthLog::create([
                'cpu_usage' => $cpuUsage,
                'memory_usage' => $memoryUsage,
                'disk_usage' => $diskUsage,
                'load_average' => sprintf('%.2f, %.2f, %.2f', rand(0, 400) / 100, rand(0, 400) / 100, rand(0, 400) / 100),
                'uptime_seconds' => rand(86400, 2592000), // 1-30 days
                'database_response_ms' => rand(10, 80),
                'cache_status' => 'online',
                'queue_pending' => rand(0, 50),
                'queue_failed' => rand(0, 5),
                'overall_status' => $status,
                'created_at' => now()->subDays($i),
                'updated_at' => now()->subDays($i),
            ]);
        }

        // Create backup logs (last 30 days)
        for ($i = 29; $i >= 0; $i--) {
            $type = ['full', 'incremental', 'database', 'files'][array_rand(['full', 'incremental', 'database', 'files'])];
            $status = (rand(1, 100) > 95) ? 'failed' : 'completed'; // 95% success rate
            
            $startedAt = now()->subDays($i)->setHour(2)->setMinute(0);
            $completedAt = $status === 'completed' ? $startedAt->copy()->addMinutes(rand(15, 60)) : null;

            SystemBackupLog::create([
                'backup_type' => $type,
                'status' => $status,
                'location' => '/backups/' . $type . '_' . $startedAt->format('Ymd_His') . '.tar.gz',
                'size_bytes' => $status === 'completed' ? rand(100000000, 5000000000) : null, // 100MB-5GB
                'started_at' => $startedAt,
                'completed_at' => $completedAt,
                'error_message' => $status === 'failed' ? 'Disk space limit exceeded' : null,
                'metadata' => [
                    'backup_engine' => 'Laravel Backup',
                    'compression' => 'gzip',
                ],
                'created_at' => $startedAt,
                'updated_at' => $completedAt ?? $startedAt,
            ]);
        }

        // Create patch approvals (mix of pending and deployed)
        $patches = [
            ['name' => 'Security Patch Q4 2025', 'type' => 'security', 'from' => '1.2.0', 'to' => '1.2.1', 'status' => 'pending'],
            ['name' => 'Performance Optimization', 'type' => 'performance', 'from' => '1.1.5', 'to' => '1.2.0', 'status' => 'deployed'],
            ['name' => 'Bug Fix Release', 'type' => 'bugfix', 'from' => '1.1.4', 'to' => '1.1.5', 'status' => 'deployed'],
            ['name' => 'New Feature Rollout', 'type' => 'feature', 'from' => '1.1.0', 'to' => '1.1.4', 'status' => 'approved'],
            ['name' => 'Critical Security Update', 'type' => 'security', 'from' => '1.0.9', 'to' => '1.1.0', 'status' => 'deployed'],
        ];

        foreach ($patches as $index => $patch) {
            $requestedAt = now()->subDays(10 - $index * 2);
            $approvedAt = in_array($patch['status'], ['approved', 'deployed']) ? $requestedAt->copy()->addHours(rand(4, 48)) : null;
            $deployedAt = $patch['status'] === 'deployed' ? $approvedAt?->copy()->addDays(rand(1, 3)) : null;

            SystemPatchApproval::create([
                'patch_name' => $patch['name'],
                'patch_type' => $patch['type'],
                'version_from' => $patch['from'],
                'version_to' => $patch['to'],
                'status' => $patch['status'],
                'description' => $patch['type'] === 'security' 
                    ? 'Critical security vulnerability fix for authentication module' 
                    : 'System improvement and enhancements',
                'requested_by' => $superadmin?->id,
                'approved_by' => $approvedAt ? $superadmin?->id : null,
                'requested_at' => $requestedAt,
                'approved_at' => $approvedAt,
                'deployed_at' => $deployedAt,
                'deployment_notes' => $deployedAt ? 'Successfully deployed to production' : null,
                'created_at' => $requestedAt,
                'updated_at' => $deployedAt ?? $approvedAt ?? $requestedAt,
            ]);
        }

        // Create security audit logs (last 24 hours)
        $events = [
            ['type' => 'login', 'severity' => 'info', 'desc' => 'Successful login'],
            ['type' => 'logout', 'severity' => 'info', 'desc' => 'User logged out'],
            ['type' => 'failed_login', 'severity' => 'warning', 'desc' => 'Failed login attempt - incorrect password'],
            ['type' => 'failed_login', 'severity' => 'warning', 'desc' => 'Failed login attempt - incorrect password'],
            ['type' => 'role_change', 'severity' => 'critical', 'desc' => 'User role changed from User to Admin'],
            ['type' => 'permission_change', 'severity' => 'warning', 'desc' => 'Permission granted: system.health.view'],
            ['type' => 'data_access', 'severity' => 'info', 'desc' => 'Accessed user management page'],
            ['type' => 'login', 'severity' => 'info', 'desc' => 'Successful login'],
        ];

        foreach ($events as $index => $event) {
            SecurityAuditLog::create([
                'event_type' => $event['type'],
                'severity' => $event['severity'],
                'user_id' => $superadmin?->id,
                'ip_address' => '127.0.0.' . rand(1, 255),
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'description' => $event['desc'],
                'metadata' => [
                    'session_id' => uniqid('sess_'),
                ],
                'created_at' => now()->subHours(24 - $index * 3),
                'updated_at' => now()->subHours(24 - $index * 3),
            ]);
        }

        $this->command->info('System health sample data seeded successfully!');
    }
}
