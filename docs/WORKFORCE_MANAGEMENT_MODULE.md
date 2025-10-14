
# Workforce Management Module - Architecture & Implementation Plan

## Module Overview
The Workforce Management Module is responsible for all aspects of workforce scheduling, shift and rotation planning, daily assignment tracking, and workforce analytics for Cathay Metal Corporation. It ensures that employees are assigned to the correct shifts and rotations, and provides the data foundation for timekeeping, payroll, and performance appraisal.

## Module Goals
1. **Shift Scheduling:** Define and manage work schedules for all departments and employee groups.
2. **Rotation Planning:** Create and manage rotation patterns for employees (e.g., 4x2, 6x1, night/day shifts).
3. **Daily Assignment Tracking:** Assign employees to specific shifts and locations on a daily basis.
4. **Workforce Analytics:** Generate reports on coverage, overtime, and schedule adherence.
5. **Integration:** Provide data to Timekeeping (for attendance validation), Payroll (for premiums), and Appraisal (for productivity scoring).

---

## Database Schema (Workforce Management Module)

### workforce_schedules
```sql
- id (primary key)
- name (string, required) # "Standard Office Hours", "Night Shift", etc.
- description (text, nullable)
- effective_date (date)
- expires_at (date, nullable)
- created_by (foreign key to users)
- created_at, updated_at
```

### shift_assignments
```sql
- id (primary key)
- employee_id (foreign key to employees)
- schedule_id (foreign key to workforce_schedules)
- date (date)
- shift_start (time)
- shift_end (time)
- location (string, nullable)
- is_overtime (boolean, default false)
- created_by (foreign key to users)
- created_at, updated_at
```

### employee_rotations
```sql
- id (primary key)
- name (string, required) # "4x2 Rotation", etc.
- pattern_json (json) # Serialized pattern (e.g., ["Day", "Day", "Night", "Off", ...])
- description (text, nullable)
- created_by (foreign key to users)
- created_at, updated_at
```

### rotation_assignments
```sql
- id (primary key)
- employee_id (foreign key to employees)
- rotation_id (foreign key to employee_rotations)
- start_date (date)
- end_date (date, nullable)
- is_active (boolean, default true)
- created_by (foreign key to users)
- created_at, updated_at
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
