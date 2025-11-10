<?php

namespace App\Http\Controllers\System\Security;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\Security\RoleRequest;
use App\Models\Position;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
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
		// Authorization: Only Super Admin
		Gate::authorize('system.onboarding.initialize');

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

		// Get all available permissions grouped by module
		$permissionsQuery = Permission::where('guard_name', 'web');
		
		// Check if module column exists before ordering by it
		if (Schema::hasColumn('permissions', 'module')) {
			$permissionsQuery->orderBy('module')->orderBy('name');
		} else {
			$permissionsQuery->orderBy('name');
		}
		
		$permissions = $permissionsQuery->get()
			->groupBy(fn($p) => $p->module ?? 'General')
			->map(fn($group) => $group->map(fn($p) => [
				'id' => $p->id,
				'name' => $p->name,
				'description' => $p->description ?? '',
				'module' => $p->module ?? 'General',
			])->toArray());

		// Get positions for role mapping
		$positions = Position::select('id', 'title', 'level', 'department_id')
			->with('department:id,name')
			->orderBy('level')
			->orderBy('title')
			->get()
			->map(function ($position) {
				return [
					'id' => $position->id,
					'title' => $position->title,
					'level' => $position->level,
					'department_name' => $position->department?->name ?? 'N/A',
				];
			});

		$breadcrumbs = [
			['title' => 'System', 'href' => '#'],
			['title' => 'Security & Access', 'href' => '#'],
			['title' => 'Roles & Permissions', 'href' => '/system/security/roles'],
		];

		return Inertia::render('System/Security/Roles', [
			'roles' => $roles,
			'permissions' => $permissions,
			'positions' => $positions,
			'breadcrumbs' => $breadcrumbs,
			'stats' => [
				'total_roles' => Role::where('guard_name', 'web')->count(),
				'system_roles' => Role::whereIn('name', ['Superadmin', 'Admin', 'User'])->where('guard_name', 'web')->count(),
				'custom_roles' => Role::whereNotIn('name', ['Superadmin', 'Admin', 'User'])->where('guard_name', 'web')->count(),
				'total_permissions' => Permission::where('guard_name', 'web')->count(),
				'total_positions' => Position::count(),
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
			$this->auditLog(
				'role_created',
				"Created role: {$role->name}",
				'high',
				'Role Management',
				[
					'role_id' => $role->id,
					'role_name' => $role->name,
					'permissions_count' => count($request->validated('permissions')),
				]
			);

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
			$this->auditLog(
				'role_updated',
				"Updated role: {$role->name}",
				'high',
				'Role Management',
				[
					'role_id' => $role->id,
					'role_name' => $role->name,
					'permissions_count' => count($request->validated('permissions')),
				]
			);

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
			$this->auditLog(
				'role_deleted',
				"Deleted role: {$roleName}",
				'high',
				'Role Management',
				[
					'role_name' => $roleName,
				]
			);

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
