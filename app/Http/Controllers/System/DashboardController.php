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

		// If no per-user onboarding row exists, generate placeholder checklist for Superadmin
		// This allows fresh Superadmin users to see meaningful onboarding items
		if (!$userOnboarding || empty($userOnboarding->checklist_json)) {
			$currentUser = $request->user();
			
			// Helper function to safely get route or return fallback
			$safeRoute = function($routeName, $fallback = '#') {
				try {
					return \Illuminate\Support\Facades\Route::has($routeName) 
						? route($routeName) 
						: $fallback;
				} catch (\Exception $e) {
					return $fallback;
				}
			};
			
			// Generate placeholder checklist for demonstration
			$placeholderChecklist = [
				[
					'id' => 'profile_complete',
					'title' => 'Complete Your Profile',
					'description' => 'Add your full name, contact information, and emergency contact details',
					'completed' => !empty($currentUser->profile),
					'action_url' => $safeRoute('profile.show', '/settings/profile'),
					'action_label' => 'Update Profile',
					'required' => true,
				],
				[
					'id' => 'password_set',
					'title' => 'Set a Strong Password',
					'description' => 'Ensure your account is secured with a strong password',
					'completed' => !empty($currentUser->password),
					'action_url' => $safeRoute('password.show', '/settings/password'),
					'action_label' => 'Change Password',
					'required' => true,
				],
				[
					'id' => 'two_factor_enabled',
					'title' => 'Enable Two-Factor Authentication',
					'description' => 'Add an extra layer of security to your Superadmin account',
					'completed' => $currentUser->two_factor_secret !== null,
					'action_url' => $safeRoute('two-factor.show', '/settings/two-factor'),
					'action_label' => 'Enable 2FA',
					'required' => true,
				],
				[
					'id' => 'email_verified',
					'title' => 'Verify Your Email Address',
					'description' => 'Confirm your email address to receive system notifications',
					'completed' => $currentUser->email_verified_at !== null,
					'action_url' => $safeRoute('verification.notice', '#'),
					'action_label' => 'Verify Email',
					'required' => true,
				],
				[
					'id' => 'system_tour',
					'title' => 'Take the System Tour',
					'description' => 'Learn about the Superadmin dashboard and available features',
					'completed' => false,
					'action_url' => '#',
					'action_label' => 'Start Tour',
					'required' => false,
				],
				[
					'id' => 'security_review',
					'title' => 'Review Security Settings',
					'description' => 'Configure password policies, session timeouts, and IP restrictions',
					'completed' => false,
					'action_url' => '#',
					'action_label' => 'Review Settings',
					'required' => false,
				],
			];

			// Calculate completion percentage
			$completedCount = count(array_filter($placeholderChecklist, fn($item) => $item['completed']));
			$totalCount = count($placeholderChecklist);
			$completionPercentage = $totalCount > 0 ? round(($completedCount / $totalCount) * 100) : 0;

			$userOnboarding = (object) [
				'id' => null,
				'user_id' => $currentUser->id,
				'status' => $completionPercentage === 100 ? 'completed' : 'pending',
				'checklist_json' => $placeholderChecklist,
				'completion_percentage' => $completionPercentage,
			];
		}

		// Show the setup modal when the user hasn't completed onboarding
		// For Superadmins, we show profile onboarding (not system onboarding)
		$showByUserOnboarding = false;
		try {
			$u = $request->user();
			if ($u && $userOnboarding && isset($userOnboarding->status)) {
				// Show for Superadmins with incomplete profiles
				$showByUserOnboarding = in_array($userOnboarding->status, ['pending', 'in_progress'], true);
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