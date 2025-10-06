<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Services\AdminOnboardingService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminProfileController extends Controller
{
    private AdminOnboardingService $onboardingService;

    public function __construct(AdminOnboardingService $onboardingService)
    {
        $this->onboardingService = $onboardingService;
    }

    /**
     * Show the admin profile completion form
     */
    public function show()
    {
        $user = auth()->user();
        
        // Check if user is admin and either needs onboarding OR has skipped (allow them to complete)
        if (!$user->isAdmin()) {
            return redirect()->route('dashboard')->with('error', 'Access denied.');
        }
        
        // Only redirect if profile is completely filled (not allowing partial completion edits)
        // Users can always return to edit their profile, even if they have some data
        // if ($user->hasEmployeeRecord() && !$user->hasSkippedProfileCompletion()) {
        //     return redirect()->route('dashboard')->with('success', 'Profile already completed!');
        // }

        // Get onboarding progress
        $progress = $this->onboardingService->getOnboardingProgress($user);
        
        // Get departments for dropdown
        $departments = Department::active()->orderBy('name')->get(['id', 'name', 'department_type']);

        // Determine starting step based on completion progress
        $startingStep = $this->determineStartingStep($user);

        return Inertia::render('Admin/ProfileCompletion', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'employee' => $user->employee ? [
                    'id' => $user->employee->id,
                    'firstname' => $user->employee->firstname,
                    'lastname' => $user->employee->lastname,
                    'middlename' => $user->employee->middlename,
                    'date_of_birth' => $user->employee->date_of_birth,
                    'gender' => $user->employee->gender,
                    'civil_status' => $user->employee->civil_status,
                    'nationality' => $user->employee->nationality,
                    'religion' => $user->employee->religion,
                    'email_personal' => $user->employee->email_personal,
                    'contact_number' => $user->employee->contact_number,
                    'mobile_number' => $user->employee->mobile_number,
                    'address' => $user->employee->address,
                    'city' => $user->employee->city,
                    'state' => $user->employee->state,
                    'postal_code' => $user->employee->postal_code,
                    'country' => $user->employee->country,
                    'position' => $user->employee->position,
                    'department_id' => $user->employee->department_id,
                    'date_employed' => $user->employee->date_employed,
                    'employment_type' => $user->employee->employment_type,
                    'work_schedule' => $user->employee->work_schedule,
                    'basic_salary' => $user->employee->basic_salary,
                    'hourly_rate' => $user->employee->hourly_rate,
                    'immediate_supervisor_id' => $user->employee->immediate_supervisor_id,
                    'sss_no' => $user->employee->sss_no,
                    'philhealth_no' => $user->employee->philhealth_no,
                    'tin_no' => $user->employee->tin_no,
                    'pagibig_no' => $user->employee->pagibig_no,
                    'emergency_contact_name' => $user->employee->emergency_contact_name,
                    'emergency_contact_relationship' => $user->employee->emergency_contact_relationship,
                    'emergency_contact_number' => $user->employee->emergency_contact_number,
                    'emergency_contact_address' => $user->employee->emergency_contact_address,
                ] : null,
            ],
            'progress' => $progress,
            'departments' => $departments,
            'initialStep' => $startingStep,
        ]);
    }

    /**
     * Determine which step the user should start from based on their completion progress
     */
    private function determineStartingStep($user)
    {
        // If no employee record exists, start from step 1
        if (!$user->employee) {
            return 1;
        }

        $employee = $user->employee;

        // Step 1 fields (Personal Information)
        $step1Fields = [
            'firstname', 'lastname', 'date_of_birth', 'place_of_birth',
            'gender', 'civil_status'
        ];

        // Check if step 1 is complete
        $step1Complete = true;
        foreach ($step1Fields as $field) {
            // For required fields, check if they are not null and not empty
            if (is_null($employee->$field) || $employee->$field === '') {
                $step1Complete = false;
                break;
            }
        }

        // If step 1 is not complete, start from step 1
        if (!$step1Complete) {
            return 1;
        }

        // Step 2 fields (Contact Information)
        $step2Fields = [
            'email_personal', 'contact_number', 'address'
        ];

        // Check if step 2 is complete
        $step2Complete = true;
        foreach ($step2Fields as $field) {
            if (is_null($employee->$field) || $employee->$field === '') {
                $step2Complete = false;
                break;
            }
        }

        // If step 2 is not complete, start from step 2
        if (!$step2Complete) {
            return 2;
        }

        // Step 3 fields (Employment Information)
        $step3Fields = [
            'position', 'department_id', 'date_employed', 
            'employment_type'
        ];

        // Check if step 3 is complete
        $step3Complete = true;
        foreach ($step3Fields as $field) {
            if (is_null($employee->$field) || $employee->$field === '') {
                $step3Complete = false;
                break;
            }
        }

        // If step 3 is not complete, start from step 3
        if (!$step3Complete) {
            return 3;
        }

        // Step 4 fields (Government IDs and Emergency Contact)
        $step4Fields = [
            'sss_no', 'philhealth_no', 'tin_no', 'pagibig_no',
            'emergency_contact_name', 'emergency_contact_relationship', 
            'emergency_contact_number'
        ];

        // Check if step 4 is complete
        $step4Complete = true;
        foreach ($step4Fields as $field) {
            if (is_null($employee->$field) || $employee->$field === '') {
                $step4Complete = false;
                break;
            }
        }

        // If step 4 is not complete, start from step 4
        if (!$step4Complete) {
            return 4;
        }

        // If all steps are complete, still go to step 1 (shouldn't happen in practice)
        return 1;
    }

    /**
     * Process the admin profile completion form
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        // Check if user needs onboarding
        if (!$this->onboardingService->requiresOnboarding($user)) {
            return redirect()->route('dashboard')->with('success', 'Profile already completed!');
        }

        // Validate the employee data
        $validated = $request->validate([
            // Personal Information
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'place_of_birth' => 'required|string|max:255',
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'civil_status' => ['required', Rule::in(['single', 'married', 'divorced', 'widowed', 'separated'])],
            'nationality' => 'required|string|max:100',
            'religion' => 'nullable|string|max:100',
            
            // Contact Information
            'email' => 'required|email|max:255',
            'phone_number' => 'required|string|max:20',
            'mobile_number' => 'nullable|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            
            // Employment Information
            'position' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'hire_date' => 'required|date',
            'employment_type' => ['required', Rule::in(['regular', 'contractual', 'probationary', 'consultant'])],
            'work_schedule' => ['required', Rule::in(['day-shift', 'night-shift', 'rotating', 'flexible'])],
            'basic_salary' => 'required|numeric|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'supervisor_id' => 'nullable|exists:employees,id',
            
            // Government IDs
            'sss_number' => 'nullable|string|max:50',
            'philhealth_number' => 'nullable|string|max:50',
            'tin_number' => 'nullable|string|max:50',
            'pag_ibig_number' => 'nullable|string|max:50',
            
            // Emergency Contact
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_relationship' => 'required|string|max:100',
            'emergency_contact_phone' => 'required|string|max:20',
            'emergency_contact_address' => 'nullable|string|max:500',
        ]);

        try {
            // Map form field names to Employee model field names for final submission
            $fieldMap = [
                'first_name' => 'firstname',
                'last_name' => 'lastname',
                'middle_name' => 'middlename',
                'phone_number' => 'contact_number',
                'hire_date' => 'date_employed',
                'sss_number' => 'sss_no',
                'philhealth_number' => 'philhealth_no',
                'tin_number' => 'tin_no',
                'pag_ibig_number' => 'pagibig_no',
                'email' => 'email_personal',
                'supervisor_id' => 'immediate_supervisor_id',
                'emergency_contact_phone' => 'emergency_contact_number',
                'emergency_contact_address' => 'emergency_contact_address',
            ];

            $mappedData = [];
            foreach ($validated as $field => $value) {
                $mappedField = isset($fieldMap[$field]) ? $fieldMap[$field] : $field;
                $mappedData[$mappedField] = $value;
            }

            // Create employee record for admin with mapped data
            $employee = $this->onboardingService->createEmployeeForAdmin($user, $mappedData);
            
            return redirect()->route('dashboard')->with('success', 
                'Profile completed successfully! Welcome to the SyncingSteel System.');
                
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to complete profile: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Skip profile completion for now
     */
    public function skip()
    {
        $user = auth()->user();
        
        // Check if user is admin and needs onboarding
        if (!$user->isAdmin()) {
            return redirect()->route('dashboard');
        }

        // Mark profile completion as skipped
        $user->markProfileCompletionSkipped();
        
        return redirect()->route('dashboard')->with('info', 
            'Profile completion skipped. You can complete it later from your account settings.');
    }

    /**
     * Save partial profile completion progress
     */
    public function saveProgress(Request $request)
    {
        // Debug logging
        \Log::info('SaveProgress called', [
            'user_id' => auth()->id(),
            'request_data' => $request->all(),
            'timestamp' => now()
        ]);

        $user = auth()->user();
        
        // Check if user is admin
        if (!$user->isAdmin()) {
            \Log::error('SaveProgress access denied', ['user_id' => $user->id]);
            return response()->json(['error' => 'Access denied'], 403);
        }

        // Reset the "skipped" flag if user is now actively completing their profile
        if ($user->profile_completion_skipped) {
            $user->profile_completion_skipped = false;
            $user->save();
            \Log::info('Reset profile_completion_skipped flag', ['user_id' => $user->id]);
        }

        // Reload the user relationship to ensure we have the latest employee record
        $user->load('employee');
        
        // If user already has an employee record, update it; otherwise create new one
        if ($user->employee) {
            $employee = $user->employee;
            \Log::info('Updating existing employee', ['employee_id' => $employee->id]);
        } else {
            // Create new employee record
            $employee = new \App\Models\Employee();
            $employee->user_id = $user->id;
            $employee->created_by = $user->id;
            $employee->updated_by = $user->id;
            // Set default status
            $employee->status = 'active';
            \Log::info('Creating new employee record', ['user_id' => $user->id]);
        }

        // Get the submitted data and only update non-empty fields
        $submittedData = $request->all();
        
        // Map form field names to Employee model field names
        $fieldMap = [
            'first_name' => 'firstname',
            'last_name' => 'lastname',
            'middle_name' => 'middlename',
            'phone_number' => 'contact_number',
            'hire_date' => 'date_employed',
            'sss_number' => 'sss_no',
            'philhealth_number' => 'philhealth_no',
            'tin_number' => 'tin_no',
            'pag_ibig_number' => 'pagibig_no',
            'email' => 'email_personal',
            'supervisor_id' => 'immediate_supervisor_id',
            'emergency_contact_phone' => 'emergency_contact_number',
        ];

        // Remove empty values and map field names
        $dataToUpdate = [];
        $skippedFields = [];
        foreach ($submittedData as $field => $value) {
            if ($value !== null && $value !== '') {
                $mappedField = isset($fieldMap[$field]) ? $fieldMap[$field] : $field;
                if (in_array($mappedField, $employee->getFillable())) {
                    $dataToUpdate[$mappedField] = $value;
                } else {
                    $skippedFields[] = $field . ' (mapped to: ' . $mappedField . ')';
                }
            }
        }

        \Log::info('Field mapping results', [
            'fields_to_update' => array_keys($dataToUpdate),
            'skipped_fields' => $skippedFields,
            'employee_fillable' => $employee->getFillable()
        ]);

        // Update employee with the new data
        foreach ($dataToUpdate as $field => $value) {
            $employee->$field = $value;
        }
        
        // Set updated_by for existing records
        if ($employee->exists) {
            $employee->updated_by = $user->id;
        }

        // Save the employee record
        try {
            $employee->save();
            \Log::info('Employee saved successfully', [
                'employee_id' => $employee->id, 
                'user_id' => $user->id,
                'is_new' => !$employee->wasRecentlyCreated,
                'updated_fields' => array_keys($dataToUpdate)
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to save employee', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'data' => $dataToUpdate
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Failed to save employee: ' . $e->getMessage()
            ], 500);
        }

        // Update user's employee_id if this is a new employee
        if (!$user->employee_id && $employee->id) {
            $user->employee_id = $employee->id;
            \Log::info('Linking employee to user', ['user_id' => $user->id, 'employee_id' => $employee->id]);
        }
        
        // Update user's department_id if provided
        if (isset($dataToUpdate['department_id']) && $dataToUpdate['department_id']) {
            $user->department_id = $dataToUpdate['department_id'];
        }
        
        $user->save();
        \Log::info('User updated', ['user_id' => $user->id, 'employee_id' => $user->employee_id]);

        return response()->json([
            'success' => true,
            'message' => 'Progress saved successfully'
        ]);
    }
}
