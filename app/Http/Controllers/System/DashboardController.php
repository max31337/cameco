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

		// If no per-user onboarding row exists or it lacks a checklist, generate a checklist from profile
		// so fresh users see meaningful onboarding items. Do not force this for Superadmins (they manage system onboarding).
		try {
			$currentUser = $request->user();
			if ($currentUser && ! $currentUser->isSuperadmin()) {
				$service = app(UserOnboardingService::class);
				if (! $userOnboarding) {
					$generated = $service->generateChecklistForUser($currentUser);
					$userOnboarding = (object) [
						'id' => null,
						'user_id' => $currentUser->id,
						'status' => 'pending',
						'checklist_json' => $generated,
					];
				} else {
					// ensure checklist_json is available as decoded array
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
			// ignore generation errors and fall back to existing behavior
		}

		// Show the setup modal when the user hasn't skipped onboarding.
		// For Superadmins we do not show the per-user onboarding modal (they have system onboarding responsibilities).
		$showByUserOnboarding = false;
		try {
			$u = $request->user();
			if ($u && $u->isSuperadmin()) {
				$showByUserOnboarding = false;
			} else {
				if ($userOnboarding && isset($userOnboarding->status)) {
					// Show modal for pending, in_progress or skipped so users who skipped
					// are reminded to continue onboarding on next login.
					$showByUserOnboarding = in_array($userOnboarding->status, ['pending', 'in_progress', 'skipped'], true);
				} else {
					$showByUserOnboarding = true;
				}
			}
		} catch (\Throwable $e) {
			$showByUserOnboarding = false;
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