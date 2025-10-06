# SyncingSteel System - Complete Database Schema

## Overview
This document provides the complete database schema for the SyncingSteel System, including all tables across the Foundation, HR, Timekeeping, and Payroll modules. The schema follows Laravel conventions with proper foreign keys, indexes, and constraints.

## Schema Conventions
- **Primary Keys**: `id` (auto-incrementing integer)
- **Foreign Keys**: `{table}_id` format (e.g., `user_id`, `employee_id`)
- **Timestamps**: `created_at`, `updated_at` (Laravel standard)
- **Soft Deletes**: `deleted_at` where applicable
- **Enum Values**: Defined as database enums for data integrity
- **Decimal Precision**: Money fields use `decimal(10,2)`, rates use `decimal(8,4)`

---

## Foundation Tables (Authentication & Core)

### users
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    current_team_id BIGINT UNSIGNED NULL,
    profile_photo_path VARCHAR(2048) NULL,
    
    -- Enhanced fields
    employee_id BIGINT UNSIGNED NULL,
    department_id BIGINT UNSIGNED NULL,
    employee_number VARCHAR(50) UNIQUE NULL,
    status ENUM('pending', 'active', 'inactive', 'suspended') DEFAULT 'pending',

    profile_completion_skipped BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Two-factor authentication (Jetstream)
    two_factor_secret TEXT NULL,
    two_factor_recovery_codes TEXT NULL,
    two_factor_confirmed_at TIMESTAMP NULL,
    
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_users_employee_id (employee_id),
    INDEX idx_users_department_id (department_id),
    INDEX idx_users_status (status),
    INDEX idx_users_employee_number (employee_number)
);
```

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

### team_invitations
```sql
CREATE TABLE team_invitations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT UNSIGNED NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY team_invitations_unique (team_id, email),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
```

### personal_access_tokens
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

### sessions
```sql
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

### cache
```sql
CREATE TABLE cache (
    `key` VARCHAR(255) PRIMARY KEY,
    value MEDIUMTEXT NOT NULL,
    expiration INT NOT NULL
);
```

### cache_locks
```sql
CREATE TABLE cache_locks (
    `key` VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INT NOT NULL
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
    created_at INT UNSIGNED NOT NULL,
    
    INDEX jobs_queue (queue)
);
```

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

### roles
```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    guard_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY roles_name_guard_name_unique (name, guard_name)
);
```

### permissions
```sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    guard_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY permissions_name_guard_name_unique (name, guard_name)
);
```

### model_has_permissions
```sql
CREATE TABLE model_has_permissions (
    permission_id BIGINT UNSIGNED NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    
    INDEX model_has_permissions_model_id_model_type (model_id, model_type),
    PRIMARY KEY (permission_id, model_id, model_type),
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

### model_has_roles
```sql
CREATE TABLE model_has_roles (
    role_id BIGINT UNSIGNED NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    
    INDEX model_has_roles_model_id_model_type (model_id, model_type),
    PRIMARY KEY (role_id, model_id, model_type),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

### role_has_permissions
```sql
CREATE TABLE role_has_permissions (
    permission_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    
    PRIMARY KEY (permission_id, role_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
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

### leave_requests
```sql
CREATE TABLE leave_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    leave_type ENUM('VL', 'SL', 'EL', 'ML', 'PL', 'BL', 'SP', 'LWOP') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count DECIMAL(4,2) NOT NULL,
    half_day BOOLEAN DEFAULT FALSE,
    reason TEXT NOT NULL,
    
    -- Approval Workflow
    status ENUM('draft', 'pending', 'approved', 'rejected', 'cancelled') DEFAULT 'draft',
    submitted_at TIMESTAMP NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    
    -- Leave Balance Impact
    deducted_days DECIMAL(4,2) NULL,
    remaining_balance DECIMAL(4,2) NULL,
    
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_leave_requests_employee_id (employee_id),
    INDEX idx_leave_requests_leave_type (leave_type),
    INDEX idx_leave_requests_status (status),
    INDEX idx_leave_requests_start_date (start_date),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);
```

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
**Last Updated**: October 6, 2025  
**Total Tables**: 45 tables  
**Estimated Storage**: ~50MB for 1000 employees with 2 years of data