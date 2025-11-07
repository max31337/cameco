<?php

namespace App\Http\Controllers\System\Security;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\Security\RoleRequest;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
	use LogsSecurityAudits;

	/**
	 * Display a listing of all roles with permissions.
	 */
	public function index(Request $request)
	{
		$roles = Role::with('permissions')
			->withCount('users')
			->orderBy('name')
			->get()
			->map(fn($role) => [
				'id' => $role->id,
				'name' => $role->name,
				'description' => $role->description ?? '',
				'permissions_count' => $role->permissions->count(),
				'users_count' => $role->users_count ?? 0,
				'guard_name' => $role->guard_name,
				'created_at' => $role->created_at->format('Y-m-d H:i:s'),
				'permissions' => $role->permissions->map(fn($p) => [
					'id' => $p->id,
					'name' => $p->name,
					'description' => $p->description ?? '',
				])->toArray(),
			]);

		// Get all available permissions grouped by category
		$permissions = Permission::orderBy('name')->get()
			->groupBy(fn($p) => explode(':', $p->name)[0]) // Group by prefix (e.g., 'user', 'role', 'security')
			->map(fn($group) => $group->map(fn($p) => [
				'id' => $p->id,
				'name' => $p->name,
				'description' => $p->description ?? '',
			])->toArray());

		$breadcrumbs = [
			['title' => 'System', 'href' => '#'],
			['title' => 'Security & Access', 'href' => '#'],
			['title' => 'Roles & Permissions', 'href' => '/system/security/roles'],
		];

		return Inertia::render('System/Security/Roles', [
			'roles' => $roles,
			'permissions' => $permissions,
			'breadcrumbs' => $breadcrumbs,
			'stats' => [
				'total_roles' => Role::count(),
				'system_roles' => Role::whereIn('name', ['Superadmin', 'Admin', 'User'])->count(),
				'custom_roles' => Role::whereNotIn('name', ['Superadmin', 'Admin', 'User'])->count(),
				'total_permissions' => Permission::count(),
			],
		]);
	}

	/**
	 * Show the form for creating a new role.
	 */
	public function create()
	{
		$permissions = Permission::orderBy('name')
			->get()
			->groupBy(fn($p) => explode(':', $p->name)[0])
			->map(fn($group) => $group->map(fn($p) => [
				'id' => $p->id,
				'name' => $p->name,
				'description' => $p->description ?? '',
			])->toArray());

		return Inertia::render('System/Security/RoleForm', [
			'role' => null,
			'permissions' => $permissions,
			'breadcrumbs' => [
				['title' => 'System', 'href' => '#'],
				['title' => 'Security & Access', 'href' => '#'],
				['title' => 'Roles & Permissions', 'href' => '/system/security/roles'],
				['title' => 'Create Role', 'href' => '/system/security/roles/create'],
			],
		]);
	}

	/**
	 * Store a newly created role in storage.
	 */
	public function store(RoleRequest $request)
	{
		try {
			$role = Role::create([
				'name' => $request->validated('name'),
				'description' => $request->validated('description'),
				'guard_name' => 'web',
			]);

			// Attach permissions
			if ($request->has('permissions')) {
				$role->syncPermissions($request->validated('permissions'));
			}

			// Audit log
			$this->logSecurityAudit('role.created', [
				'role_id' => $role->id,
				'role_name' => $role->name,
				'permissions_count' => count($request->validated('permissions')),
			]);

			return redirect('/system/security/roles')
				->with('success', "Role '{$role->name}' created successfully.");
		} catch (\Exception $e) {
			return redirect()->back()
				->withErrors(['error' => 'Failed to create role: ' . $e->getMessage()]);
		}
	}

	/**
	 * Show the form for editing the specified role.
	 */
	public function edit(Role $role)
	{
		if (in_array($role->name, ['Superadmin', 'Admin'])) {
			return redirect('/system/security/roles')
				->with('error', "Cannot edit system role '{$role->name}'.");
		}

		$permissions = Permission::orderBy('name')
			->get()
			->groupBy(fn($p) => explode(':', $p->name)[0])
			->map(fn($group) => $group->map(fn($p) => [
				'id' => $p->id,
				'name' => $p->name,
				'description' => $p->description ?? '',
				'has_permission' => $role->hasPermissionTo($p->name),
			])->toArray());

		return Inertia::render('System/Security/RoleForm', [
			'role' => [
				'id' => $role->id,
				'name' => $role->name,
				'description' => $role->description ?? '',
				'permissions' => $role->permissions->pluck('id')->toArray(),
			],
			'permissions' => $permissions,
			'breadcrumbs' => [
				['title' => 'System', 'href' => '#'],
				['title' => 'Security & Access', 'href' => '#'],
				['title' => 'Roles & Permissions', 'href' => '/system/security/roles'],
				['title' => "Edit {$role->name}", 'href' => "/system/security/roles/{$role->id}/edit"],
			],
		]);
	}

	/**
	 * Update the specified role in storage.
	 */
	public function update(RoleRequest $request, Role $role)
	{
		if (in_array($role->name, ['Superadmin', 'Admin'])) {
			return redirect('/system/security/roles')
				->with('error', "Cannot edit system role '{$role->name}'.");
		}

		try {
			$role->update([
				'description' => $request->validated('description'),
			]);

			// Sync permissions
			if ($request->has('permissions')) {
				$role->syncPermissions($request->validated('permissions'));
			}

			// Audit log
			$this->logSecurityAudit('role.updated', [
				'role_id' => $role->id,
				'role_name' => $role->name,
				'permissions_count' => count($request->validated('permissions')),
			]);

			return redirect('/system/security/roles')
				->with('success', "Role '{$role->name}' updated successfully.");
		} catch (\Exception $e) {
			return redirect()->back()
				->withErrors(['error' => 'Failed to update role: ' . $e->getMessage()]);
		}
	}

	/**
	 * Delete the specified role.
	 */
	public function destroy(Role $role)
	{
		if (in_array($role->name, ['Superadmin', 'Admin', 'User'])) {
			return redirect('/system/security/roles')
				->with('error', "Cannot delete system role '{$role->name}'.");
		}

		if ($role->users()->count() > 0) {
			return redirect('/system/security/roles')
				->with('error', "Cannot delete role with {$role->users()->count()} assigned users.");
		}

		try {
			$roleName = $role->name;
			$role->delete();

			// Audit log
			$this->logSecurityAudit('role.deleted', [
				'role_name' => $roleName,
			]);

			return redirect('/system/security/roles')
				->with('success', "Role '{$roleName}' deleted successfully.");
		} catch (\Exception $e) {
			return redirect()->back()
				->withErrors(['error' => 'Failed to delete role: ' . $e->getMessage()]);
		}
	}

	/**
	 * Get permission matrix for a role.
	 */
	public function getPermissionMatrix(Role $role)
	{
		$matrix = Permission::all()
			->groupBy(fn($p) => explode(':', $p->name)[0])
			->map(fn($group, $category) => [
				'category' => $category,
				'permissions' => $group->map(fn($p) => [
					'id' => $p->id,
					'name' => $p->name,
					'has_permission' => $role->hasPermissionTo($p->name),
				])->toArray(),
			])->values();

		return response()->json($matrix);
	}
}
