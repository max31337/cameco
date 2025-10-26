<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    // keep any project-specific attributes but include guard_name for Spatie compatibility
    protected $fillable = ['name', 'guard_name', 'description', 'is_system_role'];

    protected $casts = [
        'is_system_role' => 'boolean',
    ];
}