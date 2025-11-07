<?php

namespace App\Repositories\Contracts\System;

use App\Models\ScheduledJob;
use Illuminate\Database\Eloquent\Collection;

interface CronRepositoryInterface
{
    /**
     * Get all scheduled jobs with optional filters.
     *
     * @param array $filters Optional filters (is_enabled, status, search)
     * @return Collection
     */
    public function getAllJobs(array $filters = []): Collection;

    /**
     * Get all enabled scheduled jobs.
     *
     * @return Collection
     */
    public function getEnabledJobs(): Collection;

    /**
     * Get all disabled scheduled jobs.
     *
     * @return Collection
     */
    public function getDisabledJobs(): Collection;

    /**
     * Get overdue jobs (past their next_run_at time).
     *
     * @return Collection
     */
    public function getOverdueJobs(): Collection;

    /**
     * Get upcoming jobs (running within next X minutes).
     *
     * @param int $minutes
     * @return Collection
     */
    public function getUpcomingJobs(int $minutes = 60): Collection;

    /**
     * Find a scheduled job by ID.
     *
     * @param int $id
     * @return ScheduledJob|null
     */
    public function findById(int $id): ?ScheduledJob;

    /**
     * Find a scheduled job by command signature.
     *
     * @param string $command
     * @return ScheduledJob|null
     */
    public function findByCommand(string $command): ?ScheduledJob;

    /**
     * Find a scheduled job by name.
     *
     * @param string $name
     * @return ScheduledJob|null
     */
    public function findByName(string $name): ?ScheduledJob;

    /**
     * Create a new scheduled job.
     *
     * @param array $data
     * @return ScheduledJob
     */
    public function createJob(array $data): ScheduledJob;

    /**
     * Update an existing scheduled job.
     *
     * @param int $id
     * @param array $data
     * @return ScheduledJob
     */
    public function updateJob(int $id, array $data): ScheduledJob;

    /**
     * Toggle job enabled/disabled status.
     *
     * @param int $id
     * @return ScheduledJob
     */
    public function toggleJobStatus(int $id): ScheduledJob;

    /**
     * Soft delete a scheduled job.
     *
     * @param int $id
     * @return bool
     */
    public function deleteJob(int $id): bool;

    /**
     * Record a job execution (update last_run_at, exit_code, output, counts).
     *
     * @param int $id
     * @param int $exitCode
     * @param string $output
     * @return ScheduledJob
     */
    public function recordExecution(int $id, int $exitCode, string $output = ''): ScheduledJob;

    /**
     * Get execution history for a job (via last_run_at, exit_code tracking).
     * Note: For detailed history, consider creating a separate cron_job_executions table.
     *
     * @param int $id
     * @param int $limit
     * @return array Historical data (limited to current record for now)
     */
    public function getExecutionHistory(int $id, int $limit = 10): array;

    /**
     * Get aggregate metrics for all jobs.
     *
     * @return array
     */
    public function getJobMetrics(): array;

    /**
     * Get jobs with pagination.
     *
     * @param int $perPage
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedJobs(int $perPage = 15, array $filters = []): \Illuminate\Contracts\Pagination\LengthAwarePaginator;

    /**
     * Calculate next run time for all enabled jobs.
     *
     * @return void
     */
    public function recalculateNextRuns(): void;
}
