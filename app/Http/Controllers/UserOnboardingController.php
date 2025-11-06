<?php

namespace App\Http\Controllers;

use App\Services\UserOnboardingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Profile;

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

        // For Inertia clients (browser), return a redirect so Inertia receives a
        // proper Inertia response instead of plain JSON. Non-Inertia/API clients
        // can receive JSON.
        if ($request->header('X-Inertia')) {
            // Redirect back to the dashboard so the Inertia page will re-render
            // with updated props. Use a 303 for non-GET semantics (handled by
            // the Inertia client automatically).
            return redirect()->route('dashboard');
        }

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

    /**
     * Render the onboarding page (Inertia)
     */
    public function page(Request $request): Response
    {
        $user = $request->user();

        $userOnboarding = null;
        try {
            $userOnboarding = $this->service->getForUser($user->id);
        } catch (\Throwable $e) {
            $userOnboarding = null;
        }

        // If no row exists, generate checklist but do not persist yet
        if (! $userOnboarding) {
            $generated = $this->service->generateChecklistForUser($user);
            $userOnboarding = (object) [
                'id' => null,
                'user_id' => $user->id,
                'status' => 'pending',
                'checklist_json' => $generated,
            ];
        } elseif (is_string($userOnboarding->checklist_json)) {
            $decoded = json_decode($userOnboarding->checklist_json, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $userOnboarding->checklist_json = $decoded;
            }
        }

        return Inertia::render('Onboarding', [
            'userOnboarding' => $userOnboarding,
        ]);
    }

    /**
     * Complete a single onboarding step. Accepts 'step' and optional data.
     */
    public function completeStep(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $payload = $request->validate([
            'step' => 'required|string',
            'data' => 'nullable|array',
        ]);

        $step = $payload['step'];
        $data = $payload['data'] ?? [];

        // Support steps that write into the profiles table
        try {
            if (in_array($step, ['phone', 'address', 'emergency_contact', 'name'], true)) {
                if ($step === 'name') {
                    // Save user's name on users table (profile generator will prefer profile values)
                    $user->name = trim((string) ($data['name'] ?? $user->name));
                    $user->save();
                } else {
                    $profile = $user->profile()->first() ?? new Profile();
                    $profile->user_id = $user->id;
                    if ($step === 'phone') {
                        $profile->contact_number = $data['contact_number'] ?? $profile->contact_number;
                    } elseif ($step === 'address') {
                        $profile->address = $data['address'] ?? $profile->address;
                    } elseif ($step === 'emergency_contact') {
                        $profile->emergency_contact = $data['emergency_contact'] ?? $profile->emergency_contact;
                    }
                    $profile->save();
                }
            }
        } catch (\Throwable $e) {
            // ignore write failures for now
        }

        // Regenerate and persist checklist
        try {
            $checklist = $this->service->generateChecklistForUser($user);
            $this->service->start($user->id, ['checklist_json' => $checklist]);
        } catch (\Throwable $e) {
            // log? ignore
        }

        // For Inertia clients redirect back to onboarding page
        if ($request->header('X-Inertia')) {
            return redirect()->route('onboarding.page');
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Finalize onboarding if checklist is 100% complete
     */
    public function complete(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $checklist = $this->service->generateChecklistForUser($user);
        $total = count($checklist);
        $completed = 0;
        foreach ($checklist as $it) {
            if (is_array($it) || is_object($it)) {
                $done = $it['done'] ?? $it->done ?? false;
            } else {
                $done = false;
            }
            if ($done) $completed++;
        }

        $percent = $total > 0 ? (int) round(($completed / $total) * 100) : 0;

        if ($percent < 100) {
            if ($request->header('X-Inertia')) {
                return redirect()->route('onboarding.page')->with('error', 'Please complete all steps before finalizing onboarding.');
            }
            return response()->json(['message' => 'Incomplete'], 422);
        }

        $this->service->complete($user->id);

        if ($request->header('X-Inertia')) {
            return redirect()->route('dashboard');
        }

        return response()->json(['ok' => true]);
    }
}
