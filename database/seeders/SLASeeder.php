<?php

namespace Database\Seeders;

use App\Models\ApplicationIncident;
use App\Models\ApplicationPatch;
use App\Models\ApplicationUptimeLog;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * SLA Seeder
 * 
 * Seeds sample data for SLA monitoring (incidents, uptime logs, patches).
 */
class SLASeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedUptimeLogs();
        $this->seedIncidents();
        $this->seedPatches();
    }

    /**
     * Seed uptime logs - simulate hourly health checks for the past 30 days.
     */
    private function seedUptimeLogs(): void
    {
        $this->command->info('Seeding uptime logs...');

        $startDate = now()->subDays(30);
        $currentDate = clone $startDate;

        // Create hourly health checks for the past 30 days
        while ($currentDate <= now()) {
            // 99.9% uptime means ~0.1% downtime
            // Randomly insert a few downtime events
            $isHealthy = rand(1, 1000) > 1; // 99.9% chance of being healthy

            ApplicationUptimeLog::create([
                'checked_at' => $currentDate,
                'is_healthy' => $isHealthy,
                'response_time_ms' => $isHealthy ? rand(50, 200) : rand(5000, 30000),
                'check_type' => 'automated',
                'failure_reason' => $isHealthy ? null : $this->getRandomFailureReason(),
                'metrics' => [
                    'cpu_usage' => rand(10, 80),
                    'memory_usage' => rand(30, 70),
                    'disk_usage' => rand(20, 60),
                ],
            ]);

            $currentDate->addHour();
        }

        $this->command->info('✓ Uptime logs seeded successfully.');
    }

    /**
     * Seed system incidents.
     */
    private function seedIncidents(): void
    {
        $this->command->info('Seeding incidents...');

        $superadmin = User::where('email', 'admin@example.com')->first();
        $userId = $superadmin?->id ?? 1;

        // Create a few resolved incidents
        ApplicationIncident::create([
            'title' => 'Database Connection Timeout',
            'description' => 'Users experienced slow response times due to database connection pooling issues.',
            'severity' => 'major',
            'status' => 'resolved',
            'reported_by' => $userId,
            'assigned_to' => $userId,
            'detected_at' => now()->subDays(20),
            'acknowledged_at' => now()->subDays(20)->addMinutes(15),
            'investigating_started_at' => now()->subDays(20)->addMinutes(30),
            'resolved_at' => now()->subDays(20)->addHours(4),
            'resolution_notes' => 'Increased connection pool size from 10 to 50 connections.',
        ]);

        ApplicationIncident::create([
            'title' => 'Email Service Outage',
            'description' => 'SMTP server was unreachable, preventing email notifications.',
            'severity' => 'minor',
            'status' => 'closed',
            'reported_by' => $userId,
            'assigned_to' => $userId,
            'detected_at' => now()->subDays(15),
            'acknowledged_at' => now()->subDays(15)->addMinutes(10),
            'investigating_started_at' => now()->subDays(15)->addMinutes(20),
            'resolved_at' => now()->subDays(15)->addHours(2),
            'closed_at' => now()->subDays(14),
            'resolution_notes' => 'Updated SMTP credentials and verified connectivity.',
        ]);

        // Create a few open Application Incidents
        ApplicationIncident::create([
            'title' => 'Slow Report Generation',
            'description' => 'Payroll reports are taking longer than expected to generate.',
            'severity' => 'minor',
            'status' => 'investigating',
            'reported_by' => $userId,
            'assigned_to' => $userId,
            'detected_at' => now()->subDays(2),
            'acknowledged_at' => now()->subDays(2)->addMinutes(30),
            'investigating_started_at' => now()->subDays(1),
        ]);

        ApplicationIncident::create([
            'title' => 'Cache Invalidation Issue',
            'description' => 'Some users seeing stale data after recent updates.',
            'severity' => 'minor',
            'status' => 'open',
            'reported_by' => $userId,
            'detected_at' => now()->subHours(6),
        ]);

        $this->command->info('✓ Incidents seeded successfully.');
    }

    /**
     * Seed system patches.
     */
    private function seedPatches(): void
    {
        $this->command->info('Seeding patches...');

        $superadmin = User::where('email', 'admin@example.com')->first();
        $userId = $superadmin?->id ?? 1;

        // Previously deployed patches
        ApplicationPatch::create([
            'version' => '1.0.0',
            'patch_number' => 'PATCH-2024-001',
            'type' => 'feature',
            'status' => 'deployed',
            'description' => 'Initial release with core HRIS functionality.',
            'release_notes' => 'First production release.',
            'scheduled_at' => now()->subMonths(6),
            'deployed_at' => now()->subMonths(6),
            'deployed_by' => $userId,
            'deployment_notes' => 'Deployed successfully without issues.',
            'affected_components' => ['core', 'auth', 'hr'],
        ]);

        ApplicationPatch::create([
            'version' => '1.1.0',
            'patch_number' => 'PATCH-2024-002',
            'type' => 'feature',
            'status' => 'deployed',
            'description' => 'Added employee onboarding module.',
            'release_notes' => 'New onboarding workflow with digital document signing.',
            'scheduled_at' => now()->subMonths(4),
            'deployed_at' => now()->subMonths(4)->addDays(1),
            'deployed_by' => $userId,
            'deployment_notes' => 'Minor UI adjustments needed post-deployment.',
            'affected_components' => ['onboarding', 'documents'],
        ]);

        ApplicationPatch::create([
            'version' => '1.2.0',
            'patch_number' => 'PATCH-2025-001',
            'type' => 'security',
            'status' => 'deployed',
            'description' => 'Security patches for authentication vulnerabilities.',
            'release_notes' => 'Updated Laravel framework and dependencies.',
            'scheduled_at' => now()->subMonths(1),
            'deployed_at' => now()->subMonths(1)->addHours(2),
            'deployed_by' => $userId,
            'deployment_notes' => 'All security scans passed.',
            'affected_components' => ['auth', 'api', 'core'],
        ]);

        // Upcoming scheduled patch
        ApplicationPatch::create([
            'version' => '1.3.0',
            'patch_number' => 'PATCH-2025-002',
            'type' => 'feature',
            'status' => 'scheduled',
            'description' => 'Performance improvements and new reporting features.',
            'release_notes' => 'Enhanced analytics dashboard with real-time metrics.',
            'scheduled_at' => now()->addDays(45),
            'affected_components' => ['analytics', 'reports', 'performance'],
        ]);

        $this->command->info('✓ Patches seeded successfully.');
    }

    /**
     * Get a random failure reason for downtime events.
     */
    private function getRandomFailureReason(): string
    {
        $reasons = [
            'Database connection timeout',
            'High CPU usage detected',
            'Memory limit exceeded',
            'Disk space critical',
            'Network latency spike',
            'Service restart required',
        ];

        return $reasons[array_rand($reasons)];
    }
}
