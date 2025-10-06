<?php

// Simple database check script
// Load Composer autoload and bootstrap Laravel from project root
require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

$app = require_once dirname(__DIR__, 2) . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Employee;

echo "=== DATABASE CHECK ===\n\n";

// Check users
$users = User::all();
echo "Total Users: " . $users->count() . "\n";

foreach ($users as $user) {
    echo "User ID: {$user->id}, Name: {$user->name}, Email: {$user->email}\n";
    echo "  - Has Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";
    echo "  - Has Skipped Profile: " . ($user->hasSkippedProfileCompletion() ? 'Yes' : 'No') . "\n";
    echo "  - Employee ID: " . ($user->employee_id ?? 'None') . "\n";
    
    if ($user->employee) {
        echo "  - Employee Data:\n";
        echo "    First Name: " . ($user->employee->firstname ?? 'Not set') . "\n";
        echo "    Last Name: " . ($user->employee->lastname ?? 'Not set') . "\n";
        echo "    Email: " . ($user->employee->email_personal ?? 'Not set') . "\n";
        echo "    Contact: " . ($user->employee->contact_number ?? 'Not set') . "\n";
        echo "    Position: " . ($user->employee->position ?? 'Not set') . "\n";
        echo "    Department ID: " . ($user->employee->department_id ?? 'Not set') . "\n";
    }
    echo "\n";
}

// Check employees
$employees = Employee::all();
echo "Total Employees: " . $employees->count() . "\n";

foreach ($employees as $employee) {
    echo "Employee ID: {$employee->id}, User ID: {$employee->user_id}\n";
    echo "  Name: {$employee->firstname} {$employee->lastname}\n";
    echo "  Email: " . ($employee->email_personal ?? 'Not set') . "\n";
    echo "  Contact: " . ($employee->contact_number ?? 'Not set') . "\n";
    echo "  Position: " . ($employee->position ?? 'Not set') . "\n";
    echo "  Department ID: " . ($employee->department_id ?? 'Not set') . "\n";
    echo "  Created: {$employee->created_at}\n";
    echo "  Updated: {$employee->updated_at}\n\n";
}