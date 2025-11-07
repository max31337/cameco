<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Services\System\SystemCronService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CronController extends Controller
{
    public function __construct(
        private SystemCronService $cronService
    ) {
        // Note: auth and superadmin middleware should be applied in routes
    }

    /**
     * Display a listing of scheduled jobs.
     */
    public function index(Request $request): Response
    {
        try {
            $filters = $request->only(['is_enabled', 'status', 'search', 'sort_by', 'sort_order']);
            $perPage = $request->integer('per_page', 15);

            $jobs = $this->cronService->getAllJobs($perPage, $filters);
            $metrics = $this->cronService->getJobMetrics();
            $availableCommands = $this->cronService->getAvailableCommands();

            return Inertia::render('System/Cron', [
                'jobs' => $jobs,
                'metrics' => $metrics,
                'availableCommands' => $availableCommands,
                'filters' => $filters,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load cron jobs page', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return Inertia::render('System/Cron', [
                'jobs' => [],
                'metrics' => [
                    'total_jobs' => 0,
                    'enabled_jobs' => 0,
                    'disabled_jobs' => 0,
                    'overdue_jobs' => 0,
                ],
                'availableCommands' => [],
                'filters' => $filters ?? [],
                'error' => 'Failed to load cron jobs. Please try again.',
            ]);
        }
    }

    /**
     * Store a newly created scheduled job.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:scheduled_jobs,name',
                'description' => 'nullable|string|max:1000',
                'command' => 'required|string|max:500',
                'cron_expression' => 'required|string|max:100',
                'is_enabled' => 'boolean',
            ]);

            // Validate cron expression
            if (!$this->cronService->validateCronExpression($validated['cron_expression'])) {
                throw ValidationException::withMessages([
                    'cron_expression' => 'Invalid cron expression format.',
                ]);
            }

            $job = $this->cronService->createJob($validated, Auth::id());

            Log::info('Scheduled job created', [
                'job_id' => $job->id,
                'name' => $job->name,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('success', 'Scheduled job created successfully.');
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Failed to create scheduled job', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'data' => $request->all(),
            ]);

            return redirect()->back()->with('error', 'Failed to create scheduled job: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified scheduled job.
     */
    public function update(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255|unique:scheduled_jobs,name,' . $id,
                'description' => 'nullable|string|max:1000',
                'command' => 'sometimes|required|string|max:500',
                'cron_expression' => 'sometimes|required|string|max:100',
                'is_enabled' => 'boolean',
            ]);

            // Validate cron expression if provided
            if (isset($validated['cron_expression']) && !$this->cronService->validateCronExpression($validated['cron_expression'])) {
                throw ValidationException::withMessages([
                    'cron_expression' => 'Invalid cron expression format.',
                ]);
            }

            $job = $this->cronService->updateJob($id, $validated, Auth::id());

            Log::info('Scheduled job updated', [
                'job_id' => $job->id,
                'name' => $job->name,
                'user_id' => Auth::id(),
                'changes' => $validated,
            ]);

            return redirect()->back()->with('success', 'Scheduled job updated successfully.');
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Failed to update scheduled job', [
                'job_id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('error', 'Failed to update scheduled job: ' . $e->getMessage());
        }
    }

    /**
     * Toggle the enabled status of a scheduled job.
     */
    public function toggle(int $id)
    {
        try {
            $job = $this->cronService->findJobById($id);

            if (!$job) {
                return redirect()->back()->with('error', 'Scheduled job not found.');
            }

            $newStatus = !$job->is_enabled;
            $updatedJob = $newStatus 
                ? $this->cronService->enableJob($id, Auth::id())
                : $this->cronService->disableJob($id, Auth::id());

            Log::info('Scheduled job toggled', [
                'job_id' => $id,
                'name' => $job->name,
                'new_status' => $newStatus ? 'enabled' : 'disabled',
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('success', 'Scheduled job ' . ($newStatus ? 'enabled' : 'disabled') . ' successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to toggle scheduled job', [
                'job_id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('error', 'Failed to toggle scheduled job: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified scheduled job (soft delete).
     */
    public function destroy(int $id)
    {
        try {
            $job = $this->cronService->findJobById($id);

            if (!$job) {
                return redirect()->back()->with('error', 'Scheduled job not found.');
            }

            $jobName = $job->name;
            $this->cronService->deleteJob($id);

            Log::info('Scheduled job deleted', [
                'job_id' => $id,
                'name' => $jobName,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('success', 'Scheduled job deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete scheduled job', [
                'job_id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('error', 'Failed to delete scheduled job: ' . $e->getMessage());
        }
    }

    /**
     * Manually execute a scheduled job.
     */
    public function run(int $id)
    {
        try {
            $result = $this->cronService->executeJob($id, Auth::id());

            Log::info('Scheduled job manually executed', [
                'job_id' => $id,
                'user_id' => Auth::id(),
                'success' => $result['success'],
                'exit_code' => $result['exit_code'],
            ]);

            if ($result['success']) {
                return redirect()->back()->with('success', 'Job executed successfully. Exit code: ' . $result['exit_code']);
            } else {
                return redirect()->back()->with('warning', 'Job executed with errors. Exit code: ' . $result['exit_code'] . '. Check logs for details.');
            }
        } catch (\Exception $e) {
            Log::error('Failed to execute scheduled job', [
                'job_id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('error', 'Failed to execute job: ' . $e->getMessage());
        }
    }

    /**
     * Get execution history for a scheduled job.
     */
    public function history(int $id)
    {
        try {
            $limit = request()->integer('limit', 50);
            $history = $this->cronService->getExecutionHistory($id, $limit);
            $metrics = $this->cronService->getJobDetailMetrics($id);

            return response()->json([
                'success' => true,
                'history' => $history,
                'metrics' => $metrics,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch job execution history', [
                'job_id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch execution history: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Discover and sync scheduled jobs from Laravel's Schedule.
     */
    public function sync()
    {
        try {
            $result = $this->cronService->syncJobs(Auth::id());

            Log::info('Scheduled jobs synced', [
                'user_id' => Auth::id(),
                'discovered' => $result['discovered'],
                'added' => $result['added'],
                'updated' => $result['updated'],
                'skipped' => $result['skipped'],
            ]);

            $message = sprintf(
                'Sync complete. Discovered: %d, Added: %d, Updated: %d, Skipped: %d',
                $result['discovered'],
                $result['added'],
                $result['updated'],
                $result['skipped']
            );

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to sync scheduled jobs', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('error', 'Failed to sync jobs: ' . $e->getMessage());
        }
    }
}
