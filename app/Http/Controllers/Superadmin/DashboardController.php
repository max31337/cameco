<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
	/**
	 * Show the superadmin dashboard.
	 */
	public function index(Request $request)
	{
		// Minimal payload — teams can extend with stats or counts as needed.
		$data = [
			'counts' => [
				'users' => 0,
				'companies' => 0,
			],
			// If the login response appended ?welcome=1 we open a small onboarding/setup modal for Superadmins.
			'showSetupModal' => (bool) $request->query('welcome', false),
			'welcomeText' => 'Welcome to the Superadmin dashboard — manage platform settings and users from here.',
		];

		return Inertia::render('Superadmin/Dashboard', $data);
	}
}