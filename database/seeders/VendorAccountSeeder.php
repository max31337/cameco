<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Vendor Account Seeder
 * 
 * Seeds a vendor account user for accessing the Remote Vendor SLA dashboard.
 */
class VendorAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding vendor account...');

        // Create vendor account
        $vendor = User::firstOrCreate(
            ['email' => 'vendor@cameco.com'],
            [
                'name' => 'Vendor Account',
                'username' => 'vendor',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Assign Vendor role if it exists
        if (method_exists($vendor, 'assignRole')) {
            try {
                // Try to assign Vendor role, or create it if needed
                if (class_exists(\Spatie\Permission\Models\Role::class)) {
                    $vendorRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Vendor']);
                    $vendor->assignRole($vendorRole);
                    $this->command->info('Vendor role assigned to vendor@cameco.com');
                }
            } catch (\Throwable $e) {
                $this->command->warn('Could not assign Vendor role: ' . $e->getMessage());
            }
        }

        $this->command->info('Vendor account created: vendor@cameco.com / password');
    }
}
