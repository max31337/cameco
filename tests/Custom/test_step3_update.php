<?php

require __DIR__ . '/../../vendor/autoload.php';

$app = require_once __DIR__ . '/../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Employee;

echo "=== MANUAL STEP 3 UPDATE TEST ===\n\n";

$user = User::find(1);
$employee = $user->employee;

if (!$employee) {
    echo "No employee record found!\n";
    exit;
}

echo "Before Update:\n";
echo "  position: " . ($employee->position ?: 'NULL') . "\n";
echo "  department_id: " . ($employee->department_id ?: 'NULL') . "\n";
echo "  date_employed: " . ($employee->date_employed ?: 'NULL') . "\n";
echo "  employment_type: " . ($employee->employment_type ?: 'NULL') . "\n\n";

// Manually update Step 3 fields
$employee->position = 'System Administrator';
$employee->department_id = 1;
$employee->date_employed = '2025-01-01';
$employee->employment_type = 'full-time';
$employee->updated_by = 1;

try {
    $employee->save();
    echo "✅ Save successful!\n\n";
} catch (\Exception $e) {
    echo "❌ Save failed: " . $e->getMessage() . "\n\n";
    exit;
}

// Reload and check
$employee->refresh();

echo "After Update:\n";
echo "  position: " . ($employee->position ?: 'NULL') . "\n";
echo "  department_id: " . ($employee->department_id ?: 'NULL') . "\n";
echo "  date_employed: " . ($employee->date_employed ?: 'NULL') . "\n";
echo "  employment_type: " . ($employee->employment_type ?: 'NULL') . "\n";
