<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'superadmin@cameco.com'],
            [
                'name' => 'Test User',
                'username' => 'superadmin',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        
        // Seed roles and permissions (Spatie) and assign Superadmin role to the seeded user
        if (class_exists(\Database\Seeders\RolesAndPermissionsSeeder::class)) {
            $this->call(\Database\Seeders\RolesAndPermissionsSeeder::class);

            $user = User::where('email', 'superadmin@cameco.com')->first();
            if ($user && method_exists($user, 'assignRole')) {
                try {
                    $user->assignRole('Superadmin');
                } catch (\Throwable $e) {
                    // ignore assignment errors during seeding
                }
            }
        }

        
        User::firstOrCreate(
            ['email' => 'hrmanager@cameco.com'],
            [
                'name' => 'Test User',
                'username' => 'hrmanager',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        
        // Seed roles and permissions (Spatie) and assign Superadmin role to the seeded user
        if (class_exists(\Database\Seeders\RolesAndPermissionsSeeder::class)) {
            $this->call(\Database\Seeders\RolesAndPermissionsSeeder::class);

            $user = User::where('email', 'hrmanager@cameco.com')->first();
            if ($user && method_exists($user, 'assignRole')) {
                try {
                    $user->assignRole('HR Manager');
                } catch (\Throwable $e) {
                    // ignore assignment errors during seeding
                }
            }
        }

        if (class_exists(\Database\Seeders\SLASeeder::class)) {
            $this->call(\Database\Seeders\SLASeeder::class);
        }

        // Seed cron jobs
        if (class_exists(\Database\Seeders\CronJobSeeder::class)) {
            $this->call(\Database\Seeders\CronJobSeeder::class);
        }

        // Seed default security policies
        if (class_exists(\Database\Seeders\SecurityPolicySeeder::class)) {
            $this->call(\Database\Seeders\SecurityPolicySeeder::class);
        }

        // Seed default security logs
        if (class_exists(\Database\Seeders\SecurityAuditLogSeeder::class)) {
            $this->call(\Database\Seeders\SecurityAuditLogSeeder::class);
        }

        // Seed system settings
        if (class_exists(\Database\Seeders\SystemSettingsSeeder::class)) {
            $this->call(\Database\Seeders\SystemSettingsSeeder::class);
        }

        // Seed System Error Logs
        if (class_exists(\Database\Seeders\SystemErrorLogSeeder::class)) {
            $this->call(\Database\Seeders\SystemErrorLogSeeder::class);
        }

        // Seed Scheduled Jobs
        if (class_exists(\Database\Seeders\ScheduledJobsSeeder::class)) {
            $this->call(\Database\Seeders\ScheduledJobsSeeder::class);
        }

        // Seed System Health Checks
        if (class_exists(\Database\Seeders\SystemHealthSeeder::class)) {
            $this->call(\Database\Seeders\SystemHealthSeeder::class);
        }

        // Seed Support Contract Settings
        if (class_exists(\Database\Seeders\SupportContractSettingsSeeder::class)) {
            $this->call(\Database\Seeders\SupportContractSettingsSeeder::class);
        }

    }


}
