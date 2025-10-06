<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RejectedUserSeeder extends Seeder
{
    /**
     * Seed the application's database with rejected users for testing.
     */
    public function run(): void
    {
        $rejectedUsers = [
            [
                'name' => 'Bob Wilson',
                'username' => 'bob.wilson',
                'email' => 'bob.wilson@external.com',
                'password' => Hash::make('password'),
                'status' => 'rejected',
                'approved_by' => 1, // Admin user ID
                'approved_at' => now(),
                'rejection_reason' => 'External email address not allowed. Please use your @cathay.com company email.',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Alice Brown',
                'username' => 'alice.brown',
                'email' => 'alice.brown@cathay.com',
                'password' => Hash::make('password'),
                'status' => 'rejected',
                'approved_by' => 1, // Admin user ID
                'approved_at' => now(),
                'rejection_reason' => 'Unable to verify employment status. Please contact HR department.',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Tom Davis',
                'username' => 'tom.davis',
                'email' => 'tom.davis@contractor.com',
                'password' => Hash::make('password'),
                'status' => 'rejected',
                'approved_by' => 1, // Admin user ID
                'approved_at' => now(),
                'rejection_reason' => 'Contractor accounts require special approval. Please submit contractor authorization form.',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($rejectedUsers as $userData) {
            User::create($userData);
        }

        $this->command->info('✅ Created 3 rejected users for testing:');
        $this->command->info('   • bob.wilson@external.com (Bob Wilson) - External email');
        $this->command->info('   • alice.brown@cathay.com (Alice Brown) - Employment verification');
        $this->command->info('   • tom.davis@contractor.com (Tom Davis) - Contractor approval');
        $this->command->info('   Password for all: password');
        $this->command->info('   All have custom rejection reasons for testing.');
    }
}