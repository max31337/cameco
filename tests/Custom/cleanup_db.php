<?php

require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Employee;
use App\Models\User;

echo "Cleaning up database...\n";

// Delete all employee records
Employee::truncate();
echo "Deleted all employee records\n";

// Reset user employee_id and profile_completion_skipped
User::where('email', 'admin@cameco.com')->update([
    'employee_id' => null,
    'profile_completion_skipped' => false
]);

echo "Reset admin user\n";
echo "Database cleanup complete!\n";