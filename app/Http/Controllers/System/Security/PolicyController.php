<?php

namespace App\Http\Controllers\System\Security;

use App\Http\Controllers\Controller;
use App\Models\SecurityPolicy;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PolicyController extends Controller
{
	use LogsSecurityAudits;

	/**
	 * Display security policies page.
	 */
	public function index(Request $request)
	{
		$policies = SecurityPolicy::orderBy('category')->orderBy('policy_key')->get();

		$groupedPolicies = [
			'password' => $policies->filter(fn($p) => $p->category === 'password')->values(),
			'2fa' => $policies->filter(fn($p) => $p->category === '2fa')->values(),
			'session' => $policies->filter(fn($p) => $p->category === 'session')->values(),
			'login' => $policies->filter(fn($p) => $p->category === 'login')->values(),
		];

		$stats = [
			'total_policies' => $policies->count(),
			'password_policies' => $groupedPolicies['password']->count(),
			'session_policies' => $groupedPolicies['session']->count(),
			'login_policies' => $groupedPolicies['login']->count(),
		];

		$breadcrumbs = [
			['title' => 'System', 'href' => '#'],
			['title' => 'Security & Access', 'href' => '#'],
			['title' => 'Security Policies', 'href' => '/system/security/policies'],
		];

		return Inertia::render('System/Security/Policies', [
			'policies' => $groupedPolicies,
			'stats' => $stats,
			'breadcrumbs' => $breadcrumbs,
		]);
	}

	/**
	 * Update security policies.
	 */
	public function update(Request $request)
	{
		$validated = $request->validate([
			'policies' => 'required|array',
			'policies.*.policy_key' => 'required|string',
			'policies.*.policy_value' => 'required|string',
			'policies.*.is_enabled' => 'required|boolean',
		]);

		try {
			foreach ($validated['policies'] as $policyData) {
				$policy = SecurityPolicy::where('policy_key', $policyData['policy_key'])->first();

				if ($policy) {
					$oldValue = $policy->policy_value;
					$policy->update([
						'policy_value' => $policyData['policy_value'],
						'is_enabled' => $policyData['is_enabled'],
					]);

					// Log security audit for policy changes
					$this->logSecurityAudit('security_policy.updated', [
						'policy_key' => $policyData['policy_key'],
						'old_value' => $oldValue,
						'new_value' => $policyData['policy_value'],
						'enabled' => $policyData['is_enabled'],
					]);
				}
			}

			return redirect()->back()
				->with('success', 'Security policies updated successfully.');
		} catch (\Exception $e) {
			return redirect()->back()
				->withErrors(['error' => 'Failed to update security policies: ' . $e->getMessage()]);
		}
	}

	/**
	 * Get policy by key.
	 */
	public function show($key)
	{
		$policy = SecurityPolicy::where('policy_key', $key)->first();

		if (!$policy) {
			return response()->json(['error' => 'Policy not found'], 404);
		}

		return response()->json($policy);
	}

	/**
	 * Reset policy to default.
	 */
	public function reset($key)
	{
		$defaults = $this->getDefaultPolicies();

		if (!isset($defaults[$key])) {
			return redirect()->back()
				->withErrors(['error' => 'Default policy not found']);
		}

		$policy = SecurityPolicy::where('policy_key', $key)->first();

		if ($policy) {
			$oldValue = $policy->policy_value;
			$policy->update(['policy_value' => $defaults[$key]['value']]);

			$this->logSecurityAudit('security_policy.reset', [
				'policy_key' => $key,
				'old_value' => $oldValue,
				'reset_value' => $defaults[$key]['value'],
			]);
		}

		return redirect()->back()
			->with('success', "Policy '{$key}' reset to default.");
	}

	/**
	 * Get default security policies.
	 */
	private function getDefaultPolicies(): array
	{
		return [
			// Password policies
			'password_min_length' => [
				'value' => '8',
				'type' => 'integer',
				'category' => 'password',
				'description' => 'Minimum password length',
			],
			'password_require_uppercase' => [
				'value' => '1',
				'type' => 'boolean',
				'category' => 'password',
				'description' => 'Require at least one uppercase letter',
			],
			'password_require_lowercase' => [
				'value' => '1',
				'type' => 'boolean',
				'category' => 'password',
				'description' => 'Require at least one lowercase letter',
			],
			'password_require_numbers' => [
				'value' => '1',
				'type' => 'boolean',
				'category' => 'password',
				'description' => 'Require at least one number',
			],
			'password_require_special' => [
				'value' => '1',
				'type' => 'boolean',
				'category' => 'password',
				'description' => 'Require at least one special character',
			],
			'password_expiry_days' => [
				'value' => '90',
				'type' => 'integer',
				'category' => 'password',
				'description' => 'Password expiry in days (0 = never)',
			],

			// 2FA policies
			'two_factor_enforced' => [
				'value' => '0',
				'type' => 'boolean',
				'category' => '2fa',
				'description' => 'Enforce 2FA for all users',
			],
			'two_factor_grace_period' => [
				'value' => '7',
				'type' => 'integer',
				'category' => '2fa',
				'description' => 'Grace period for enabling 2FA in days',
			],

			// Session policies
			'session_timeout_minutes' => [
				'value' => '30',
				'type' => 'integer',
				'category' => 'session',
				'description' => 'Session timeout in minutes',
			],
			'session_concurrent_limit' => [
				'value' => '3',
				'type' => 'integer',
				'category' => 'session',
				'description' => 'Maximum concurrent sessions per user',
			],

			// Login policies
			'login_attempt_limit' => [
				'value' => '5',
				'type' => 'integer',
				'category' => 'login',
				'description' => 'Maximum failed login attempts before lockout',
			],
			'login_lockout_duration_minutes' => [
				'value' => '15',
				'type' => 'integer',
				'category' => 'login',
				'description' => 'Account lockout duration in minutes',
			],
		];
	}

	/**
	 * Initialize default policies in database.
	 */
	public function initializeDefaults()
	{
		$defaults = $this->getDefaultPolicies();

		foreach ($defaults as $key => $config) {
			SecurityPolicy::updateOrCreate(
				['policy_key' => $key],
				[
					'policy_value' => $config['value'],
					'policy_type' => $config['type'],
					'category' => $config['category'],
					'description' => $config['description'],
					'is_enabled' => true,
				]
			);
		}

		$this->logSecurityAudit('security_policy.initialized', [
			'policies_count' => count($defaults),
		]);

		return response()->json(['message' => 'Default policies initialized']);
	}
}
