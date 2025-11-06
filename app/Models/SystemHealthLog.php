<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemHealthLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'cpu_usage',
        'memory_usage',
        'disk_usage',
        'load_average',
        'uptime_seconds',
        'database_response_ms',
        'cache_status',
        'queue_pending',
        'queue_failed',
        'overall_status',
    ];

    protected $casts = [
        'cpu_usage' => 'decimal:2',
        'memory_usage' => 'decimal:2',
        'disk_usage' => 'decimal:2',
        'uptime_seconds' => 'integer',
        'database_response_ms' => 'integer',
        'queue_pending' => 'integer',
        'queue_failed' => 'integer',
    ];

    /**
     * Get formatted uptime string
     */
    public function getFormattedUptimeAttribute(): string
    {
        if (!$this->uptime_seconds) {
            return 'Unknown';
        }

        $seconds = $this->uptime_seconds;
        $days = floor($seconds / 86400);
        $hours = floor(($seconds % 86400) / 3600);
        $minutes = floor(($seconds % 3600) / 60);

        return "{$days}d {$hours}h {$minutes}m";
    }

    /**
     * Determine if CPU is healthy
     */
    public function isCpuHealthy(): bool
    {
        return $this->cpu_usage < 70;
    }

    /**
     * Determine if memory is healthy
     */
    public function isMemoryHealthy(): bool
    {
        return $this->memory_usage < 75;
    }

    /**
     * Determine if disk is healthy
     */
    public function isDiskHealthy(): bool
    {
        return $this->disk_usage < 80;
    }

    /**
     * Get status color for UI
     */
    public function getStatusColor(): string
    {
        return match ($this->overall_status) {
            'healthy' => 'green',
            'warning' => 'yellow',
            'critical' => 'red',
            default => 'gray',
        };
    }
}
