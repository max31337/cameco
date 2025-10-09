<?php

// Test admin detection and shared data
require_once __DIR__ . '/../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

echo "=== TESTING ADMIN DETECTION ===\n\n";

// Get the admin user
$user = User::where('email', 'admin@cameco.com')->first();

if (!$user) {
    echo "Admin user not found!\n";
    exit;
}

echo "User: {$user->name} (ID: {$user->id})\n";
echo "Email: {$user->email}\n";
echo "Is Admin: " . ($user->isAdmin() ? 'Yes' : 'No') . "\n";
echo "Has Employee Record: " . ($user->hasEmployeeRecord() ? 'Yes' : 'No') . "\n";
echo "Has Skipped Profile: " . ($user->hasSkippedProfileCompletion() ? 'Yes' : 'No') . "\n";

echo "\n=== Shared Data Structure ===\n";
echo "This is what will be passed to the frontend:\n";
$sharedData = [
    'id' => $user->id,
    'name' => $user->name,
    'email' => $user->email,
    'status' => $user->status,
    'isAdmin' => $user->isAdmin(),
    'hasEmployeeRecord' => $user->hasEmployeeRecord(),
    'hasSkippedProfile' => $user->hasSkippedProfileCompletion(),
];

foreach ($sharedData as $key => $value) {
    echo "  {$key}: " . (is_bool($value) ? ($value ? 'true' : 'false') : $value) . "\n";
}