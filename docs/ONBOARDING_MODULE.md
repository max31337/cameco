
# Onboarding Module - Architecture & Implementation Plan

## Module Overview
The Onboarding Module automates and tracks all post-hire activities for new employees, ensuring a smooth transition from candidate to productive team member. It manages document collection, contract signing, account provisioning, and onboarding checklists, and integrates with HR Core and ATS.

## Module Goals
1. **Automated Onboarding Checklists:** Assign and track required onboarding tasks for each new hire.
2. **Document Collection & Contract Signing:** Collect required documents and manage digital contract signing.
3. **Account Provisioning:** Trigger IT/system account creation and initial access setup.
4. **Progress Tracking & Notifications:** Monitor onboarding progress and send reminders to new hires and HR staff.
5. **Integration:** Seamlessly connect with ATS (trigger onboarding) and HR Core (update employee status, seed leave balances).

---

## Database Schema (Onboarding Module)

### onboarding_checklists
```sql
- id (primary key)
- name (string, required) # "Standard Office Onboarding", etc.
- tasks_json (json) # Serialized list of tasks (e.g., ["Submit SSS", "Sign Contract", ...])
- created_by (foreign key to users)
- is_active (boolean, default true)
- created_at, updated_at
```

### onboarding_tasks
```sql
- id (primary key)
- employee_id (foreign key to employees)
- checklist_id (foreign key to onboarding_checklists)
- task (string)
- status (enum: pending, in_progress, completed, skipped)
- due_date (date, nullable)
- completed_at (timestamp, nullable)
- assigned_by (foreign key to users)
- created_at, updated_at
```

### onboarding_documents
```sql
- id (primary key)
- employee_id (foreign key to employees)
- document_type (string) # e.g., "SSS", "TIN", "Contract"
- file_path (string)
- status (enum: pending, submitted, verified, rejected)
- submitted_at (timestamp, nullable)
- verified_by (foreign key to users, nullable)
- verified_at (timestamp, nullable)
- created_at, updated_at
```

---

## Key Workflows

### 1. Onboarding Trigger
- Onboarding is triggered by ATS (on hire) or HR Core (manual add).
- HR Staff/Admin Officer selects onboarding checklist template.
- System generates onboarding tasks for the new employee.

### 2. Task Assignment & Tracking
- Each onboarding task is assigned to the employee (and/or responsible HR/IT staff).
- Employees and staff receive notifications/reminders for pending tasks.
- Task status is updated as work is completed.

### 3. Document Collection & Contract Signing
- Employee uploads required documents (SSS, TIN, etc.).
- HR reviews and verifies submissions.
- Digital contract signing is tracked as a required task.

### 4. Account Provisioning
- IT is notified to create system/email accounts as part of onboarding tasks.
- Account details are recorded and shared securely with the employee.

### 5. Completion & Handoff
- When all tasks are completed, onboarding is marked as complete.
- Employee status is updated in HR Core; initial leave balances are seeded.

---

## Integration Points
- **ATS:**
	- Triggers onboarding workflow for new hires.
- **HR Core:**
	- Updates employee status to "Active" upon onboarding completion.
	- Seeds initial leave balances and system access.
- **IT/Account Provisioning:**
	- Receives onboarding tasks for account creation.

---

## Roles & Permissions
- **HR Staff:** Can trigger onboarding, assign tasks, and monitor progress.
- **Admin Officer:** Full access to onboarding templates, task assignment, and completion approval.
- **Employee:** _Currently, employees do not have direct access to the system. All onboarding tasks, document uploads, and contract signing are managed by HR staff on behalf of employees. In the future, an employee portal may be enabled to allow employees to complete onboarding tasks and upload documents themselves._

---

## Implementation Phases

### Phase 1: Foundation Models & Migrations
- [ ] Create Eloquent models for checklists, tasks, and documents
- [ ] Create migrations for all tables
- [ ] Seeders for standard onboarding checklists

### Phase 2: Repository & Service Layer
- [ ] Define repository interfaces for onboarding management
- [ ] Implement Eloquent repositories
- [ ] Create services for task assignment, document collection, and progress tracking

### Phase 3: UI & Workflow Integration
- [ ] Build React/Inertia.js pages for onboarding management and employee self-service
- [ ] Integrate with ATS and HR Core modules
- [ ] Add notification and reporting features

---

## Future Refactor: Domain Layer
When the system is refactored to MVCSR + Domain, move the following to the Domain layer:
- Task dependency and completion rules
- Document validation and verification logic
- Onboarding completion invariants

---

**Dependencies:** ATS (hiring trigger), HR Core (employee data), IT/Account Provisioning
