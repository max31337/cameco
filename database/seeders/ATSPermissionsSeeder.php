<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class ATSPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create all ATS permissions
        $permissions = [
            // Job Postings Permissions
            'recruitment.job_postings.view',
            'recruitment.job_postings.create',
            'recruitment.job_postings.edit',
            'recruitment.job_postings.delete',
            'recruitment.job_postings.publish',
            'recruitment.job_postings.close',

            // Candidates Permissions
            'recruitment.candidates.view',
            'recruitment.candidates.create',
            'recruitment.candidates.edit',
            'recruitment.candidates.delete',
            'recruitment.candidates.add_note',

            // Applications Permissions
            'recruitment.applications.view',
            'recruitment.applications.edit',
            'recruitment.applications.shortlist',
            'recruitment.applications.reject',
            'recruitment.applications.update_status',

            // Interviews Permissions
            'recruitment.interviews.view',
            'recruitment.interviews.create',
            'recruitment.interviews.edit',
            'recruitment.interviews.cancel',
            'recruitment.interviews.add_feedback',

            // Hiring Pipeline Permissions
            'recruitment.hiring_pipeline.view',
            'recruitment.hiring_pipeline.move_application',
        ];

        // Create permissions if they don't exist
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['guard_name' => 'web']
            );
        }

        // Get HR Manager role and assign all permissions
        $hrManagerRole = \Spatie\Permission\Models\Role::firstOrCreate(
            ['name' => 'HR Manager'],
            ['guard_name' => 'web']
        );

        // Assign all ATS permissions to HR Manager role
        $hrManagerRole->givePermissionTo($permissions);

        $this->command->info('ATS permissions seeded successfully!');
    }
}
