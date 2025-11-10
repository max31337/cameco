<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create HR module permissions
        $permissions = [
            // Employee permissions
            'hr.employees.view',
            'hr.employees.create',
            'hr.employees.update',
            'hr.employees.delete',
            'hr.employees.restore',
            'hr.employees.export',
            
            // Department permissions
            'hr.departments.view',
            'hr.departments.create',
            'hr.departments.update',
            'hr.departments.delete',
            
            // Position permissions
            'hr.positions.view',
            'hr.positions.create',
            'hr.positions.update',
            'hr.positions.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => 'web'],
                ['guard_name' => 'web']
            );
        }

        // Assign all HR permissions to HR Manager role
        $hrManagerRole = Role::where('name', 'HR Manager')->first();
        if ($hrManagerRole) {
            $hrManagerRole->syncPermissions($permissions);
        }

        // Assign all HR permissions to Superadmin role
        $superadminRole = Role::where('name', 'Superadmin')->first();
        if ($superadminRole) {
            $allPermissions = Permission::where('guard_name', 'web')->pluck('name')->toArray();
            $superadminRole->syncPermissions($allPermissions);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove HR permissions
        $permissions = [
            'hr.employees.view',
            'hr.employees.create',
            'hr.employees.update',
            'hr.employees.delete',
            'hr.employees.restore',
            'hr.employees.export',
            'hr.departments.view',
            'hr.departments.create',
            'hr.departments.update',
            'hr.departments.delete',
            'hr.positions.view',
            'hr.positions.create',
            'hr.positions.update',
            'hr.positions.delete',
        ];

        Permission::whereIn('name', $permissions)->delete();
    }
};
