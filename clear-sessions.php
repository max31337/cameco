<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Clear all sessions from database
\Illuminate\Support\Facades\DB::table('sessions')->truncate();
echo "✅ Cleared all sessions from database\n";

// Force clear cache
\Illuminate\Support\Facades\Artisan::call('cache:clear');
echo "✅ Cleared application cache\n";

\Illuminate\Support\Facades\Artisan::call('view:clear');
echo "✅ Cleared view cache\n";

echo "\n✅ All caches and sessions cleared!\n";
echo "Now please:\n";
echo "1. Go to http://localhost:8000\n";
echo "2. Log in with: hrmanager@cameco.com / password\n";
echo "3. Try accessing http://localhost:8000/hr/employees/create\n";
