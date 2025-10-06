<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'department_type',
        'manager_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'department_type' => 'string',
    ];

    /**
     * Get the manager of this department
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    /**
     * Get all employees in this department
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    /**
     * Get all users in this department
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Scope to filter by department type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('department_type', $type);
    }

    /**
     * Scope to get only active departments
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Check if department is office type
     */
    public function isOffice(): bool
    {
        return $this->department_type === 'office';
    }

    /**
     * Check if department is production type
     */
    public function isProduction(): bool
    {
        return $this->department_type === 'production';
    }

    /**
     * Check if department is security type
     */
    public function isSecurity(): bool
    {
        return $this->department_type === 'security';
    }
}
