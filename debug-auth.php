<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== DATABASE USERS AND ROLES ===\n";
$users = \App\Models\User::all();
foreach ($users as $user) {
    echo "\nUser ID: {$user->id}\n";
    echo "Email: {$user->email}\n";
    echo "Roles: " . $user->getRoleNames()->join(', ') . "\n";
}

echo "\n\n=== CHECKING PERMISSIONS ===\n";
$user = \App\Models\User::where('email', 'hrmanager@cameco.com')->first();
if ($user) {
    echo "\nUser: {$user->email}\n";
    echo "Has 'HR Manager' role (exact): " . ($user->hasRole('HR Manager') ? 'YES' : 'NO') . "\n";
    echo "Has ['HR Manager', 'Superadmin'] roles: " . ($user->hasRole(['HR Manager', 'Superadmin']) ? 'YES' : 'NO') . "\n";
    echo "Direct roles in DB:\n";
    foreach ($user->roles as $role) {
        echo "  - Role ID: {$role->id}, Name: {$role->name}\n";
    }
}

echo "\n\n=== MIDDLEWARE TEST ===\n";
$user = \App\Models\User::where('email', 'hrmanager@cameco.com')->first();
if ($user) {
    // Simulate middleware check
    $hasAccess = $user->hasRole(['HR Manager', 'Superadmin']);
    echo "Would middleware allow access? " . ($hasAccess ? 'YES' : 'NO') . "\n";
}
