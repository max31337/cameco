<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeRemark extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'remark',
        'created_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the employee this remark belongs to.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who created this remark.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
