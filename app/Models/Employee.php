<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_number',
        'lastname',
        'firstname',
        'middlename',
        'address',
        'contact_number',
        'email_personal',
        'place_of_birth',
        'date_of_birth',
        'civil_status',
        'gender',
        'department_id',
        'position',
        'employment_type',  
        'date_employed',
        'date_regularized',
        'immediate_supervisor_id',
    'sss_no',
    'pagibig_no',
    'tin_no',
    'philhealth_no',
    'gsis_no',
        'spouse_name',
        'spouse_dob',
        'spouse_occupation',
        'father_name',
        'father_dob',
        'mother_name',
        'mother_dob',
        'emergency_contact_name',
        'emergency_contact_relationship',
        'emergency_contact_number',
        'status',
        'termination_date',
        'termination_reason',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_employed' => 'date',
        'date_regularized' => 'date',
        'spouse_dob' => 'date',
        'father_dob' => 'date',
        'mother_dob' => 'date',
        'termination_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($employee) {
            if (empty($employee->employee_number)) {
                $employee->employee_number = static::generateEmployeeNumber();
            }
        });
    }

    /**
     * Generate unique employee number in format EMP-YYYY-NNNN
     */
    public static function generateEmployeeNumber(): string
    {
        $year = date('Y');
        $lastEmployee = static::where('employee_number', 'like', "EMP-{$year}-%")
            ->orderBy('employee_number', 'desc')
            ->first();

        if ($lastEmployee) {
            $lastNumber = (int) substr($lastEmployee->employee_number, -4);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('EMP-%s-%04d', $year, $nextNumber);
    }

    /**
     * Get the user account associated with this employee
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the department this employee belongs to
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the immediate supervisor of this employee
     */
    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'immediate_supervisor_id');
    }

    /**
     * Get employees who report to this employee
     */
    public function subordinates(): HasMany
    {
        return $this->hasMany(Employee::class, 'immediate_supervisor_id');
    }

    /**
     * Get the user who created this employee record
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this employee record
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get the full name of the employee
     */
    public function getFullNameAttribute(): string
    {
        $fullName = trim($this->firstname . ' ' . $this->middlename . ' ' . $this->lastname);
        return preg_replace('/\s+/', ' ', $fullName);
    }

    /**
     * Get the formal name (Last, First Middle)
     */
    public function getFormalNameAttribute(): string
    {
        $middle = $this->middlename ? ' ' . $this->middlename : '';
        return $this->lastname . ', ' . $this->firstname . $middle;
    }

    /**
     * Check if employee has a linked user account
     */
    public function hasUserAccount(): bool
    {
        return !is_null($this->user_id);
    }

    /**
     * Check if employee is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Scope to get only active employees
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to filter by department
     */
    public function scopeInDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    /**
     * Scope to filter by employment type
     */
    public function scopeByEmploymentType($query, string $type)
    {
        return $query->where('employment_type', $type);
    }
}
