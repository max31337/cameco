<?php

namespace App\Http\Controllers\System\Onboarding;

use App\Http\Controllers\Controller;
use App\Services\System\SystemOnboardingService;
use Illuminate\Http\Request;

class SystemOnboardingController extends Controller
{
    protected SystemOnboardingService $service;

    public function __construct(SystemOnboardingService $service)
    {
        $this->service = $service;
    }

    /**
     * PHASE 1: Initialize System (Super Admin only)
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
