<?php

namespace App\Http\Controllers\System\Onboarding;

use App\Http\Controllers\Controller;
use App\Services\System\Organization\SystemOnboardingService;
use App\Models\SystemSetting;
use App\Models\SecurityAuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SystemOnboardingController extends Controller
{
    protected SystemOnboardingService $service;

    public function __construct(SystemOnboardingService $service)
    {
        $this->service = $service;
    }

    /**
     * PHASE 1: Initialize system with company profile (for first-time superadmin login)
     * Creates system_settings and marks onboarding as in_progress
     * 
     * Authorization: Super Admin role only
     */
    public function initializeCompany(Request $request)
    {
        // Check authorization - Super Admin only
        $this->authorize('system.onboarding.initialize');

        $validated = $request->validate([
            'company_name' => 'required|string|min:2|max:255',
            'company_reg_number' => 'nullable|string|max:50',
            'country' => 'required|string|in:PH,US,SG,TH,JP',
            'timezone' => 'required|string|timezone',
            'currency' => 'required|string|in:PHP,USD,SGD,THB,JPY',
            'fiscal_year_start_month' => 'required|integer|min:1|max:12',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                // Store company settings
                SystemSetting::updateOrCreate(
                    ['key' => 'company_name'],
                    ['value' => $validated['company_name'], 'updated_by' => auth()->id()]
                );

                SystemSetting::updateOrCreate(
                    ['key' => 'company_registration_number'],
                    ['value' => $validated['company_reg_number'] ?? null, 'updated_by' => auth()->id()]
                );

                SystemSetting::updateOrCreate(
                    ['key' => 'country'],
                    ['value' => $validated['country'], 'updated_by' => auth()->id()]
                );

                SystemSetting::updateOrCreate(
                    ['key' => 'timezone'],
                    ['value' => $validated['timezone'], 'updated_by' => auth()->id()]
                );

                SystemSetting::updateOrCreate(
                    ['key' => 'currency'],
                    ['value' => $validated['currency'], 'updated_by' => auth()->id()]
                );

                SystemSetting::updateOrCreate(
                    ['key' => 'fiscal_year_start_month'],
                    ['value' => (string) $validated['fiscal_year_start_month'], 'updated_by' => auth()->id()]
                );

                // Mark onboarding as started
                SystemSetting::updateOrCreate(
                    ['key' => 'onboarding_status'],
                    ['value' => 'in_progress', 'updated_by' => auth()->id()]
                );

                SystemSetting::updateOrCreate(
                    ['key' => 'onboarding_started_at'],
                    ['value' => now()->toIso8601String(), 'updated_by' => auth()->id()]
                );

                // Initialize empty completed tasks
                SystemSetting::updateOrCreate(
                    ['key' => 'onboarding_completed_tasks'],
                    ['value' => json_encode([]), 'updated_by' => auth()->id()]
                );

                // Log audit trail
                SecurityAuditLog::create([
                    'user_id' => auth()->id(),
                    'action' => 'system_onboarding_initialize',
                    'description' => 'Initialized system with company profile: ' . $validated['company_name'],
                    'metadata' => [
                        'company_name' => $validated['company_name'],
                        'country' => $validated['country'],
                        'timezone' => $validated['timezone'],
                        'currency' => $validated['currency'],
                    ],
                ]);

                return response()->json([
                    'message' => 'System initialized successfully',
                    'redirect' => '/system/organization/overview',
                ], 201);
            });
        } catch (\Exception $e) {
            // Log error
            SecurityAuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'system_onboarding_initialize_failed',
                'description' => 'Failed to initialize system: ' . $e->getMessage(),
                'metadata' => ['error' => $e->getMessage()],
            ]);

            return response()->json([
                'message' => 'Failed to initialize system',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get current onboarding status
     */
    public function getStatus()
    {
        $onboardingStatus = SystemSetting::where('key', 'onboarding_status')->value('value') ?? 'not_started';

        return response()->json([
            'status' => $onboardingStatus,
            'company_name' => SystemSetting::where('key', 'company_name')->value('value'),
            'country' => SystemSetting::where('key', 'country')->value('value'),
            'timezone' => SystemSetting::where('key', 'timezone')->value('value'),
            'currency' => SystemSetting::where('key', 'currency')->value('value'),
            'fiscal_year_start_month' => SystemSetting::where('key', 'fiscal_year_start_month')->value('value'),
        ]);
    }

    /**
     * PHASE 1 LEGACY: Initialize System (Super Admin only)
     */
    public function initialize(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'timezone'     => 'required|string',
            'currency'     => 'required|string',
            // Add more system identity rules
        ]);

        // Yes, an actual user must trigger this. Wild concept.
        $userId = auth()->id();

        $id = $this->service->initializeSystem($validated, $userId);

        return response()->json([
            'message' => 'System onboarding initialized',
            'id' => $id,
        ], 201);
    }

    /**
     * PHASE 2 & 3: Transition workflow ownership downstream
     */
    public function transition(Request $request, int $id)
    {
        $validated = $request->validate([
            'next_role' => 'required|string|in:office_admin,hr_manager',
        ]);

        $this->service->transition($id, $validated['next_role']);

        return response()->json([
            'message' => 'Workflow transitioned',
            'id' => $id,
        ]);
    }

    /**
     * PHASE 4: Mark onboarding complete and unlock system
     */
    public function complete(int $id)
    {
        $this->service->complete($id);

        return response()->json([
            'message' => 'Onboarding workflow completed',
            'id' => $id,
        ]);
    }
}
