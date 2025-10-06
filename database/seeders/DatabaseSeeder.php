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
        // Create admin user first (required for approval relationships)
        $this->call([
            AdminUserSeeder::class,
        ]);

        // Create test users for different approval states
        $this->call([
            ApprovedUserSeeder::class,
            RejectedUserSeeder::class,
        ]);

        // User::factory(10)->withPersonalTeam()->create();

        // Optionally create test user with pending status
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        //     'status' => 'pending',
        // ]);
    }
}
