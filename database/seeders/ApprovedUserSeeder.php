<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Laravel\Jetstream\Jetstream;

class ApprovedUserSeeder extends Seeder
{
    /**
     * Seed the application's database with approved users for testing.
     */
    public function run(): void
    {
        $approvedUsers = [
            [
                'name' => 'John Smith',
                'username' => 'john.smith',
                'email' => 'john.smith@cathay.com',
                'password' => Hash::make('password'),
                'status' => 'active',
                'approved_by' => 1, // Admin user ID
                'approved_at' => now(),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sarah Johnson',
                'username' => 'sarah.johnson',
                'email' => 'sarah.johnson@cathay.com',
                'password' => Hash::make('password'),
                'status' => 'active',
                'approved_by' => 1, // Admin user ID
                'approved_at' => now(),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Mike Chen',
                'username' => 'mike.chen',
                'email' => 'mike.chen@cathay.com',
                'password' => Hash::make('password'),
                'status' => 'active',
                'approved_by' => 1, // Admin user ID
                'approved_at' => now(),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($approvedUsers as $userData) {
            $user = User::create($userData);

            // Create a personal team for each user (Jetstream requirement)
            if (Jetstream::hasTeamFeatures()) {
                $user->ownedTeams()->save(\App\Models\Team::forceCreate([
                    'user_id' => $user->id,
                    'name' => explode(' ', $user->name, 2)[0]."'s Team",
                    'personal_team' => true,
                ]));
            }
        }

        $this->command->info('✅ Created 3 approved users for testing:');
        $this->command->info('   • john.smith@cathay.com (John Smith)');
        $this->command->info('   • sarah.johnson@cathay.com (Sarah Johnson)');
        $this->command->info('   • mike.chen@cathay.com (Mike Chen)');
        $this->command->info('   Password for all: password');
    }
}