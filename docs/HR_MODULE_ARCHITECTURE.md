# HR Module - Architecture & Implementation Plan

## Module Overview
The HR Module is the **foundation module** of the SyncingSteel System, providing comprehensive employee management capabilities for Cathay Metal Corporation. This module establishes the core employee data structure that will be used by Timekeeping and all modules.

**Employee Access Policy:**
> **Currently, employees (non-HR) have no direct access to the system.** All requests, updates, and information must go through HR staff, who act as the sole interface between employees and the HRIS. Employees do not log in, view, or update their own records.

> **Future Option:** The system is designed to allow for an employee self-service portal in the future, enabling employees to view payslips, request leave, and update personal information directly if enabled by management.

---

### Admin Self-Onboarding Workflow (System Startup)
1. **Admin registers user account** (`user.employee_id = NULL`)
2. **System detects unlinked admin** (on first login after registration approval)
3. **Display self-onboarding prompt** ("Complete your employee profile to continue")
4. **Admin fills employee creation form** (own personal/employment details)
5. **System creates employee record** (`employees.user_id = admin_user.id`)
6. **Auto-link user to employee** (`user.employee_id = new_employee.id`)
7. **Admin can now access full HR module** (manage other employees)

### Employee Onboarding Workflow (Normal Operation)
1. **HR creates employee record** (basic info)
2. **Complete employee profile** (personal, government IDs, family)
3. **Generate employment contract** (auto-populated from template)
4. **Create system user account** (optional, for self-service access)
5. **Set initial leave balances** (per company policy)
6. **Send welcome notification** (email with system access details)ll modules.

## Current State
- ✅ User authentication and approval system
- ✅ Role-based access control foundation
- ✅ Basic department structure planning
- 🔄 **Ready for HR module implementation**

## User-Employee Relationship Strategy

**⚠️ Critical Design Decision:** The system handles the "empty system" startup scenario through flexible user-employee relationships with special admin workflow.

**Problem Solved:** 
- System starts with no employee records
- Admin needs to bootstrap themselves as both user and employee
- Users can register before employee records exist
- Admin needs to manage both user accounts and employee data

**Architecture Solution:**
- **`users.employee_id`** → **NULLABLE** (users can exist without employee records)
- **`employees.user_id`** → **NULLABLE** (employee records can exist without system access)
- **Bidirectional optional relationship** enables flexible linking when needed

## Complete User-Employee Workflow Scenarios

### 1. Admin Bootstrapping (System Startup)
```
System Start → Admin Registration → First Login → Self-Onboarding Prompt
                     ↓                    ↓              ↓
            user.employee_id = NULL  Dashboard shows   Admin creates own
                                    "Complete Profile"  employee record
                                           ↓                    ↓
                                    Auto-link user.employee_id to new record
                                           ↓
                                    Admin can now manage other employees
```

### 2. Employee Registration & Approval
```
Employee Registration → Admin Review → Link to Employee Record
         ↓                    ↓              ↓
user.employee_id = NULL  Find existing OR  user.employee_id = employee.id
                        create new record   employee.user_id = user.id
```

### 3. System-Only Users (Special Cases)
```
External User Registration → Admin Review → Remain Unlinked
           ↓                      ↓              ↓
  user.employee_id = NULL    No employee     user.employee_id = NULL
                            record needed    (consultant, external admin)
```

## Module Goals
1. **Employee Lifecycle Management**: Onboarding to archiving
2. **Leave Request Workflow**: Multi-level approval system
3. **Document Generation**: Contracts, slips, certificates
4. **Self-Service Portal**: Employee access to own records
5. **HR Analytics**: Reporting and insights
6. **Compliance**: Philippine labor law requirements
7. **Onboarding & Offboarding**: Clear handoffs from ATS to HR Core and onboarding task automation

---

## Database Schema (HR Module)


### Core Employee Tables

## HR Module Tables (see HR_MODULE_ARCHITECTURE.md for full schema and details)
### employees
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

Note: Employees do not store personal identity fields (name, DOB, contact, address). Those live in the profiles table. Link employees.profile_id to profiles.id. This separation allows a single person identity to be reused across modules (User Management, ATS) and keeps employment data isolated.

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

## Implementation Phases

### Phase 1: Foundation Models & Migrations (Week 1)
- [ ] Create all HR Eloquent models with relationships
- [ ] Create database migrations for HR tables
- [ ] Set up model factories for testing data
- [ ] Create seeders for departments and sample employees
- [ ] Add indexes for performance optimization

#### Department Structure (To be seeded)
**Office Departments:**
- HR (Human Resources) - Code: HR
- Accounting - Code: ACCT
- Administration - Code: ADMIN
- IT Department - Code: IT
- Front Desk - Code: FRONTDESK

**Production Departments:**
- Rolling Mill 1 - Code: RM1
- Rolling Mill 2 - Code: RM2
- Rolling Mill 3 - Code: RM3
- Rolling Mill 4 - Code: RM4
- Rolling Mill 5 - Code: RM5

**Security Department:**
- Security/Guards - Code: SECURITY

#### departments (table definition)
```sql
CREATE TABLE departments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    code VARCHAR(50) NULL UNIQUE,
    description TEXT NULL,
    department_type ENUM('office','production','security','other') DEFAULT 'office',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### Phase 2: Repository Layer (Week 1-2)
- [ ] Create repository interfaces (Employee, Leave, Document)
- [ ] Implement Eloquent repositories with advanced querying
- [ ] Create RepositoryServiceProvider and register bindings
- [ ] Add caching layer for frequently accessed data
- [ ] Write repository unit tests

### Phase 3: Service Layer (Week 2-3)
- [ ] Create EmployeeService for CRUD and business logic
- [ ] Create LeaveService for leave request workflow
- [ ] Create OnboardingService for new employee process
- [ ] Create AdminOnboardingService for admin self-employee creation
- [ ] Create UserEmployeeLinkingService for linking users to employees
- [ ] Create DocumentService for PDF generation
- [ ] Implement transaction handling and error recovery

### Phase 4: Controller & Routes (Week 3-4)
- [ ] Create HR controllers with proper DI
- [ ] Implement form request classes for validation
- [ ] Set up RESTful routes with middleware protection
- [ ] Add role-based access control middleware
- [ ] Create API-like responses for Inertia.js
- [ ] **Build user-employee linking interface** (for admin approval workflow)

### Phase 5: Frontend Components (Week 4-5)
- [ ] Create employee listing with search/filter
- [ ] Build employee profile and edit forms
- [ ] Implement leave request submission and approval
- [ ] Create document generation interface  
- [ ] Add employee onboarding wizard
- [ ] Build admin self-onboarding component (first login prompt)
- [ ] Create user-employee linking interface for admin approval

### Phase 6: Document Generation (Week 5-6)
- [ ] Set up PDF generation with DomPDF
- [ ] Create Blade templates for each document type
- [ ] Implement template variable replacement
- [ ] Add document preview and download
- [ ] Create document management interface

### Phase 7: Testing & Polish (Week 6)
- [ ] Write feature tests for all workflows
- [ ] Create integration tests for services
- [ ] Add browser tests for critical paths
- [ ] Performance optimization and caching
- [ ] Documentation and user guide updates

---

## Service Layer Implementation Details

### AdminOnboardingService
```php
class AdminOnboardingService
{
    public function requiresOnboarding(User $user): bool
    {
        return $user->isAdmin() && is_null($user->employee_id);
    }
    
    public function createEmployeeForAdmin(User $admin, array $employeeData): Employee
    {
        DB::transaction(function () use ($admin, $employeeData) {
            $employee = Employee::create([
                'user_id' => $admin->id,
                'created_by' => $admin->id,
                ...$employeeData
            ]);
            
            $admin->update(['employee_id' => $employee->id]);
            
            return $employee;
        });
    }
}
```

### UserEmployeeLinkingService (Enhanced)
```php
class UserEmployeeLinkingService
{
    public function linkUserToEmployee(User $user, Employee $employee): void
    {
        DB::transaction(function () use ($user, $employee) {
            $user->update(['employee_id' => $employee->id]);
            $employee->update(['user_id' => $user->id]);
            
            // Log the linking activity
            activity()
                ->causedBy(auth()->user())
                ->performedOn($user)
                ->log("Linked user to employee: {$employee->full_name}");
        });
    }
    
    public function unlinkUserFromEmployee(User $user): void
    {
        DB::transaction(function () use ($user) {
            if ($user->employee) {
                $user->employee->update(['user_id' => null]);
            }
            $user->update(['employee_id' => null]);
        });
    }
    
    public function isLinked(User $user): bool
    {
        return !is_null($user->employee_id);
    }
}
```

---

## Technical Requirements

### Dependencies
```bash
# PDF Generation
composer require barryvdh/laravel-dompdf

# Image processing (for employee photos)
composer require intervention/image

# Activity logging
composer require spatie/laravel-activitylog

# Advanced validation rules
composer require laravel/precognition
```

### File Storage Structure
```
storage/app/
├── employees/
│   ├── photos/           # Employee profile photos
│   ├── documents/        # Generated documents (contracts, slips)
│   └── attachments/      # Supporting documents (ID copies, etc.)
└── templates/
    ├── contracts/        # Employment contract templates
    ├── leaves/           # Leave slip templates
    └── certificates/     # Certificate templates
```

---

## Key Features & Workflows

### System Startup & Data Population Workflow
**Phase 1: Empty System Setup**
1. **Admin account created** (employee_id = null, no employee record needed)
2. **Admin accesses HR module** (begins populating employee master data)
3. **Employee records created** (user_id = null, no system accounts yet)

**Phase 2: User Registration & Linking**
1. **Employees self-register** (employee_id = null initially)
2. **Admin reviews registrations** (approval process with optional employee linking)
3. **Admin links user to employee record** (bidirectional relationship update)
4. **User gains employee-specific features** (self-service portal, leave requests)

### Employee Onboarding Workflow
1. **HR creates employee record** (basic info, user_id = null)
2. **Complete employee profile** (personal, government IDs, family)
3. **Generate employment contract** (auto-populated from template)
4. **Create/link system user account** (optional, for self-service access)
5. **Set initial leave balances** (per company policy)
6. **Send welcome notification** (email with system access details)

### Leave Request Workflow  
1. **Employee submits leave request** (via self-service or HR)
2. **System validates leave balance** (sufficient days available)
3. **Route to immediate supervisor** (auto-approval for certain types)
4. **Supervisor approves/rejects** (with comments if rejected)
5. **Update leave balance** (deduct approved days)
6. **Generate leave slip** (PDF for filing)
7. **Notify employee** (approval/rejection with document)

### Document Generation Workflow
1. **Select document template** (contract, certificate, etc.)
2. **Auto-populate employee data** (from database)
3. **Allow custom field editing** (specific dates, amounts, etc.)
4. **Generate PDF preview** (review before final generation)
5. **Save to document storage** (with audit trail)
6. **Email to employee** (optional distribution)

---

## User Interface Design

### Admin Self-Onboarding Interface
- **First Login Detection**: Middleware checks if admin needs employee record
- **Onboarding Modal**: "Complete your profile to access HR features"
- **Employee Creation Form**: Personal details, employment info, department
- **Auto-link Confirmation**: "Your user account is now linked to employee record"

### HR Dashboard
- **Employee Statistics**: Active, new hires, terminations
- **Leave Requests**: Pending approvals, recent submissions
- **Document Queue**: Recent generations, templates used
- **Quick Actions**: Add employee, approve leaves, generate docs
- **User Management**: Pending user approvals with employee linking options
- **User Management**: Pending user registrations, employee-user linking

### Department Management
- **Department List**: Office, Production, and Security departments
- **Department Profile**: Manager assignment, employee count, status
- **Department Hierarchy**: Visual organization chart
- **Department Reports**: Headcount, distribution, and analytics

### Employee Management
- **Employee List**: Searchable, filterable by department/status
- **Employee Profile**: Comprehensive view with tabs (Personal, Employment, Family, Documents, Leaves)
- **Onboarding Wizard**: Step-by-step employee creation with department assignment
- **Bulk Actions**: Import employees, bulk document generation
- **Department Transfer**: Employee movement between departments

### Leave Management
- **Leave Calendar**: Visual calendar showing all leaves
- **Request Form**: Smart form with balance validation
- **Approval Queue**: Supervisor dashboard for pending requests
- **Balance Tracking**: Real-time leave balance management

### Document Center
- **Template Management**: Create and edit document templates
- **Document Library**: Search and download generated documents
- **Bulk Generation**: Generate multiple documents (year-end certificates)
- **Distribution**: Email documents to employees

### User-Employee Linking Interface
- **Pending Users List**: Shows users awaiting approval with employee matching suggestions
- **Employee Search**: Quick lookup to find employee records by name, email, department
- **Link Confirmation**: Visual confirmation of user ↔ employee relationship before approval
- **Bulk Linking**: Process multiple user approvals with employee associations
- **Unlinked Users**: Manage system users without employee records (admins, contractors)

---

## Security & Compliance

### Data Protection
- **Sensitive Field Encryption**: Government IDs, salary information
- **File Access Control**: Role-based document access
- **Audit Logging**: All employee data changes tracked
- **Backup Strategy**: Regular encrypted backups

### Philippine Labor Law Compliance
- **Leave Entitlements**: Statutory leave calculations
- **Document Templates**: Legal-compliant contract templates
- **Retention Policy**: Employee record retention requirements
- **Privacy Compliance**: Data Privacy Act compliance

---

## Performance Considerations

### Database Optimization
- **Indexes**: Employee number, department, status, dates
- **Query Optimization**: Eager loading for relationships
- **Soft Deletes**: Archive instead of hard delete
- **Partitioning**: Large tables by year (future consideration)

### Caching Strategy
- **Employee Statistics**: Cache for 1 hour
- **Leave Balances**: Cache until balance changes
- **Document Templates**: Cache until template updates
- **Department Lists**: Cache for 24 hours

---

## Testing Strategy

### Unit Tests
- Model relationships and business logic
- Repository query methods
- Service class methods
- Document generation functions

### Feature Tests
- Employee CRUD operations
- Leave request workflow
- Document generation process
- Permission and access control

### Browser Tests
- Employee onboarding wizard
- Leave request submission
- Document preview and download
- HR dashboard functionality

---

## Future Enhancements

### User-Employee Linking Implementation

#### Service Layer Methods
```php
class UserEmployeeLinkingService
{
    public function suggestEmployeeMatches(User $user): Collection
    {
        // Match by email, name similarity, department
        return Employee::query()
            ->where('email_personal', $user->email)
            ->orWhere(function($q) use ($user) {
                $q->whereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$user->name}%"]);
            })
            ->whereNull('user_id')
            ->get();
    }
    
    public function linkUserToEmployee(User $user, Employee $employee): bool
    {
        DB::transaction(function() use ($user, $employee) {
            $user->update(['employee_id' => $employee->id]);
            $employee->update(['user_id' => $user->id]);
            
            // Assign employee-specific roles based on position/department
            $this->assignEmployeeRoles($user, $employee);
        });
    }
}
```

#### Frontend Components
- **`UserApprovalModal`**: Shows user details with employee matching interface
- **`EmployeeSearchDropdown`**: Searchable employee selector with smart matching
- **`LinkingConfirmation`**: Visual preview of user-employee relationship
- **`UserManagementTable`**: Lists pending users with quick approval actions

### Phase 2 Additions
- **Employee Performance Reviews**: Annual review system
- **Training Records**: Employee training and certification tracking
- **Asset Management**: Company asset assignment to employees
- **Advanced Reporting**: Custom report builder

### Integration Points
- **User Management**: Enhanced user approval workflow with employee linking
- **Timekeeping Module**: Employee attendance data
- **Payroll Module**: Salary and deduction information
- **Email System**: Automated notifications and document distribution
- **File Scanner**: Document digitization and attachment

---

**Module Completion Criteria:**
- [ ] All employee lifecycle operations functional
- [ ] **User-employee linking system implemented** (solves empty system startup)
- [ ] Leave request workflow complete with approvals
- [ ] Document generation system operational
- [ ] Self-service portal accessible to employees
- [ ] HR analytics and reporting available
- [ ] Full test coverage and documentation complete

**Estimated Timeline:** 6 weeks  
**Resources Required:** 1 Full-stack developer  
**Dependencies:** Foundation setup (roles, permissions, shared components)