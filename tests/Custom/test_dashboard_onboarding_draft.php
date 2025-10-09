<?php
// Script to test if DashboardController provides onboarding draft data for the current user
require_once __DIR__ . '/../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\EmployeeDraft;
use App\Http\Controllers\DashboardController;
use App\Services\AdminOnboardingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Simulate admin user
$user = User::where('email', 'admin@cameco.com')->first();
if (!$user) {
    echo "Admin user not found!\n";
    exit(1);
}

// Simulate authentication
Auth::login($user);

// Call DashboardController@index

// Create the required service and controller
$onboardingService = new AdminOnboardingService();
$controller = new DashboardController($onboardingService);

// Call DashboardController@index (no arguments)
$response = $controller->index();


// Get the data passed to Inertia
if (method_exists($response, 'getProps')) {
    $props = $response->getProps();
} elseif (method_exists($response, 'toArray')) {
    $props = $response->toArray();
} else {
    $props = (array) $response;
}

// Output onboardingDraft and profileCompletion
if (isset($props['onboardingDraft'])) {
    echo "onboardingDraft: ";
    print_r($props['onboardingDraft']);
} else {
    echo "onboardingDraft: NOT SET\n";
}

if (isset($props['profileCompletion'])) {
    echo "profileCompletion: ";
    print_r($props['profileCompletion']);
} else {
    echo "profileCompletion: NOT SET\n";
}

// Also show all props for debugging
if (!empty($props)) {
    echo "\nAll props returned by DashboardController@index:\n";
    print_r($props);
}
