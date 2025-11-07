<?php

namespace Database\Seeders;

use App\Models\PayrollExecutionHistory;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ScheduledJobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        $thirtyDaysAgo = $now->copy()->subDays(30);

        // Create successful payroll runs (80% success rate)
        for ($i = 0; $i < 24; $i++) {
            $executedAt = Carbon::instance(
                fake()->dateTimeBetween($thirtyDaysAgo, $now)
            );

            $completedAt = $executedAt->copy()->addMinutes(rand(3, 15));

            $employeesProcessed = fake()->numberBetween(50, 250);
            $avgSalary = rand(35000, 85000);
            $totalAmount = $employeesProcessed * ($avgSalary / 12);

            PayrollExecutionHistory::create([
                'job_type' => 'payroll_generation',
                'status' => 'completed',
                'executed_at' => $executedAt,
                'completed_at' => $completedAt,
                'metadata' => json_encode([
                    'employees_processed' => $employeesProcessed,
                    'total_amount' => round($totalAmount, 2),
                    'currency' => 'USD',
                    'payment_method' => fake()->randomElement(['direct_deposit', 'check', 'wire_transfer']),
                    'payroll_period' => $executedAt->format('Y-m-d') . ' to ' . $executedAt->copy()->addDays(13)->format('Y-m-d'),
                    'batch_number' => 'BATCH-' . $executedAt->format('Ymd') . '-' . str_pad(rand(1, 9), 3, '0', STR_PAD_LEFT),
                    'processed_records' => $employeesProcessed,
                    'failed_records' => rand(0, 3),
                    'total_deductions' => round($totalAmount * 0.15, 2),
                    'net_amount' => round($totalAmount * 0.85, 2),
                ]),
                'created_at' => $executedAt,
                'updated_at' => $completedAt,
            ]);
        }

        // Create failed payroll runs (20% failure rate)
        for ($i = 0; $i < 6; $i++) {
            $executedAt = Carbon::instance(
                fake()->dateTimeBetween($thirtyDaysAgo, $now)
            );

            $errorType = fake()->randomElement([
                'database_connection_error',
                'bank_service_unavailable',
                'insufficient_funds',
                'validation_error',
                'timeout_error',
            ]);

            PayrollExecutionHistory::create([
                'job_type' => 'payroll_generation',
                'status' => 'failed',
                'executed_at' => $executedAt,
                'completed_at' => $executedAt->copy()->addMinutes(rand(1, 5)),
                'metadata' => json_encode([
                    'employees_processed' => fake()->numberBetween(0, 50),
                    'total_amount' => 0,
                    'currency' => 'USD',
                    'error_type' => $errorType,
                    'error_message' => $this->getErrorMessageForType($errorType),
                    'error_timestamp' => $executedAt->toIso8601String(),
                    'payroll_period' => $executedAt->format('Y-m-d') . ' to ' . $executedAt->copy()->addDays(13)->format('Y-m-d'),
                    'batch_number' => 'BATCH-' . $executedAt->format('Ymd') . '-' . str_pad(rand(1, 9), 3, '0', STR_PAD_LEFT),
                    'retry_count' => rand(1, 3),
                    'retry_attempted' => true,
                ]),
                'created_at' => $executedAt,
                'updated_at' => $executedAt,
            ]);
        }

        // Create in-progress/pending jobs (rare, but realistic)
        for ($i = 0; $i < 2; $i++) {
            $executedAt = $now->copy()->subMinutes(rand(10, 45));

            PayrollExecutionHistory::create([
                'job_type' => 'payroll_generation',
                'status' => 'processing',
                'executed_at' => $executedAt,
                'completed_at' => null,
                'metadata' => json_encode([
                    'employees_processed' => fake()->numberBetween(25, 100),
                    'total_amount' => 0,
                    'currency' => 'USD',
                    'current_step' => fake()->randomElement([
                        'validating_employees',
                        'calculating_deductions',
                        'processing_taxes',
                        'initiating_transfers',
                    ]),
                    'progress_percentage' => fake()->numberBetween(20, 95),
                    'payroll_period' => $executedAt->format('Y-m-d') . ' to ' . $executedAt->copy()->addDays(13)->format('Y-m-d'),
                    'batch_number' => 'BATCH-' . $executedAt->format('Ymd') . '-' . str_pad(rand(1, 9), 3, '0', STR_PAD_LEFT),
                ]),
                'created_at' => $executedAt,
                'updated_at' => now(),
            ]);
        }

        // Create payment batch records (linked to successful payroll runs)
        for ($i = 0; $i < 12; $i++) {
            $batchDate = Carbon::instance(
                fake()->dateTimeBetween($thirtyDaysAgo, $now)
            );

            $employeesInBatch = fake()->numberBetween(20, 80);
            $avgAmount = fake()->numberBetween(2000, 5000);
            $totalBatchAmount = $employeesInBatch * ($avgAmount / rand(1, 3));

            PayrollExecutionHistory::create([
                'job_type' => 'payment_batch',
                'status' => 'completed',
                'executed_at' => $batchDate,
                'completed_at' => $batchDate->copy()->addMinutes(rand(2, 8)),
                'metadata' => json_encode([
                    'batch_type' => fake()->randomElement(['direct_deposit', 'check_run', 'wire_transfer']),
                    'employee_count' => $employeesInBatch,
                    'total_amount' => round($totalBatchAmount, 2),
                    'currency' => 'USD',
                    'batch_reference' => 'PAY-' . $batchDate->format('Ymd-His'),
                    'payment_date' => $batchDate->addDays(1)->format('Y-m-d'),
                    'processing_time_seconds' => rand(120, 480),
                    'reconciled' => rand(0, 1) === 1,
                    'reconciliation_date' => $batchDate->addDays(rand(1, 3))->format('Y-m-d'),
                ]),
                'created_at' => $batchDate,
                'updated_at' => $batchDate->copy()->addMinutes(rand(2, 8)),
            ]);
        }

        // Create other job types for system health (backup, maintenance jobs)
        $otherJobTypes = [
            ['type' => 'system_backup', 'status' => 'completed', 'frequency' => 10],
            ['type' => 'database_maintenance', 'status' => 'completed', 'frequency' => 5],
            ['type' => 'compliance_audit', 'status' => 'completed', 'frequency' => 3],
            ['type' => 'user_sync', 'status' => 'completed', 'frequency' => 15],
        ];

        foreach ($otherJobTypes as $jobConfig) {
            for ($i = 0; $i < $jobConfig['frequency']; $i++) {
                $executedAt = Carbon::instance(
                    fake()->dateTimeBetween($thirtyDaysAgo, $now)
                );

                $completedAt = $executedAt->copy()->addMinutes(rand(1, 30));

                PayrollExecutionHistory::create([
                    'job_type' => $jobConfig['type'],
                    'status' => $jobConfig['status'],
                    'executed_at' => $executedAt,
                    'completed_at' => $completedAt,
                    'metadata' => json_encode([
                        'duration_seconds' => $completedAt->diffInSeconds($executedAt),
                        'records_processed' => fake()->numberBetween(10, 1000),
                        'status_message' => 'Job completed successfully',
                    ]),
                    'created_at' => $executedAt,
                    'updated_at' => $completedAt,
                ]);
            }
        }

        $this->command->info('ScheduledJob seeder completed. Created 50+ scheduled job entries.');
    }

    private function getErrorMessageForType(string $errorType): string
    {
        return match ($errorType) {
            'database_connection_error' => 'Failed to connect to database. Connection timeout after 30 seconds.',
            'bank_service_unavailable' => 'Bank ACH service is currently unavailable. Please retry later.',
            'insufficient_funds' => 'Insufficient funds in primary account for payroll transfer.',
            'validation_error' => 'Payroll validation failed: Missing employee tax information for 3 employees.',
            'timeout_error' => 'Payroll processing timed out after 15 minutes. Partial data processed.',
            default => 'An unexpected error occurred during payroll processing.',
        };
    }
}
