<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SystemPatch extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'version',
        'patch_number',
        'type',
        'status',
        'description',
        'release_notes',
        'scheduled_at',
        'deployed_at',
        'failed_at',
        'rolled_back_at',
        'deployed_by',
        'deployment_notes',
        'affected_components',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'deployed_at' => 'datetime',
        'failed_at' => 'datetime',
        'rolled_back_at' => 'datetime',
        'affected_components' => 'array',
    ];

    /**
     * Get the user who deployed the patch.
     */
    public function deployer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deployed_by');
    }

    /**
     * Check if the patch is pending deployment.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the patch has been successfully deployed.
     */
    public function isDeployed(): bool
    {
        return $this->status === 'deployed';
    }

    /**
     * Check if the patch is a security patch.
     */
    public function isSecurityPatch(): bool
    {
        return $this->type === 'security';
    }

    /**
     * Get days until scheduled deployment.
     */
    public function getDaysUntilDeploymentAttribute(): ?int
    {
        if (!$this->scheduled_at) {
            return null;
        }

        return now()->diffInDays($this->scheduled_at, false);
    }

    /**
     * Scope query to pending patches.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope query to deployed patches.
     */
    public function scopeDeployed($query)
    {
        return $query->where('status', 'deployed');
    }

    /**
     * Scope query to scheduled patches.
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope query to patches by type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get the latest deployed patch.
     */
    public function scopeLatestDeployed($query)
    {
        return $query->deployed()->latest('deployed_at');
    }
}
