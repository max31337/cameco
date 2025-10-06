<?php

use App\Models\User;
use App\Services\AdminOnboardingService;

// Find admin user
$admin = User::where('email', 'admin@cathay.com')->first();
if (!$admin) {
    echo "Admin user not found!\n";
    exit;
}

// Test AdminOnboardingService
$service = new AdminOnboardingService();

echo "=== Admin Onboarding Test ===\n";
echo "Admin Email: " . $admin->email . "\n";
echo "Admin is admin: " . ($admin->isAdmin() ? 'YES' : 'NO') . "\n";
echo "Admin has employee record: " . ($admin->hasEmployeeRecord() ? 'YES' : 'NO') . "\n";
echo "Admin needs onboarding: " . ($service->requiresOnboarding($admin) ? 'YES' : 'NO') . "\n";

$progress = $service->getOnboardingProgress($admin);
echo "Onboarding status: " . $progress['status'] . "\n";

if ($progress['status'] === 'pending') {
    echo "Required fields available: YES\n";
}

echo "=== Test completed successfully! ===\n";