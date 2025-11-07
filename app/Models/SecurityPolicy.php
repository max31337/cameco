<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SecurityPolicy extends Model
{
    use HasFactory;

    protected $fillable = [
        'policy_key',
        'policy_value',
        'policy_type',
        'description',
        'category',
        'is_enabled',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    /**
     * Scope to get policies by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to get enabled policies only
     */
    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    /**
     * Get all policies grouped by category
     */
    public static function getAllGroupedByCategory()
    {
        return self::all()->groupBy('category')->toArray();
    }

    /**
     * Get a policy value by key
     */
    public static function getPolicy(string $key, $default = null)
    {
        $policy = self::where('policy_key', $key)->where('is_enabled', true)->first();
        return $policy?->policy_value ?? $default;
    }

    /**
     * Set a policy value
     */
    public static function setPolicy(string $key, $value, string $type = 'string', string $category = 'general', string $description = null)
    {
        return self::updateOrCreate(
            ['policy_key' => $key],
            [
                'policy_value' => (string) $value,
                'policy_type' => $type,
                'category' => $category,
                'description' => $description,
                'is_enabled' => true,
            ]
        );
    }
}
