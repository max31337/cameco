<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
// Load Composer autoload and bootstrap Laravel from project root
require_once dirname(__DIR__, 2) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__, 2) . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Employee;
use App\Http\Controllers\AdminProfileController;
use App\Services\AdminOnboardingService;

echo "Debugging step calculation...\n\n";

// Clean up first
Employee::query()->delete();
$user = User::where('email', 'admin@cameco.com')->first();

// Create employee with step 1 data
$employee = Employee::create([
    'user_id' => $user->id,
    'employee_number' => 'EMP-DEBUG',
    'firstname' => 'Debug',
    'lastname' => 'User',
    'date_of_birth' => '1990-01-01',
    'gender' => 'male',
    'civil_status' => 'single',
    'created_by' => $user->id,
    'updated_by' => $user->id,
]);

// Refresh user
$user->refresh();

echo "Employee data:\n";
echo "- firstname: '{$employee->firstname}'\n";
echo "- lastname: '{$employee->lastname}'\n";
echo "- date_of_birth: '{$employee->date_of_birth}'\n";
echo "- gender: '{$employee->gender}'\n";
echo "- civil_status: '{$employee->civil_status}'\n\n";

// Manual step 1 check
$step1Fields = ['firstname', 'lastname', 'date_of_birth', 'gender', 'civil_status'];
echo "Step 1 field check:\n";
$step1Complete = true;
foreach ($step1Fields as $field) {
    $value = $employee->$field;
    $isEmpty = is_null($value) || $value === '';
    echo "- {$field}: '{$value}' (empty: " . ($isEmpty ? 'YES' : 'NO') . ")\n";
    if ($isEmpty) {
        $step1Complete = false;
    }
}
echo "Step 1 Complete: " . ($step1Complete ? 'YES' : 'NO') . "\n\n";

// Manual step 2 check
$step2Fields = ['email_personal', 'contact_number', 'address'];
echo "Step 2 field check:\n";
$step2Complete = true;
foreach ($step2Fields as $field) {
    $value = $employee->$field;
    $isEmpty = is_null($value) || $value === '';
    echo "- {$field}: '{$value}' (empty: " . ($isEmpty ? 'YES' : 'NO') . ")\n";
    if ($isEmpty) {
        $step2Complete = false;
    }
}
echo "Step 2 Complete: " . ($step2Complete ? 'YES' : 'NO') . "\n\n";

// Expected result
if (!$step1Complete) {
    echo "Expected starting step: 1 (step 1 incomplete)\n";
} elseif (!$step2Complete) {
    echo "Expected starting step: 2 (step 1 complete, step 2 incomplete)\n";
} else {
    echo "Expected starting step: 3+ (steps 1-2 complete)\n";
}

?>