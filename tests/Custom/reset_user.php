<?php

// Reset user data for testing
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Employee;

echo "=== RESETTING USER DATA FOR TESTING ===\n\n";

// Get the admin user
$user = User::where('email', 'admin@cameco.com')->first();

if (!$user) {
    echo "Admin user not found!\n";
    exit;
}

echo "Resetting User: {$user->name} (ID: {$user->id})\n";

// Delete existing employee record
if ($user->employee) {
    $user->employee->delete();
    echo "Deleted employee record ID: {$user->employee_id}\n";
}

// Reset user fields
$user->employee_id = null;
$user->profile_completion_skipped = false;
$user->save();

echo "Reset user employee_id and profile_completion_skipped\n";
echo "User is now ready for fresh testing\n\n";

// Verify reset
$user->refresh();
echo "=== VERIFICATION ===\n";
echo "User Employee ID: " . ($user->employee_id ?? 'None') . "\n";
echo "Has Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";
echo "Has Skipped Profile: " . ($user->hasSkippedProfileCompletion() ? 'Yes' : 'No') . "\n";
echo "Employee Count: " . Employee::count() . "\n";