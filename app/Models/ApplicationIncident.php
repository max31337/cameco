<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Application Incident Model
 *
 * Tracks support incidents/tickets.
 * Used for monitoring SLA compliance, response times, and resolution tracking.
 */
class ApplicationIncident extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'application_incidents';

    protected $fillable = [
        'title',
        'description',
        'severity',
        'status',
        'reported_by',
        'assigned_to',
        'detected_at',
        'acknowledged_at',
        'investigating_started_at',
        'resolved_at',
        'closed_at',
        'resolution_notes',
        'metadata',
    ];

    protected $casts = [
        'detected_at' => 'datetime',
        'acknowledged_at' => 'datetime',
        'investigating_started_at' => 'datetime',
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Get the user who reported the incident.
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    /**
     * Get the user assigned to handle the incident.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Calculate response time (time from detection to acknowledgment).
     * Returns time in minutes.
     */
    public function getResponseTimeAttribute(): ?float
    {
        if (!$this->detected_at || !$this->acknowledged_at) {
            return null;
        }

        return $this->detected_at->diffInMinutes($this->acknowledged_at);
    }

    /**
     * Calculate resolution time (time from detection to resolution).
     * Returns time in hours.
     */
    public function getResolutionTimeAttribute(): ?float
    {
        if (!$this->detected_at || !$this->resolved_at) {
            return null;
        }

        return round($this->detected_at->diffInHours($this->resolved_at, true), 2);
    }

    /**
     * Check if the incident is currently open (not resolved or closed).
     */
    public function isOpen(): bool
    {
        return in_array($this->status, ['open', 'investigating']);
    }

    /**
     * Check if the incident is critical severity.
     */
    public function isCritical(): bool
    {
        return $this->severity === 'critical';
    }

    /**
     * Scope query to only open incidents.
     */
    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['open', 'investigating']);
    }

    /**
     * Scope query to incidents by severity.
     */
    public function scopeBySeverity($query, string $severity)
    {
        return $query->where('severity', $severity);
    }

    /**
     * Scope query to incidents within a date range.
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('detected_at', [$startDate, $endDate]);
    }
}
