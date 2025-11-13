<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = \App\Models\User::with('roles')->get();
echo "\n=== ALL USERS AND THEIR ROLES ===\n";
foreach ($users as $user) {
    $roleNames = $user->getRoleNames()->join(', ');
    echo "User: {$user->email} | Roles: {$roleNames}\n";
}

echo "\n=== CURRENTLY AUTHENTICATED USER ===\n";
$currentUser = auth()->user();
if ($currentUser) {
    echo "Email: {$currentUser->email}\n";
    echo "Roles: " . $currentUser->getRoleNames()->join(', ') . "\n";
    echo "Has HR Manager: " . ($currentUser->hasRole('HR Manager') ? 'YES' : 'NO') . "\n";
    echo "Has Superadmin: " . ($currentUser->hasRole('Superadmin') ? 'YES' : 'NO') . "\n";
} else {
    echo "No user currently authenticated\n";
}
