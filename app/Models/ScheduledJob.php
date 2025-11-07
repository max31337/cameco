<?php

namespace App\Models;

use Cron\CronExpression;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class ScheduledJob extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'command',
        'cron_expression',
        'is_enabled',
        'last_run_at',
        'next_run_at',
        'last_exit_code',
        'last_output',
        'run_count',
        'success_count',
        'failure_count',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_enabled' => 'boolean',
        'last_run_at' => 'datetime',
        'next_run_at' => 'datetime',
        'last_exit_code' => 'integer',
        'run_count' => 'integer',
        'success_count' => 'integer',
        'failure_count' => 'integer',
    ];

    /**
     * Get the user who created this job.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this job.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope to get only enabled jobs.
     */
    public function scopeEnabled(Builder $query): Builder
    {
        return $query->where('is_enabled', true);
    }

    /**
     * Scope to get only disabled jobs.
     */
    public function scopeDisabled(Builder $query): Builder
    {
        return $query->where('is_enabled', false);
    }

    /**
     * Scope to get overdue jobs (next_run_at is in the past and job is enabled).
     */
    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('is_enabled', true)
            ->where('next_run_at', '<', now())
            ->whereNotNull('next_run_at');
    }

    /**
     * Scope to get jobs that should run soon (within next hour).
     */
    public function scopeUpcoming(Builder $query, int $minutes = 60): Builder
    {
        return $query->where('is_enabled', true)
            ->where('next_run_at', '>', now())
            ->where('next_run_at', '<=', now()->addMinutes($minutes))
            ->orderBy('next_run_at');
    }

    /**
     * Calculate and return the next run time based on cron expression.
     */
    public function calculateNextRun(): ?Carbon
    {
        try {
            $cron = new CronExpression($this->cron_expression);
            $nextRun = $cron->getNextRunDate();
            
            return Carbon::instance($nextRun);
        } catch (\Exception $e) {
            // Invalid cron expression
            return null;
        }
    }

    /**
     * Check if this job is overdue (past next_run_at).
     */
    public function isOverdue(): bool
    {
        return $this->is_enabled 
            && $this->next_run_at 
            && $this->next_run_at->isPast();
    }

    /**
     * Increment the run count.
     */
    public function incrementRunCount(): void
    {
        $this->increment('run_count');
    }

    /**
     * Record a successful execution.
     */
    public function recordSuccess(string $output = ''): void
    {
        $this->update([
            'last_run_at' => now(),
            'last_exit_code' => 0,
            'last_output' => $output,
            'next_run_at' => $this->calculateNextRun(),
        ]);
        
        $this->increment('success_count');
    }

    /**
     * Record a failed execution.
     */
    public function recordFailure(int $exitCode, string $output = ''): void
    {
        $this->update([
            'last_run_at' => now(),
            'last_exit_code' => $exitCode,
            'last_output' => $output,
            'next_run_at' => $this->calculateNextRun(),
        ]);
        
        $this->increment('failure_count');
    }

    /**
     * Get formatted next run time (e.g., "in 3 hours").
     */
    public function getFormattedNextRunAttribute(): ?string
    {
        if (!$this->next_run_at) {
            return null;
        }

        return $this->next_run_at->diffForHumans();
    }

    /**
     * Get formatted last run time (e.g., "2 hours ago").
     */
    public function getFormattedLastRunAttribute(): ?string
    {
        if (!$this->last_run_at) {
            return 'Never';
        }

        return $this->last_run_at->diffForHumans();
    }

    /**
     * Get success rate as a percentage.
     */
    public function getSuccessRateAttribute(): float
    {
        if ($this->run_count === 0) {
            return 0.0;
        }

        return round(($this->success_count / $this->run_count) * 100, 2);
    }

    /**
     * Get status badge text.
     */
    public function getStatusAttribute(): string
    {
        if (!$this->is_enabled) {
            return 'disabled';
        }

        if ($this->isOverdue()) {
            return 'overdue';
        }

        if ($this->last_exit_code !== null && $this->last_exit_code !== 0) {
            return 'failed';
        }

        return 'active';
    }

    /**
     * Get human-readable cron expression description.
     */
    public function getCronDescriptionAttribute(): string
    {
        try {
            $cron = new CronExpression($this->cron_expression);
            
            // Simple description based on common patterns
            $parts = explode(' ', $this->cron_expression);
            
            if ($this->cron_expression === '* * * * *') {
                return 'Every minute';
            }
            if ($this->cron_expression === '0 * * * *') {
                return 'Every hour';
            }
            if ($this->cron_expression === '0 0 * * *') {
                return 'Daily at midnight';
            }
            if ($this->cron_expression === '0 0 * * 0') {
                return 'Weekly on Sunday at midnight';
            }
            if ($this->cron_expression === '0 0 1 * *') {
                return 'Monthly on the 1st at midnight';
            }
            
            return 'Custom schedule';
        } catch (\Exception $e) {
            return 'Invalid expression';
        }
    }
}
