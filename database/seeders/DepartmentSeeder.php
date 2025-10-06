<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            // Office Departments
            [
                'name' => 'Human Resources',
                'code' => 'HR',
                'description' => 'Employee management, recruitment, and HR policies',
                'department_type' => 'office',
                'is_active' => true,
            ],
            [
                'name' => 'Accounting',
                'code' => 'ACCT',
                'description' => 'Financial management and accounting operations',
                'department_type' => 'office',
                'is_active' => true,
            ],
            [
                'name' => 'Administration',
                'code' => 'ADMIN',
                'description' => 'General administration and office management',
                'department_type' => 'office',
                'is_active' => true,
            ],
            [
                'name' => 'IT Department',
                'code' => 'IT',
                'description' => 'Information technology and systems management',
                'department_type' => 'office',
                'is_active' => true,
            ],
            [
                'name' => 'Front Desk',
                'code' => 'FRONTDESK',
                'description' => 'Reception and visitor management',
                'department_type' => 'office',
                'is_active' => true,
            ],

            // Production Departments
            [
                'name' => 'Rolling Mill 1',
                'code' => 'RM1',
                'description' => 'Rolling mill production unit 1',
                'department_type' => 'production',
                'is_active' => true,
            ],
            [
                'name' => 'Rolling Mill 2',
                'code' => 'RM2',
                'description' => 'Rolling mill production unit 2',
                'department_type' => 'production',
                'is_active' => true,
            ],
            [
                'name' => 'Rolling Mill 3',
                'code' => 'RM3',
                'description' => 'Rolling mill production unit 3',
                'department_type' => 'production',
                'is_active' => true,
            ],
            [
                'name' => 'Rolling Mill 4',
                'code' => 'RM4',
                'description' => 'Rolling mill production unit 4',
                'department_type' => 'production',
                'is_active' => true,
            ],
            [
                'name' => 'Rolling Mill 5',
                'code' => 'RM5',
                'description' => 'Rolling mill production unit 5',
                'department_type' => 'production',
                'is_active' => true,
            ],

            // Security Department
            [
                'name' => 'Security/Guards',
                'code' => 'SECURITY',
                'description' => 'Security and guard services',
                'department_type' => 'security',
                'is_active' => true,
            ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
