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
