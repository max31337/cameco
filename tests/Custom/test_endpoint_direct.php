<?php

// Test the saveProgress endpoint directly
require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

$app = require_once dirname(__DIR__, 2) . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminProfileController;
use App\Services\AdminOnboardingService;
use Illuminate\Support\Facades\Auth;

echo "=== TESTING SAVE-PROGRESS ENDPOINT ===\n\n";

// Get and authenticate admin user
$user = User::where('email', 'admin@cameco.com')->first();
Auth::login($user);

echo "Authenticated as: {$user->name}\n";
echo "User ID: {$user->id}\n";
echo "Has Employee: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n\n";

// Create test request data (Step 1 data)
$testData = [
    'first_name' => 'John',
    'last_name' => 'Doe',
    'middle_name' => 'M',
    'date_of_birth' => '1990-05-15',
    'gender' => 'male',
    'civil_status' => 'single',
];

echo "Sending test data to saveProgress:\n";
print_r($testData);
echo "\n";

// Create request instance
$request = Request::create('/admin/profile/save-progress', 'POST', $testData);
$request->setUserResolver(function () use ($user) {
    return $user;
});

// Create controller and call saveProgress
try {
    $onboardingService = app(AdminOnboardingService::class);
    $controller = new AdminProfileController($onboardingService);
    
    echo "Calling saveProgress method...\n";
    $response = $controller->saveProgress($request);
    
    echo "Response Status: " . $response->getStatusCode() . "\n";
    echo "Response Body: " . $response->getContent() . "\n\n";
    
    // Check database
    $user->refresh();
    echo "=== VERIFICATION ===\n";
    echo "User has employee: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";
    
    if ($user->employee) {
        echo "Employee ID: {$user->employee->id}\n";
        echo "Employee Name: {$user->employee->firstname} {$user->employee->lastname}\n";
        echo "✅ SUCCESS: Data was saved!\n";
    } else {
        echo "❌ FAIL: No employee record created\n";
    }
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

?>