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
| Area | Superadmin | Admin | HR Manager | HR Staff | User |
|------|------------|-------|------------|----------|------|
| Create users | yes | yes | limited (employee) | no | no |
| Invite Admins | yes | limited (with approval) | no | no | no |
| Assign roles | yes | yes (except Superadmin) | limited | no | no |
| Edit payroll master | yes | limited | yes | no | no |
| View audit logs | yes | yes | limited | limited | no |

## Acceptance criteria
- Role assignment rules enforce no elevation without approval.
- Immutable fields and critical actions require Superadmin justification.
- Audit logging for all RBAC changes exists and is searchable.

## Database schema snippet for roles table
### roles
```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```