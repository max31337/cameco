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

        // Seed vendor account and remote vendor SLA data
        if (class_exists(\Database\Seeders\VendorAccountSeeder::class)) {
            $this->call(\Database\Seeders\VendorAccountSeeder::class);
        }

        if (class_exists(\Database\Seeders\RemoteVendorSLASeeder::class)) {
            $this->call(\Database\Seeders\RemoteVendorSLASeeder::class);
        }
    }
}
