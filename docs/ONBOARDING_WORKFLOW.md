# System Onboarding (Organization) - Workflow

## Overview
This document describes the onboarding workflow for a new organization instance of SyncingSteel. Onboarding is normally triggered by a Superadmin who invites an Office Admin. Admin then performs initial org setup, and HR Manager/Staff initialize HR-specific configuration.

This workflow is skippable:
- Superadmin may skip the guided onboarding flow.
- Office Admin, HR Manager, or HR Staff who trigger system initialization may also skip setup, but they must complete personal and profile setup before they can use the system's full features.

## System onboarding flow
Superadmin → Admin Invitation → Admin Accepts → Admin Setup → HR Setup → Ready

Alternate flows:
- Superadmin chooses "Skip onboarding" → organization created with minimal defaults → onboarding tasks can be completed later from Admin Settings.
- Office Admin / HR Manager / HR Staff chooses "Skip initialization" when prompted → essential organization placeholders are created; user must complete profile setup (see Profile Requirements) before accessing full functionality.

### Profile requirements (required before full access)
Any user who skips initialization (Office Admin, HR Manager, HR Staff) must complete the following before they can use the full system and its features:
- Confirm name and contact email (email verified)
- Set password and MFA if required by org policy
- Complete role assignment and department affiliation (or accept default assignment)
- Provide required HR/payroll contact information where prompted

### Organization creation & domain setup
1. Superadmin creates organization record: name, primary domain (optional), contact email, timezone, currency.
2. Domain setup options:
    - Domain-restricted invitations (only emails under specified domain can accept invitations).
    - Manual domain whitelist managed by Superadmin.
3. If onboarding is skipped, the system seeds minimal organization data and placeholders for payroll, departments, and notification settings. These must be completed by an Admin or an authorized user before production use.

### Admin invitation process and email workflow
1. Superadmin creates an Admin invitation: email, display name, optional role templating, expiration.
2. System sends invite email with one-time token link.
3. Admin accepts invite, completes account setup (password, MFA if enabled), and gains Admin privileges for that organization.
4. If an Admin skips onboarding and accepts later, the system will prompt for any missing organization-level settings before allowing full administrative actions.

### Admin setup responsibilities
- HR department registration: create departments and initial departmental managers.
- Payroll configuration initialization: set payroll period type (monthly/semimonthly/biweekly), initial salary components, statutory rates placeholders.
- Employee role assignments: define initial roles and hierarchy for the organization.
- If onboarding was skipped, Admins will be presented with a checklist and cannot perform certain operations (e.g., full payroll runs, bulk hiring imports) until required org and profile data are completed.

### HR Manager initialization flow
1. Admin assigns HR Manager role or invites HR Manager via invitation.
2. HR Manager performs HR-specific setup:
    - Create department list
    - Seed sample employees (optional) or import CSV
    - Configure leave types and accrual rules
    - Review payroll placeholders and coordinate with Admin
3. If HR Manager skipped initial system setup, they must complete their profile and confirm HR settings before using HR-specific modules.

### First-time system setup checklist
- [ ] Organization created and domain configured (can be deferred if Superadmin skips)
- [ ] Admin invitation accepted
- [ ] HR Manager assigned and HR departments created (or placeholder created if skipped)
- [ ] Payroll configuration initialized (periods, components) — placeholders allowed if skipped, must be finalized before payroll runs
- [ ] Role templates created (Admin, HR Manager, HR Staff) or assigned defaults
- [ ] Notification / email server tested
- [ ] Audit logging retention policy set
- [ ] Required user profiles completed (all users who skipped initialization must finish Profile Requirements)

## Security & safeguards
- Invitations expire and can be revoked.
- Domain restrictions prevent external accounts unless Superadmin overrides.
- Audit trail records invitation creation/acceptance, onboarding skips, and all setup actions.
- Skips are logged and reversible; Superadmin and Admins can resume guided onboarding at any time from settings.

## Integration points
- Onboarding triggers initial employee records and can seed Timekeeping and Payroll placeholders.
- If onboarding is skipped, integrations remain disabled or operate in a limited mode until required org and profile setup is completed.

## Acceptance criteria
- Superadmin can invite and revoke Admin invites.
- Superadmin can skip the guided onboarding flow; skipped actions are logged and can be completed later.
- Office Admin, HR Manager, or HR Staff can trigger system initialization and may skip, but they must complete profile setup (email verification, password/MFA, role/department) to access the whole system and its features.
- Admin completes org setup and assigns HR Manager (or confirms placeholders exist and schedules completion).
- HR Manager completes HR initialization checklist and can import initial employees once profile and org requirements are satisfied.
- System prevents critical operations (e.g., payroll runs, bulk external integrations) until required org configuration and user profile completion are verified.
- Audit logs include onboarding skip actions and profile completion timestamps.
