
# System Onboarding Workflow (Single-Organization)

## Overview

This document describes the onboarding workflow for the single-organization deployment of SyncingSteel. Onboarding is triggered by a Superadmin who invites an Admin. Admin then performs initial system setup, and HR Manager/Staff initialize HR-specific configuration.

This workflow is skippable:
- Superadmin may skip the guided onboarding flow.
- Admin, HR Manager, or HR Staff who trigger system initialization may also skip setup, but they must complete personal and profile setup before they can use the system's full features.


## System onboarding flow
Superadmin → Admin Invitation → Admin Accepts → Admin Setup → HR Setup → Ready

Alternate flows:
- Superadmin chooses "Skip onboarding" → system initialized with minimal defaults → onboarding tasks can be completed later from Admin Settings.
- Admin / HR Manager / HR Staff chooses "Skip initialization" when prompted → essential system placeholders are created; user must complete profile setup (see Profile Requirements) before accessing full functionality.


### Profile requirements (required before full access)
Any user who skips initialization (Admin, HR Manager, HR Staff) must complete the following before they can use the full system and its features:
- Confirm name and contact email (email verified)
- Set password and MFA if required by system policy
- Complete role assignment and department affiliation (or accept default assignment)
- Provide required HR/payroll contact information where prompted


### System initialization (no organization/domain setup)
1. Superadmin starts system onboarding: sets company name, contact email, timezone, currency.
2. If onboarding is skipped, the system seeds minimal data and placeholders for payroll, departments, and notification settings. These must be completed by an Admin or authorized user before production use.


### Admin invitation process and email workflow
1. Superadmin creates an Admin invitation: email, display name, optional role templating, expiration.
2. System sends invite email with one-time token link.
3. Admin accepts invite, completes account setup (password, MFA if enabled), and gains Admin privileges for the system.
4. If an Admin skips onboarding and accepts later, the system will prompt for any missing system-level settings before allowing full administrative actions.


### Admin setup responsibilities
- HR department registration: create departments and initial departmental managers.
- Payroll configuration initialization: set payroll period type (monthly/semimonthly/biweekly), initial salary components, statutory rates placeholders.
- Employee role assignments: define initial roles and hierarchy for the company.
- If onboarding was skipped, Admins will be presented with a checklist and cannot perform certain operations (e.g., full payroll runs, bulk hiring imports) until required system and profile data are completed.


### HR Manager initialization flow
1. Admin assigns HR Manager role or invites HR Manager via invitation.
2. HR Manager performs HR-specific setup:
    - Create department list
    - Seed sample employees (optional) or import CSV
    - Configure leave types and accrual rules
    - Review payroll placeholders and coordinate with Admin
3. If HR Manager skipped initial system setup, they must complete their profile and confirm HR settings before using HR-specific modules.


### First-time system setup checklist
- [ ] System initialized (company name, contact email, timezone, currency)
- [ ] Admin invitation accepted
- [ ] HR Manager assigned and HR departments created (or placeholder created if skipped)
- [ ] Payroll configuration initialized (periods, components) — placeholders allowed if skipped, must be finalized before payroll runs
- [ ] Role templates created (Admin, HR Manager, HR Staff) or assigned defaults
- [ ] Notification / email server tested
- [ ] Audit logging retention policy set
- [ ] Required user profiles completed (all users who skipped initialization must finish Profile Requirements)


## Security & safeguards
- Invitations expire and can be revoked.
- Audit trail records invitation creation/acceptance, onboarding skips, and all setup actions.
- Skips are logged and reversible; Superadmin and Admins can resume guided onboarding at any time from settings.


## Integration points
- Onboarding triggers initial employee records and can seed Timekeeping and Payroll placeholders.
- If onboarding is skipped, integrations remain disabled or operate in a limited mode until required system and profile setup is completed.


## Acceptance criteria
- Superadmin can invite and revoke Admin invites.
- Superadmin can skip the guided onboarding flow; skipped actions are logged and can be completed later.
- Admin, HR Manager, or HR Staff can trigger system initialization and may skip, but they must complete profile setup (email verification, password/MFA, role/department) to access the whole system and its features.
- Admin completes system setup and assigns HR Manager (or confirms placeholders exist and schedules completion).
- HR Manager completes HR initialization checklist and can import initial employees once profile and system requirements are satisfied.
- System prevents critical operations (e.g., payroll runs, bulk external integrations) until required system configuration and user profile completion are verified.
- Audit logs include onboarding skip actions and profile completion timestamps.

# Onboarding Workflow Tables (System-wide)

### system_onboarding
```sql
CREATE TABLE system_onboarding (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    status ENUM('pending','in_progress','completed','skipped') DEFAULT 'pending',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    skipped_at TIMESTAMP NULL,
    skipped_by BIGINT UNSIGNED NULL,
    checklist_json JSON NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### onboarding_skips
```sql
CREATE TABLE onboarding_skips (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    skipped_at TIMESTAMP NOT NULL,
    reason TEXT NULL,
    created_at TIMESTAMP
);
```

### role_templates (optional mapping to Spatie roles)

This schema stores onboarding role templates which can be used to seed roles and permissions during system initialization. We recommend mapping templates to Spatie's `roles` and `permissions` tables rather than building a separate enforcement system.

Suggested workflow:

1. Store a role template in `role_templates.template_json` as a mapping of role names to permission names.
2. During onboarding (or via a seeder), read the JSON and create `Spatie\Permission\Models\Permission` and `Spatie\Permission\Models\Role` records.
3. Attach permissions to roles with `role->givePermissionTo($permissions)`.

If you don't have `role_templates` in your schema yet, a minimal table looks like this:

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

This keeps onboarding-driven role creation deterministic and reproducible across environments.

We recommend using canonical permission names of the form `module.resource.action` (resources plural), e.g. `users.create` or `system.settings.update`. When seeding from `role_templates.template_json`, ensure `guard_name` is set (default `web`) or that your seeder (for example `database/seeders/RolesAndPermissionsSeeder.php`) sets it explicitly to avoid mismatches between guards.

(In Laravel migrations prefer `timestamps()` and `softDeletes()` helpers. SQL shown is illustrative.)