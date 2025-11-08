<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Checking user roles...\n";

// Check all users
$users = App\Models\User::with('roles')->get();

foreach ($users as $user) {
    echo "\n";
    echo "Email: {$user->email}\n";
    echo "Roles: " . $user->roles->pluck('name')->join(', ') . "\n";
}

// Assign HR Manager role to hrmanager user
$hrManager = App\Models\User::where('email', 'hrmanager@cameco.com')->first();
if ($hrManager) {
    if (!$hrManager->hasRole('HR Manager')) {
        $hrManager->assignRole('HR Manager');
        echo "\n✓ HR Manager role assigned to hrmanager@cameco.com\n";
    } else {
        echo "\n✓ hrmanager@cameco.com already has HR Manager role\n";
    }
}

// Assign Superadmin role to superadmin user
$superadmin = App\Models\User::where('email', 'superadmin@cameco.com')->first();
if ($superadmin) {
    if (!$superadmin->hasRole('Superadmin')) {
        $superadmin->assignRole('Superadmin');
        echo "✓ Superadmin role assigned to superadmin@cameco.com\n";
    } else {
        echo "✓ superadmin@cameco.com already has Superadmin role\n";
    }
}

echo "\nDone!\n";
