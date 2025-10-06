<?php

// Test the step 1 -> next -> step 2 -> skip workflow
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Employee;

echo "=== TESTING STEP 1 -> NEXT -> STEP 2 -> SKIP WORKFLOW ===\n\n";

// Reset user first
$user = User::where('email', 'admin@cameco.com')->first();
if ($user->employee) {
    $user->employee->delete();
}
$user->employee_id = null;
$user->profile_completion_skipped = false;
$user->save();

echo "1. Reset user - Ready for testing\n";
echo "   Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";
echo "   Profile Skipped: " . ($user->hasSkippedProfileCompletion() ? 'Yes' : 'No') . "\n\n";

// Simulate Step 1 data (what user fills in step 1)
$step1Data = [
    'first_name' => 'System',
    'last_name' => 'Administrator', 
    'middle_name' => 'Test',
    'date_of_birth' => '1990-01-01',
    'gender' => 'male',
    'civil_status' => 'single',
    'nationality' => 'Filipino',
    'religion' => 'Catholic',
];

echo "2. Simulating Step 1 form data:\n";
foreach ($step1Data as $key => $value) {
    echo "   {$key}: {$value}\n";
}

// Simulate clicking "Next" (this should save step 1 data)
echo "\n3. Simulating 'Next' button click (should save Step 1 data)...\n";

// Create the AdminProfileController and call saveProgress
$controller = new \App\Http\Controllers\AdminProfileController(new \App\Services\AdminOnboardingService());

// Mock the request
$request = new \Illuminate\Http\Request();
$request->replace($step1Data);

// Simulate being logged in as the admin user
auth()->guard('web')->login($user);

try {
    $response = $controller->saveProgress($request);
    $responseData = json_decode($response->getContent(), true);
    echo "   Save Progress Response: " . $response->getContent() . "\n";
} catch (Exception $e) {
    echo "   Error saving progress: " . $e->getMessage() . "\n";
}

// Check if data was saved
$user->refresh();
echo "\n4. Checking if Step 1 data was saved:\n";
echo "   Has Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";

if ($user->employee) {
    echo "   Employee Data:\n";
    echo "     First Name: " . ($user->employee->firstname ?? 'Not set') . "\n";
    echo "     Last Name: " . ($user->employee->lastname ?? 'Not set') . "\n";
    echo "     Middle Name: " . ($user->employee->middlename ?? 'Not set') . "\n";
    echo "     Date of Birth: " . ($user->employee->date_of_birth ?? 'Not set') . "\n";
    echo "     Gender: " . ($user->employee->gender ?? 'Not set') . "\n";
    echo "     Civil Status: " . ($user->employee->civil_status ?? 'Not set') . "\n";
}

// Now simulate clicking "Skip" in step 2
echo "\n5. Simulating 'Skip' button click in Step 2...\n";

try {
    $skipResponse = $controller->skip();
    echo "   Skip Response: Success (redirects to dashboard)\n";
} catch (Exception $e) {
    echo "   Error skipping: " . $e->getMessage() . "\n";
}

// Check final state
$user->refresh();
echo "\n6. Final State Check:\n";
echo "   Has Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";
echo "   Profile Skipped: " . ($user->hasSkippedProfileCompletion() ? 'Yes' : 'No') . "\n";

// Calculate completion percentage
$dashboardController = new \App\Http\Controllers\DashboardController(new \App\Services\AdminOnboardingService());
$reflection = new ReflectionClass($dashboardController);
$method = $reflection->getMethod('calculateProfileCompletionPercentage');
$method->setAccessible(true);
$completion = $method->invoke($dashboardController, $user);

echo "\n7. Profile Completion Calculation:\n";
echo "   Percentage: " . $completion['percentage'] . "%\n";
echo "   Status: " . $completion['status'] . "\n";
echo "   Message: " . $completion['message'] . "\n";

if (!empty($completion['missingFields'])) {
    echo "   Missing Fields: " . implode(', ', array_slice($completion['missingFields'], 0, 5)) . "\n";
}