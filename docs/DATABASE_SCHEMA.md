

# HRIS Database Schema — Complete System Index

**Purpose:** This document provides a detailed, module-referenced index of all database tables required for the SyncingSteel HRIS. For each module, all required tables are listed with key fields and a reference to the module documentation for full details, workflows, and field explanations.

**Stack:** Laravel (MySQL/Postgres), React + Inertia.js frontend. Single-tenant, scalable, modular.

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Module Table Index](#module-table-index)
    - [User Management & RBAC](#user-management--rbac)
    - [HR Core](#hr-core)
    - [Payroll](#payroll)
    - [Timekeeping](#timekeeping)
    - [Workforce Management](#workforce-management)
    - [ATS (Applicant Tracking System)](#ats-applicant-tracking-system)
    - [Onboarding](#onboarding)
    - [Appraisal & Rehire](#appraisal--rehire)
    - [System & Support Tables](#system--support-tables)
3. [Foreign Key & Relationship Notes](#foreign-key--relationship-notes)
4. [See Also: Module Docs](#see-also-module-docs)

---

## Design Principles

- **Normalization (3NF)** for data integrity and maintainability
- **Soft deletes** (`deleted_at`) for auditability using Laravel `SoftDeletes`
- **IDs:** `BIGINT` auto-increment primary keys (UUIDs optional for future)
- **Foreign keys** with strict referential integrity and appropriate `ON DELETE` rules
- **Auditability:** All critical changes logged in `activity_logs` and `audit_trails`
- **Government Compliance:** All fields required for BIR, SSS, PhilHealth, Pag-IBIG, DOLE
- **Extensibility:** Modular, with clear boundaries for each domain

---

## Module Table Index

### User Management & RBAC ([USER_MANAGEMENT.md](USER_MANAGEMENT.md), [RBAC_MATRIX.md](RBAC_MATRIX.md))
- `users` — system authentication & accounts
- `profiles` — person identity (name, DOB, contact)
- `government_ids` — SSS/TIN/PhilHealth/Pag-IBIG etc. (linked to `profiles`)
- `user_invitations` — invitation-based onboarding, tokens, status, audit
- `roles`, `permissions`, `role_user`, `permission_user` — RBAC (Spatie-compatible)
- `role_templates` — reusable role/permission sets for onboarding
- `audit_trails`, `activity_logs` — all critical changes, user lifecycle, RBAC changes
- `user_audit_logs` — user-specific audit trail (creation, invite, update, role change, deactivate, delete)

### HR Core ([HR_MODULE_ARCHITECTURE.md](HR_MODULE_ARCHITECTURE.md))
- `employees` — employment instances/contracts (bidirectional link to `users`), all personal, employment, government, family, and emergency info
- `employee_children` — dependents/children of employees
- `employee_remarks` — employment events, status changes, disciplinary actions, rehire notes
- `departments`, `teams`, `team_members` — org structure, department/production/security, team assignments
- `leave_requests`, `leave_balances` — time-off workflows, multi-level approval, balance tracking
- `document_templates`, `generated_documents`, `documents` — document management, contracts, certificates, leave slips
- `notifications` — system/user notifications
# HR Module Tables (Expanded)

### employees
```sql
CREATE TABLE employees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL, -- FK to users.id, nullable for unlinked employees
    employee_number VARCHAR(20) NOT NULL UNIQUE, -- EMP-YYYY-NNNN
    lastname VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100) NULL,
    address TEXT,
    contact_number VARCHAR(30) NULL,
    email_personal VARCHAR(191) NULL,
    place_of_birth VARCHAR(100) NULL,
    date_of_birth DATE NULL,
    civil_status ENUM('single','married','divorced','widowed') NOT NULL,
    gender ENUM('male','female') NOT NULL,
    department_id BIGINT UNSIGNED NOT NULL,
    position VARCHAR(100) NULL,
    employment_type ENUM('regular','contractual','probationary','consultant') NOT NULL,
    date_employed DATE NOT NULL,
    date_regularized DATE NULL,
    immediate_supervisor_id BIGINT UNSIGNED NULL, -- FK to employees.id
    sss_no VARCHAR(30) UNIQUE NULL,
    pagibig_no VARCHAR(30) UNIQUE NULL,
    tin_no VARCHAR(30) UNIQUE NULL,
    philhealth_no VARCHAR(30) UNIQUE NULL,
    spouse_name VARCHAR(100) NULL,
    spouse_dob DATE NULL,
    spouse_occupation VARCHAR(100) NULL,
    father_name VARCHAR(100) NULL,
    father_dob DATE NULL,
    mother_name VARCHAR(100) NULL,
    mother_dob DATE NULL,
    emergency_contact_name VARCHAR(100) NULL,
    emergency_contact_relationship VARCHAR(50) NULL,
    emergency_contact_number VARCHAR(30) NULL,
    status ENUM('active','archived','terminated','on_leave','suspended') DEFAULT 'active',
    termination_date DATE NULL,
    termination_reason TEXT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NOT NULL,
    rehired_of BIGINT UNSIGNED NULL, -- FK to employees.id
    rehire_recommendation ENUM('eligible','not_recommended','review_required') DEFAULT 'review_required',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### employee_children
```sql
CREATE TABLE employee_children (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    child_name VARCHAR(100) NOT NULL,
    child_dob DATE NULL,
    child_gender ENUM('male','female') NOT NULL,
    is_student BOOLEAN DEFAULT FALSE,
    school_name VARCHAR(100) NULL,
    remarks TEXT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### employee_remarks
```sql
CREATE TABLE employee_remarks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    remark_type ENUM('rehired','end_of_contract','leave_of_absence','suspension','promotion','demotion','salary_adjustment','disciplinary_action') NOT NULL,
    title VARCHAR(100) NOT NULL,
    note TEXT,
    effective_date DATE NOT NULL,
    expiry_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### leave_requests
```sql
CREATE TABLE leave_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    leave_type ENUM('VL','SL','EL','ML','PL','BL','SP','LWOP') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count DECIMAL(4,2) NOT NULL,
    half_day BOOLEAN DEFAULT FALSE,
    reason TEXT,
    status ENUM('draft','pending','approved','rejected','cancelled') DEFAULT 'draft',
    submitted_at TIMESTAMP NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    deducted_days DECIMAL(4,2) NULL,
    remaining_balance DECIMAL(4,2) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### leave_balances
```sql
CREATE TABLE leave_balances (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    year INT NOT NULL,
    leave_type ENUM('VL','SL','EL','ML','PL','BL','SP') NOT NULL,
    earned_days DECIMAL(4,2) NOT NULL,
    used_days DECIMAL(4,2) DEFAULT 0,
    remaining_days DECIMAL(4,2) NOT NULL,
    carried_forward DECIMAL(4,2) DEFAULT 0,
    expires_at DATE NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### document_templates
```sql
CREATE TABLE document_templates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('employment_contract','job_offer','leave_slip','certificate_of_employment','excuse_slip','memorandum') NOT NULL,
    template_path VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    variables JSON NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### generated_documents
```sql
CREATE TABLE generated_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    template_id BIGINT UNSIGNED NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    generated_by BIGINT UNSIGNED NOT NULL,
    generated_at TIMESTAMP NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Payroll ([PAYROLL_MODULE_ARCHITECTURE.md](PAYROLL_MODULE_ARCHITECTURE.md), [HR_PAYROLL_CONFIG.md](HR_PAYROLL_CONFIG.md))
- `payroll_periods` — pay period definitions, status, summary fields, audit
- `employee_payroll_info` — salary, tax, government, bank, de minimis, and benefit info per employee
- `salary_components` — all earnings, deductions, benefits, taxes, contributions, loans, allowances, with calculation and display settings
- `employee_salary_components` — per-employee config for all salary components, frequency, proration, attendance, etc.
- `payroll_calculations` — per-period, per-employee payroll snapshot (all breakdowns, YTD, status, errors, audit)
- `payroll_calculation_details` — per-component calculation breakdown, formula, adjustments
- `payroll_adjustments` — manual adjustments, overrides, approvals
- `government_contribution_rates` — SSS, PhilHealth, Pag-IBIG, EC, with brackets, rates, caps, effective dates
- `tax_brackets` — BIR tax tables, all statuses, effective dates
- `payslips` — detailed payslip records, file info, distribution, acknowledgment
- `government_reports` — all BIR, SSS, PhilHealth, Pag-IBIG, bank, and summary reports
- `government_remittances` — remittance tracking, payment info, status, attachments
- `bank_payroll_files` — generated bank files for ATM payroll, upload status
- `payroll_journal_entries` — accounting journal entries, export info
- `employee_loans` — SSS, Pag-IBIG, company, cash advance loans, amortization
- `loan_payments` — per-loan, per-period payment tracking
- `payroll_audit_logs` — audit trail for all payroll actions

### Timekeeping ([TIMEKEEPING_MODULE_ARCHITECTURE.md](TIMEKEEPING_MODULE_ARCHITECTURE.md))
- `work_schedules`, `employee_schedules` — shift/assignment
- `attendance_events`, `daily_attendance_summary` — raw and processed attendance
- `import_batches`, `import_errors` — timesheet import
- `overtime_requests` — overtime workflow
- `time_logs`, `devices`, `shifts`, `employee_shifts` — hardware and shift management

### Workforce Management ([WORKFORCE_MANAGEMENT_MODULE.md](WORKFORCE_MANAGEMENT_MODULE.md))
- `workforce_schedules`, `shift_assignments`, `employee_rotations`, `rotation_assignments` — advanced scheduling

### ATS (Applicant Tracking System) ([ATS_MODULE.md](ATS_MODULE.md))
- `candidates`, `job_postings`, `applications`, `interviews`, `candidate_notes` — recruitment

### Onboarding ([ONBOARDING_MODULE.md](ONBOARDING_MODULE.md), [ONBOARDING_WORKFLOW.md](ONBOARDING_WORKFLOW.md))
- `onboarding_checklists`, `onboarding_tasks`, `onboarding_documents` — onboarding workflow
- `system_onboarding` — system-wide onboarding status, setup progress
- `onboarding_skips` — records of onboarding skip actions, user, timestamp, reason
# User Management & RBAC Tables (Expanded)

### users
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    invited_by BIGINT UNSIGNED NULL,
    created_by BIGINT UNSIGNED NULL,
    suspended_at TIMESTAMP NULL,
    archived_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### user_invitations
```sql
CREATE TABLE user_invitations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    invited_by BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NULL,
    department_id BIGINT UNSIGNED NULL,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP NULL,
    declined_at TIMESTAMP NULL,
    revoked_at TIMESTAMP NULL,
    status ENUM('pending','accepted','declined','revoked','expired') DEFAULT 'pending',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### profiles
```sql
CREATE TABLE profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NULL,
    dob DATE NULL,
    contact_number VARCHAR(30) NULL,
    address TEXT NULL,
    emergency_contact VARCHAR(100) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### government_ids
```sql
CREATE TABLE government_ids (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    profile_id BIGINT UNSIGNED NOT NULL,
    sss_number VARCHAR(20) NULL,
    tin_number VARCHAR(20) NULL,
    philhealth_number VARCHAR(20) NULL,
    pagibig_number VARCHAR(20) NULL,
    passport_number VARCHAR(20) NULL,
    drivers_license VARCHAR(20) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

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

### permissions
```sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### role_user (pivot)
```sql
CREATE TABLE role_user (
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    assigned_by BIGINT UNSIGNED NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, role_id)
);
```

### permission_user (pivot)
```sql
CREATE TABLE permission_user (
    user_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    granted_by BIGINT UNSIGNED NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, permission_id)
);
```

### role_templates
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

### user_audit_logs
```sql
CREATE TABLE user_audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    actor_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(50) NOT NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP
);
```

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

### Appraisal & Rehire ([APPRAISAL_MODULE.md](APPRAISAL_MODULE.md))
- `appraisals`, `appraisal_cycles`, `appraisal_scores`, `rehire_recommendations` — performance and rehire

### System & Support Tables
- `jobs`, `job_batches`, `failed_jobs`, `sessions`, `personal_access_tokens` — Laravel/system support

---

## Foreign Key & Relationship Notes

- All `*_id` columns reference their parent tables, with `ON DELETE CASCADE` for required relationships and `ON DELETE SET NULL` for optional ones.
- All tables use `BIGINT UNSIGNED` for PKs and FKs.
- All tables (except pure pivot tables) have `created_at`, `updated_at`, and most have `deleted_at` for soft deletes.
- All tables use strict foreign key constraints.
- All tables are designed for 3NF normalization and scalability.

---

## See Also: Module Docs

- For full field lists, workflows, and business rules, see the module documentation in `/docs`:
    - [USER_MANAGEMENT.md](USER_MANAGEMENT.md)
    - [RBAC_MATRIX.md](RBAC_MATRIX.md)
    - [HR_MODULE_ARCHITECTURE.md](HR_MODULE_ARCHITECTURE.md)
    - [PAYROLL_MODULE_ARCHITECTURE.md](PAYROLL_MODULE_ARCHITECTURE.md)
    - [HR_PAYROLL_CONFIG.md](HR_PAYROLL_CONFIG.md)
    - [TIMEKEEPING_MODULE_ARCHITECTURE.md](TIMEKEEPING_MODULE_ARCHITECTURE.md)
    - [WORKFORCE_MANAGEMENT_MODULE.md](WORKFORCE_MANAGEMENT_MODULE.md)
    - [ATS_MODULE.md](ATS_MODULE.md)
    - [ONBOARDING_MODULE.md](ONBOARDING_MODULE.md)
    - [ONBOARDING_WORKFLOW.md](ONBOARDING_WORKFLOW.md)
    - [APPRAISAL_MODULE.md](APPRAISAL_MODULE.md)

---


# [The detailed SQL table definitions follow below.]

## Payroll Module Tables (Expanded for Philippine Compliance)

### payroll_periods
```sql
CREATE TABLE payroll_periods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    period_type ENUM('weekly','bi_weekly','semi_monthly','monthly') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cutoff_date DATE NULL,
    pay_date DATE NOT NULL,
    status ENUM('draft','importing','calculating','calculated','reviewing','approved','bank_file_generated','paid','closed') DEFAULT 'draft',
    processed_at TIMESTAMP NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    finalized_by BIGINT UNSIGNED NULL,
    finalized_at TIMESTAMP NULL,
    total_employees INT DEFAULT 0,
    total_gross_pay DECIMAL(14,2) DEFAULT 0,
    total_deductions DECIMAL(14,2) DEFAULT 0,
    total_net_pay DECIMAL(14,2) DEFAULT 0,
    total_employer_cost DECIMAL(14,2) DEFAULT 0,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### employee_payroll_info
```sql
CREATE TABLE employee_payroll_info (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    salary_type ENUM('monthly','daily','hourly','contractual','project_based') NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    daily_rate DECIMAL(8,2) NULL,
    hourly_rate DECIMAL(8,2) NULL,
    tax_status ENUM('Z','S','ME','S1','ME1','S2','ME2','S3','ME3','S4','ME4') NOT NULL,
    rdo_code VARCHAR(10) NULL,
    withholding_tax_exemption DECIMAL(8,2) DEFAULT 0,
    is_tax_exempt BOOLEAN DEFAULT FALSE,
    is_substituted_filing BOOLEAN DEFAULT FALSE,
    sss_number VARCHAR(20) NULL,
    philhealth_number VARCHAR(20) NULL,
    pagibig_number VARCHAR(20) NULL,
    tin_number VARCHAR(20) NULL,
    sss_bracket VARCHAR(20) NULL,
    is_sss_voluntary BOOLEAN DEFAULT FALSE,
    philhealth_is_indigent BOOLEAN DEFAULT FALSE,
    pagibig_employee_rate DECIMAL(4,2) DEFAULT 1.00,
    payment_method ENUM('bank_transfer','cash','check') NOT NULL,
    bank_name VARCHAR(100) NULL,
    bank_code VARCHAR(20) NULL,
    bank_account_number VARCHAR(50) NULL,
    bank_account_name VARCHAR(100) NULL,
    is_entitled_to_rice BOOLEAN DEFAULT TRUE,
    is_entitled_to_uniform BOOLEAN DEFAULT TRUE,
    is_entitled_to_laundry BOOLEAN DEFAULT TRUE,
    is_entitled_to_medical BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### salary_components
```sql
CREATE TABLE salary_components (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    component_type ENUM('earning','deduction','benefit','tax','contribution','loan','allowance') NOT NULL,
    category ENUM('regular','overtime','holiday','leave','allowance','deduction','tax','contribution','loan','adjustment') NOT NULL,
    calculation_method ENUM('fixed_amount','percentage_of_basic','percentage_of_gross','per_hour','per_day','per_unit','percentage_of_component') NOT NULL,
    default_amount DECIMAL(10,2) NULL,
    default_percentage DECIMAL(5,2) NULL,
    reference_component_id BIGINT UNSIGNED NULL,
    ot_multiplier DECIMAL(4,2) NULL,
    is_premium_pay BOOLEAN DEFAULT FALSE,
    is_taxable BOOLEAN DEFAULT TRUE,
    is_deminimis BOOLEAN DEFAULT FALSE,
    deminimis_limit_monthly DECIMAL(10,2) NULL,
    deminimis_limit_annual DECIMAL(10,2) NULL,
    is_13th_month BOOLEAN DEFAULT FALSE,
    is_other_benefits BOOLEAN DEFAULT FALSE,
    affects_sss BOOLEAN DEFAULT FALSE,
    affects_philhealth BOOLEAN DEFAULT FALSE,
    affects_pagibig BOOLEAN DEFAULT FALSE,
    affects_gross_compensation BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    is_displayed_on_payslip BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_system_component BOOLEAN DEFAULT FALSE,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### employee_salary_components
```sql
CREATE TABLE employee_salary_components (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    salary_component_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NULL,
    percentage DECIMAL(5,2) NULL,
    units DECIMAL(8,2) NULL,
    frequency ENUM('per_payroll','monthly','quarterly','semi_annual','annually','one_time') NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_prorated BOOLEAN DEFAULT FALSE,
    requires_attendance BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### payroll_calculations
```sql
CREATE TABLE payroll_calculations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_period_id BIGINT UNSIGNED NOT NULL,
    employee_id BIGINT UNSIGNED NOT NULL,
    employee_number VARCHAR(30) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    department_id BIGINT UNSIGNED NOT NULL,
    position_id BIGINT UNSIGNED NULL,
    employment_status VARCHAR(50) NOT NULL,
    tin_number VARCHAR(20) NULL,
    sss_number VARCHAR(20) NULL,
    philhealth_number VARCHAR(20) NULL,
    pagibig_number VARCHAR(20) NULL,
    salary_type VARCHAR(20) NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    daily_rate DECIMAL(8,2) NULL,
    hourly_rate DECIMAL(8,2) NULL,
    scheduled_days DECIMAL(4,2) NOT NULL,
    days_worked DECIMAL(4,2) NOT NULL,
    days_absent DECIMAL(4,2) DEFAULT 0,
    days_late DECIMAL(4,2) DEFAULT 0,
    days_undertime DECIMAL(4,2) DEFAULT 0,
    regular_hours DECIMAL(6,2) NOT NULL,
    overtime_regular_hours DECIMAL(6,2) DEFAULT 0,
    overtime_restday_hours DECIMAL(6,2) DEFAULT 0,
    overtime_special_holiday_hours DECIMAL(6,2) DEFAULT 0,
    overtime_regular_holiday_hours DECIMAL(6,2) DEFAULT 0,
    night_differential_hours DECIMAL(6,2) DEFAULT 0,
    regular_holiday_hours DECIMAL(6,2) DEFAULT 0,
    special_holiday_hours DECIMAL(6,2) DEFAULT 0,
    leave_with_pay_hours DECIMAL(6,2) DEFAULT 0,
    leave_without_pay_hours DECIMAL(6,2) DEFAULT 0,
    basic_pay DECIMAL(10,2) NOT NULL,
    overtime_pay DECIMAL(10,2) DEFAULT 0,
    night_differential_pay DECIMAL(10,2) DEFAULT 0,
    holiday_pay DECIMAL(10,2) DEFAULT 0,
    leave_pay DECIMAL(10,2) DEFAULT 0,
    rice_allowance DECIMAL(8,2) DEFAULT 0,
    uniform_allowance DECIMAL(8,2) DEFAULT 0,
    laundry_allowance DECIMAL(8,2) DEFAULT 0,
    medical_allowance DECIMAL(8,2) DEFAULT 0,
    cola DECIMAL(8,2) DEFAULT 0,
    transportation_allowance DECIMAL(8,2) DEFAULT 0,
    meal_allowance DECIMAL(8,2) DEFAULT 0,
    communication_allowance DECIMAL(8,2) DEFAULT 0,
    bonuses DECIMAL(10,2) DEFAULT 0,
    incentives DECIMAL(10,2) DEFAULT 0,
    commissions DECIMAL(10,2) DEFAULT 0,
    retroactive_pay DECIMAL(10,2) DEFAULT 0,
    other_earnings DECIMAL(10,2) DEFAULT 0,
    thirteenth_month_pay DECIMAL(10,2) DEFAULT 0,
    other_benefits_pay DECIMAL(10,2) DEFAULT 0,
    gross_pay DECIMAL(10,2) NOT NULL,
    non_taxable_earnings DECIMAL(10,2) DEFAULT 0,
    total_earnings DECIMAL(10,2) NOT NULL,
    sss_employee DECIMAL(8,2) DEFAULT 0,
    sss_ec DECIMAL(6,2) DEFAULT 0,
    philhealth_employee DECIMAL(8,2) DEFAULT 0,
    pagibig_employee DECIMAL(8,2) DEFAULT 0,
    sss_employer DECIMAL(8,2) DEFAULT 0,
    philhealth_employer DECIMAL(8,2) DEFAULT 0,
    pagibig_employer DECIMAL(8,2) DEFAULT 0,
    taxable_income DECIMAL(10,2) NOT NULL,
    withholding_tax DECIMAL(10,2) DEFAULT 0,
    tax_status VARCHAR(10) NOT NULL,
    tardiness_deduction DECIMAL(8,2) DEFAULT 0,
    undertime_deduction DECIMAL(8,2) DEFAULT 0,
    absence_deduction DECIMAL(8,2) DEFAULT 0,
    sss_loan DECIMAL(8,2) DEFAULT 0,
    pagibig_loan DECIMAL(8,2) DEFAULT 0,
    company_loan DECIMAL(8,2) DEFAULT 0,
    cash_advance DECIMAL(8,2) DEFAULT 0,
    insurance_premium DECIMAL(8,2) DEFAULT 0,
    hmo_premium DECIMAL(8,2) DEFAULT 0,
    uniform_deduction DECIMAL(8,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,
    total_statutory_deductions DECIMAL(10,2) NOT NULL,
    total_other_deductions DECIMAL(10,2) NOT NULL,
    total_deductions DECIMAL(10,2) NOT NULL,
    net_pay DECIMAL(10,2) NOT NULL,
    employer_contributions DECIMAL(10,2) NOT NULL,
    total_employer_cost DECIMAL(10,2) NOT NULL,
    ytd_gross DECIMAL(12,2) DEFAULT 0,
    ytd_tax DECIMAL(12,2) DEFAULT 0,
    ytd_sss_employee DECIMAL(10,2) DEFAULT 0,
    ytd_sss_employer DECIMAL(10,2) DEFAULT 0,
    ytd_philhealth_employee DECIMAL(10,2) DEFAULT 0,
    ytd_philhealth_employer DECIMAL(10,2) DEFAULT 0,
    ytd_pagibig_employee DECIMAL(10,2) DEFAULT 0,
    ytd_pagibig_employer DECIMAL(10,2) DEFAULT 0,
    ytd_13th_month DECIMAL(10,2) DEFAULT 0,
    ytd_other_benefits DECIMAL(10,2) DEFAULT 0,
    ytd_deminimis DECIMAL(10,2) DEFAULT 0,
    ytd_net_pay DECIMAL(12,2) DEFAULT 0,
    calculation_version INT DEFAULT 1,
    calculation_notes TEXT NULL,
    has_adjustments BOOLEAN DEFAULT FALSE,
    has_errors BOOLEAN DEFAULT FALSE,
    error_messages TEXT NULL,
    is_finalized BOOLEAN DEFAULT FALSE,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP NULL,
    calculated_at TIMESTAMP,
    calculated_by BIGINT UNSIGNED NOT NULL,
    finalized_at TIMESTAMP NULL,
    finalized_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX(payroll_period_id, employee_id),
    INDEX(employee_id, is_finalized),
    INDEX(payroll_period_id, is_finalized)
);
```

### payroll_calculation_details
```sql
CREATE TABLE payroll_calculation_details (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_calculation_id BIGINT UNSIGNED NOT NULL,
    salary_component_id BIGINT UNSIGNED NOT NULL,
    component_name VARCHAR(100) NOT NULL,
    component_code VARCHAR(30) NOT NULL,
    component_type VARCHAR(20) NOT NULL,
    base_amount DECIMAL(10,2) NOT NULL,
    rate_or_percentage DECIMAL(8,4) NOT NULL,
    units DECIMAL(8,2) NULL,
    calculated_amount DECIMAL(10,2) NOT NULL,
    calculation_formula VARCHAR(255) NULL,
    calculation_notes TEXT NULL,
    is_adjustment BOOLEAN DEFAULT FALSE,
    adjusted_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP NULL
);
```

### payroll_adjustments
```sql
CREATE TABLE payroll_adjustments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_calculation_id BIGINT UNSIGNED NOT NULL,
    salary_component_id BIGINT UNSIGNED NULL,
    adjustment_type ENUM('add','deduct','override') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    reference_number VARCHAR(50) NULL,
    requested_by BIGINT UNSIGNED NOT NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### government_contribution_rates
```sql
CREATE TABLE government_contribution_rates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    contribution_type ENUM('sss','sss_ec','philhealth','pagibig') NOT NULL,
    bracket_name VARCHAR(50) NULL,
    min_salary DECIMAL(10,2) NOT NULL,
    max_salary DECIMAL(10,2) NULL,
    employee_contribution DECIMAL(8,2) NULL,
    employer_contribution DECIMAL(8,2) NULL,
    ec_contribution DECIMAL(6,2) NULL,
    total_contribution DECIMAL(8,2) NULL,
    employee_rate DECIMAL(6,4) NULL,
    employer_rate DECIMAL(6,4) NULL,
    minimum_contribution DECIMAL(8,2) NULL,
    maximum_contribution DECIMAL(8,2) NULL,
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### tax_brackets
```sql
CREATE TABLE tax_brackets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tax_status ENUM('Z','S','ME','S1','ME1','S2','ME2','S3','ME3','S4','ME4') NOT NULL,
    min_income DECIMAL(10,2) NOT NULL,
    max_income DECIMAL(10,2) NULL,
    base_tax DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,4) NOT NULL,
    excess_over DECIMAL(10,2) NOT NULL,
    description VARCHAR(100) NULL,
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### payslips
```sql
CREATE TABLE payslips (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_calculation_id BIGINT UNSIGNED NOT NULL,
    employee_id BIGINT UNSIGNED NOT NULL,
    payroll_period_id BIGINT UNSIGNED NOT NULL,
    payslip_number VARCHAR(30) NOT NULL UNIQUE,
    generated_at TIMESTAMP NOT NULL,
    pdf_file_path VARCHAR(255) NULL,
    pdf_file_size INT NULL,
    pdf_hash VARCHAR(64) NULL,
    distribution_method ENUM('email','portal','printed') NOT NULL,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP NULL,
    email_address VARCHAR(191) NULL,
    downloaded_by_employee BOOLEAN DEFAULT FALSE,
    downloaded_at TIMESTAMP NULL,
    printed BOOLEAN DEFAULT FALSE,
    printed_at TIMESTAMP NULL,
    printed_by BIGINT UNSIGNED NULL,
    acknowledged_by_employee BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMP NULL,
    generated_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### government_reports
```sql
CREATE TABLE government_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    report_type ENUM('bir_1601c','bir_1604c','bir_1604cf','bir_2316','bir_alphalist','sss_r3','sss_r5','philhealth_rf1','pagibig_mcrf','bank_file') NOT NULL,
    reporting_period VARCHAR(20) NOT NULL,
    period_type ENUM('monthly','quarterly','annual') NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    total_employees INT DEFAULT 0,
    total_gross_pay DECIMAL(14,2) DEFAULT 0,
    total_taxable_income DECIMAL(14,2) DEFAULT 0,
    total_contributions DECIMAL(14,2) DEFAULT 0,
    total_taxes DECIMAL(14,2) DEFAULT 0,
    total_employer_share DECIMAL(14,2) DEFAULT 0,
    report_file_path VARCHAR(255) NULL,
    report_file_name VARCHAR(100) NULL,
    report_file_size INT NULL,
    file_format ENUM('pdf','excel','csv','txt','dat') NOT NULL,
    report_file_hash VARCHAR(64) NULL,
    status ENUM('draft','generated','validated','submitted','accepted','rejected') DEFAULT 'draft',
    generated_at TIMESTAMP NULL,
    validated_at TIMESTAMP NULL,
    submitted_at TIMESTAMP NULL,
    submitted_by BIGINT UNSIGNED NULL,
    reference_number VARCHAR(50) NULL,
    acknowledgment_receipt VARCHAR(100) NULL,
    submission_notes TEXT NULL,
    generated_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### government_remittances
```sql
CREATE TABLE government_remittances (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    remittance_type ENUM('sss','philhealth','pagibig','bir_tax') NOT NULL,
    reporting_period VARCHAR(20) NOT NULL,
    total_employee_contribution DECIMAL(12,2) NOT NULL,
    total_employer_contribution DECIMAL(12,2) NOT NULL,
    total_ec_contribution DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NULL,
    payment_method ENUM('online','otc','bank') NULL,
    payment_reference_number VARCHAR(50) NULL,
    bank_name VARCHAR(100) NULL,
    check_number VARCHAR(50) NULL,
    transaction_number VARCHAR(50) NULL,
    status ENUM('pending','paid','confirmed') DEFAULT 'pending',
    paid_by BIGINT UNSIGNED NULL,
    confirmed_by BIGINT UNSIGNED NULL,
    confirmed_at TIMESTAMP NULL,
    payment_proof_path VARCHAR(255) NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### bank_payroll_files
```sql
CREATE TABLE bank_payroll_files (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_period_id BIGINT UNSIGNED NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    bank_code VARCHAR(20) NULL,
    file_name VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_format ENUM('csv','txt','excel','fixed_width') NOT NULL,
    file_size INT NOT NULL,
    file_hash VARCHAR(64) NULL,
    total_employees INT NOT NULL,
    total_amount DECIMAL(14,2) NOT NULL,
    status ENUM('generated','uploaded','processed','confirmed','failed') DEFAULT 'generated',
    generated_at TIMESTAMP NOT NULL,
    uploaded_at TIMESTAMP NULL,
    uploaded_by BIGINT UNSIGNED NULL,
    confirmation_number VARCHAR(50) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### payroll_journal_entries
```sql
CREATE TABLE payroll_journal_entries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_period_id BIGINT UNSIGNED NOT NULL,
    journal_entry_number VARCHAR(30) NOT NULL UNIQUE,
    journal_date DATE NOT NULL,
    total_salaries_wages DECIMAL(14,2) NOT NULL,
    total_employer_contributions DECIMAL(12,2) NOT NULL,
    total_employee_deductions DECIMAL(12,2) NOT NULL,
    total_tax_payable DECIMAL(12,2) NOT NULL,
    status ENUM('draft','posted','exported') DEFAULT 'draft',
    posted_at TIMESTAMP NULL,
    posted_by BIGINT UNSIGNED NULL,
    exported_at TIMESTAMP NULL,
    export_file_path VARCHAR(255) NULL,
    exported_to_system VARCHAR(50) NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### employee_loans
```sql
CREATE TABLE employee_loans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    loan_type ENUM('sss','pagibig','company','cash_advance') NOT NULL,
    loan_number VARCHAR(30) NOT NULL UNIQUE,
    principal_amount DECIMAL(10,2) NOT NULL,
    interest_rate DECIMAL(5,2) NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    monthly_amortization DECIMAL(8,2) NOT NULL,
    number_of_installments INT NOT NULL,
    installments_paid INT DEFAULT 0,
    remaining_balance DECIMAL(10,2) NOT NULL,
    start_deduction_period_id BIGINT UNSIGNED NOT NULL,
    last_deduction_period_id BIGINT UNSIGNED NULL,
    loan_date DATE NOT NULL,
    start_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    status ENUM('active','completed','cancelled','restructured') DEFAULT 'active',
    is_active BOOLEAN DEFAULT TRUE,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### loan_payments
```sql
CREATE TABLE loan_payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_loan_id BIGINT UNSIGNED NOT NULL,
    payroll_calculation_id BIGINT UNSIGNED NOT NULL,
    payroll_period_id BIGINT UNSIGNED NOT NULL,
    payment_amount DECIMAL(8,2) NOT NULL,
    principal_payment DECIMAL(8,2) NOT NULL,
    interest_payment DECIMAL(8,2) DEFAULT 0,
    balance_after_payment DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP
);
```

### payroll_audit_logs
```sql
CREATE TABLE payroll_audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_period_id BIGINT UNSIGNED NULL,
    payroll_calculation_id BIGINT UNSIGNED NULL,
    action VARCHAR(30) NOT NULL,
    entity_type VARCHAR(30) NOT NULL,
    entity_id BIGINT UNSIGNED NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    changes_summary TEXT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP
);
```

# Workforce Management Tables

### workforce_schedules
```sql
CREATE TABLE workforce_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    effective_date DATE NOT NULL,
    expires_at DATE NULL,
    created_by BIGINT UNSIGNED NULL, -- FK -> users.id
    created_at TIMESTAMP,
    updated_at TIMESTAMP
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
    location VARCHAR(100) NULL,
    is_overtime BOOLEAN DEFAULT FALSE,
    created_by BIGINT UNSIGNED NULL, -- FK -> users.id
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### employee_rotations
```sql
CREATE TABLE employee_rotations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pattern_json JSON NOT NULL,
    description TEXT NULL,
    created_by BIGINT UNSIGNED NULL, -- FK -> users.id
    created_at TIMESTAMP,
    updated_at TIMESTAMP
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
    created_by BIGINT UNSIGNED NULL, -- FK -> users.id
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

# ATS (Applicant Tracking System) Tables

### candidates
```sql
CREATE TABLE candidates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    profile_id BIGINT UNSIGNED NULL, -- FK -> profiles.id
    source ENUM('referral','job_board','walk_in','agency','internal','other'),
    status ENUM('new','in_process','interviewed','offered','hired','rejected','withdrawn'),
    applied_at TIMESTAMP,
    notes TEXT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### job_postings
```sql
CREATE TABLE job_postings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department_id BIGINT UNSIGNED NULL, -- FK -> departments.id
    description TEXT,
    requirements TEXT,
    status ENUM('open','closed','draft'),
    posted_at TIMESTAMP,
    closed_at TIMESTAMP NULL,
    created_by BIGINT UNSIGNED NULL, -- FK -> users.id
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### applications
```sql
CREATE TABLE applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL, -- FK -> candidates.id
    job_id BIGINT UNSIGNED NOT NULL, -- FK -> job_postings.id
    status ENUM('submitted','shortlisted','interviewed','offered','hired','rejected','withdrawn'),
    score DECIMAL(5,2) NULL,
    resume_path VARCHAR(255) NULL,
    cover_letter TEXT NULL,
    applied_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### interviews
```sql
CREATE TABLE interviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNSIGNED NOT NULL, -- FK -> applications.id
    scheduled_at TIMESTAMP,
    interviewer_id BIGINT UNSIGNED NULL, -- FK -> users.id
    feedback TEXT NULL,
    score DECIMAL(5,2) NULL,
    status ENUM('scheduled','completed','cancelled','no_show'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### candidate_notes
```sql
CREATE TABLE candidate_notes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL, -- FK -> candidates.id
    note TEXT,
    created_by BIGINT UNSIGNED NULL, -- FK -> users.id
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

# Onboarding Tables

### onboarding_checklists
```sql
CREATE TABLE onboarding_checklists (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tasks_json JSON NOT NULL,
    created_by BIGINT UNSIGNED NULL, -- FK -> users.id
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### onboarding_tasks
```sql
CREATE TABLE onboarding_tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
    checklist_id BIGINT UNSIGNED NOT NULL, -- FK -> onboarding_checklists.id
    task VARCHAR(255) NOT NULL,
    status ENUM('pending','in_progress','completed','skipped'),
    due_date DATE NULL,
    completed_at TIMESTAMP NULL,
    assigned_by BIGINT UNSIGNED NULL, -- FK -> users.id
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### onboarding_documents
```sql
CREATE TABLE onboarding_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id
    document_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    status ENUM('pending','submitted','verified','rejected'),
    submitted_at TIMESTAMP NULL,
    verified_by BIGINT UNSIGNED NULL, -- FK -> users.id
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```
 - `appraisals`, `appraisal_scores`, `rehire_recommendations` — Appraisal & Rehire

---

# Schema (SQL-like definitions, Laravel-friendly)

> Use this as spec to implement Laravel migrations (`foreignId()->constrained()` patterns).


### teams
```sql
CREATE TABLE teams (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    personal_team BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### team_user
```sql
CREATE TABLE team_user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY team_user_unique (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```


## `employees`

## personal_access_tokens
```sql
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX personal_access_tokens_tokenable (tokenable_type, tokenable_id)
);
```






## team_members
```sql
CREATE TABLE team_members (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT UNSIGNED NOT NULL, -- FK -> teams.id (CASCADE)
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id (CASCADE)
    role_in_team VARCHAR(50) NULL,
    joined_at DATE NULL,
    left_at DATE NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE(team_id, employee_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
```
* Many-to-many for employees ↔ teams, supports history.





CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,
    
    INDEX sessions_user_id (user_id),
    INDEX sessions_last_activity (last_activity)
);
```




### jobs
```sql
CREATE TABLE jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload LONGTEXT NOT NULL,
    attempts TINYINT UNSIGNED NOT NULL,
    reserved_at INT UNSIGNED NULL,
    available_at INT UNSIGNED NOT NULL,
```
- Single person identity; do not store employment-specific IDs here (they go in `government_ids` or `employees`).



### job_batches
```sql
CREATE TABLE job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INT NOT NULL,
    pending_jobs INT NOT NULL,
    failed_jobs INT NOT NULL,
    failed_job_ids LONGTEXT NOT NULL,
    options MEDIUMTEXT NULL,
    cancelled_at INT NULL,
    created_at INT NOT NULL,
    finished_at INT NULL
);
```

### failed_jobs
```sql
CREATE TABLE failed_jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload LONGTEXT NOT NULL,
    exception LONGTEXT NOT NULL,
    failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Roles & Permissions (Spatie Laravel Permission)



## roles
```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NULL,
    hierarchy_level INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```


## permissions
```sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```


## role_permissions
```sql
CREATE TABLE role_permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL, -- FK -> roles.id (CASCADE)
    permission_id BIGINT UNSIGNED NOT NULL, -- FK -> permissions.id (CASCADE)
    UNIQUE(role_id, permission_id),
    created_at TIMESTAMP
);
```


## role_user (pivot)
```sql
CREATE TABLE role_user (
    user_id BIGINT UNSIGNED NOT NULL, -- FK -> users.id (CASCADE)
    role_id BIGINT UNSIGNED NOT NULL, -- FK -> roles.id (CASCADE)
    assigned_at TIMESTAMP,
    PRIMARY KEY(user_id, role_id)
);
```


## permissions_user (optional direct grants)
```sql
CREATE TABLE permissions_user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL, -- FK -> users.id (CASCADE)
    permission_id BIGINT UNSIGNED NOT NULL, -- FK -> permissions.id (CASCADE)
    granted_at TIMESTAMP,
    granted_by BIGINT UNSIGNED NULL -- FK -> users.id (SET NULL)
);
```


---

## Shared Core Tables

### departments
```sql
CREATE TABLE departments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT NULL,
    department_type ENUM('office', 'production', 'security') NOT NULL,
    manager_id BIGINT UNSIGNED NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_departments_manager_id (manager_id),
    INDEX idx_departments_is_active (is_active),
    INDEX idx_departments_type (department_type),
    UNIQUE KEY departments_name_unique (name),
    UNIQUE KEY departments_code_unique (code)
);
```
## devices
```sql
CREATE TABLE devices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type ENUM('biometric','camera','rfid','door','other') DEFAULT 'biometric',
    serial_number VARCHAR(150) UNIQUE NULL,
    ip_address VARCHAR(50) NULL,
    location VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    meta JSONB NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

## `time_logs`
```sql
CREATE TABLE time_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    device_id BIGINT UNSIGNED NULL, -- FK -> devices.id (SET NULL)
    employee_id BIGINT UNSIGNED NULL, -- FK -> employees.id (SET NULL)
    log_type ENUM('IN','OUT','UNKNOWN') NOT NULL,
    log_time TIMESTAMP NOT NULL,
    captured_image_path VARCHAR(255) NULL,
    raw_payload JSONB NULL,
    is_manual BOOLEAN DEFAULT FALSE,
    verified_by BIGINT UNSIGNED NULL, -- FK -> users.id (SET NULL)
    created_at TIMESTAMP
);
```

## `shifts`
```sql
CREATE TABLE shifts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_minutes INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## `employee_shifts`
```sql
CREATE TABLE employee_shifts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id (CASCADE)
    shift_id BIGINT UNSIGNED NOT NULL, -- FK -> shifts.id (CASCADE)
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(employee_id, shift_id, effective_from)
);
```


## `leave_requests`
```sql
CREATE TABLE leave_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id (CASCADE)
    leave_type ENUM('Vacation','Sick','Emergency','Maternity','Paternity','Unpaid','Other') NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    reason TEXT NULL,
    status ENUM('Pending','Approved','Rejected','Cancelled') DEFAULT 'Pending',
    approved_by BIGINT UNSIGNED NULL, -- FK -> users.id (SET NULL)
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## `overtimes`
```sql
CREATE TABLE overtimes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id (CASCADE)
    date DATE NOT NULL,
    hours DECIMAL(4,2) NOT NULL,
    reason TEXT NULL,
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    approved_by BIGINT UNSIGNED NULL, -- FK -> users.id (SET NULL)
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## `payroll_periods`
```sql
CREATE TABLE payroll_periods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status ENUM('Open','Processing','Closed') DEFAULT 'Open',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(period_start, period_end)
);
```

## `payrolls`
```sql
CREATE TABLE payrolls (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL, -- FK -> employees.id (CASCADE)
    payroll_period_id BIGINT UNSIGNED NOT NULL, -- FK -> payroll_periods.id (CASCADE)
    gross_pay DECIMAL(12,2) NOT NULL,
    net_pay DECIMAL(12,2) NOT NULL,
    total_deductions DECIMAL(12,2) NOT NULL,
    status ENUM('Pending','Processed','Released','On Hold') DEFAULT 'Pending',
    released_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(employee_id, payroll_period_id)
);
```

## `deductions`
```sql
CREATE TABLE deductions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_id BIGINT UNSIGNED NOT NULL, -- FK -> payrolls.id (CASCADE)
    type ENUM('Tax','SSS','PhilHealth','PagIBIG','Loan','Other') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```


## `documents`
```sql
CREATE TABLE documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NULL, -- FK -> employees.id (SET NULL)
    file_path VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    description TEXT NULL,
    uploaded_by BIGINT UNSIGNED NULL, -- FK -> users.id (SET NULL)
    uploaded_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## `notifications`
```sql
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL, -- FK -> users.id (CASCADE)
    type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```


## Foreign Key Summary

* All `*_id` columns reference their respective parent tables, with `ON DELETE CASCADE` for required relationships and `ON DELETE SET NULL` for optional ones.
* All tables use `BIGINT UNSIGNED` for PKs and FKs.
* All tables (except pure pivot tables) have `created_at`, `updated_at`, and most have `deleted_at` for soft deletes.
* All tables use strict foreign key constraints.
* All tables are designed for 3NF normalization and scalability.

---

## Roles Seed Set (Example)

```php
// database/seeders/RoleSeeder.php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

$roles = [
    'Super Admin',
    'HR Manager',
    'Payroll Officer',
    'Department Head',
    'Employee',
];

foreach ($roles as $role) {
    Role::firstOrCreate(['name' => $role]);
}
```

---

## Seeder Snippet for Permissions (Example)

```php
// database/seeders/PermissionSeeder.php
$permissions = [
    'view employees',
    'edit employees',
    'delete employees',
    'view payroll',
    'process payroll',
    'approve leave',
    'manage devices',
    // ...
];

foreach ($permissions as $permission) {
    Permission::firstOrCreate(['name' => $permission]);
}
```

---

## Next Steps / Deliverables

1. Review this schema with stakeholders and finalize any custom business rules.
2. Generate Laravel migrations for all tables above, using `foreignId()->constrained()` and `softDeletes()` where appropriate.
3. Implement seeders for roles, permissions, and initial data.
4. Integrate Spatie/laravel-permission for RBAC.
5. Set up audit logging and device integration as per schema.
6. Validate with sample data and iterate as needed.




-- Department Seeding Data:
-- Office Departments:
-- 1. HR (Human Resources) - Code: HR, Type: office
-- 2. Accounting - Code: ACCT, Type: office  
-- 3. Administration - Code: ADMIN, Type: office
-- 4. IT Department - Code: IT, Type: office
-- 5. Front Desk - Code: FRONTDESK, Type: office
-- 
-- Production Departments:
-- 6. Rolling Mill 1 - Code: RM1, Type: production
-- 7. Rolling Mill 2 - Code: RM2, Type: production
-- 8. Rolling Mill 3 - Code: RM3, Type: production
-- 9. Rolling Mill 4 - Code: RM4, Type: production
-- 10. Rolling Mill 5 - Code: RM5, Type: production
--
-- Security Department:
-- 11. Security/Guards - Code: SECURITY, Type: security
```

---

## HR Module Tables

### employees
```sql
CREATE TABLE employees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    middlename VARCHAR(255) NULL,
    
    -- Personal Information
    address TEXT NULL,
    contact_number VARCHAR(50) NULL,
    email_personal VARCHAR(255) NULL,
    place_of_birth VARCHAR(255) NULL,
    date_of_birth DATE NULL,
    civil_status ENUM('single', 'married', 'divorced', 'widowed') NULL,
    gender ENUM('male', 'female') NULL,
    
    -- Employment Information
    department_id BIGINT UNSIGNED NULL,
    position VARCHAR(255) NULL,
    employment_type ENUM('regular', 'contractual', 'probationary', 'consultant') NULL,
    date_employed DATE NULL,
    date_regularized DATE NULL,
    immediate_supervisor_id BIGINT UNSIGNED NULL,
    
    -- Government IDs
    sss_no VARCHAR(50) UNIQUE NULL,
    pagibig_no VARCHAR(50) UNIQUE NULL,
    tin_no VARCHAR(50) UNIQUE NULL,
    philhealth_no VARCHAR(50) UNIQUE NULL,
    
    -- Family Information
    spouse_name VARCHAR(255) NULL,
    spouse_dob DATE NULL,
    spouse_occupation VARCHAR(255) NULL,
    father_name VARCHAR(255) NULL,
    father_dob DATE NULL,
    mother_name VARCHAR(255) NULL,
    mother_dob DATE NULL,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255) NULL,
    emergency_contact_relationship VARCHAR(255) NULL,
    emergency_contact_number VARCHAR(50) NULL,
    
    -- System Fields
    status ENUM('active', 'archived', 'terminated', 'on_leave', 'suspended') DEFAULT 'active',
    termination_date DATE NULL,
    termination_reason TEXT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_employees_user_id (user_id),
    INDEX idx_employees_employee_number (employee_number),
    INDEX idx_employees_department_id (department_id),
    INDEX idx_employees_supervisor_id (immediate_supervisor_id),
    INDEX idx_employees_status (status),
    INDEX idx_employees_employment_type (employment_type),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (immediate_supervisor_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

### employee_children
```sql
CREATE TABLE employee_children (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    child_dob DATE NOT NULL,
    child_gender ENUM('male', 'female') NOT NULL,
    is_student BOOLEAN DEFAULT FALSE,
    school_name VARCHAR(255) NULL,
    remarks TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_employee_children_employee_id (employee_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
```

### employee_remarks
```sql
CREATE TABLE employee_remarks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    remark_type ENUM('rehired', 'end_of_contract', 'leave_of_absence', 'suspension', 'promotion', 'demotion', 'salary_adjustment', 'disciplinary_action') NOT NULL,
    title VARCHAR(255) NOT NULL,
    note TEXT NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_employee_remarks_employee_id (employee_id),
    INDEX idx_employee_remarks_type (remark_type),
    INDEX idx_employee_remarks_effective_date (effective_date),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```


## `users`
```
```
username VARCHAR(100) UNIQUE NULL
email VARCHAR(191) UNIQUE NOT NULL
password VARCHAR(255) NOT NULL
is_active BOOLEAN DEFAULT TRUE
created_at TIMESTAMP
updated_at TIMESTAMP
deleted_at TIMESTAMP NULL
```
- Authentication entity. Link to `profiles` via `profiles.user_id` if needed (one-to-one).


### leave_balances
```sql
CREATE TABLE leave_balances (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    year INT NOT NULL,
    leave_type ENUM('VL', 'SL', 'EL', 'ML', 'PL', 'BL', 'SP') NOT NULL,
    earned_days DECIMAL(4,2) NOT NULL,
    used_days DECIMAL(4,2) DEFAULT 0,
    remaining_days DECIMAL(4,2) NOT NULL,
    carried_forward DECIMAL(4,2) DEFAULT 0,
    expires_at DATE NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY leave_balances_employee_year_type (employee_id, year, leave_type),
    INDEX idx_leave_balances_employee_id (employee_id),
    INDEX idx_leave_balances_year (year),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
```

### document_templates
```sql
CREATE TABLE document_templates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('employment_contract', 'job_offer', 'leave_slip', 'certificate_of_employment', 'excuse_slip', 'memorandum') NOT NULL,
    template_path VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    variables JSON NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_document_templates_type (type),
    INDEX idx_document_templates_is_active (is_active),
    
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### generated_documents
```sql
CREATE TABLE generated_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    template_id BIGINT UNSIGNED NOT NULL,
    document_type VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT UNSIGNED NOT NULL,
    generated_by BIGINT UNSIGNED NOT NULL,
    generated_at TIMESTAMP NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_generated_documents_employee_id (employee_id),
    INDEX idx_generated_documents_template_id (template_id),
    INDEX idx_generated_documents_generated_at (generated_at),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES document_templates(id),
    FOREIGN KEY (generated_by) REFERENCES users(id)
);
```

---

## Timekeeping Module Tables

### work_schedules
```sql
CREATE TABLE work_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    
    -- Schedule Definition
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
    
    -- Break Times
    lunch_break_duration INT UNSIGNED DEFAULT 60, -- minutes
    morning_break_duration INT UNSIGNED NULL, -- minutes
    afternoon_break_duration INT UNSIGNED NULL, -- minutes
    
    -- Overtime Rules
    overtime_threshold INT UNSIGNED DEFAULT 480, -- minutes (8 hours)
    overtime_rate_multiplier DECIMAL(3,2) DEFAULT 1.25,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_work_schedules_is_active (is_active),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### employee_schedules
```sql
CREATE TABLE employee_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    work_schedule_id BIGINT UNSIGNED NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_employee_schedules_employee_id (employee_id),
    INDEX idx_employee_schedules_schedule_id (work_schedule_id),
    INDEX idx_employee_schedules_effective_date (effective_date),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (work_schedule_id) REFERENCES work_schedules(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### attendance_events
```sql
CREATE TABLE attendance_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    event_date DATE NOT NULL,
    event_time TIMESTAMP NOT NULL,
    event_type ENUM('time_in', 'time_out', 'break_start', 'break_end', 'overtime_start', 'overtime_end') NOT NULL,
    
    -- Data Source
    source ENUM('manual', 'imported', 'system') DEFAULT 'manual',
    imported_batch_id BIGINT UNSIGNED NULL,
    
    -- Validation & Correction
    is_corrected BOOLEAN DEFAULT FALSE,
    original_time TIMESTAMP NULL,
    correction_reason TEXT NULL,
    corrected_by BIGINT UNSIGNED NULL,
    corrected_at TIMESTAMP NULL,
    
    -- Location & Device Info
    location VARCHAR(255) NULL,
    notes TEXT NULL,
    
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_attendance_events_employee_date (employee_id, event_date),
    INDEX idx_attendance_events_event_time (event_time),
    INDEX idx_attendance_events_batch_id (imported_batch_id),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (corrected_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### daily_attendance_summary
```sql
CREATE TABLE daily_attendance_summary (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    attendance_date DATE NOT NULL,
    work_schedule_id BIGINT UNSIGNED NOT NULL,
    
    -- Time Tracking
    time_in TIMESTAMP NULL,
    time_out TIMESTAMP NULL,
    break_start TIMESTAMP NULL,
    break_end TIMESTAMP NULL,
    
    -- Calculated Fields
    total_hours_worked DECIMAL(4,2) NULL,
    regular_hours DECIMAL(4,2) NULL,
    overtime_hours DECIMAL(4,2) NULL,
    break_duration INT UNSIGNED NULL, -- minutes
    
    -- Status Flags
    is_present BOOLEAN DEFAULT FALSE,
    is_late BOOLEAN DEFAULT FALSE,
    is_undertime BOOLEAN DEFAULT FALSE,
    is_overtime BOOLEAN DEFAULT FALSE,
    late_minutes INT UNSIGNED NULL,
    undertime_minutes INT UNSIGNED NULL,
    
    -- Leave Integration
    leave_request_id BIGINT UNSIGNED NULL,
    is_on_leave BOOLEAN DEFAULT FALSE,
    
    calculated_at TIMESTAMP NULL,
    is_finalized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY daily_attendance_employee_date (employee_id, attendance_date),
    INDEX idx_daily_attendance_date (attendance_date),
    INDEX idx_daily_attendance_schedule_id (work_schedule_id),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (work_schedule_id) REFERENCES work_schedules(id),
    FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id) ON DELETE SET NULL
);
```

### import_batches
```sql
CREATE TABLE import_batches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT UNSIGNED NOT NULL,
    
    -- Import Details
    import_type ENUM('attendance', 'schedule', 'correction') NOT NULL,
    total_records INT UNSIGNED NOT NULL,
    processed_records INT UNSIGNED DEFAULT 0,
    successful_records INT UNSIGNED DEFAULT 0,
    failed_records INT UNSIGNED DEFAULT 0,
    
    -- Processing Status
    status ENUM('uploaded', 'processing', 'completed', 'failed') DEFAULT 'uploaded',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    error_log TEXT NULL,
    
    imported_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_import_batches_status (status),
    INDEX idx_import_batches_imported_by (imported_by),
    
    FOREIGN KEY (imported_by) REFERENCES users(id)
);
```

### import_errors
```sql
CREATE TABLE import_errors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    import_batch_id BIGINT UNSIGNED NOT NULL,
    row_number INT UNSIGNED NOT NULL,
    employee_identifier VARCHAR(255) NOT NULL,
    error_type ENUM('invalid_employee', 'invalid_time', 'duplicate_entry', 'validation_error') NOT NULL,
    error_message TEXT NOT NULL,
    raw_data JSON NOT NULL,
    created_at TIMESTAMP NULL,
    
    INDEX idx_import_errors_batch_id (import_batch_id),
    FOREIGN KEY (import_batch_id) REFERENCES import_batches(id) ON DELETE CASCADE
);
```

### overtime_requests
```sql
CREATE TABLE overtime_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    request_date DATE NOT NULL,
    planned_start_time TIMESTAMP NOT NULL,
    planned_end_time TIMESTAMP NOT NULL,
    planned_hours DECIMAL(4,2) NOT NULL,
    reason TEXT NOT NULL,
    
    -- Approval Workflow
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    
    -- Actual Time Tracking
    actual_start_time TIMESTAMP NULL,
    actual_end_time TIMESTAMP NULL,
    actual_hours DECIMAL(4,2) NULL,
    
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_overtime_requests_employee_id (employee_id),
    INDEX idx_overtime_requests_status (status),
    INDEX idx_overtime_requests_request_date (request_date),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

---

## Payroll Module Tables

### payroll_periods
```sql
CREATE TABLE payroll_periods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    period_type ENUM('weekly', 'bi_weekly', 'semi_monthly', 'monthly') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pay_date DATE NOT NULL,
    
    -- Processing Status
    status ENUM('draft', 'processing', 'calculated', 'approved', 'paid', 'closed') DEFAULT 'draft',
    processed_at TIMESTAMP NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_payroll_periods_status (status),
    INDEX idx_payroll_periods_start_date (start_date),
    INDEX idx_payroll_periods_pay_date (pay_date),
    
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### employee_payroll_info
```sql
CREATE TABLE employee_payroll_info (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    
    -- Salary Information
    salary_type ENUM('monthly', 'daily', 'hourly', 'contractual') NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    daily_rate DECIMAL(8,2) NULL,
    hourly_rate DECIMAL(8,2) NULL,
    
    -- Tax Information
    tax_status ENUM('S', 'ME', 'S1', 'ME1', 'S2', 'ME2', 'S3', 'ME3', 'S4', 'ME4') NOT NULL,
    withholding_tax_exemption DECIMAL(8,2) DEFAULT 0,
    
    -- Government Numbers
    sss_number VARCHAR(50) NULL,
    philhealth_number VARCHAR(50) NULL,
    pagibig_number VARCHAR(50) NULL,
    tin_number VARCHAR(50) NULL,
    
    -- Bank Information
    bank_name VARCHAR(255) NULL,
    bank_account_number VARCHAR(50) NULL,
    bank_account_name VARCHAR(255) NULL,
    
    -- Effective Dates
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_by BIGINT UNSIGNED NOT NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_employee_payroll_info_employee_id (employee_id),
    INDEX idx_employee_payroll_info_effective_date (effective_date),
    INDEX idx_employee_payroll_info_is_active (is_active),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

### salary_components
```sql
CREATE TABLE salary_components (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    component_type ENUM('earning', 'deduction', 'benefit', 'tax', 'contribution') NOT NULL,
    
    -- Calculation Settings
    calculation_method ENUM('fixed_amount', 'percentage_of_basic', 'percentage_of_gross', 'per_hour', 'per_day') NOT NULL,
    default_amount DECIMAL(10,2) NULL,
    default_percentage DECIMAL(5,2) NULL,
    
    -- Tax Treatment
    is_taxable BOOLEAN DEFAULT TRUE,
    is_deminimis BOOLEAN DEFAULT FALSE,
    
    -- Government Contribution Settings
    affects_sss BOOLEAN DEFAULT FALSE,
    affects_philhealth BOOLEAN DEFAULT FALSE,
    affects_pagibig BOOLEAN DEFAULT FALSE,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_salary_components_code (code),
    INDEX idx_salary_components_type (component_type),
    INDEX idx_salary_components_is_active (is_active),
    
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### employee_salary_components
```sql
CREATE TABLE employee_salary_components (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    salary_component_id BIGINT UNSIGNED NOT NULL,
    
    -- Component Settings
    amount DECIMAL(10,2) NULL,
    percentage DECIMAL(5,2) NULL,
    
    -- Frequency and Timing
    frequency ENUM('per_payroll', 'monthly', 'quarterly', 'annually', 'one_time') DEFAULT 'per_payroll',
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_employee_salary_components_employee (employee_id),
    INDEX idx_employee_salary_components_component (salary_component_id),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (salary_component_id) REFERENCES salary_components(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### payroll_calculations
```sql
CREATE TABLE payroll_calculations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_period_id BIGINT UNSIGNED NOT NULL,
    employee_id BIGINT UNSIGNED NOT NULL,
    
    -- Time and Attendance Data
    days_worked DECIMAL(4,2) NOT NULL,
    regular_hours DECIMAL(6,2) NOT NULL,
    overtime_hours DECIMAL(6,2) DEFAULT 0,
    night_differential_hours DECIMAL(6,2) DEFAULT 0,
    holiday_hours DECIMAL(6,2) DEFAULT 0,
    leave_hours_paid DECIMAL(6,2) DEFAULT 0,
    
    -- Gross Earnings
    basic_pay DECIMAL(10,2) NOT NULL,
    overtime_pay DECIMAL(10,2) DEFAULT 0,
    night_differential_pay DECIMAL(10,2) DEFAULT 0,
    holiday_pay DECIMAL(10,2) DEFAULT 0,
    allowances DECIMAL(10,2) DEFAULT 0,
    bonuses DECIMAL(10,2) DEFAULT 0,
    other_earnings DECIMAL(10,2) DEFAULT 0,
    gross_pay DECIMAL(10,2) NOT NULL,
    
    -- Deductions
    sss_contribution DECIMAL(8,2) DEFAULT 0,
    philhealth_contribution DECIMAL(8,2) DEFAULT 0,
    pagibig_contribution DECIMAL(8,2) DEFAULT 0,
    withholding_tax DECIMAL(10,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,
    total_deductions DECIMAL(10,2) NOT NULL,
    
    -- Net Pay
    net_pay DECIMAL(10,2) NOT NULL,
    
    -- Year-to-Date Totals
    ytd_gross DECIMAL(12,2) NOT NULL,
    ytd_tax DECIMAL(12,2) NOT NULL,
    ytd_sss DECIMAL(10,2) NOT NULL,
    ytd_philhealth DECIMAL(10,2) NOT NULL,
    ytd_pagibig DECIMAL(10,2) NOT NULL,
    
    calculated_at TIMESTAMP NOT NULL,
    is_finalized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY payroll_calculations_period_employee (payroll_period_id, employee_id),
    INDEX idx_payroll_calculations_employee_id (employee_id),
    INDEX idx_payroll_calculations_period_id (payroll_period_id),
    
    FOREIGN KEY (payroll_period_id) REFERENCES payroll_periods(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
```

### payroll_calculation_details
```sql
CREATE TABLE payroll_calculation_details (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_calculation_id BIGINT UNSIGNED NOT NULL,
    salary_component_id BIGINT UNSIGNED NOT NULL,
    
    -- Calculation Details
    base_amount DECIMAL(10,2) NOT NULL,
    rate_or_percentage DECIMAL(8,4) NOT NULL,
    calculated_amount DECIMAL(10,2) NOT NULL,
    
    calculation_notes TEXT NULL,
    created_at TIMESTAMP NULL,
    
    INDEX idx_calculation_details_calculation_id (payroll_calculation_id),
    INDEX idx_calculation_details_component_id (salary_component_id),
    
    FOREIGN KEY (payroll_calculation_id) REFERENCES payroll_calculations(id) ON DELETE CASCADE,
    FOREIGN KEY (salary_component_id) REFERENCES salary_components(id)
);
```

### government_contribution_rates
```sql
CREATE TABLE government_contribution_rates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    contribution_type ENUM('sss', 'philhealth', 'pagibig', 'withholding_tax') NOT NULL,
    
    -- Rate Brackets
    min_salary DECIMAL(10,2) NOT NULL,
    max_salary DECIMAL(10,2) NULL,
    employee_rate DECIMAL(6,4) NOT NULL,
    employer_rate DECIMAL(6,4) NOT NULL,
    total_contribution DECIMAL(8,2) NULL,
    
    -- Effective Period
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_government_rates_type (contribution_type),
    INDEX idx_government_rates_effective_date (effective_date),
    INDEX idx_government_rates_is_active (is_active),
    
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### tax_brackets
```sql
CREATE TABLE tax_brackets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tax_status ENUM('S', 'ME', 'S1', 'ME1', 'S2', 'ME2', 'S3', 'ME3', 'S4', 'ME4') NOT NULL,
    
    -- Tax Bracket
    min_income DECIMAL(10,2) NOT NULL,
    max_income DECIMAL(10,2) NULL,
    base_tax DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,4) NOT NULL,
    excess_over DECIMAL(10,2) NOT NULL,
    
    -- Effective Period
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_tax_brackets_status (tax_status),
    INDEX idx_tax_brackets_effective_date (effective_date),
    INDEX idx_tax_brackets_is_active (is_active),
    
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### payslips
```sql
CREATE TABLE payslips (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payroll_calculation_id BIGINT UNSIGNED NOT NULL,
    employee_id BIGINT UNSIGNED NOT NULL,
    payroll_period_id BIGINT UNSIGNED NOT NULL,
    
    -- Payslip Details
    payslip_number VARCHAR(50) UNIQUE NOT NULL,
    generated_at TIMESTAMP NOT NULL,
    
    -- File Information
    pdf_file_path VARCHAR(500) NULL,
    pdf_file_size INT UNSIGNED NULL,
    
    -- Distribution
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP NULL,
    downloaded_by_employee BOOLEAN DEFAULT FALSE,
    downloaded_at TIMESTAMP NULL,
    
    generated_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_payslips_employee_id (employee_id),
    INDEX idx_payslips_period_id (payroll_period_id),
    INDEX idx_payslips_generated_at (generated_at),
    
    FOREIGN KEY (payroll_calculation_id) REFERENCES payroll_calculations(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (payroll_period_id) REFERENCES payroll_periods(id),
    FOREIGN KEY (generated_by) REFERENCES users(id)
);
```

### government_reports
```sql
CREATE TABLE government_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    report_type ENUM('bir_2316', 'sss_r3', 'philhealth_rf1', 'pagibig_mcrf') NOT NULL,
    reporting_period VARCHAR(50) NOT NULL,
    
    -- Report Details
    total_employees INT UNSIGNED NOT NULL,
    total_gross_pay DECIMAL(12,2) NOT NULL,
    total_contributions DECIMAL(12,2) NOT NULL,
    total_taxes DECIMAL(12,2) NOT NULL,
    
    -- File Information
    report_file_path VARCHAR(500) NULL,
    report_file_size INT UNSIGNED NULL,
    
    -- Submission Status
    status ENUM('draft', 'generated', 'submitted', 'accepted') DEFAULT 'draft',
    generated_at TIMESTAMP NULL,
    submitted_at TIMESTAMP NULL,
    
    generated_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_government_reports_type (report_type),
    INDEX idx_government_reports_period (reporting_period),
    INDEX idx_government_reports_status (status),
    
    FOREIGN KEY (generated_by) REFERENCES users(id)
);
```

---

## Activity Log Tables (Audit Trail)

### activity_log
```sql
CREATE TABLE activity_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    log_name VARCHAR(255) NULL,
    description TEXT NOT NULL,
    subject_type VARCHAR(255) NULL,
    event VARCHAR(255) NULL,
    subject_id BIGINT UNSIGNED NULL,
    causer_type VARCHAR(255) NULL,
    causer_id BIGINT UNSIGNED NULL,
    properties JSON NULL,
    batch_uuid CHAR(36) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX activity_log_log_name (log_name),
    INDEX activity_log_subject (subject_type, subject_id),
    INDEX activity_log_causer (causer_type, causer_id)
);
```

---

## Foreign Key Relationships Summary

### Key Relationships
1. **users ↔ employees**: Bidirectional optional relationship
2. **employees → departments**: Employee belongs to department
3. **employees → employees**: Self-referencing for supervisors
4. **leave_requests → employees**: Employee has many leave requests
5. **attendance_events → employees**: Employee has many attendance events
6. **payroll_calculations → employees**: Employee has many payroll calculations
7. **daily_attendance_summary → work_schedules**: Attendance linked to schedules
8. **employee_payroll_info → employees**: Payroll settings per employee

### Cross-Module Dependencies
- **HR → Foundation**: employees references users, departments
- **Timekeeping → HR**: attendance_events references employees
- **Payroll → HR**: payroll_calculations references employees
- **Payroll → Timekeeping**: Uses attendance data for calculations

---

## Indexing Strategy

### Performance Indexes
- **Foreign Key Indexes**: All foreign key columns indexed
- **Date Indexes**: All date columns for reporting queries
- **Status Indexes**: Enum status columns for filtering
- **Unique Constraints**: Employee numbers, government IDs, email addresses
- **Composite Indexes**: Employee+Date combinations for time-series data

### Query Optimization
- **Partitioning**: Consider partitioning large tables by date/year
- **Archiving**: Implement data archiving strategy for old records
- **Caching**: Cache frequently accessed lookup data
- **Read Replicas**: Consider read replicas for reporting queries

---

## Data Migration Notes

### Seeding Order
1. **Foundation**: users, roles, permissions, departments
2. **HR**: employees, leave_balances, document_templates
3. **Timekeeping**: work_schedules, employee_schedules
4. **Payroll**: salary_components, government_contribution_rates, tax_brackets

### Migration Dependencies
- Create base Laravel tables first (users, teams, sessions, etc.)
- Install Spatie Permission tables
- Create departments before employees
- Create employees before module-specific tables
- Seed configuration tables before operational tables

---

**Schema Version**: 1.0  
**Last Updated**: October 23, 2025  
**Total Tables**: 45 tables  
**Estimated Storage**: ~50MB for 1000 employees with 2 years of data