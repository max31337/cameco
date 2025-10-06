<?php

// Test profile completion workflow
require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

$app = require_once dirname(__DIR__, 2) . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;

echo "=== TESTING PROFILE COMPLETION WORKFLOW ===\n\n";

// Get the admin user
$user = User::where('email', 'admin@cameco.com')->first();
if (!$user) {
    echo "❌ Admin user not found!\n";
    exit(1);
}

echo "Testing with User: {$user->name} (ID: {$user->id})\n";
echo "Has Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n\n";

// Simulate Step 1 data submission
echo "=== STEP 1: Simulating profile completion step 1 ===\n";
$step1Data = [
    'first_name' => 'System',
    'last_name' => 'Administrator',
    'middle_name' => '',
    'date_of_birth' => '1990-01-01',
    'gender' => 'male',
    'civil_status' => 'single',
];

echo "Submitting step 1 data:\n";
foreach ($step1Data as $key => $value) {
    echo "  - {$key}: {$value}\n";
}

// Map fields like the controller does
$fieldMap = [
    'first_name' => 'firstname',
    'last_name' => 'lastname',
    'middle_name' => 'middlename',
];

$mappedData = [];
foreach ($step1Data as $field => $value) {
    $mappedField = isset($fieldMap[$field]) ? $fieldMap[$field] : $field;
    if ($value !== null && $value !== '') {
        $mappedData[$mappedField] = $value;
    }
}

echo "\nMapped data for Employee model:\n";
foreach ($mappedData as $key => $value) {
    echo "  - {$key}: {$value}\n";
}

// Reload user relationship
$user->load('employee');

// Create or update employee
if ($user->employee) {
    $employee = $user->employee;
    echo "\nUpdating existing employee (ID: {$employee->id})\n";
} else {
    $employee = new Employee();
    $employee->user_id = $user->id;
    $employee->created_by = $user->id;
    $employee->updated_by = $user->id;
    $employee->status = 'active';
    echo "\nCreating new employee record\n";
}

// Apply data
foreach ($mappedData as $field => $value) {
    $employee->$field = $value;
}

// Save
try {
    $employee->save();
    echo "✅ Employee saved successfully! ID: {$employee->id}\n";
} catch (\Exception $e) {
    echo "❌ Failed to save employee: " . $e->getMessage() . "\n";
    exit(1);
}

// Update user
if (!$user->employee_id) {
    $user->employee_id = $employee->id;
}
$user->save();
echo "✅ User updated with employee_id: {$user->employee_id}\n\n";

// Verify
$user->refresh();
echo "=== VERIFICATION ===\n";
echo "User has employee record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";
echo "Employee ID: {$user->employee_id}\n";
echo "Employee data:\n";
echo "  - Name: {$employee->firstname} {$employee->lastname}\n";
echo "  - Date of Birth: {$employee->date_of_birth}\n";
echo "  - Gender: {$employee->gender}\n";
echo "  - Civil Status: {$employee->civil_status}\n";
echo "  - Employee Number: {$employee->employee_number}\n";

echo "\n=== TEST PASSED ===\n";
echo "Profile completion step 1 data saved successfully!\n";

?>