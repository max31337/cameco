<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== ALL USERS IN DATABASE ===\n";
$users = \App\Models\User::with('roles')->get();
foreach ($users as $user) {
    echo "\nUser ID: {$user->id}\n";
    echo "Name: {$user->name}\n";
    echo "Email: {$user->email}\n";
    echo "Roles: " . $user->getRoleNames()->join(', ') . "\n";
    echo "---\n";
}

echo "\n\n=== SESSIONS / AUTH STATUS ===\n";
echo "To see who is currently logged in, check your browser's session/cookies.\n";
echo "The issue is likely that you are logged in as a different user.\n";
echo "\n✅ Solution:\n";
echo "1. Log out completely from the application\n";
echo "2. Clear your browser cookies for localhost:8000\n";
echo "3. Log back in with: hrmanager@cameco.com / password\n";
echo "4. Try accessing /hr/employees/create\n";
