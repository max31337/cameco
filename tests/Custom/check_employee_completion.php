<?php

require_once __DIR__ . '/../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Employee;

echo "=== DETAILED EMPLOYEE CHECK ===\n\n";

$user = User::find(1);
if (!$user) {
    echo "User not found!\n";
    exit;
}

echo "User: {$user->name} ({$user->email})\n";
echo "Has Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";
echo "Has Skipped Profile: " . ($user->hasSkippedProfileCompletion() ? 'Yes' : 'No') . "\n\n";

if ($user->employee) {
    $employee = $user->employee;
    
    echo "=== EMPLOYEE RECORD DETAILS ===\n";
    echo "Employee ID: {$employee->id}\n";
    echo "Employee Number: {$employee->employee_number}\n\n";
    
    // Step 1 fields (Personal Information)
    echo "STEP 1 - Personal Information:\n";
    echo "  firstname: " . ($employee->firstname ?: 'NULL') . "\n";
    echo "  lastname: " . ($employee->lastname ?: 'NULL') . "\n";
    echo "  middlename: " . ($employee->middlename ?: 'NULL') . "\n";
    echo "  date_of_birth: " . ($employee->date_of_birth ?: 'NULL') . "\n";
    echo "  gender: " . ($employee->gender ?: 'NULL') . "\n";
    echo "  civil_status: " . ($employee->civil_status ?: 'NULL') . "\n";
    echo "  place_of_birth: " . ($employee->place_of_birth ?: 'NULL') . "\n\n";
    
    // Step 2 fields (Contact Information)
    echo "STEP 2 - Contact Information:\n";
    echo "  email_personal: " . ($employee->email_personal ?: 'NULL') . "\n";
    echo "  contact_number: " . ($employee->contact_number ?: 'NULL') . "\n";
    echo "  address: " . ($employee->address ?: 'NULL') . "\n\n";
    
    // Step 3 fields (Employment Information)
    echo "STEP 3 - Employment Information:\n";
    echo "  position: " . ($employee->position ?: 'NULL') . "\n";
    echo "  department_id: " . ($employee->department_id ?: 'NULL') . "\n";
    echo "  date_employed: " . ($employee->date_employed ?: 'NULL') . "\n";
    echo "  employment_type: " . ($employee->employment_type ?: 'NULL') . "\n\n";
    
    // Step 4 fields (Government IDs and Emergency Contact)
    echo "STEP 4 - Government IDs & Emergency Contact:\n";
    echo "  sss_no: " . ($employee->sss_no ?: 'NULL') . "\n";
    echo "  philhealth_no: " . ($employee->philhealth_no ?: 'NULL') . "\n";
    echo "  tin_no: " . ($employee->tin_no ?: 'NULL') . "\n";
    echo "  pagibig_no: " . ($employee->pagibig_no ?: 'NULL') . "\n";
    echo "  emergency_contact_name: " . ($employee->emergency_contact_name ?: 'NULL') . "\n";
    echo "  emergency_contact_relationship: " . ($employee->emergency_contact_relationship ?: 'NULL') . "\n";
    echo "  emergency_contact_number: " . ($employee->emergency_contact_number ?: 'NULL') . "\n\n";
    
    // Calculate completion based on DashboardController logic
    $totalFields = 17;
    $filledFields = 0;
    
    $requiredFields = [
        'firstname', 'lastname', 'date_of_birth', 'gender', 'civil_status',
        'email_personal', 'contact_number', 'address', 'position', 'department_id',
        'date_employed', 'employment_type', 'emergency_contact_name',
        'emergency_contact_relationship', 'emergency_contact_number'
    ];
    
    echo "=== COMPLETION CALCULATION ===\n";
    foreach ($requiredFields as $field) {
        $value = $employee->$field;
        $filled = !empty($value);
        if ($filled) $filledFields++;
        echo sprintf("%-35s: %s\n", $field, $filled ? '✓ Filled' : '✗ Empty');
    }
    
    $optionalFields = ['middlename', 'place_of_birth'];
    foreach ($optionalFields as $field) {
        $value = $employee->$field;
        $filled = !empty($value);
        if ($filled) $filledFields += 0.5;
        echo sprintf("%-35s: %s (0.5 weight)\n", $field, $filled ? '✓ Filled' : '✗ Empty');
    }
    
    $percentage = min(100, round(($filledFields / $totalFields) * 100));
    
    echo "\nFilled Fields: {$filledFields} / {$totalFields}\n";
    echo "Completion Percentage: {$percentage}%\n";
    
} else {
    echo "No employee record found!\n";
}
