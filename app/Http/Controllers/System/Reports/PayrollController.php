<?php

namespace App\Http\Controllers\System\Reports;

use App\Http\Controllers\Controller;
use App\Services\System\DatabaseCompatibilityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Response;

class PayrollController extends Controller
{
    /**
     * Display payroll generation logs
     */
    public function index(Request $request): Response
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : now()->subMonths(1);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : now();

        // Swap if from > to
        if ($from > $to) {
            [$from, $to] = [$to, $from];
        }

        $payrollRunHistory = $this->getPayrollRunHistory($from, $to);
        $errorLogs = $this->getErrorLogs($from, $to);
        $paymentBatches = $this->getPaymentBatches($from, $to);
        $payrollSummary = $this->getPayrollSummary($from, $to);

        $breadcrumbs = [
            ['title' => 'Dashboard', 'href' => '/dashboard'],
            ['title' => 'Reports', 'href' => '#'],
            ['title' => 'Payroll Logs', 'href' => '#'],
        ];

        return inertia('System/Reports/Payroll', [
            'payroll_run_history' => $payrollRunHistory,
            'error_logs' => $errorLogs,
            'payment_batches' => $paymentBatches,
            'payroll_summary' => $payrollSummary,
            'from_date' => $from->format('Y-m-d'),
            'to_date' => $to->format('Y-m-d'),
            'breadcrumbs' => $breadcrumbs,
        ]);
    }

    /**
     * Get payroll run history
     */
    private function getPayrollRunHistory(Carbon $from, Carbon $to): array
    {
        // Query payroll execution history
        $runs = DB::table('payroll_execution_histories')
            ->where('job_type', 'payroll_generation')
            ->whereBetween('executed_at', [$from, $to])
            ->orderBy('executed_at', 'desc')
            ->limit(100)
            ->get();

        return [
            'total_runs' => $runs->count(),
            'successful_runs' => $runs->where('status', 'completed')->count(),
            'failed_runs' => $runs->where('status', 'failed')->count(),
            'runs' => $runs->map(function ($run) {
                $startTime = Carbon::parse($run->executed_at);
                $endTime = $run->completed_at ? Carbon::parse($run->completed_at) : $startTime;
                $duration = $startTime->diffInSeconds($endTime);

                return [
                    'id' => $run->id,
                    'run_date' => $startTime->toDateString(),
                    'started_at' => $startTime->toDateTimeString(),
                    'completed_at' => $run->completed_at ? $endTime->toDateTimeString() : null,
                    'status' => $run->status,
                    'duration_seconds' => $duration,
                    'employees_processed' => $run->metadata ? json_decode($run->metadata, true)['employees_processed'] ?? 0 : 0,
                    'details' => $run->metadata ? json_decode($run->metadata, true) : [],
                ];
            })->all(),
        ];
    }

    /**
     * Get payroll error logs
     */
    private function getErrorLogs(Carbon $from, Carbon $to): array
    {
        $errors = DB::table('payroll_execution_histories')
            ->where('job_type', 'payroll_generation')
            ->where('status', 'failed')
            ->whereBetween('executed_at', [$from, $to])
            ->orderBy('executed_at', 'desc')
            ->limit(100)
            ->get();

        $errorsByType = [];
        $errorDetails = [];

        foreach ($errors as $error) {
            $metadata = $error->metadata ? json_decode($error->metadata, true) : [];
            $errorType = $metadata['error_type'] ?? 'Unknown Error';

            $errorsByType[$errorType] = ($errorsByType[$errorType] ?? 0) + 1;

            if (count($errorDetails) < 50) {
                $errorDetails[] = [
                    'id' => $error->id,
                    'error_type' => $errorType,
                    'message' => $metadata['error_message'] ?? 'No error message available',
                    'timestamp' => Carbon::parse($error->executed_at)->toDateTimeString(),
                    'run_details' => [
                        'started_at' => Carbon::parse($error->executed_at)->toDateTimeString(),
                        'payroll_period' => $metadata['payroll_period'] ?? 'Unknown',
                    ],
                ];
            }
        }

        return [
            'total_errors' => $errors->count(),
            'by_type' => $errorsByType,
            'recent_errors' => $errorDetails,
        ];
    }

    /**
     * Get payment batch information
     */
    private function getPaymentBatches(Carbon $from, Carbon $to): array
    {
        // Query payment-related data from payroll execution histories
        $batches = DB::table('payroll_execution_histories')
            ->where('job_type', 'payment_batch')
            ->where('status', 'completed')
            ->whereBetween('executed_at', [$from, $to])
            ->orderBy('executed_at', 'desc')
            ->limit(100)
            ->get();

        $batchData = [];

        foreach ($batches as $batch) {
            $metadata = $batch->metadata ? json_decode($batch->metadata, true) : [];

            $batchData[] = [
                'id' => $batch->id,
                'batch_number' => 'BATCH-' . $batch->id . '-' . date('Ymd', strtotime($batch->executed_at)),
                'payroll_period' => $metadata['payroll_period'] ?? 'Unknown',
                'total_employees' => $metadata['employees_processed'] ?? 0,
                'total_amount' => $metadata['total_amount'] ?? 0,
                'currency' => $metadata['currency'] ?? 'USD',
                'status' => 'paid',
                'created_date' => Carbon::parse($batch->executed_at)->toDateString(),
                'processed_date' => $batch->completed_at ? Carbon::parse($batch->completed_at)->toDateString() : Carbon::parse($batch->executed_at)->toDateString(),
                'payment_method' => $metadata['payment_method'] ?? 'Bank Transfer',
                'file_generated' => $metadata['file_generated'] ?? false,
                'file_name' => $metadata['file_name'] ?? null,
            ];
        }

        return [
            'total_batches' => count($batchData),
            'batches' => $batchData,
        ];
    }

    /**
     * Get payroll summary
     */
    private function getPayrollSummary(Carbon $from, Carbon $to): array
    {
        $runs = DB::table('scheduled_jobs')
            ->where('job_type', 'payroll_generation')
            ->whereBetween('executed_at', [$from, $to])
            ->get();

        $totalEmployeesProcessed = 0;
        $totalAmount = 0;
        $successfulRuns = 0;
        $failedRuns = 0;

        foreach ($runs as $run) {
            if ($run->status === 'completed') {
                $successfulRuns++;
                $metadata = $run->metadata ? json_decode($run->metadata, true) : [];
                $totalEmployeesProcessed += $metadata['employees_processed'] ?? 0;
                $totalAmount += $metadata['total_amount'] ?? 0;
            } else {
                $failedRuns++;
            }
        }

        return [
            'total_runs' => $runs->count(),
            'successful_runs' => $successfulRuns,
            'failed_runs' => $failedRuns,
            'success_rate' => $runs->count() > 0 ? round(($successfulRuns / $runs->count()) * 100, 2) : 0,
            'total_employees_processed' => $totalEmployeesProcessed,
            'total_amount_processed' => $totalAmount,
            'average_run_time' => $this->calculateAverageRunTime($runs),
        ];
    }

    /**
     * Calculate average run time
     */
    private function calculateAverageRunTime($runs): string
    {
        $totalSeconds = 0;
        $completedCount = 0;

        foreach ($runs as $run) {
            if ($run->completed_at) {
                $start = Carbon::parse($run->executed_at);
                $end = Carbon::parse($run->completed_at);
                $totalSeconds += $start->diffInSeconds($end);
                $completedCount++;
            }
        }

        if ($completedCount === 0) {
            return '0s';
        }

        $avgSeconds = intval($totalSeconds / $completedCount);
        $minutes = intval($avgSeconds / 60);
        $seconds = $avgSeconds % 60;

        return $minutes > 0 ? "{$minutes}m {$seconds}s" : "{$seconds}s";
    }
}
