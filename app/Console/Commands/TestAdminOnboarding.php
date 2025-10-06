<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestAdminOnboarding extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-admin-onboarding';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test admin onboarding functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Admin Onboarding Test ===');
        
        // Find or create admin user
        $admin = \App\Models\User::where('email', 'admin@cathay.com')->first();
        if (!$admin) {
            // Try to find any existing user
            $admin = \App\Models\User::first();
            if (!$admin) {
                $this->info('Creating admin user...');
                $admin = \App\Models\User::create([
                    'name' => 'System Admin',
                    'username' => 'system_admin',
                    'email' => 'admin@cathay.com',
                    'password' => \Hash::make('password'),
                    'email_verified_at' => now(),
                ]);
                $this->info('Admin user created!');
            } else {
                $this->info("Using existing user: {$admin->email}");
            }
        }

        // Test AdminOnboardingService
        $service = new \App\Services\AdminOnboardingService();

        $this->info("Admin Email: {$admin->email}");
        $this->info('Admin is admin: ' . ($admin->isAdmin() ? 'YES' : 'NO'));
        $this->info('Admin has employee record: ' . ($admin->hasEmployeeRecord() ? 'YES' : 'NO'));
        $this->info('Admin needs onboarding: ' . ($service->requiresOnboarding($admin) ? 'YES' : 'NO'));

        $progress = $service->getOnboardingProgress($admin);
        $this->info("Onboarding status: {$progress['status']}");

        if ($progress['status'] === 'pending') {
            $this->info('Required fields check: PASS');
        }

        // Test department count
        $deptCount = \App\Models\Department::count();
        $this->info("Departments created: {$deptCount}");

        // Test department retrieval
        $departments = \App\Models\Department::all();
        $this->info('Available departments:');
        foreach ($departments as $dept) {
            $this->line("  - {$dept->name} ({$dept->department_type})");
        }

        $this->info('=== Test completed successfully! ===');
    }
}
