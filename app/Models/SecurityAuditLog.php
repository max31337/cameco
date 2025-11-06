<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityAuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_type',
        'severity',
        'user_id',
        'ip_address',
        'user_agent',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the user associated with this audit log
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for critical events
     */
    public function scopeCritical($query)
    {
        return $query->where('severity', 'critical');
    }

    /**
     * Scope for warning events
     */
    public function scopeWarning($query)
    {
        return $query->where('severity', 'warning');
    }

    /**
     * Scope for info events
     */
    public function scopeInfo($query)
    {
        return $query->where('severity', 'info');
    }

    /**
     * Scope for failed login attempts
     */
    public function scopeFailedLogins($query)
    {
        return $query->where('event_type', 'failed_login');
    }

    /**
     * Scope for permission changes
     */
    public function scopePermissionChanges($query)
    {
        return $query->whereIn('event_type', ['permission_change', 'role_change']);
    }

    /**
     * Scope for recent events (last 24 hours)
     */
    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', now()->subDay());
    }

    /**
     * Get severity badge color
     */
    public function getSeverityColor(): string
    {
        return match ($this->severity) {
            'critical' => 'red',
            'warning' => 'yellow',
            'info' => 'blue',
            default => 'gray',
        };
    }

    /**
     * Get event type icon name
     */
    public function getEventIcon(): string
    {
        return match ($this->event_type) {
            'login' => 'LogIn',
            'logout' => 'LogOut',
            'failed_login' => 'AlertTriangle',
            'permission_change' => 'Shield',
            'role_change' => 'UserCog',
            'data_access' => 'Database',
            default => 'Activity',
        };
    }
}
