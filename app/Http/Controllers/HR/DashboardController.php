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

        $showModal = false;
        if ($userOnboarding && isset($userOnboarding->status)) {
            $showModal = $userOnboarding->status !== 'skipped';
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
