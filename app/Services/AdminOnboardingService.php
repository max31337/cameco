<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AdminOnboardingService
{
    /**
     * Check if a user requires onboarding (admin without employee record and hasn't skipped)
     */
    public function requiresOnboarding(User $user): bool
    {
        return $user->isAdmin() && !$user->hasEmployeeRecord() && !$user->hasSkippedProfileCompletion();
    }

    /**
     * Create employee record for admin and link accounts
     */
    public function createEmployeeForAdmin(User $admin, array $employeeData): Employee
    {
        // Validate the employee data
        $this->validateEmployeeData($employeeData);

        return DB::transaction(function () use ($admin, $employeeData) {
            // Create the employee record
            $employee = Employee::create([
                'user_id' => $admin->id,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
                ...$employeeData
            ]);

            // Update the admin user with employee_id
            $admin->update([
                'employee_id' => $employee->id,
                'department_id' => $employee->department_id,
            ]);

            return $employee;
        });
    }

    /**
     * Validate employee data for admin onboarding
     */
    protected function validateEmployeeData(array $data): void
    {
        $validator = Validator::make($data, [
            'lastname' => 'required|string|max:255',
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'employment_type' => 'required|in:regular,contractual,probationary,consultant',
            'date_employed' => 'required|date',
            'date_of_birth' => 'required|date|before:today',
            'gender' => 'required|in:male,female',
            'civil_status' => 'required|in:single,married,divorced,widowed',
            'address' => 'required|string',
            'contact_number' => 'required|string|max:50',
            'email_personal' => 'nullable|email|max:255',
            'place_of_birth' => 'required|string|max:255',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_relationship' => 'required|string|max:255',
            'emergency_contact_number' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    /**
     * Get required fields for admin onboarding
     */
    public function getRequiredFields(): array
    {
        return [
            'personal' => [
                'lastname',
                'firstname',
                'middlename',
                'date_of_birth',
                'gender',
                'civil_status',
                'address',
                'contact_number',
                'email_personal',
                'place_of_birth',
            ],
            'employment' => [
                'department_id',
                'position',
                'employment_type',
                'date_employed',
            ],
            'emergency' => [
                'emergency_contact_name',
                'emergency_contact_relationship',
                'emergency_contact_number',
            ],
        ];
    }

    /**
     * Check if admin has completed onboarding
     */
    public function hasCompletedOnboarding(User $user): bool
    {
        return $user->hasEmployeeRecord() && $user->employee !== null;
    }

    /**
     * Get onboarding progress for a user
     */
    public function getOnboardingProgress(User $user): array
    {
        if (!$user->isAdmin()) {
            return ['status' => 'not_applicable'];
        }

        if ($this->hasCompletedOnboarding($user)) {
            return [
                'status' => 'completed',
                'employee' => $user->employee,
                'completion_date' => $user->employee->created_at,
            ];
        }

        return [
            'status' => 'pending',
            'required_fields' => $this->getRequiredFields(),
            'message' => 'Complete your employee profile to access the system',
        ];
    }
}