<?php

namespace Database\Seeders;

use App\Models\SystemErrorLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class SystemErrorLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        $exceptionClasses = [
            'Illuminate\\Database\\QueryException',
            'Illuminate\\Auth\\AuthenticationException',
            'Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException',
            'Illuminate\\Validation\\ValidationException',
            'RuntimeException',
            'TypeError',
        ];

        $errorMessages = [
            'Database connection timeout',
            'Failed to authenticate user',
            'Page not found',
            'Validation failed for user input',
            'File not found in storage',
            'Invalid argument provided to method',
            'Memory limit exceeded',
            'Permission denied for resource access',
            'Cache write operation failed',
            'Unable to connect to external API',
        ];

        $levels = ['critical', 'error', 'warning', 'notice'];

        $this->command->info('Creating error logs...');

        // Create 50 error logs with varying severity and status
        for ($i = 0; $i < 50; $i++) {
            $level = $levels[array_rand($levels)];
            $exceptionClass = $exceptionClasses[array_rand($exceptionClasses)];
            $message = $errorMessages[array_rand($errorMessages)];
            $user = $users->random();
            $isResolved = $i % 3 === 0; // ~33% resolved

            $errorLog = SystemErrorLog::create([
                'level' => $level,
                'message' => $message,
                'exception_class' => $exceptionClass,
                'exception_message' => $message . ' - ' . fake()->sentence(),
                'stack_trace' => $this->generateStackTrace($exceptionClass),
                'file' => 'app/Http/Controllers/' . fake()->randomElement([
                    'UserController.php',
                    'DashboardController.php',
                    'ReportController.php',
                    'ApiController.php',
                ]),
                'line' => fake()->numberBetween(10, 500),
                'url' => '/' . fake()->randomElement(['dashboard', 'users', 'reports', 'settings', 'api/v1/data']),
                'method' => fake()->randomElement(['GET', 'POST', 'PUT', 'DELETE']),
                'ip_address' => fake()->ipv4(),
                'user_id' => $user->id,
                'context' => [
                    'request_id' => fake()->uuid(),
                    'session_id' => fake()->uuid(),
                    'user_agent' => fake()->userAgent(),
                ],
                'is_resolved' => $isResolved,
                'resolution_notes' => $isResolved ? fake()->randomElement([
                    'Fixed database connection pool settings',
                    'Updated authentication middleware',
                    'Added missing route handler',
                    'Corrected validation rules',
                    'Increased memory limit in php.ini',
                    'Fixed file permissions',
                ]) : null,
                'resolved_by' => $isResolved ? $users->random()->id : null,
                'resolved_at' => $isResolved ? now()->subDays(fake()->numberBetween(0, 7)) : null,
                'created_at' => now()->subDays(fake()->numberBetween(0, 30)),
            ]);
        }

        // Create some duplicate errors (same exception class + message) for testing bulk resolve
        $duplicateError = [
            'level' => 'error',
            'message' => 'Duplicate key constraint violation',
            'exception_class' => 'Illuminate\\Database\\QueryException',
            'exception_message' => 'SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry',
            'stack_trace' => $this->generateStackTrace('Illuminate\\Database\\QueryException'),
            'file' => 'app/Models/User.php',
            'line' => 145,
            'url' => '/users/create',
            'method' => 'POST',
            'is_resolved' => false,
        ];

        // Create 5 duplicate errors
        for ($i = 0; $i < 5; $i++) {
            SystemErrorLog::create(array_merge($duplicateError, [
                'ip_address' => fake()->ipv4(),
                'user_id' => $users->random()->id,
                'context' => [
                    'request_id' => fake()->uuid(),
                    'session_id' => fake()->uuid(),
                    'user_agent' => fake()->userAgent(),
                ],
                'created_at' => now()->subHours(fake()->numberBetween(1, 48)),
            ]));
        }

        $this->command->info('✅ Created 55 error log entries (50 varied + 5 duplicates)');
    }

    /**
     * Generate a realistic stack trace
     */
    private function generateStackTrace(string $exceptionClass): string
    {
        return <<<EOT
{$exceptionClass}: Error occurred
    at app/Http/Controllers/DashboardController.php:42
    at Illuminate\\Routing\\Controller->callAction()
    at Illuminate\\Routing\\ControllerDispatcher->dispatch()
    at Illuminate\\Routing\\Route->runController()
    at Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}()
    at Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()
    at app/Http/Middleware/EnsureProfileComplete.php:28
    at Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()
    at Illuminate\\Routing\\Middleware\\SubstituteBindings->handle()
    at Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()
    at Illuminate\\Foundation\\Http\\Kernel->handle()
    at public/index.php:17
EOT;
    }
}
