<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\SystemOnboardingRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use App\Services\UserOnboardingService;

class DashboardController extends Controller
{
	/**
	 * Show the superadmin dashboard.
	 */
	public function index(Request $request)
	{
		// Compute real values for a single-organization app.
		$counts = [
			'users' => User::count(),
		];

		// Read company name from a simple settings table if present. The codebase sometimes uses 'settings' for key/value.
		$companyName = null;
		try {
			if (Schema::hasTable('settings')) {
				$companyName = DB::table('settings')->where('key', 'company.name')->value('value');
			}
		} catch (\Exception $e) {
			$companyName = null;
		}

		// Get onboarding status from repository if available
		$repo = app(SystemOnboardingRepository::class);
		$onboarding = null;
		try {
			$onboarding = $repo->findLatest();
		} catch (\Exception $e) {
			$onboarding = null;
		}

		$onboardingStatus = $onboarding->status ?? 'not_configured';

		// Per-user onboarding (profile) — show modal when user's onboarding is not skipped
		$userOnboarding = null;
		try {
			$userOnboarding = app(UserOnboardingService::class)->getForUser($request->user()->id);
		} catch (\Throwable $e) {
			$userOnboarding = null;
		}

		// Show the setup modal when the user hasn't skipped onboarding.
		// Treat a missing per-user onboarding row as the user not having completed onboarding
		// so the modal will appear for freshly-migrated environments.
		$showByUserOnboarding = false;
		if ($userOnboarding && isset($userOnboarding->status)) {
			$showByUserOnboarding = in_array($userOnboarding->status, ['pending', 'in_progress'], true);
		} else {
			// no onboarding record — treat as new user and show the modal
			$showByUserOnboarding = true;
		}

		// Determine whether the current user may complete system onboarding
		$canCompleteOnboarding = false;
		try {
			$u = $request->user();
			if ($u) {
				$canCompleteOnboarding = $u->hasRole('Superadmin') || $u->hasRole('Admin') || $u->can('system.onboarding.manage');
			}
		} catch (\Throwable $e) {
			$canCompleteOnboarding = false;
		}

		$data = [
			'counts' => $counts,
			'company' => [
				'name' => $companyName,
			],
			'systemOnboarding' => $onboarding,
			'userOnboarding' => $userOnboarding,
			'onboardingStatus' => $onboardingStatus,
			'showSetupModal' => $showByUserOnboarding,
			'canCompleteOnboarding' => $canCompleteOnboarding,
			'welcomeText' => 'Welcome to the Superadmin dashboard — manage platform settings and users from here.',
		];

		return Inertia::render('System/Dashboard', $data);
	}
}