<?php

// Test saveProgress functionality
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Employee;

echo "=== TESTING SAVE PROGRESS FUNCTIONALITY ===\n\n";

// Get the admin user
$user = User::where('email', 'admin@cameco.com')->first();

if (!$user) {
    echo "Admin user not found!\n";
    exit;
}

echo "Testing with User: {$user->name} (ID: {$user->id})\n";
echo "Has Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";
echo "Employee ID: " . ($user->employee_id ?? 'None') . "\n\n";

// Simulate the saveProgress data
$testData = [
    'first_name' => 'System',
    'last_name' => 'Administrator',
    'email' => 'admin@cameco.com',
    'phone_number' => '123-456-7890',
    'address' => 'Test Address',
];

echo "Simulating saveProgress with data:\n";
print_r($testData);

// Create employee record manually (simulating what saveProgress should do)
echo "Creating employee record...\n";

// Field mapping
$fieldMap = [
    'first_name' => 'firstname',
    'last_name' => 'lastname',
    'middle_name' => 'middlename',
    'phone_number' => 'contact_number',
    'hire_date' => 'date_employed',
    'sss_number' => 'sss_no',
    'philhealth_number' => 'philhealth_no',
    'tin_number' => 'tin_no',
    'pag_ibig_number' => 'pagibig_no',
    'email' => 'email_personal',
    'supervisor_id' => 'immediate_supervisor_id',
];

try {
    // Check if user already has employee record
    if ($user->hasEmployeeRecord()) {
        $employee = $user->employee;
        echo "Updating existing employee record...\n";
    } else {
        $employee = new Employee([
            'user_id' => $user->id,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);
        echo "Creating new employee record...\n";
    }

    // Map and update data
    foreach ($testData as $field => $value) {
        if ($value !== null && $value !== '') {
            $mappedField = isset($fieldMap[$field]) ? $fieldMap[$field] : $field;
            if (in_array($mappedField, $employee->getFillable())) {
                $employee->$mappedField = $value;
                echo "Set {$mappedField} = {$value}\n";
            } else {
                echo "Field {$mappedField} is not fillable\n";
            }
        }
    }

    // Save employee
    $employee->save();
    echo "Employee saved with ID: {$employee->id}\n";

    // Update user's employee_id
    if (!$user->employee_id) {
        $user->employee_id = $employee->id;
        $user->save();
        echo "User updated with employee_id: {$employee->id}\n";
    }

    echo "\nTest completed successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

// Check results
echo "\n=== RESULTS ===\n";
$user->refresh();
echo "User Employee ID: " . ($user->employee_id ?? 'None') . "\n";
echo "Has Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";

if ($user->employee) {
    echo "Employee Details:\n";
    echo "  ID: {$user->employee->id}\n";
    echo "  Name: {$user->employee->firstname} {$user->employee->lastname}\n";
    echo "  Email: " . ($user->employee->email_personal ?? 'Not set') . "\n";
    echo "  Contact: " . ($user->employee->contact_number ?? 'Not set') . "\n";
}