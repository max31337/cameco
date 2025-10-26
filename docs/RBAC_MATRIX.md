# Role-based Access Control (RBAC) Matrix

## Purpose
Defines exactly who can edit what across the platform to prevent accidental full-access changes and privilege escalation.

## Role hierarchy
- Superadmin
- Admin (Office Admin / Admin Officer)
- HR Manager
- HR Staff
- Regular User

## Editable scopes per role
- Superadmin:
  - Platform: tenants, domains, global feature toggles, global statutory rates
  - Users: create/update/delete any user, assign any role, view audit logs
  - Modules: enable/disable modules globally
- Admin:
  - Organization: create/update org settings, manage org users (except Superadmin role), invite Admins (with Superadmin approval for cross-org)
  - HR/Payroll boundaries: can change payroll period and enable/disable features for departments
  - View org-level audit logs
- HR Manager:
  - Employees: create/edit employee records, assign payroll components, request role changes for HR Staff
  - Payroll: configure salary components and departmental pay bands
  - Limited visibility into org settings as read-only
- HR Staff:
  - Employees: create and edit employee records but cannot change payroll master settings or assign managerial roles
  - Payroll assistance: prepare payroll drafts, but cannot approve
- Regular User:
  - Own profile: view and edit limited personal fields (if self-service enabled)

## Inheritance rules
- Higher roles inherit lower role permissions unless explicitly denied.
- Explicit denies override inherited allows.

## System safeguards
- Immutable fields (require Superadmin justification and audit entry):
  - `employees.employee_number` once generated
  - `users.id`, primary identity fields linked to external systems
- Privilege escalation prevention:
  - No role can assign a role equal or higher than their own (e.g., HR Manager cannot assign Admin or Superadmin)
  - Admin cannot create Superadmin accounts without explicit Superadmin approval
  - Role assignment changes generate an audit entry and optional approval workflow for high-risk changes

## Audit and monitoring
- All RBAC changes logged with before/after snapshots and actor metadata.
- Daily summary of role changes sent to Superadmin (configurable).

## Example permission matrix (high-level)
| Area                      | Superadmin |          Admin           | HR Manager          | HR Staff | User |
|---------------------------|------------|--------------------------|---------------------|----------|------|
| Create users              | yes        | yes                      | limited (employee)  | no       | no   |
| Invite Admins             | yes        | limited (with approval)  | no                  | no       | no   |
| Assign roles              | yes        | yes (except Superadmin)  | limited             | no       | no   |
| Edit payroll master       | yes        | limited                  | yes                 | no       | no   |
| View audit logs           | yes        | yes                      | limited             | limited  | no   |

## Acceptance criteria
- Role assignment rules enforce no elevation without approval.
- Immutable fields and critical actions require Superadmin justification.
- Audit logging for all RBAC changes exists and is searchable.

## Database schema snippet for roles table
### roles
This repository uses Spatie's `spatie/laravel-permission` package for role and permission management. Rather than rolling a custom `roles`/`permissions` schema and pivots, prefer the package's migrations and helpers.

Setup (recommended):

- composer require spatie/laravel-permission
- php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
- php artisan migrate

Spatie creates the canonical tables: `roles`, `permissions`, `role_has_permissions`, `model_has_roles`, and `model_has_permissions`. These map cleanly to the RBAC matrix described above and support seeding role templates, auditing, and guard names.

If you still want a compact SQL example, Spatie's migrations roughly create:

```sql
CREATE TABLE roles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  guard_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE permissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  guard_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);
```

Notes:
- Use the `HasRoles` trait on your `User` model. Example: `use Spatie\Permission\Traits\HasRoles;` and `class User extends Authenticatable { use HasRoles; }`.
- Seed roles and permissions via seeders and reference them by name in code and policies.
- Enforce the "no elevation" rule in application logic and gates; Spatie helps with checks like `auth()->user()->hasRole('Admin')` and permission checks like `can('users.create')`.

See `docs/RBAC_GUIDE.md` for the canonical permission naming convention, seeder example, role_templates mapping and migration guidance.