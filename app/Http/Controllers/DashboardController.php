<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\AdminOnboardingService;
use App\Models\EmployeeDraft;

class DashboardController extends Controller
{

    /**
     * Get missing profile fields for the user
     */
    private function getMissingProfileFields($user)
    {
        if (!$user->hasEmployeeRecord()) {
            return ['All profile information needs to be completed'];
        }

        $employee = $user->employee;
        $missing = [];

        $fieldLabels = [
            'firstname' => 'First Name',
            'lastname' => 'Last Name',
            'date_of_birth' => 'Date of Birth',
            'gender' => 'Gender',
            'civil_status' => 'Civil Status',
            'contact_number' => 'Phone Number',
            'address' => 'Address',
            'position' => 'Position',
            'department_id' => 'Department',
            'date_employed' => 'Hire Date',
            'employment_type' => 'Employment Type',
            'emergency_contact_name' => 'Emergency Contact Name',
            'emergency_contact_relationship' => 'Emergency Contact Relationship',
            'emergency_contact_number' => 'Emergency Contact Phone',
        ];

        foreach ($fieldLabels as $field => $label) {
            if (empty($employee->$field)) {
                $missing[] = $label;
            }
        }

        return $missing;
    }
    /**
     * Calculate profile completion percentage for users with an employee record
     */
    private function calculateProfileCompletionPercentage($user)
    {
        // If user has no employee record, they need to complete profile
        if (!$user->hasEmployeeRecord()) {
            return [
                'percentage' => 0,
                'status' => 'incomplete',
                'message' => 'Please complete your profile to access all system features.',
                'missingFields' => $this->getMissingProfileFields($user),
            ];
        }

        // User has employee record - calculate completion based on filled fields
        $employee = $user->employee;
        $totalFields = 17; // Total number of important fields (16 required + 1 optional = 17)
        $filledFields = 0;

        // Check required fields (using Employee model field names that exist in database)
        $fieldsToCheck = [
            'firstname', 'lastname', 'date_of_birth', 'place_of_birth', 'gender', 'civil_status',
            'email_personal', 'contact_number', 'address', 'position', 'department_id',
            'date_employed', 'employment_type', 'emergency_contact_name',
            'emergency_contact_relationship', 'emergency_contact_number'
        ];

        foreach ($fieldsToCheck as $field) {
            if (!empty($employee->$field)) {
                $filledFields++;
            }
        }

        // Check optional fields (with lower weight)
        $optionalFields = ['middlename'];
        foreach ($optionalFields as $field) {
            if (!empty($employee->$field)) {
                $filledFields += 1;
            }
        }

        $percentage = min(100, round(($filledFields / $totalFields) * 100));

        // Determine status and message based on percentage and skip status
        if ($user->hasSkippedProfileCompletion()) {
            // User has skipped but may have partial data
            if ($percentage > 0) {
                return [
                    'percentage' => $percentage,
                    'status' => 'skipped_partial',
                    'message' => "You have {$percentage}% profile completion. Complete the remaining fields to unlock all features.",
                    'missingFields' => $this->getMissingProfileFields($user),
                ];
            } else {
                return [
                    'percentage' => 0,
                    'status' => 'skipped',
                    'message' => 'Profile completion was skipped. You can complete it anytime to unlock all features.',
                    'missingFields' => $this->getMissingProfileFields($user),
                ];
            }
        }

        return [
            'percentage' => $percentage,
            'status' => $percentage >= 100 ? 'complete' : 'partial',
            'message' => $percentage >= 100 ?
                'Your profile is complete!' :
                "Your profile is {$percentage}% complete. Complete it to unlock all features.",
            'missingFields' => $this->getMissingProfileFields($user),
        ];
    }
    protected $onboardingService;

    public function __construct(AdminOnboardingService $onboardingService)
    {
        $this->onboardingService = $onboardingService;
    }

    /**
     * Display the dashboard
     */
    public function index()
    {
        $user = auth()->user();
        $needsProfileCompletion = $this->onboardingService->requiresOnboarding($user);

        // Check for onboarding draft
        $draft = EmployeeDraft::where('user_id', $user->id)->first();
        $onboardingDraft = $draft ? [
            'step_completed' => $draft->step_completed,
            'updated_at' => $draft->updated_at,
        ] : null;

        // Calculate profile completion percentage
        $profileCompletion = null;
        if (!$user->hasEmployeeRecord() && $draft) {
            // Log the draft data for debugging
            \Log::info('EmployeeDraft data for user_id ' . $user->id, ['data' => $draft->data]);
            // Calculate completion from draft data
            $profileCompletion = $this->calculateDraftProfileCompletion($draft->data, $user);
        } else {
            $profileCompletion = $this->calculateProfileCompletionPercentage($user);
        }

        return Inertia::render('Dashboard', [
            'needsProfileCompletion' => $needsProfileCompletion,
            'profileCompletionUrl' => route('admin.profile.complete'),
            'profileCompletion' => $profileCompletion,
            'onboardingDraft' => $onboardingDraft,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'isAdmin' => $user->isAdmin(),
                'hasEmployeeRecord' => $user->hasEmployeeRecord(),
                'hasSkippedProfile' => $user->hasSkippedProfileCompletion(),
                'employee' => $user->employee ? [
                    'id' => $user->employee->id,
                    'employee_number' => $user->employee->employee_number,
                    'first_name' => $user->employee->firstname,
                    'last_name' => $user->employee->lastname,
                    'position' => $user->employee->position,
                    'department' => $user->employee->department ? [
                        'id' => $user->employee->department->id,
                        'name' => $user->employee->department->name,
                        'type' => $user->employee->department->type,
                    ] : null,
                    'hire_date' => $user->employee->date_employed,
                    'employment_type' => $user->employee->employment_type,
                    'email' => $user->employee->email_personal,
                    'phone_number' => $user->employee->contact_number,
                ] : null,
            ],
        ]);
    }

    /**
     * Calculate profile completion percentage from onboarding draft data
     */
    private function calculateDraftProfileCompletion($draftData, $user)
    {
        // Map draft keys to employee model keys for required fields
        $fieldMap = [
            // Personal Information
            'first_name' => 'firstname',
            'last_name' => 'lastname',
            'middle_name' => 'middlename',
            'date_of_birth' => 'date_of_birth',
            'place_of_birth' => 'place_of_birth',
            'gender' => 'gender',
            'civil_status' => 'civil_status',
            // Contact Information
            'email' => 'email_personal',
            'phone_number' => 'contact_number',
            'address' => 'address',
            'city' => 'city',
            'state' => 'state',
            'postal_code' => 'postal_code',
            'country' => 'country',
            // Employment Information
            'position' => 'position',
            'department_id' => 'department_id',
            'hire_date' => 'date_employed',
            'employment_type' => 'employment_type',
            'work_schedule' => 'work_schedule',
            'basic_salary' => 'basic_salary',
            'hourly_rate' => 'hourly_rate',
            'supervisor_id' => 'immediate_supervisor_id',
            // Government IDs
            'sss_number' => 'sss_no',
            'philhealth_number' => 'philhealth_no',
            'tin_number' => 'tin_no',
            'pag_ibig_number' => 'pagibig_no',
            // Emergency Contact
            'emergency_contact_name' => 'emergency_contact_name',
            'emergency_contact_relationship' => 'emergency_contact_relationship',
            'emergency_contact_phone' => 'emergency_contact_number',
            'emergency_contact_address' => 'emergency_contact_address',
        ];

        // Required fields for completion (same as in calculateProfileCompletionPercentage)
        $fieldsToCheck = [
            'firstname', 'lastname', 'date_of_birth', 'place_of_birth', 'gender', 'civil_status',
            'email_personal', 'contact_number', 'address', 'position', 'department_id', 
            'date_employed', 'employment_type', 'emergency_contact_name',
            'emergency_contact_relationship', 'emergency_contact_number'
        ];
        $optionalFields = ['middlename'];
        $totalFields = 17;
        $filledFields = 0;

        // Map draft data to employee keys
        $employeeData = [];
        foreach ($fieldMap as $draftKey => $employeeKey) {
            if (isset($draftData[$draftKey])) {
                $employeeData[$employeeKey] = $draftData[$draftKey];
            }
        }

        foreach ($fieldsToCheck as $field) {
            if (!empty($employeeData[$field])) {
                $filledFields++;
            }
        }
        foreach ($optionalFields as $field) {
            if (!empty($employeeData[$field])) {
                $filledFields += 1;
            }
        }

        $percentage = min(100, round(($filledFields / $totalFields) * 100));

        // Get missing fields
        $fieldLabels = [
            'firstname' => 'First Name',
            'lastname' => 'Last Name',
            'date_of_birth' => 'Date of Birth',
            'gender' => 'Gender',
            'civil_status' => 'Civil Status',
            'contact_number' => 'Phone Number',
            'address' => 'Address',
            'position' => 'Position',
            'department_id' => 'Department',
            'date_employed' => 'Hire Date',
            'employment_type' => 'Employment Type',
            'emergency_contact_name' => 'Emergency Contact Name',
            'emergency_contact_relationship' => 'Emergency Contact Relationship',
            'emergency_contact_number' => 'Emergency Contact Phone',
        ];
        $missing = [];
        foreach ($fieldLabels as $field => $label) {
            if (empty($employeeData[$field])) {
                $missing[] = $label;
            }
        }

        return [
            'percentage' => $percentage,
            'status' => $percentage >= 100 ? 'complete' : 'partial',
            'message' => $percentage >= 100 ?
                'Your profile draft is complete! Please submit to finalize.' :
                "Your profile draft is {$percentage}% complete. Complete it to unlock all features.",
            'missingFields' => $missing,
        ];
    }
}