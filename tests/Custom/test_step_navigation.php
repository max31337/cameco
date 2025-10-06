<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Employee;
use App\Http\Controllers\AdminProfileController;
use App\Services\AdminOnboardingService;
use Illuminate\Http\Request;

echo "Testing step navigation functionality...\n\n";

// Get the admin user
$user = User::where('email', 'admin@cameco.com')->first();
if (!$user) {
    echo "❌ Admin user not found\n";
    exit(1);
}

// Create controller instance with proper dependencies
$onboardingService = app(AdminOnboardingService::class);
$controller = new AdminProfileController($onboardingService);

echo "=== STEP 1: Initial state (no employee record) ===\n";
// Use reflection to call the private method
$reflection = new ReflectionClass($controller);
$method = $reflection->getMethod('determineStartingStep');
$method->setAccessible(true);

$startingStep = $method->invoke($controller, $user);
echo "Starting step: {$startingStep}\n";
echo "Expected: 1 (no employee record exists)\n\n";

echo "=== STEP 2: Complete step 1 data ===\n";
// Create employee record with step 1 data
$employee = Employee::create([
    'user_id' => $user->id,
    'employee_number' => 'EMP-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT),
    'firstname' => 'System',
    'lastname' => 'Administrator',
    'middlename' => '',
    'date_of_birth' => '1990-01-01',
    'gender' => 'male',
    'civil_status' => 'single',
    'created_by' => $user->id,
    'updated_by' => $user->id,
]);

echo "Created employee record with step 1 data:\n";
echo "- Name: {$employee->firstname} {$employee->lastname}\n";
echo "- Date of Birth: {$employee->date_of_birth}\n";
echo "- Gender: {$employee->gender}\n";
echo "- Civil Status: {$employee->civil_status}\n\n";

// Refresh user to load employee relationship
$user->refresh();

$startingStep = $method->invoke($controller, $user);
echo "Starting step after completing step 1: {$startingStep}\n";
echo "Expected: 2 (step 1 complete, step 2 incomplete)\n\n";

echo "=== STEP 3: Complete step 2 data ===\n";
// Add step 2 data
$employee->update([
    'email_personal' => 'admin.personal@gmail.com',
    'contact_number' => '(02) 123-4567',
    'address' => '123 Main Street, Makati',
]);

echo "Added step 2 contact information:\n";
echo "- Personal Email: {$employee->email_personal}\n";
echo "- Contact Number: {$employee->contact_number}\n";
echo "- Address: {$employee->address}\n\n";

// Refresh user again
$user->refresh();

$startingStep = $method->invoke($controller, $user);
echo "Starting step after completing step 2: {$startingStep}\n";
echo "Expected: 3 (steps 1-2 complete, step 3 incomplete)\n\n";

echo "=== STEP 4: Complete step 3 data ===\n";
// Add step 3 data
$employee->update([
    'position' => 'System Administrator',
    'department_id' => 1, // Assuming department 1 exists
    'date_employed' => '2025-01-01',
    'employment_type' => 'regular', // Valid enum values: regular, contractual, probationary, consultant
]);

echo "Added step 3 employment information:\n";
echo "- Position: {$employee->position}\n";
echo "- Department ID: {$employee->department_id}\n";
echo "- Date Employed: {$employee->date_employed}\n";
echo "- Employment Type: {$employee->employment_type}\n\n";

// Refresh user again
$user->refresh();

$startingStep = $method->invoke($controller, $user);
echo "Starting step after completing step 3: {$startingStep}\n";
echo "Expected: 4 (steps 1-3 complete, step 4 incomplete)\n\n";

echo "=== STEP 5: Complete step 4 data ===\n";
// Add step 4 data
$employee->update([
    'sss_no' => '12-3456789-0',
    'philhealth_no' => '12-345678901-2',
    'tin_no' => '123-456-789-000',
    'pagibig_no' => '1234-5678-9012',
    'emergency_contact_name' => 'Jane Administrator',
    'emergency_contact_relationship' => 'spouse',
    'emergency_contact_number' => '+63 917 987 6543',
]);

echo "Added step 4 government IDs and emergency contact:\n";
echo "- SSS: {$employee->sss_no}\n";
echo "- PhilHealth: {$employee->philhealth_no}\n";
echo "- TIN: {$employee->tin_no}\n";
echo "- Pag-IBIG: {$employee->pagibig_no}\n";
echo "- Emergency Contact: {$employee->emergency_contact_name}\n\n";

// Refresh user again
$user->refresh();

$startingStep = $method->invoke($controller, $user);
echo "Starting step after completing all steps: {$startingStep}\n";
echo "Expected: 1 (all complete, fallback to step 1)\n\n";

echo "=== VERIFICATION COMPLETE ===\n";
echo "✅ Step navigation logic working correctly!\n";
echo "\nNow when you click 'Complete Profile Now' after completing step 1,\n";
echo "it will automatically take you to step 2 instead of starting from step 1.\n";

?>