<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SystemOnboardingService;
use Illuminate\Support\Facades\Validator;
use App\Repositories\SystemOnboardingRepository;

class SystemOnboarding extends Controller
{
	protected SystemOnboardingService $service;

	public function __construct(SystemOnboardingService $service)
	{
		$this->service = $service;
	}

	public function start(Request $request)
	{
		$user = $request->user();
		if (!$user || !$user->isSuperadmin()) {
			return response()->json(['message' => 'Forbidden'], 403);
		}

		$validator = Validator::make($request->all(), [
			'company_name' => ['required','string'],
			'contact_email' => ['required','email'],
			'timezone' => ['required','string'],
			'currency' => ['required','string'],
			'checklist' => ['sometimes','array'],
		]);

		if ($validator->fails()) {
			return response()->json(['errors' => $validator->errors()], 422);
		}

		$id = $this->service->start($validator->validated(), $user->id);

		// If the request came from Inertia, return a redirect so Inertia can handle it
		if ($request->header('X-Inertia')) {
			return redirect()->route('dashboard');
		}

		return response()->json(['message' => 'Onboarding started', 'id' => $id], 201);
	}

	public function skip(Request $request)
	{
		$user = $request->user();
		if (!$user || !$user->isSuperadmin()) {
			return response()->json(['message' => 'Forbidden'], 403);
		}

		$validator = Validator::make($request->all(), [
			'reason' => ['sometimes','string'],
		]);

		if ($validator->fails()) {
			return response()->json(['errors' => $validator->errors()], 422);
		}

		$id = $this->service->skip($user->id, $validator->validated()['reason'] ?? null);

		// If the request came from Inertia, redirect back to the dashboard so Inertia receives a proper response
		if ($request->header('X-Inertia')) {
			return redirect()->route('dashboard');
		}

		return response()->json(['message' => 'Onboarding skipped', 'id' => $id], 201);
	}

	/**
	 * Complete the latest system onboarding (Superadmin/Admin or authorized users only)
	 */
	public function complete(Request $request)
	{
		$user = $request->user();
		if (! $user || (! $user->hasRole('Superadmin') && ! $user->hasRole('Admin') && ! $user->can('system.onboarding.manage'))) {
			return response()->json(['message' => 'Forbidden'], 403);
		}

		$repo = app(SystemOnboardingRepository::class);
		$latest = null;
		try {
			$latest = $repo->findLatest();
		} catch (\Throwable $e) {
			$latest = null;
		}

		if (! $latest || empty($latest->id)) {
			return response()->json(['message' => 'No onboarding found to complete'], 404);
		}

		$this->service->complete($latest->id);

		if ($request->header('X-Inertia')) {
			return redirect()->route('dashboard');
		}

		return response()->json(['message' => 'Onboarding completed']);
	}
}