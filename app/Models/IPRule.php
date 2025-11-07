<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IPRule extends Model
{
    use HasFactory;

    protected $table = 'ip_rules';

    protected $fillable = [
        'ip_address_or_range',
        'rule_type',
        'description',
        'is_active',
        'expires_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who created this rule
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this rule
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope to get active rules
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Scope to get whitelisted IPs
     */
    public function scopeWhitelist($query)
    {
        return $query->where('rule_type', 'whitelist')->active();
    }

    /**
     * Scope to get blacklisted IPs
     */
    public function scopeBlacklist($query)
    {
        return $query->where('rule_type', 'blacklist')->active();
    }

    /**
     * Scope to get expired rules
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    /**
     * Check if IP is whitelisted
     */
    public static function isWhitelisted(string $ip): bool
    {
        return self::whitelist()
            ->where('ip_address_or_range', $ip)
            ->exists();
    }

    /**
     * Check if IP is blacklisted
     */
    public static function isBlacklisted(string $ip): bool
    {
        return self::blacklist()
            ->where('ip_address_or_range', $ip)
            ->exists();
    }

    /**
     * Check if IP is allowed (not in blacklist and in whitelist if whitelist exists)
     */
    public static function isAllowed(string $ip): bool
    {
        // If blacklist has entries, check if IP is blacklisted
        if (self::blacklist()->exists() && self::isBlacklisted($ip)) {
            return false;
        }

        // If whitelist has entries, check if IP is whitelisted
        $whitelistCount = self::whitelist()->count();
        if ($whitelistCount > 0) {
            return self::isWhitelisted($ip);
        }

        // No restrictions
        return true;
    }
}
