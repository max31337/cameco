<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Check user 2 (HR Manager)
$user = \App\Models\User::find(2);
echo "User: " . $user->email . PHP_EOL;
echo "Roles: " . implode(', ', $user->getRoleNames()->toArray()) . PHP_EOL;
echo "Permissions: " . implode(', ', $user->getAllPermissions()->pluck('name')->toArray()) . PHP_EOL;
echo PHP_EOL;
echo "All roles in system:" . PHP_EOL;
\Spatie\Permission\Models\Role::all()->each(function($role) {
    echo "  - " . $role->name . " (permissions: " . implode(', ', $role->permissions->pluck('name')->toArray()) . ")" . PHP_EOL;
});
echo PHP_EOL;
echo "All permissions in system:" . PHP_EOL;
\Spatie\Permission\Models\Permission::all()->each(function($perm) {
    echo "  - " . $perm->name . PHP_EOL;
});
