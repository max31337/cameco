<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemErrorLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'level',
        'message',
        'exception_class',
        'exception_message',
        'stack_trace',
        'file',
        'line',
        'url',
        'method',
        'ip_address',
        'user_id',
        'context',
        'is_resolved',
        'resolution_notes',
        'resolved_by',
        'resolved_at',
    ];

    protected $casts = [
        'context' => 'array',
        'is_resolved' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    /**
     * Get the user who encountered this error
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the user who resolved this error
     */
    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    /**
     * Scope for unresolved errors
     */
    public function scopeUnresolved($query)
    {
        return $query->where('is_resolved', false);
    }

    /**
     * Scope for resolved errors
     */
    public function scopeResolved($query)
    {
        return $query->where('is_resolved', true);
    }

    /**
     * Scope for critical errors
     */
    public function scopeCritical($query)
    {
        return $query->where('level', 'critical');
    }

    /**
     * Scope for errors by level
     */
    public function scopeByLevel($query, string $level)
    {
        return $query->where('level', $level);
    }

    /**
     * Scope for recent errors (last 24 hours)
     */
    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', now()->subDay());
    }

    /**
     * Get short file path
     */
    public function getShortFileAttribute(): string
    {
        if (!$this->file) {
            return 'Unknown';
        }

        $parts = explode(DIRECTORY_SEPARATOR, $this->file);
        return implode(DIRECTORY_SEPARATOR, array_slice($parts, -3));
    }

    /**
     * Get error occurrence count (same exception class + message)
     */
    public function getOccurrenceCountAttribute(): int
    {
        if (!$this->exception_class || !$this->exception_message) {
            return 1;
        }

        return self::where('exception_class', $this->exception_class)
            ->where('exception_message', $this->exception_message)
            ->count();
    }
}
