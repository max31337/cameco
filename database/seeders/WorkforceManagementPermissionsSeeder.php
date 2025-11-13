<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class WorkforceManagementPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create all Workforce Management permissions
        $permissions = [
            // Work Schedules Permissions
            'workforce.schedules.view',
            'workforce.schedules.create',
            'workforce.schedules.update',
            'workforce.schedules.delete',

            // Employee Rotations Permissions
            'workforce.rotations.view',
            'workforce.rotations.create',
            'workforce.rotations.update',
            'workforce.rotations.delete',

            // Shift Assignments Permissions
            'workforce.assignments.view',
            'workforce.assignments.create',
            'workforce.assignments.update',
            'workforce.assignments.delete',
            'workforce.assignments.bulk_assign',
            'workforce.assignments.view_coverage',
        ];

        // Create permissions if they don't exist
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['guard_name' => 'web']
            );
        }

        // Get HR Manager role and assign all permissions
        $hrManagerRole = Role::firstOrCreate(
            ['name' => 'HR Manager'],
            ['guard_name' => 'web']
        );

        // Assign all Workforce Management permissions to HR Manager role
        $hrManagerRole->givePermissionTo($permissions);

        // Get HR Staff role and assign workforce permissions (if role exists)
        $hrStaffRole = Role::where('name', 'HR Staff')->first();
        if ($hrStaffRole) {
            // HR Staff gets all workforce permissions too
            $hrStaffRole->givePermissionTo($permissions);
            $this->command->info('Workforce Management permissions assigned to HR Staff role!');
        }

        $this->command->info('Workforce Management permissions seeded successfully!');
        $this->command->info('Total permissions created: ' . count($permissions));
    }
}
