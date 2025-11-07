<?php

namespace App\Http\Controllers\System\Security;

use App\Http\Controllers\Controller;
use App\Models\IPRule;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IPRuleController extends Controller
{
	use LogsSecurityAudits;

	/**
	 * Display IP rules page.
	 */
	public function index(Request $request)
	{
		$query = IPRule::with('createdBy:id,name', 'updatedBy:id,name')
			->orderByDesc('created_at');

		// Filter by rule type
		if ($request->has('rule_type') && $request->get('rule_type') !== 'all') {
			$query->where('rule_type', $request->get('rule_type'));
		}

		// Filter by status
		if ($request->has('status')) {
			match ($request->get('status')) {
				'active' => $query->active(),
				'inactive' => $query->where('is_active', false),
				'expired' => $query->expired(),
				default => null,
			};
		}

		// Search by IP address
		if ($request->has('search')) {
			$search = $request->get('search');
			$query->where('ip_address_or_range', 'like', "%{$search}%")
				->orWhere('description', 'like', "%{$search}%");
		}

		$rules = $query->paginate(25)
			->through(fn($rule) => [
				'id' => $rule->id,
				'ip_address_or_range' => $rule->ip_address_or_range,
				'rule_type' => $rule->rule_type,
				'description' => $rule->description,
				'is_active' => $rule->is_active,
				'expires_at' => $rule->expires_at?->format('Y-m-d H:i:s'),
				'is_expired' => $rule->expires_at && $rule->expires_at->isPast(),
				'created_by' => $rule->createdBy?->name,
				'updated_by' => $rule->updatedBy?->name,
				'created_at' => $rule->created_at->format('Y-m-d H:i:s'),
				'updated_at' => $rule->updated_at->format('Y-m-d H:i:s'),
			]);

		$stats = [
			'total_rules' => IPRule::count(),
			'active_rules' => IPRule::active()->count(),
			'inactive_rules' => IPRule::where('is_active', false)->count(),
			'whitelisted_ips' => IPRule::whitelist()->count(),
			'blacklisted_ips' => IPRule::blacklist()->count(),
			'expired_rules' => IPRule::expired()->count(),
		];

		$breadcrumbs = [
			['title' => 'System', 'href' => '#'],
			['title' => 'Security & Access', 'href' => '#'],
			['title' => 'IP Allowlist/Blocklist', 'href' => '/system/security/ip-rules'],
		];

		return Inertia::render('System/Security/IPRules', [
			'rules' => $rules,
			'stats' => $stats,
			'breadcrumbs' => $breadcrumbs,
			'filters' => [
				'rule_type' => $request->get('rule_type', 'all'),
				'status' => $request->get('status', 'all'),
				'search' => $request->get('search', ''),
			],
		]);
	}

	/**
	 * Store a new IP rule.
	 */
	public function store(Request $request)
	{
		$validated = $request->validate([
			'ip_address_or_range' => 'required|string|unique:ip_rules',
			'rule_type' => 'required|in:whitelist,blacklist',
			'description' => 'nullable|string|max:500',
			'is_active' => 'required|boolean',
			'expires_at' => 'nullable|date|after:now',
		]);

		try {
			$rule = IPRule::create([
				...$validated,
				'created_by' => $request->user()->id,
			]);

			$this->logSecurityAudit('ip_rule.created', [
				'ip_address' => $validated['ip_address_or_range'],
				'rule_type' => $validated['rule_type'],
				'expires_at' => $validated['expires_at'] ?? null,
			]);

			return redirect()->back()
				->with('success', "IP rule created: {$validated['ip_address_or_range']}");
		} catch (\Exception $e) {
			return redirect()->back()
				->withErrors(['error' => 'Failed to create IP rule: ' . $e->getMessage()]);
		}
	}

	/**
	 * Update an IP rule.
	 */
	public function update(Request $request, IPRule $rule)
	{
		$validated = $request->validate([
			'description' => 'nullable|string|max:500',
			'is_active' => 'required|boolean',
			'expires_at' => 'nullable|date|after:now',
		]);

		try {
			$oldData = [
				'is_active' => $rule->is_active,
				'expires_at' => $rule->expires_at,
			];

			$rule->update([
				...$validated,
				'updated_by' => $request->user()->id,
			]);

			$this->logSecurityAudit('ip_rule.updated', [
				'ip_address' => $rule->ip_address_or_range,
				'old_data' => $oldData,
				'new_data' => $validated,
			]);

			return redirect()->back()
				->with('success', 'IP rule updated successfully');
		} catch (\Exception $e) {
			return redirect()->back()
				->withErrors(['error' => 'Failed to update IP rule: ' . $e->getMessage()]);
		}
	}

	/**
	 * Delete an IP rule.
	 */
	public function destroy(Request $request, IPRule $rule)
	{
		try {
			$ipAddress = $rule->ip_address_or_range;
			$ruleType = $rule->rule_type;

			$rule->delete();

			$this->logSecurityAudit('ip_rule.deleted', [
				'ip_address' => $ipAddress,
				'rule_type' => $ruleType,
			]);

			return redirect()->back()
				->with('success', "IP rule deleted: {$ipAddress}");
		} catch (\Exception $e) {
			return redirect()->back()
				->withErrors(['error' => 'Failed to delete IP rule: ' . $e->getMessage()]);
		}
	}

	/**
	 * Toggle IP rule active status.
	 */
	public function toggle(Request $request, IPRule $rule)
	{
		try {
			$oldStatus = $rule->is_active;
			$rule->update(['is_active' => !$rule->is_active]);

			$this->logSecurityAudit('ip_rule.toggled', [
				'ip_address' => $rule->ip_address_or_range,
				'old_status' => $oldStatus,
				'new_status' => $rule->is_active,
			]);

			return redirect()->back()
				->with('success', "IP rule status changed: {$rule->ip_address_or_range}");
		} catch (\Exception $e) {
			return redirect()->back()
				->withErrors(['error' => 'Failed to toggle IP rule: ' . $e->getMessage()]);
		}
	}
}
