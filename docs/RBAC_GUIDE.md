# RBAC Guide — naming, seeding and onboarding mappings

This short guide centralizes the project's RBAC decisions so documentation and developers use consistent permission names, seeding patterns, and onboarding-driven role templates.

Naming convention (canonical)
- Use dot-separated permission names in the form: `module.resource.action`.
  - `module` — top-level area (e.g., `users`, `timekeeping`, `workforce`, `payroll`).
  - `resource` — plural noun for the target resource (e.g., `users`, `schedules`, `attendance`).
  - `action` — operation (e.g., `create`, `update`, `delete`, `view`, `export`).

Examples
- `users.create` — create user accounts
- `users.update` — edit user profiles
- `workforce.schedules.create` — create a workforce schedule
- `workforce.assignments.update` — update a shift assignment
- `timekeeping.attendance.create` — record attendance events
- `timekeeping.reports.view` — view timekeeping reports

Why this convention
- Predictable names make seeding and policy wiring straightforward.
- Plural resources make it easy to group permissions by resource in UIs and seeders.

Seeder example (Spatie)

Use a seeder to create permissions and assign them to roles. This keeps onboarding and deployments reproducible.

```php
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // create permissions
        $perms = [
            'users.create', 'users.update', 'users.delete', 'users.view',
            'workforce.schedules.create', 'workforce.assignments.update',
            'timekeeping.attendance.create', 'timekeeping.reports.view',
        ];

        foreach ($perms as $p) {
            Permission::firstOrCreate(['name' => $p, 'guard_name' => 'web']);
        }

        // create roles and assign permissions
        $superadmin = Role::firstOrCreate(['name' => 'Superadmin', 'guard_name' => 'web']);
        $superadmin->givePermissionTo(Permission::all());

        $hrManager = Role::firstOrCreate(['name' => 'HR Manager', 'guard_name' => 'web']);
        $hrManager->givePermissionTo(['workforce.schedules.create', 'workforce.assignments.update']);
    }
}
```

Onboarding / role_templates mapping
- `role_templates.template_json` should contain a mapping from role name → array of permission names. Example:

```json
{
  "HR Manager": ["workforce.schedules.create", "workforce.assignments.update"],
  "HR Staff": ["workforce.assignments.create", "workforce.assignments.view"]
}
```

- During onboarding, read the JSON and create permissions/roles using the seeder pattern above, then attach permissions to roles with `$role->givePermissionTo($permissions)`.

Migration guidance (docs-only)
- Prefer Spatie's migrations (roles, permissions, role_has_permissions, model_has_roles, model_has_permissions).
- If you have legacy tables (`role_user`, `permission_user`), write a one-off migration to translate rows into `model_has_roles` / `model_has_permissions` with `model_type = 'App\\Models\\User'` and `model_id = user_id`.

Runtime notes
- Add `use Spatie\Permission\Traits\HasRoles;` to the `User` model and use `auth()->user()->can('module.resource.action')` in controllers/policies.
- Where applicable, prefer gates/policies for complex checks; use permissions for simple, declarative checks.

This guide should be the single source of truth for permission naming. Keep it updated when new modules or resources are added.
