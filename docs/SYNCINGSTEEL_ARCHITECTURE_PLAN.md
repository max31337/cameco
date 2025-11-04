# SyncingSteel System - Architecture Overview

## System Overview
**SyncingSteel System** is an internal information management system for **Cathay Metal Corporation**, built as an on-premise web application. The system provides HR management, timekeeping, payroll, and future inventory management capabilities for internal office users only.

**Technology Stack:**
- **Backend:** Laravel 11 + Service & Repository Pattern
- **Frontend:** React + Inertia.js (No API Mode)
- **Database:** PostgreSQL/SQLite
- **Authentication:** Laravel Jetstream with role-based access
- **Deployment:** On-premise (LAN/Intranet access only)

**📋 Complete Database Schema:** [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - 45 tables across all modules with relationships and constraints

## Current State
- ✅ Laravel 12 + Jetstream + Inertia.js + React setup
- ✅ Authentication system with admin approval workflow
- ✅ Landing page, login, and registration pages
- ✅ User management with status-based access control
- ✅ Test users and comprehensive testing documentation

## Implementation Strategy

**Modular Development Approach:**
1. **Phase 1:** HR Module (Foundation) - *Priority Implementation*
2. **Phase 2:** Timekeeping Module - *Planned*
3. **Phase 3:** Payroll Module - *Planned*  

**Core Architectural Principles:**
1. **Clean Architecture**: Service & Repository patterns for maintainable backend
2. **Component-Based Frontend**: React components with Inertia.js integration
3. **No API Mode**: Direct Laravel-to-React rendering (not SPA)
4. **Role-Based Access**: Granular permissions for different user types
5. **Modular Design**: Each module can be developed and deployed independently

## Core Architecture Foundation

### Backend Architecture (Laravel + Service & Repository Pattern)

**Flow:** `Controllers → Services → Repositories → Models → Database`

**Key Components:**
- **Controllers**: Handle HTTP requests, delegate to services
- **Services**: Business logic, orchestration, transaction management
- **Repositories**: Data access abstraction, query optimization
- **Models**: Eloquent models with relationships
- **Actions**: Single-purpose operations (document generation, etc.)

### Frontend Architecture (React + Inertia.js - No API)

**Flow:** `Laravel Routes → Inertia::render() → React Components → User Interface`

**Key Benefits:**
- ✅ Server-side routing (SEO friendly)
- ✅ React components for rich UI
- ✅ Shared authentication state
- ✅ No API endpoints needed
- ✅ Real-time form validation
- ✅ Optimistic UI updates

### 📁 System Folder Structure
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── HR/              # HR Module Controllers
│   │   ├── Timekeeping/     # Timekeeping Module Controllers  
│   │   ├── Payroll/         # Payroll Module Controllers
│   │   └── DashboardController.php
│   └── Requests/
│       ├── HR/              # HR Form Validations
│       ├── Timekeeping/     # Timekeeping Form Validations
│       └── Payroll/         # Payroll Form Validations
│
├── Models/
│   ├── HR/                  # HR Module Models
│   ├── Timekeeping/         # Timekeeping Module Models
│   ├── Payroll/             # Payroll Module Models
│   └── Shared/              # Cross-module Models (User, Department, etc.)
│
├── Repositories/
│   ├── Contracts/
│   │   ├── HR/              # HR Repository Interfaces
│   │   ├── Timekeeping/     # Timekeeping Repository Interfaces
│   │   └── Payroll/         # Payroll Repository Interfaces
│   └── Eloquent/
│       ├── HR/              # HR Repository Implementations
│       ├── Timekeeping/     # Timekeeping Repository Implementations
│       └── Payroll/         # Payroll Repository Implementations
│
├── Services/
│   ├── HR/                  # HR Business Logic Services
│   ├── Timekeeping/         # Timekeeping Business Logic Services
│   ├── Payroll/             # Payroll Business Logic Services
│   └── Shared/              # Cross-module Services (DocumentService, etc.)
│
├── Actions/
│   ├── HR/                  # HR-specific Actions
│   ├── Timekeeping/         # Timekeeping-specific Actions
│   ├── Payroll/             # Payroll-specific Actions
│   └── Shared/              # Cross-module Actions
│
└── Providers/
    └── RepositoryServiceProvider.php
```

### Frontend Structure (React + Inertia.js)
```
resources/js/
├── Pages/
│   ├── HR/                  # HR Module Pages
│   ├── Timekeeping/         # Timekeeping Module Pages
│   ├── Payroll/             # Payroll Module Pages
│   └── Dashboard.jsx
├── Components/
│   ├── HR/                  # HR-specific Components
│   ├── Timekeeping/         # Timekeeping-specific Components
│   ├── Payroll/             # Payroll-specific Components
│   └── Shared/              # Reusable Components
├── Layouts/
│   ├── AuthenticatedLayout.jsx
│   └── ModuleLayout.jsx
└── app.jsx
```

## Module Implementation Plans

Each module has its own detailed architectural plan and implementation guide:

### 📋 [HR Module](HR_MODULE_ARCHITECTURE.md) - **Priority Implementation**
**Status:** Ready for development  
**Timeline:** 4-6 weeks  
**Core Features:**
- Employee management and onboarding
- Leave request workflow
- Document generation (contracts, slips)
- Department and role management
- Employee self-service portal

### ⏰ [Timekeeping Module](TIMEKEEPING_MODULE_ARCHITECTURE.md) - **Planned**
**Status:** Architecture planning  
**Timeline:** 3-4 weeks after HR  
**Core Features:**
- Manual time entry interface
- CSV/Excel timesheet imports
- Attendance tracking and reporting
- Overtime calculations
- Integration with HR employee data

### 💰 [Payroll Module](PAYROLL_MODULE_ARCHITECTURE.md) - **Planned**

### 🧭 [Workforce Management Module](WORKFORCE_MANAGEMENT_MODULE.md) - **Planned**
**Status:** Planning
**Core Features:**
- Schedule and rotation management
- Daily assignments and attendance integrations
- Workforce analytics and reporting

### 🧩 [Applicant Tracking (ATS) Module](ATS_MODULE.md) - **Planned**
**Status:** Planning
**Core Features:**
- Candidate pipelines and evaluation
- Interview scheduling and feedback
- Onboarding handoff to HR Core

### 🚀 [Onboarding Module](ONBOARDING_MODULE.md) - **Planned**
**Status:** Planning
**Core Features:**
- Automated onboarding checklists and tasks
- Contract generation and sign-off
- Account provisioning and initial training steps

### � New: Foundation & Admin Docs

- [User Management](USER_MANAGEMENT.md) — CRUD, invitations, activation, role lifecycle and audit logging (focus: Superadmin/Admin control)
- [Onboarding Workflow](ONBOARDING_WORKFLOW.md) — Organization creation, admin invitation, HR first-run checklist and domain restrictions
- [HR & Payroll Configuration](HR_PAYROLL_CONFIG.md) — Salary components, departmental pay bands, payroll periods and approval flows
- [System Configuration](SYSTEM_CONFIGURATION.md) — Domain-specific settings, feature toggles and configuration responsibility split
- [RBAC Matrix](RBAC_MATRIX.md) — Editable scopes per role, inheritance rules, system safeguards and audit requirements

### �📊 [Appraisal Module](APPRAISAL_MODULE.md) - **Planned**
**Status:** Planning
**Core Features:**
- Performance review cycles
- Attendance & violation-based scoring
- Rehire recommendation workflow
**Status:** Architecture planning  
**Timeline:** 6-8 weeks after Timekeeping  
**Core Features:**
- Salary calculations and deductions
- Philippine tax compliance (BIR, SSS, PhilHealth, Pag-IBIG)
- Payslip generation and distribution
- Integration with HR and Timekeeping data
- Statutory reporting capabilities

---

## Shared Foundation Components

### User-Employee Relationship Strategy

**Approach**: Bidirectional optional relationship between `users` and `employees` tables

**Rationale**:
- Not all employees need system access (many are just records in HR)  
- Not all system users are employees (external contractors, consultants)
- System users can reference their employee record via `employee_id`
- Employee records can optionally link to system user via `user_id`
- Roles and departments are managed at both levels for flexibility

**Benefits**:
- ✅ HR can manage all employees (with or without system access)
- ✅ System users have proper role-based access control
- ✅ Easy to grant/revoke system access without affecting HR records
- ✅ Supports contractors and external users
- ✅ Employee self-service portal when needed

### Database Schema

**📋 Complete Schema Reference**: See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for comprehensive table definitions.

**Core Foundation Tables**:
- `users` - System authentication with employee links (enhanced with employee_id, department_id)
- `departments` - Organizational structure with manager relationships
- `employees` - Employee master data (25+ fields including personal, employment, government IDs)
- `roles` & `permissions` - Role-based access control (Spatie Laravel Permission)
- `activity_log` - Comprehensive audit trail for all system changes

**Department Structure** (11 departments across 3 types):
- **Office Departments** (5): HR, Accounting, Administration, IT Department, Front Desk
- **Production Departments** (5): Rolling Mill 1, Rolling Mill 2, Rolling Mill 3, Rolling Mill 4, Rolling Mill 5
- **Security Department** (1): Security/Guards

**Schema Overview**:
- **Total Tables**: 45 tables across all modules
- **Foundation**: 15 tables (auth, permissions, cache, jobs)
- **HR Module**: 7 tables (employees, leave requests, documents)
- **Timekeeping**: 8 tables (attendance, schedules, imports)
- **Payroll**: 12 tables (calculations, government rates, payslips)
- **Audit**: 3 tables (activity logging and compliance)

### Roles & Permissions

**Implementation**: Using `spatie/laravel-permission` package with comprehensive role-based access control.

**Database Tables**: See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete table definitions including `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, and `role_has_permissions`.

#### Proposed Roles:
- **Super Admin**: Full system access
- **HR Manager**: Full HR module access
- **HR Staff**: HR operations (limited admin functions)
- **Department Manager**: View own department employees
- **Employee**: Self-service access (view own records, submit leave requests)

#### Proposed Permissions:
- **employees.view_all**: View all employee records
- **employees.view_department**: View department employees only
- **employees.view_own**: View own employee record only
- **employees.create**: Create new employee records
- **employees.update**: Update employee records
- **employees.delete**: Archive/delete employee records
- **attendance.view_all**: View all attendance records
- **attendance.view_department**: View department attendance
- **attendance.manage**: Create/edit attendance records
- **leaves.view_all**: View all leave requests
- **leaves.approve**: Approve/reject leave requests
- **leaves.create**: Submit leave requests
- **documents.generate**: Generate HR documents
- **reports.view**: Access to reports and analytics

## System-Wide Implementation Phases

### Phase A: Foundation Setup
**Timeline:** 1-2 weeks  
**Scope:** All modules
- [ ] Install and configure required dependencies
- [ ] Set up role and permission system
- [ ] Create shared models (User, Department, Employee base)
- [ ] Implement repository service provider
- [ ] Create shared UI components and layouts

### Phase B: HR Module Implementation  
**Timeline:** 4-6 weeks  
**Scope:** Complete HR functionality
- [ ] Implement HR-specific architecture (see [HR_MODULE_ARCHITECTURE.md](HR_MODULE_ARCHITECTURE.md))
- [ ] Employee management system
- [ ] Leave request workflow
- [ ] Document generation system
- [ ] HR reporting and analytics

### Phase C: Timekeeping Module Implementation
**Timeline:** 3-4 weeks  
**Scope:** Attendance and time tracking
- [ ] Implement Timekeeping architecture (see [TIMEKEEPING_MODULE_ARCHITECTURE.md](TIMEKEEPING_MODULE_ARCHITECTURE.md))
- [ ] Manual time entry interface
- [ ] CSV/Excel import system
- [ ] Attendance reporting
- [ ] Integration with HR employee data

### Phase D: Payroll Module Implementation
**Timeline:** 6-8 weeks  
**Scope:** Salary calculation and compliance
- [ ] Implement Payroll architecture (see [PAYROLL_MODULE_ARCHITECTURE.md](PAYROLL_MODULE_ARCHITECTURE.md))
- [ ] Salary calculation engine
- [ ] Philippine tax compliance
- [ ] Payslip generation
- [ ] Integration with HR and Timekeeping

## Technical Requirements

### Dependencies to Install
```bash
# PDF Generation
composer require barryvdh/laravel-dompdf

# Excel Export (future use)
composer require maatwebsite/excel

# Role and Permission Management
composer require spatie/laravel-permission

# Activity Logging (audit trail)
composer require spatie/laravel-activitylog
```

### Architecture Principles
1. **Single Responsibility**: Each class has one clear purpose
2. **Dependency Injection**: All dependencies injected through constructor
3. **Interface Segregation**: Repositories implement focused interfaces
4. **Open/Closed**: Easy to extend without modifying existing code
5. **Repository Pattern**: Database access abstracted through repositories
6. **Service Pattern**: Business logic separated from controllers

### Naming Conventions
- **Models**: Singular, PascalCase (Employee, LeaveRequest)
- **Controllers**: PascalCase with Controller suffix (EmployeeController)
- **Services**: PascalCase with Service suffix (EmployeeService)
- **Eloquent**: PascalCase with Repository suffix (EloquentEmployeeRepository)
- **Contracts**: PascalCase with Interface suffix (EmployeeRepositoryInterface)
- **Actions**: PascalCase with Action suffix (GenerateContractAction)

### Error Handling Strategy
- Use Laravel's built-in exception handling
- Create custom exceptions for business logic errors
- Repository layer throws standard exceptions
- Service layer catches and transforms to business exceptions
- Controllers handle HTTP-specific responses

## Document Generation System

### Document Types
1. **Employment Contract** - Generated during onboarding
2. **Leave Slips** - Various types (AP, AC, BL, SL, etc.)
3. **Excuse Slips** - For tardiness or absences
4. **Certificates** - Employment, compensation, etc.

### PDF Generation Flow
1. Service calls DocumentService
2. DocumentService loads appropriate Blade template
3. Template populated with employee/leave data
3. PDF generated using DomPDF
4. File stored in storage/app/documents
5. Database record created with file metadata

## Testing Strategy

### Repository Tests
- Test database interactions
- Mock external dependencies
- Verify query optimization
- Test edge cases and error handling

### Service Tests
- Mock repository dependencies
- Test business logic
- Verify validation rules
- Test transaction handling

### Integration Tests
- Test controller-to-database flow
- Verify middleware functionality
- Test PDF generation
- Validate form submissions

## Security Considerations

### Access Control
- Role-based permissions (Admin, HR, Manager, Employee)
- Route protection with middleware
- Form validation and CSRF protection
- Activity logging for audit trails

### Data Protection
- Sensitive data encryption
- Secure file storage
- Input sanitization
- SQL injection prevention

## Performance Optimization

### Database
- Proper indexing on foreign keys and search fields
- Eager loading for relationships
- Query optimization
- Database connection pooling

### Caching
- Cache employee statistics
- Cache document templates
- Redis for session storage
- Query result caching

## Integration Strategy

### Cross-Module Data Flow
```
HR Module → Employee Data → Timekeeping Module → Attendance Data → Payroll Module
     ↓              ↓                    ↓                  ↓              ↓
  Documents     Leave Requests      Time Records      Calculations    Payslips
```

### Shared Services
- **DocumentService**: PDF generation across all modules
- **NotificationService**: Email/system notifications
- **ReportingService**: Cross-module analytics and reports
- **AuditService**: Activity logging and compliance tracking

### Frontend Integration (No API Mode)
- **Shared Layout**: Consistent navigation across modules
- **Component Library**: Reusable UI components
- **State Management**: Inertia.js handles data flow
- **Form Handling**: Unified validation and submission

---

## Getting Started

### Current Status
✅ **Foundation Ready**: Authentication, user management, and basic structure complete

### Next Steps
1. **Review Documentation**: 
   - **📋 [Complete Database Schema](DATABASE_SCHEMA.md)** - 45 tables with relationships and constraints
   - [HR Module Architecture](HR_MODULE_ARCHITECTURE.md) - Priority implementation
   - [Timekeeping Module Architecture](TIMEKEEPING_MODULE_ARCHITECTURE.md) - Attendance tracking
   - [Payroll Module Architecture](PAYROLL_MODULE_ARCHITECTURE.md) - Philippine tax compliance

2. **Begin Implementation**: Start with Phase A (Foundation Setup)

3. **Development Priority**: HR Module → Timekeeping → Payroll

### Total Timeline Estimate
- **Foundation Setup**: 1-2 weeks
- **HR Module**: 4-6 weeks  
- **Timekeeping Module**: 3-4 weeks
- **Payroll Module**: 6-8 weeks
- **Total**: ~4-5 months for complete system

### Dependencies
- ✅ **Current Setup**: Laravel 11 + Jetstream + Inertia.js + React
- 🔄 **To Install**: PDF generation, permissions, activity logging
- 📋 **To Plan**: Module-specific requirements (see individual architecture docs)

**Last Updated**: October 14, 2025  
