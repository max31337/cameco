<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeDraft extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'data',
        'step_completed',
    ];

    protected $casts = [
        'data' => 'array',
        'step_completed' => 'integer',
    ];

    /**
     * Get the user that owns the draft.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
