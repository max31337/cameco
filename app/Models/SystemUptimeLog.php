<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemUptimeLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'checked_at',
        'is_healthy',
        'response_time_ms',
        'check_type',
        'failure_reason',
        'metrics',
    ];

    protected $casts = [
        'checked_at' => 'datetime',
        'is_healthy' => 'boolean',
        'response_time_ms' => 'integer',
        'metrics' => 'array',
    ];

    /**
     * Check if the system was down during this check.
     */
    public function isDowntime(): bool
    {
        return !$this->is_healthy;
    }

    /**
     * Get response time in seconds.
     */
    public function getResponseTimeSecondsAttribute(): float
    {
        return $this->response_time_ms / 1000;
    }

    /**
     * Scope query to healthy checks.
     */
    public function scopeHealthy($query)
    {
        return $query->where('is_healthy', true);
    }

    /**
     * Scope query to downtime events.
     */
    public function scopeDowntime($query)
    {
        return $query->where('is_healthy', false);
    }

    /**
     * Scope query to checks within a date range.
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('checked_at', [$startDate, $endDate]);
    }

    /**
     * Scope query to automated checks.
     */
    public function scopeAutomated($query)
    {
        return $query->where('check_type', 'automated');
    }
}
