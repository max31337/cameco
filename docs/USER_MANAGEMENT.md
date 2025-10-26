# User Management Module

## Overview
This document describes the User Management module: CRUD and lifecycle of system users, invitation and activation flows, role assignment, audit logging, and role reassignment workflows. Focus is on Superadmin/Admin control and safe delegation to HR Manager and HR Staff.

## Role hierarchy
- Superadmin
- Admin (Office Admin / Admin Officer)
- HR Manager
- HR Staff
- Regular User (Employee)

Roles are hierarchical: higher roles inherit the capabilities of lower roles unless explicitly restricted.

## User creation
1. Direct creation (by Superadmin/Admin): Create user record, assign role, optionally link to an `employee` record.
   - Use when provisioning system accounts for internal staff or service accounts.
2. Invitation-based (preferred for Admin onboarding): Superadmin or Admin sends an invitation email with secure token and optional domain constraint.
   - Invitation flow: create invitation record → send email → invited user accepts → account created/linked.

Fields captured at creation: name, email (primary, unique), role, department (optional), employee_id (optional), invited_by, created_by.

## Account activation / deactivation
- Activation:
  - Invitation acceptance auto-activates the account after email verification.
  - Direct-created accounts require activation by Admin or email verification depending on site policy.
- Deactivation:
  - Soft-deactivate (status = suspended/archived) keeps audit trail and preserves links to payroll and timekeeping.
  - Hard-delete: only for accidental test accounts; requires Superadmin approval and audit entry.

## Permission assignment per role
- Use fine-grained permissions (e.g., `users.create`, `users.update`, `users.delete`, `users.view`, `roles.assign`).
- Map capabilities per role (high level):
  - Superadmin: all permissions, tenant and platform management
  - Admin: organization-level user management, invite users, set org policies
  - HR Manager: create/link employee users, manage employee-related permissions
  - HR Staff: view and edit employee fields, cannot assign Admin/Superadmin roles
  - Regular User: view own profile only

## Audit logging for user actions
- All user lifecycle events must be logged: create, invite, accept, update, role change, deactivate, delete.
- Log body: actor_id, target_user_id, action, details (before/after), ip, user_agent, timestamp.
- Retention: configurable (default 2 years) with export capability for compliance.

## Role reassignment / demotion workflows
1. Request: role change is requested by Admin or HR Manager.
2. Approval: certain role changes require approval (e.g., Admin → Superadmin requires Superadmin approval).
3. Execution: system records previous roles in audit trail and notifies the affected user.
4. Forced demotion: supported in emergencies (Superadmin only) with mandatory justification log.

## UX & API considerations
- Admin UI: bulk invite, CSV import, role templates (e.g., HR-Manager template), search and filters.
- API: endpoints protected by role/permission middleware; include audit headers when available.

## Acceptance criteria
- Superadmin can create/invite Admins and manage platform-level accounts.
- Admin can invite and manage organization users and assign HR roles.
- HR Manager and HR Staff can create/link employee user accounts and manage employee fields according to permissions.
- All events are auditable and reversible where appropriate.

## Edge cases
- Email domain restrictions (reject invites outside organization's domain unless Superadmin allows).
- Handling duplicate emails across tenants (if multi-tenant behavior is later enabled).
- User record links to employee lifecycle (archived employees keep user records but with restricted access).



# User Management & RBAC Tables (Expanded)
### users
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    invited_by BIGINT UNSIGNED NULL,
    created_by BIGINT UNSIGNED NULL,
    suspended_at TIMESTAMP NULL,
    archived_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```
- Authentication entity. Link to `profiles` via `profiles.user_id` if needed (one-to-one).

### user_invitations
```sql
CREATE TABLE user_invitations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    invited_by BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NULL,
    department_id BIGINT UNSIGNED NULL,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP NULL,
    declined_at TIMESTAMP NULL,
    revoked_at TIMESTAMP NULL,
    status ENUM('pending','accepted','declined','revoked','expired') DEFAULT 'pending',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### profiles
```sql
CREATE TABLE profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NULL,
    dob DATE NULL,
    contact_number VARCHAR(30) NULL,
    address TEXT NULL,
    emergency_contact VARCHAR(100) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### roles & permissions (using spatie/laravel-permission)

This project uses (or should use) the community-standard package spatie/laravel-permission to manage roles and permissions. Instead of custom pivot tables like `role_user` or `permission_user`, prefer Spatie's tables and helpers which provide a robust, audited, and well-tested foundation.

Quick setup (composer + publish + migrate):

- composer require spatie/laravel-permission
- php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
- php artisan migrate

Key tables created by the package (summary):

- `roles` — stores role records (id, name, guard_name, timestamps)
- `permissions` — stores permission records (id, name, guard_name, timestamps)
- `model_has_permissions` — relation: model_id/model_type -> permission_id
- `model_has_roles` — relation: model_id/model_type -> role_id
- `role_has_permissions` — pivot: role_id -> permission_id

Example SQL-ish layout (what Spatie migrations create):

```sql
-- roles
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    guard_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- permissions
CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    guard_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- role_has_permissions
CREATE TABLE role_has_permissions (
    permission_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(permission_id, role_id)
);

-- model_has_roles
CREATE TABLE model_has_roles (
    role_id BIGINT UNSIGNED NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(role_id, model_id, model_type)
);

-- model_has_permissions
CREATE TABLE model_has_permissions (
    permission_id BIGINT UNSIGNED NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(permission_id, model_id, model_type)
);
```

Notes and recommendations:

- Use the `HasRoles` trait on the `User` model (or whichever model represents authenticable users) to get `assignRole`, `removeRole`, `givePermissionTo`, and `hasPermissionTo` helpers.
- Seed base roles and permissions using a seeder (e.g., `RolesAndPermissionsSeeder`) rather than ad-hoc inserts.
- If you previously had custom pivot tables (`role_user`, `permission_user`), migrate existing data into Spatie's tables with a one-off migration script that maps old role ids/names to the new `roles` and `model_has_roles` rows.
- Spatie supports multiple guards; ensure `guard_name` matches your auth guard (default: `web`).

Example seeder outline:

```php
// database/seeders/RolesAndPermissionsSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

// In seeders prefer firstOrCreate and set guard_name (default: 'web') to avoid guard mismatches
Permission::firstOrCreate(['name' => 'users.create', 'guard_name' => 'web']);
$admin = Role::firstOrCreate(['name' => 'Superadmin', 'guard_name' => 'web']);
$admin->givePermissionTo(Permission::all());
// etc.
```

### role_templates
```sql
CREATE TABLE role_templates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    template_json JSON NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

(In Laravel migrations prefer `timestamps()` and `softDeletes()` helpers. SQL shown is illustrative.)

### user_audit_logs
```sql
CREATE TABLE user_audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    actor_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(50) NOT NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP
);
```