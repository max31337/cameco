<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists
        $admin = User::where('email', 'admin@cameco.com')->first();

        if (!$admin) {
            $admin = User::create([
                'name' => 'System Administrator',
                'username' => 'admin',
                'email' => 'admin@cameco.com',
                'password' => Hash::make('password'),
                'status' => 'active', // Admin is immediately active
                'email_verified_at' => now(),
            ]);

            $this->command->info('✅ Admin user created successfully!');
            $this->command->info('👤 Username: admin');
            $this->command->info('📧 Email: admin@cameco.com');
            $this->command->info('🔑 Password: password');
        } else {
            // Update existing admin to be active
            $admin->update([
                'username' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
            
            $this->command->info('✅ Admin user already exists and updated to active status!');
            $this->command->info('👤 Username: admin');
            $this->command->info('📧 Email: admin@cameco.com');
        }

        // Create admin's personal team if it doesn't exist
        if (!$admin->currentTeam) {
            $admin->ownedTeams()->create([
                'name' => explode(' ', $admin->name, 2)[0]."'s Team",
                'personal_team' => true,
            ]);
            
            $this->command->info('✅ Admin personal team created!');
        }
    }
}
