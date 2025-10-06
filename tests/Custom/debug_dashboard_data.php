<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Http\Controllers\DashboardController;
use App\Services\AdminOnboardingService;
use Illuminate\Support\Facades\Auth;

echo "Testing dashboard profile completion data...\n\n";

// Get the admin user
$user = User::where('email', 'admin@cameco.com')->first();
Auth::login($user);

// Create controller instance
$onboardingService = app(AdminOnboardingService::class);
$controller = new DashboardController($onboardingService);

// Use reflection to call the private method
$reflection = new ReflectionClass($controller);
$method = $reflection->getMethod('calculateProfileCompletionPercentage');
$method->setAccessible(true);

$profileCompletion = $method->invoke($controller, $user);

echo "Profile Completion Data:\n";
echo "- Percentage: " . $profileCompletion['percentage'] . "%\n";
echo "- Status: " . $profileCompletion['status'] . "\n";
echo "- Message: " . $profileCompletion['message'] . "\n";
echo "- Missing Fields: " . implode(', ', $profileCompletion['missingFields']) . "\n\n";

// Also check if user has employee record
echo "User has employee record: " . ($user->employee ? 'YES' : 'NO') . "\n";

if ($user->employee) {
    $employee = $user->employee;
    echo "Employee fields:\n";
    echo "- firstname: '{$employee->firstname}'\n";
    echo "- lastname: '{$employee->lastname}'\n";
    echo "- date_of_birth: '{$employee->date_of_birth}'\n";
    echo "- gender: '{$employee->gender}'\n";
    echo "- civil_status: '{$employee->civil_status}'\n";
    echo "- email_personal: '{$employee->email_personal}'\n";
    echo "- contact_number: '{$employee->contact_number}'\n";
    echo "- address: '{$employee->address}'\n";
    echo "- position: '{$employee->position}'\n";
    echo "- department_id: '{$employee->department_id}'\n";
}

echo "\nBased on the calculation, the dashboard should show:\n";
echo "- Button text: " . ($profileCompletion['percentage'] > 0 ? 'Continue Profile Setup' : 'Start Profile Setup') . "\n";
echo "- Percentage display: " . $profileCompletion['percentage'] . "%\n";

?>