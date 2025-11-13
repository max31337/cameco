<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$users = App\Models\User::with('roles')->get();

echo "=== ALL USERS IN DATABASE ===\n\n";

foreach ($users as $user) {
    $roles = $user->roles->pluck('name')->toArray();
    echo "User ID: {$user->id}\n";
    echo "Email: {$user->email}\n";
    echo "Username: {$user->username}\n";
    echo "Roles: " . (!empty($roles) ? implode(', ', $roles) : 'NO ROLES') . "\n";
    echo "Can Access HR: " . ($user->hasRole(['HR Manager', 'Superadmin']) ? '✅ YES' : '❌ NO') . "\n";
    echo "---\n\n";
}

echo "To log in with HR Manager role, use:\n";
echo "  Email: hrmanager@cameco.com\n";
echo "  Password: password\n\n";

echo "To log in with Superadmin role, use:\n";
echo "  Email: superadmin@cameco.com\n";
echo "  Password: password\n";
