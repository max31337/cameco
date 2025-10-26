# HR Core Schema

Overview
This document defines the HR Core database schema. It focuses on employment-specific data and intentionally delegates personal identity information to the shared profiles table used by the User Management module.

Key design
- Single person identity lives in profiles. An employee references that identity via employees.profile_id.
- Employment-only data (department, position, dates, status, supervisor) remains in employees.
- Family/dependent and employment remarks are separate child tables.

Entity diagram (high level)
profiles (1) ──< employees (0..n employment instances per person)
             └──< government_ids (0..1 typical)

Tables

employees
```sql
CREATE TABLE employees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    profile_id BIGINT UNSIGNED NOT NULL, -- Personal information lives in profiles; employees reference profiles
    employee_number VARCHAR(50) UNIQUE NOT NULL,

    -- Employment Information (keep employment-only fields here)
    department_id BIGINT UNSIGNED NULL,
    position VARCHAR(255) NULL,
    employment_type ENUM('regular', 'contractual', 'probationary', 'consultant') NULL,
    date_employed DATE NULL,
    date_regularized DATE NULL,
    immediate_supervisor_id BIGINT UNSIGNED NULL,

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
    INDEX idx_employees_profile_id (profile_id),
    INDEX idx_employees_employee_number (employee_number),
    INDEX idx_employees_department_id (department_id),
    INDEX idx_employees_supervisor_id (immediate_supervisor_id),
    INDEX idx_employees_status (status),
    INDEX idx_employees_employment_type (employment_type),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE RESTRICT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (immediate_supervisor_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

Important note
- Employees do not store personal identity fields (name, DOB, contact, address). Those live in the profiles table. This separation allows a single person identity to be reused across modules (User Management, ATS) and keeps employment data isolated.
- Migration strategy (if converting from legacy): create profiles from unique persons, link employees.profile_id, then drop personal columns from employees.

employee_children
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

employee_remarks
```sql
CREATE TABLE employee_remarks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    remark_type ENUM('rehired', 'end_of_contract', 'leave_of_absence', 'suspension', 'promotion', 'demotion', 'salary_adjustment', 'disciplinary_action') NOT NULL,
    title VARCHAR(255) NOT NULL,
    details TEXT NULL,
    effective_date DATE NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    INDEX idx_employee_remarks_employee_id (employee_id),
    INDEX idx_employee_remarks_type (remark_type),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

See also
- User Management Schema (profiles, users, government_ids): USER_MANAGEMENT.md
- HR Module Architecture: HR_MODULE_ARCHITECTURE.md
