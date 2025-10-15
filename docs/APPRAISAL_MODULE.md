
# Appraisal Module - Architecture & Implementation Plan

## Module Overview

The Appraisal Module manages performance review cycles, scoring, feedback, and rehire recommendations for all employees. It integrates with Timekeeping and Workforce Management to provide a holistic view of employee performance, and its outputs are used by HR and Payroll for separation and rehire decisions.

**Manufacturing Employees & Supervisor Access:**
Currently, supervisors of manufacturing employees and manufacturing employees themselves do not have access to the system. All appraisal, performance, and HR-related information is managed and accessed by HR Staff and Admin Officers only.

**Future Option:**
If required, the system can be extended to include an employee portal and supervisor interface, allowing direct access for manufacturing employees and their supervisors to view relevant information, submit requests, or participate in appraisals. This is not enabled by default and should be clarified with the client before implementation.

**Employee Portal & Access Policy:**
By default, employees do not have direct access to a self-service portal for viewing appraisals, payslips, or submitting requests. All requests and information (including appraisal results, leave requests, and payslip inquiries) are routed through HR Staff, who act as the point of contact for employees.

**Optional Self-Service (Configurable):**
If the client prefers, the system can be configured to allow employees limited self-service access for:
- Viewing their own payslips
- Viewing their own appraisal/performance results
- Submitting leave requests (e.g., SL, VL, etc.)
This access is disabled by default and can be enabled per client requirements. Please clarify with the client before enabling any employee self-service features.

---

## Module Goals
1. **Performance Review Management:** Create, schedule, and manage appraisal cycles for all employees.
2. **Scoring & Feedback:** Collect quantitative and qualitative feedback from supervisors, peers, and self-assessments.
3. **Attendance & Violation Integration:** Factor in attendance, punctuality, and disciplinary records from Timekeeping and Workforce modules.
4. **Rehire Recommendation:** Generate rehire eligibility based on appraisal results and business rules.
5. **Employee Self-Service:** Allow employees to view their own appraisal results and feedback.
6. **Analytics & Reporting:** Provide HR with insights into performance trends, high/low performers, and rehire statistics.

---

## Module Dependencies
- **HR Module:** Employee master data, department structure
- **Timekeeping Module:** Attendance, lateness, violation data
- **Workforce Management:** Rotation and assignment history
- **Payroll Module:** For separation and final pay adjustments
- **Foundation:** User management, roles, permissions

---

## Database Schema (Appraisal Module)

### appraisals
```sql
CREATE TABLE appraisals (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
	cycle_id BIGINT UNSIGNED NOT NULL,    -- FK -> appraisal_cycles.id
	status ENUM('draft','in_progress','completed','acknowledged') DEFAULT 'draft',
	overall_score DECIMAL(5,2) NULL,
	feedback TEXT NULL,
	created_by BIGINT UNSIGNED NOT NULL,  -- FK -> users.id
	updated_by BIGINT UNSIGNED NULL,      -- FK -> users.id
	created_at TIMESTAMP,
	updated_at TIMESTAMP,
	deleted_at TIMESTAMP NULL
);
```

### appraisal_cycles
```sql
CREATE TABLE appraisal_cycles (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL, -- e.g. "2025 Annual Review"
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	status ENUM('open','closed') DEFAULT 'open',
	created_by BIGINT UNSIGNED NOT NULL,  -- FK -> users.id
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);
```

### appraisal_scores
```sql
CREATE TABLE appraisal_scores (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	appraisal_id BIGINT UNSIGNED NOT NULL, -- FK -> appraisals.id
	criterion VARCHAR(100) NOT NULL,       -- e.g. "Attendance", "Teamwork"
	score DECIMAL(5,2) NOT NULL,
	notes TEXT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);
```

### rehire_recommendations
```sql
CREATE TABLE rehire_recommendations (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
	appraisal_id BIGINT UNSIGNED NOT NULL, -- FK -> appraisals.id
	recommendation ENUM('eligible','not_recommended','review_required') DEFAULT 'review_required',
	notes TEXT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);
```

---

## Key Workflows

### 1. Appraisal Cycle Creation
- HR creates a new appraisal cycle (e.g., annual, semi-annual)
- Defines review period, criteria, and scoring rubrics

### 2. Appraisal Assignment & Collection
- HR assigns appraisals to employees (by department, team, or individually)
- Supervisors, peers, and/or self-assessments are collected
- Scores and feedback are entered per criterion

### 3. Review & Acknowledgment
- HR reviews submitted appraisals
- Employees acknowledge receipt and can add comments

### 4. Rehire Recommendation
- System calculates rehire eligibility based on scores, attendance, and violations
- HR can override or add notes
- Recommendation is stored and visible to HR and Payroll

### 5. Integration Points
- Attendance and violation data are automatically imported from Timekeeping
- Workforce history is referenced for context
- Rehire recommendations are used by Payroll for separation/final pay

---

## Implementation Phases

### Phase 1: Foundation Models & Migrations (Week 1)
- [ ] Create Eloquent models for appraisals, cycles, scores, recommendations
- [ ] Create database migrations for all tables
- [ ] Set up model factories and seeders

### Phase 2: Appraisal Workflow Logic (Week 2)
- [ ] Implement appraisal cycle creation and assignment logic
- [ ] Build forms for score and feedback entry
- [ ] Add validation and business rules for scoring

### Phase 3: Integration & Automation (Week 3)
- [ ] Integrate with Timekeeping for attendance/violation data
- [ ] Automate rehire recommendation logic
- [ ] Add notifications for review/acknowledgment

### Phase 4: Self-Service & Analytics (Week 4)
- [ ] Employee self-service portal for viewing appraisals
- [ ] HR analytics dashboard for performance trends

### Phase 5: Testing & Documentation (Week 5)
- [ ] Write unit and integration tests
- [ ] Complete user and admin documentation

---

## Roles & Access
- **HR Manager / HR Staff:** Create/manage cycles, assign appraisals, review results, override recommendations, and serve as the main point of contact for all employee requests and information.
- **Supervisors/Peers:** Enter scores and feedback (if enabled) 
- **Office Staff and Manufacturing Employees:**
	- By default: No direct access; all requests and information go through HR Staff.
	- Optional (if enabled): May view own appraisals, payslips, and submit leave requests via self-service portal.

---

## Integration
- **Timekeeping:** Attendance, lateness, and violation data for scoring
- **Workforce Management:** Rotation and assignment history for context
- **Payroll:** Rehire recommendations for separation/final pay
- **HR Core:** Employee master data and department structure

---

## Status & Timeline

**Last Updated:** October 15 2025

**Estimated Timeline:**
- Appraisal module implementation: 4-5 weeks after Timekeeping module
- Full system (all modules): Target completion within 2 months from project start

**Note:** This document is current as of the above date. Timelines may be adjusted based on project needs and resource availability.
