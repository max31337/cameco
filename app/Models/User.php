<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Jetstream\HasTeams;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use HasProfilePhoto;
    use HasTeams;
    use Notifiable;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'status',
        'rejection_reason',
        'employee_id',
        'department_id',
        'profile_completion_skipped',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * Get the admin who approved this user.
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Check if the user is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the user is pending approval.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the user is suspended.
     */
    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }

    /**
     * Check if the user is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Get the employee record associated with this user
     */
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    /**
     * Get the department this user belongs to
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Check if the user has an associated employee record
     */
    public function hasEmployeeRecord(): bool
    {
        return !is_null($this->employee);
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        // For now, check if user is the seeded admin or has admin in email
        return $this->email === 'admin@cameco.com' || str_contains($this->email, 'admin');
    }

    /**
     * Check if admin needs employee record creation
     */
    public function requiresEmployeeOnboarding(): bool
    {
        return $this->isAdmin() && !$this->hasEmployeeRecord();
    }

    /**
     * Mark profile completion as skipped
     */
    public function markProfileCompletionSkipped(): void
    {
        $this->profile_completion_skipped = true;
        $this->save();
    }

    /**
     * Check if profile completion was skipped
     */
    public function hasSkippedProfileCompletion(): bool
    {
        return $this->profile_completion_skipped;
    }
}
