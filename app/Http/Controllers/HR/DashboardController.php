<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Repositories\SystemOnboardingRepository;
use App\Services\UserOnboardingService;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Read system onboarding
        $repo = app(SystemOnboardingRepository::class);
        $systemOnboarding = null;
        try {
            $systemOnboarding = $repo->findLatest();
        } catch (\Throwable $e) {
            $systemOnboarding = null;
        }

        // Per-user onboarding
        $userOnboarding = null;
        try {
            $userOnboarding = app(UserOnboardingService::class)->getForUser($request->user()->id);
        } catch (\Throwable $e) {
            $userOnboarding = null;
        }

        // If no per-user onboarding row exists or it lacks a checklist, generate one from the user's profile
        try {
            $currentUser = $request->user();
            $service = app(UserOnboardingService::class);
            if ($currentUser && ! $currentUser->isSuperadmin()) {
                if (! $userOnboarding) {
                    $generated = $service->generateChecklistForUser($currentUser);
                    $userOnboarding = (object) [
                        'id' => null,
                        'user_id' => $currentUser->id,
                        'status' => 'pending',
                        'checklist_json' => $generated,
                    ];
                } else {
                    if (empty($userOnboarding->checklist_json)) {
                        $userOnboarding->checklist_json = $service->generateChecklistForUser($currentUser);
                    } elseif (is_string($userOnboarding->checklist_json)) {
                        $decoded = json_decode($userOnboarding->checklist_json, true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $userOnboarding->checklist_json = $decoded;
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            // ignore generation errors
        }

        // Show the setup modal for new users or when onboarding is pending/in_progress.
        $showModal = false;
        try {
            $u = $request->user();
            if ($u && $u->isSuperadmin()) {
                $showModal = false;
            } else {
                if ($userOnboarding && isset($userOnboarding->status)) {
                    // Show modal for pending, in_progress or skipped so users who skipped
                    // are reminded to continue onboarding on next login.
                    $showModal = in_array($userOnboarding->status, ['pending', 'in_progress', 'skipped'], true);
                } else {
                    // No onboarding record — show modal for freshly-created accounts
                    $showModal = true;
                }
            }
        } catch (\Throwable $e) {
            $showModal = false;
        }

        $canCompleteOnboarding = false;
        try {
            $u = $request->user();
            if ($u) {
                $canCompleteOnboarding = $u->hasRole('Superadmin') || $u->hasRole('Admin') || $u->hasRole('HR Manager') || $u->can('system.onboarding.manage');
            }
        } catch (\Throwable $e) {
            $canCompleteOnboarding = false;
        }

        $data = [
            'systemOnboarding' => $systemOnboarding,
            'userOnboarding' => $userOnboarding,
            'showSetupModal' => $showModal,
            'canCompleteOnboarding' => $canCompleteOnboarding,
        ];

        return Inertia::render('HR/Dashboard', $data);
    }
}
