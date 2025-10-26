<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\SystemOnboardingRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

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

		// Show modal if welcome query param present OR onboarding exists and is not completed
		$showByQuery = (bool) $request->query('welcome', false);
		// Only show the modal when onboarding is actively pending or in_progress.
		// If onboarding was skipped, do not show the modal for Superadmin.
		$showByOnboarding = false;
		if ($onboarding && isset($onboarding->status)) {
			$showByOnboarding = in_array($onboarding->status, ['pending', 'in_progress'], true);
		}

		$data = [
			'counts' => $counts,
			'company' => [
				'name' => $companyName,
			],
			'onboardingStatus' => $onboardingStatus,
			'showSetupModal' => $showByQuery || $showByOnboarding,
			'welcomeText' => 'Welcome to the Superadmin dashboard — manage platform settings and users from here.',
		];

		return Inertia::render('Superadmin/Dashboard', $data);
	}
}