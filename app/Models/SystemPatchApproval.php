<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemPatchApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'patch_name',
        'patch_type',
        'version_from',
        'version_to',
        'status',
        'description',
        'requested_by',
        'approved_by',
        'requested_at',
        'approved_at',
        'deployed_at',
        'deployment_notes',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'deployed_at' => 'datetime',
    ];

    /**
     * Get the user who requested the patch
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * Get the user who approved the patch
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scope for pending patches
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for approved patches
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for deployed patches
     */
    public function scopeDeployed($query)
    {
        return $query->where('status', 'deployed');
    }

    /**
     * Scope for security patches
     */
    public function scopeSecurity($query)
    {
        return $query->where('patch_type', 'security');
    }

    /**
     * Get status badge color
     */
    public function getStatusColor(): string
    {
        return match ($this->status) {
            'deployed' => 'green',
            'approved' => 'blue',
            'pending' => 'yellow',
            'rejected' => 'gray',
            'failed' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get patch type badge color
     */
    public function getTypeColor(): string
    {
        return match ($this->patch_type) {
            'security' => 'red',
            'feature' => 'blue',
            'bugfix' => 'yellow',
            'performance' => 'purple',
            default => 'gray',
        };
    }
}
