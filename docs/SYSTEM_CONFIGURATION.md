# System Configuration & Platform Settings

## Overview
System-wide configuration and domain-level settings. Clarifies which roles can edit which settings and describes feature toggles, access controls, and global parameters.

## Configuration responsibility split
- Superadmin:
  - Platform-level settings, tenant management, global feature toggles, domain whitelist, and audit retention defaults.
  - Can add/remove tenants (if multi-tenant later), manage global statutory rate updates, and configure email/SMTP at platform level.
- Admin:
  - Organization-level settings: timezone, currency, payroll defaults, department-level feature access.
  - Manage organization-level integrations (e.g., attendance device endpoints) and test credentials.
- HR Manager:
  - Limited configuration related to HR and Payroll only (salary components, leave types, approval chains).

## Domain-specific settings
- Domain whitelist and invitation constraints (allowlist/blocklist).
- Per-organization branding (logo, contact email) managed by Admin.

## Feature toggles per organization
- Toggle modules: Timekeeping, Payroll, Onboarding, ATS, Appraisal, Workforce Management.
- Admin can enable/disable modules for their organization; Superadmin can override.

## Access control per module
- Modules have their own permission sets. Admin can assign module-level access to roles; Superadmin can enforce global overrides.

## Global parameter management
- Statutory rates (SSS, PhilHealth, Pag-IBIG) may be updated by Superadmin; Admins can set org-level offsets or apply local overrides.
- Email templates and notification settings: Admins edit org templates; Superadmin can modify platform base templates.

## Safeguards & restrictions
- Immutable fields: `users.email` (unless verified/reset), `employees.employee_number` once issued (edits require Superadmin justification), audit-enabled fields.
- Critical actions (tenant delete, global statutory update) require Superadmin with two-factor confirmation.

## Acceptance criteria
- Superadmin controls platform-level toggles and tenant/domain settings.
- Admin controls organization-level settings and can enable/disable modules for their organization.
