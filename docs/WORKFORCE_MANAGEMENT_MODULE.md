
# Workforce Management Module - Architecture & Implementation Plan

## Module Overview

The Workforce Management Module is responsible for all aspects of workforce scheduling, shift and rotation planning, daily assignment tracking, and workforce analytics for Cathay Metal Corporation. It ensures that employees are assigned to the correct shifts and rotations, and provides the data foundation for timekeeping, payroll, and performance appraisal.

**Manufacturing Employees & Supervisor Access:**
Currently, supervisors of manufacturing employees and manufacturing employees themselves do not have access to the system. All scheduling, assignment, and workforce management actions are performed by HR Staff and Admin Officers only.

**Future Option:**
If required, the system can be extended to include an employee portal and supervisor interface, allowing direct access for manufacturing employees and their supervisors to view schedules, assignments, or submit requests. This is not enabled by default and should be clarified with the client before implementation.

## Module Goals
1. **Shift Scheduling:** Define and manage work schedules for all departments and employee groups.
2. **Rotation Planning:** Create and manage rotation patterns for employees (e.g., 4x2, 6x1, night/day shifts).
3. **Daily Assignment Tracking:** Assign employees to specific shifts and locations on a daily basis.
4. **Workforce Analytics:** Generate reports on coverage, overtime, and schedule adherence.
5. **Integration:** Provide data to Timekeeping (for attendance validation), Payroll (for premiums), and Appraisal (for productivity scoring).

---

## Database Schema (Workforce Management Module)

# Workforce Management Tables (Expanded)

### workforce_schedules
```sql
CREATE TABLE workforce_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    description TEXT NULL,
    effective_date DATE NOT NULL,
    expires_at DATE NULL,
    created_by BIGINT UNSIGNED NOT NULL, -- FK -> users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### shift_assignments
```sql
CREATE TABLE shift_assignments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
    schedule_id BIGINT UNSIGNED NOT NULL, -- FK -> workforce_schedules.id
    date DATE NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    location VARCHAR(191) NULL,
    is_overtime BOOLEAN DEFAULT FALSE,
    created_by BIGINT UNSIGNED NOT NULL, -- FK -> users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (schedule_id) REFERENCES workforce_schedules(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### employee_rotations
```sql
CREATE TABLE employee_rotations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    pattern_json JSON NOT NULL,
    description TEXT NULL,
    created_by BIGINT UNSIGNED NOT NULL, -- FK -> users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### rotation_assignments
```sql
CREATE TABLE rotation_assignments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
    rotation_id BIGINT UNSIGNED NOT NULL, -- FK -> employee_rotations.id
    start_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL, -- FK -> users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (rotation_id) REFERENCES employee_rotations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

# Timekeeping Module Tables (Expanded)

### work_schedules
```sql
CREATE TABLE work_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    description TEXT NULL,
    monday_start TIME NULL,
    monday_end TIME NULL,
    tuesday_start TIME NULL,
    tuesday_end TIME NULL,
    wednesday_start TIME NULL,
    wednesday_end TIME NULL,
    thursday_start TIME NULL,
    thursday_end TIME NULL,
    friday_start TIME NULL,
    friday_end TIME NULL,
    saturday_start TIME NULL,
    saturday_end TIME NULL,
    sunday_start TIME NULL,
    sunday_end TIME NULL,
    lunch_break_duration INT NULL,
    morning_break_duration INT NULL,
    afternoon_break_duration INT NULL,
    overtime_threshold INT NULL,
    overtime_rate_multiplier DECIMAL(3,2) DEFAULT 1.25,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL, -- FK -> users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### employee_schedules
```sql
CREATE TABLE employee_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
    work_schedule_id BIGINT UNSIGNED NOT NULL, -- FK -> work_schedules.id
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL, -- FK -> users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (work_schedule_id) REFERENCES work_schedules(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### attendance_events
```sql
CREATE TABLE attendance_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
    event_date DATE NOT NULL,
    event_time TIMESTAMP NOT NULL,
    event_type ENUM('time_in','time_out','break_start','break_end','overtime_start','overtime_end') NOT NULL,
    source ENUM('manual','imported','system') NOT NULL,
    imported_batch_id BIGINT UNSIGNED NULL, -- FK -> import_batches.id
    is_corrected BOOLEAN DEFAULT FALSE,
    original_time TIMESTAMP NULL,
    correction_reason TEXT NULL,
    corrected_by BIGINT UNSIGNED NULL, -- FK -> users.id
    corrected_at TIMESTAMP NULL,
    location VARCHAR(191) NULL,
    notes TEXT NULL,
    created_by BIGINT UNSIGNED NULL, -- FK -> users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (imported_batch_id) REFERENCES import_batches(id),
    FOREIGN KEY (corrected_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### daily_attendance_summary
```sql
CREATE TABLE daily_attendance_summary (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
    attendance_date DATE NOT NULL,
    work_schedule_id BIGINT UNSIGNED NOT NULL, -- FK -> work_schedules.id
    time_in TIMESTAMP NULL,
    time_out TIMESTAMP NULL,
    break_start TIMESTAMP NULL,
    break_end TIMESTAMP NULL,
    total_hours_worked DECIMAL(4,2) NULL,
    regular_hours DECIMAL(4,2) NULL,
    overtime_hours DECIMAL(4,2) NULL,
    break_duration INT NULL,
    is_present BOOLEAN DEFAULT FALSE,
    is_late BOOLEAN DEFAULT FALSE,
    is_undertime BOOLEAN DEFAULT FALSE,
    is_overtime BOOLEAN DEFAULT FALSE,
    late_minutes INT NULL,
    undertime_minutes INT NULL,
    leave_request_id BIGINT UNSIGNED NULL, -- FK -> leave_requests.id
    is_on_leave BOOLEAN DEFAULT FALSE,
    calculated_at TIMESTAMP NULL,
    is_finalized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (work_schedule_id) REFERENCES work_schedules(id),
    FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id)
);
```

### import_batches
```sql
CREATE TABLE import_batches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(191) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    import_type ENUM('attendance','schedule','correction') NOT NULL,
    total_records INT NOT NULL,
    processed_records INT NOT NULL,
    successful_records INT NOT NULL,
    failed_records INT NOT NULL,
    status ENUM('uploaded','processing','completed','failed') NOT NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    error_log TEXT NULL,
    imported_by BIGINT UNSIGNED NOT NULL, -- FK -> users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (imported_by) REFERENCES users(id)
);
```

### import_errors
```sql
CREATE TABLE import_errors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    import_batch_id BIGINT UNSIGNED NOT NULL, -- FK -> import_batches.id
    row_number INT NOT NULL,
    employee_identifier VARCHAR(191) NOT NULL,
    error_type ENUM('invalid_employee','invalid_time','duplicate_entry','validation_error') NOT NULL,
    error_message TEXT NOT NULL,
    raw_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (import_batch_id) REFERENCES import_batches(id)
);
```

### overtime_requests
```sql
CREATE TABLE overtime_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
    request_date DATE NOT NULL,
    planned_start_time TIMESTAMP NOT NULL,
    planned_end_time TIMESTAMP NOT NULL,
    planned_hours DECIMAL(4,2) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending','approved','rejected','completed') DEFAULT 'pending',
    approved_by BIGINT UNSIGNED NULL, -- FK -> users.id
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    actual_start_time TIMESTAMP NULL,
    actual_end_time TIMESTAMP NULL,
    actual_hours DECIMAL(4,2) NULL,
    created_by BIGINT UNSIGNED NOT NULL, -- FK -> users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```
---
## Key Workflows

### 1. Shift Scheduling
- HR Manager defines standard and custom schedules (e.g., 8am-5pm, 10pm-6am).
- HR Staff assigns employees to schedules for specific periods.
- Schedules can be recurring or one-off (e.g., for special projects).

### 2. Rotation Planning
- HR Manager creates rotation patterns (e.g., 4 days work, 2 days off).
- Assigns employees or teams to rotation patterns.
- System generates shift assignments based on rotation and calendar.

### 3. Daily Assignment Tracking
- HR Staff records daily assignments, including location and shift details.
- Overtime and special assignments are flagged for payroll.
- Changes are logged for audit and analytics.

### 4. Workforce Analytics
- Generate reports on:
	- Coverage gaps (unassigned shifts)
	- Overtime frequency
	- Schedule adherence (late/early/absent)
	- Rotation effectiveness

---

## Integration Points
- **Timekeeping:**
	- Emits shift assignments to `attendance_events` and `daily_attendance_summary` for validation.
	- Used to validate late/undertime/overtime.
- **Payroll:**
	- Provides data for rotation premiums, overtime, and special pay.
- **Appraisal:**
	- Supplies attendance and assignment data for performance scoring.

---

## Roles & Permissions
- **HR Manager:** Full access to create, edit, and approve schedules, rotations, and assignments.
- **HR Staff:** Can input, update, and adjust assignments, but cannot approve or delete master schedules/rotations.

This project uses (or should use) `spatie/laravel-permission` for roles and permissions so that module-level guards and permissions are consistent across the system. Example permission names for this module:

- `workforce.schedules.create`
- `workforce.schedules.update`
- `workforce.schedules.delete`
- `workforce.assignments.create`
- `workforce.assignments.update`
- `workforce.assignments.view`

Mapping guidance:

- Seed roles and permissions in a `RolesAndPermissionsSeeder` and reference them by name in code and gates.
- Use the `HasRoles` trait on the `User` model (`use Spatie\Permission\Traits\HasRoles;`) and check `hasRole('HR Manager')` or `can('workforce.schedules.create')` in controllers/policies.
- Use `role_templates` (see `SYSTEM_ONBOARDING_WORKFLOW.md`) to keep onboarding-driven role creation reproducible across environments.

---

## Implementation Phases

### Phase 1: Foundation Models & Migrations
- [ ] Create Eloquent models for schedules, assignments, rotations
- [ ] Create migrations for all tables
- [ ] Seeders for standard schedules and sample rotations

### Phase 2: Repository & Service Layer
- [ ] Define repository interfaces for schedule, assignment, and rotation management
- [ ] Implement Eloquent repositories
- [ ] Create services for schedule generation, rotation assignment, and analytics

### Phase 3: UI & Workflow Integration
- [ ] Build React/Inertia.js pages for schedule and assignment management
- [ ] Integrate with Timekeeping and Payroll modules
- [ ] Add reporting and analytics dashboards

---

## Future Refactor: Domain Layer
When the system is refactored to MVCSR + Domain, move the following to the Domain layer:
- Rotation pattern validation and invariants
- Overtime/assignment eligibility rules
- Schedule conflict detection

---

**Dependencies:** HR Module (employee data), Timekeeping Module (attendance), Payroll Module (pay calculations), Appraisal Module (performance data)
