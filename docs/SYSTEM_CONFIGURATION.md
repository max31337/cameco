# System Configuration & Platform Settings

## Overview
Company-wide configuration and system-level settings. Clarifies which roles can edit which settings and describes feature toggles, access controls, and global parameters.

## Configuration responsibility split
- Superadmin:
  - Platform/system-level settings, company-wide feature toggles, global environment controls, and audit retention defaults.
  - Manage global statutory rate updates and configure platform email/SMTP settings.
  - Approve or enforce overrides that affect the entire system.
- Admin:
  - Company-level settings: timezone, currency, payroll defaults, department-level feature access.
  - Manage integrations used by the company (e.g., attendance device endpoints) and test credentials.
- HR Manager:
  - Limited configuration related to HR and Payroll only (salary components, leave types, approval chains).

## Company-specific settings
- Email domain and invitation constraints (allowlist/blocklist for onboarding).
- Company branding (logo, contact email) managed by Admin.

## Feature toggles for the company
- Toggle modules: Timekeeping, Payroll, Onboarding, ATS, Appraisal, Workforce Management.
- Admin can enable/disable modules for the company; Superadmin can enforce or override platform-wide defaults.

## Access control per module
- Modules have their own permission sets. Admin assigns module-level access to roles; Superadmin can enforce global overrides.

## Global parameter management
- Statutory rates (SSS, PhilHealth, Pag-IBIG) are maintained at the platform level by Superadmin; Admins may set company-level offsets or local adjustments where permitted.
- Email templates and notification settings: Admins edit company templates; Superadmin maintains platform base templates.

## Safeguards & restrictions
- Immutable fields: `users.email` (unless verified/reset), `employees.employee_number` once issued (edits require Superadmin justification), audit-enabled fields.
- Critical actions (company data deletion, global statutory updates) require Superadmin authorization with two-factor confirmation.

## Acceptance criteria
- Superadmin controls platform-level toggles and system-wide settings.
- Admin controls company-level settings and can enable/disable modules for the company.
- Changes to immutable fields and critical actions are auditable and require required authorizations.
- Role permissions and overrides are clearly documented and enforced.

# System & Configuration Tables

### system_settings
```sql
CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    key VARCHAR(191) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description VARCHAR(255) NULL,
    updated_by BIGINT UNSIGNED NOT NULL, -- FK -> users.id
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```