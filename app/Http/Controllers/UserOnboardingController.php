<?php

namespace App\Http\Controllers;

use App\Services\UserOnboardingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserOnboardingController extends Controller
{
    protected UserOnboardingService $service;

    public function __construct(UserOnboardingService $service)
    {
        $this->service = $service;
    }

    /**
     * Return current user's onboarding status (or for the supplied user if authorized)
     */
    public function show(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $data = $this->service->getForUser($user->id);

        if ($request->header('X-Inertia')) {
            // DashboardController usually handles rendering; return JSON payload for Inertia requests
            return response()->json(['userOnboarding' => $data]);
        }

        return response()->json(['userOnboarding' => $data]);
    }

    /**
     * Start or update onboarding for current user
     */
    public function update(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $payload = $request->validate([
            'status' => 'nullable|in:pending,in_progress,completed,skipped',
            'checklist_json' => 'nullable|json',
            'metadata' => 'nullable|json',
        ]);

        // Convert JSON strings to arrays where applicable
        if (isset($payload['checklist_json']) && is_string($payload['checklist_json'])) {
            $payload['checklist_json'] = json_decode($payload['checklist_json'], true);
        }
        if (isset($payload['metadata']) && is_string($payload['metadata'])) {
            $payload['metadata'] = json_decode($payload['metadata'], true);
        }

        $result = $this->service->start($user->id, $payload);

        return response()->json(['userOnboarding' => $result]);
    }

    /**
     * Skip onboarding for current user
     */
    public function skip(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $payload = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        $result = $this->service->skip($user->id, $user->id, $payload['reason'] ?? null);

        // For Inertia clients, return a redirect response to avoid plain JSON being handled incorrectly
        if ($request->header('X-Inertia')) {
            return redirect()->route('dashboard');
        }

        return response()->json(['userOnboarding' => $result]);
    }
}
