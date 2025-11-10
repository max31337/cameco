<?php

namespace Database\Seeders;

use App\Models\ScheduledJob;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CronJobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find user without role check to avoid errors if roles not seeded yet
        $superadmin = User::where('email', 'superadmin@cameco.com')->first()
            ?? User::first();

        if (!$superadmin) {
            $this->command->warn('No user found. Skipping CronJobSeeder.');
            return;
        }

        $jobs = [
            [
                'name' => 'Database Backup',
                'description' => 'Create a full database backup and store it securely. Critical for disaster recovery.',
                'command' => 'backup:run --only-db',
                'cron_expression' => '0 2 * * *', // Daily at 2 AM
                'is_enabled' => true,
                'run_count' => 45,
                'success_count' => 44,
                'failure_count' => 1,
                'last_run_at' => Carbon::now()->subDay()->setHour(2)->setMinute(0),
                'last_exit_code' => 0,
            ],
            [
                'name' => 'Clean Old Logs',
                'description' => 'Remove log files older than 30 days to free up disk space.',
                'command' => 'log:clean --days=30',
                'cron_expression' => '0 3 * * 0', // Weekly on Sunday at 3 AM
                'is_enabled' => true,
                'run_count' => 12,
                'success_count' => 12,
                'failure_count' => 0,
                'last_run_at' => Carbon::now()->subWeek()->setHour(3)->setMinute(0),
                'last_exit_code' => 0,
            ],
            [
                'name' => 'Send Daily Email Reports',
                'description' => 'Send automated daily summary reports to department heads.',
                'command' => 'reports:send-daily',
                'cron_expression' => '0 6 * * *', // Daily at 6 AM
                'is_enabled' => true,
                'run_count' => 60,
                'success_count' => 58,
                'failure_count' => 2,
                'last_run_at' => Carbon::now()->subDay()->setHour(6)->setMinute(0),
                'last_exit_code' => 0,
            ],
            [
                'name' => 'Queue Worker Health Check',
                'description' => 'Monitor queue workers and restart if needed. Ensures background jobs are processing.',
                'command' => 'queue:monitor',
                'cron_expression' => '*/5 * * * *', // Every 5 minutes
                'is_enabled' => true,
                'run_count' => 2880,
                'success_count' => 2875,
                'failure_count' => 5,
                'last_run_at' => Carbon::now()->subMinutes(5),
                'last_exit_code' => 0,
            ],
            [
                'name' => 'Clear Application Cache',
                'description' => 'Clear application cache to ensure fresh data. Runs daily at midnight.',
                'command' => 'cache:clear',
                'cron_expression' => '0 0 * * *', // Daily at midnight
                'is_enabled' => true,
                'run_count' => 30,
                'success_count' => 30,
                'failure_count' => 0,
                'last_run_at' => Carbon::now()->subDay()->setHour(0)->setMinute(0),
                'last_exit_code' => 0,
            ],
            [
                'name' => 'Optimize Database Tables',
                'description' => 'Optimize and analyze database tables for better performance.',
                'command' => 'db:optimize',
                'cron_expression' => '0 4 * * 0', // Weekly on Sunday at 4 AM
                'is_enabled' => false, // Disabled for manual execution only
                'run_count' => 5,
                'success_count' => 5,
                'failure_count' => 0,
                'last_run_at' => Carbon::now()->subWeeks(2)->setHour(4)->setMinute(0),
                'last_exit_code' => 0,
            ],
            [
                'name' => 'Generate Monthly Reports',
                'description' => 'Generate comprehensive monthly reports for all departments.',
                'command' => 'reports:monthly',
                'cron_expression' => '0 5 1 * *', // First day of month at 5 AM
                'is_enabled' => true,
                'run_count' => 3,
                'success_count' => 3,
                'failure_count' => 0,
                'last_run_at' => Carbon::now()->subMonth()->startOfMonth()->setHour(5)->setMinute(0),
                'last_exit_code' => 0,
            ],
            [
                'name' => 'Clean Temporary Files',
                'description' => 'Remove temporary files and expired uploads from storage.',
                'command' => 'storage:clean-temp',
                'cron_expression' => '0 1 * * *', // Daily at 1 AM
                'is_enabled' => true,
                'run_count' => 30,
                'success_count' => 30,
                'failure_count' => 0,
                'last_run_at' => Carbon::now()->subDay()->setHour(1)->setMinute(0),
                'last_exit_code' => 0,
            ],
            [
                'name' => 'Send Reminder Notifications',
                'description' => 'Send reminder notifications for pending approvals and tasks.',
                'command' => 'notifications:send-reminders',
                'cron_expression' => '0 9 * * 1-5', // Weekdays at 9 AM
                'is_enabled' => false, // Disabled temporarily
                'run_count' => 10,
                'success_count' => 9,
                'failure_count' => 1,
                'last_run_at' => Carbon::now()->subWeek()->setHour(9)->setMinute(0),
                'last_exit_code' => 1,
            ],
            [
                'name' => 'Update Security Patches',
                'description' => 'Check for and download available security patches.',
                'command' => 'security:check-patches',
                'cron_expression' => '0 */6 * * *', // Every 6 hours
                'is_enabled' => true,
                'run_count' => 120,
                'success_count' => 118,
                'failure_count' => 2,
                'last_run_at' => Carbon::now()->subHours(6),
                'last_exit_code' => 0,
            ],
        ];

        foreach ($jobs as $jobData) {
            $jobData['created_by'] = $superadmin->id;
            $jobData['updated_by'] = $superadmin->id;
            
            // Calculate next run time based on cron expression
            try {
                $cron = new \Cron\CronExpression($jobData['cron_expression']);
                $jobData['next_run_at'] = Carbon::instance($cron->getNextRunDate());
            } catch (\Exception $e) {
                $jobData['next_run_at'] = Carbon::now()->addDay();
            }

            // Use firstOrCreate to avoid duplicate entry errors
            ScheduledJob::firstOrCreate(
                ['name' => $jobData['name']], // Search criteria
                $jobData // Full data to create if not found
            );
        }

        $this->command->info('Seeded cron jobs (created new or skipped existing).');
    }
}
