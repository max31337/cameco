<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $perms = [
            'users.create', 'users.update', 'users.delete', 'users.view',
            'workforce.schedules.create', 'workforce.assignments.update',
            'timekeeping.attendance.create', 'timekeeping.reports.view',
            'system.settings.update',
        ];

        foreach ($perms as $p) {
            Permission::firstOrCreate(['name' => $p, 'guard_name' => 'web']);
        }

        $superadmin = Role::firstOrCreate(['name' => 'Superadmin', 'guard_name' => 'web']);
        $superadmin->givePermissionTo(Permission::all());

        $hrManager = Role::firstOrCreate(['name' => 'HR Manager', 'guard_name' => 'web']);
        $hrManager->givePermissionTo(['workforce.schedules.create', 'workforce.assignments.update']);
    }
}
