# ISSUE-1 - Implement Login and Signup Pages with Admin Approval## Acceptance Criteria
- [x] Login page styled with Cathay Metal branding (blue #0056A4, red #DC1E28)
- [x] Registration page with username and required user fields
- [x] New users created with 'pending' status by default
- [x] Pending users cannot log in (blocked by middleware)
- [x] **Admin System Setup Workflow (COMPLETED)**
  - [x] Admin logs in with seeded account (admin@cameco.com)
  - [x] System detects admin needs employee record creation
  - [x] Admin forced to complete profile setup (cannot access system otherwise)
  - [x] Admin creates their own employee record with personal/employment details
  - [x] System automatically links admin user account to new employee record
  - [x] Admin can then access full system functionality
- [ ] Admin can view list of pending user registrations
- [ ] Admin can approve/reject users with optional rejection message
- [ ] Email notifications sent for registration, approval, and rejection
- [x] Approved users can log in successfully (tested with admin seeder)
- [x] Rejected users see appropriate error message
- [x] All forms have proper validation and CSRF protection

## Phased Plan
| Phase | Description | Status |
|-------|--------------|--------|
| 1 | Database migration: Add user status fields | ✅ DONE |
| 2 | Create EnsureUserIsActive middleware | ✅ DONE |
| 3 | Update registration to set pending status | ✅ DONE |
| 4 | Design Login page with Cathay Metal branding | ✅ DONE |
| 5 | Design Registration page with employee fields | ✅ DONE |
| **6** | **Admin Self-Onboarding System (NEW PRIORITY)** | **✅ DONE** |
| 6a | Create Department model and seeder for company structure | ✅ DONE |
| 6b | Create Employee model with user relationship | ✅ DONE |
| 6c | Create AdminOnboardingService for profile completion | ✅ DONE |
| 6d | Build admin profile completion form and workflow | ✅ DONE |
| 6e | Implement automatic user-employee linking middleware | ✅ DONE |
| 7 | Create admin user approval interface | ⏳ TODO |
| 8 | Implement email notifications system | ⏳ TODO |
| 9 | End-to-end testing and validation | ⏳ TODO |
## Summary
## Summary
Implement secure login and registration pages for the SyncingSteel System with an admin approval workflow. New user registrations should require admin review and approval before users can access the system.

## Requirements

### Login Page
- Clean, professional design matching Cathay Metal Corporation branding
- Blue (#0056A4) and red (#DC1E28) color scheme
- Email/username and password fields
- Remember me checkbox
- Forgot password link
- Error message display for invalid credentials
- CSRF protection (Laravel built-in)

### Signup/Registration Page
- User information form (name, email, password, confirm password)
- Employee ID field
- Department/Position selection
- Terms of service acceptance checkbox
- Submit button triggers pending approval status
- Success message: Registration submitted. Awaiting admin approval.

### Admin Self-Onboarding Workflow (NEW PRIORITY)
- Seeded admin account (admin@cathay.com) has `employee_id = NULL`
- After admin login, middleware detects missing employee record
- Admin redirected to mandatory profile completion page
- Admin cannot access any system features until profile complete
- Admin fills employee creation form with personal/employment details
- System creates employee record with `user_id = admin.id`
- System updates admin user with `employee_id = new_employee.id`
- Admin gains full system access after linking complete

### Admin Approval Workflow
- New registrations create user with pending status
- Admin dashboard shows list of pending user registrations
- Admin can view user details before approval
- Admin can approve or reject registration
- Email notification sent to user upon approval/rejection
- Approved users can log in immediately
- Rejected users receive explanation (optional message from admin)

## Technical Requirements

### Database Schema
- Add status field to users table: enum(pending, active, suspended, rejected)
- Add username field (unique, required)
- Add approved_by field (foreign key to users table)
- Add approved_at timestamp
- Add rejection_reason text field (nullable)

### Additional Schema for Admin Self-Onboarding
- **departments table**: Company department structure (HR, Accounting, IT, RM1-RM5, Security)
- **employees table**: Employee master data with nullable user_id relationship
- **users.employee_id**: Nullable foreign key to employees (bidirectional relationship)
- **Admin seeder update**: Set employee_id = NULL for seeded admin account

### Middleware
- Create EnsureUserIsActive middleware to check user status on login
- Block pending and rejected users from accessing system
- Show appropriate message based on status
- **EnsureAdminHasEmployee middleware**: Check if admin user has employee record
- Redirect admin to profile completion if employee_id is NULL
- Allow access to profile completion route only

### Notifications
- Email notification on registration (to admins)
- Email notification on approval (to user)
- Email notification on rejection (to user, with reason)

### Service Layer
- **AdminOnboardingService**: Handle admin profile completion workflow
  - `requiresOnboarding(User $user): bool` - Check if admin needs employee record
  - `createEmployeeForAdmin(User $admin, array $data): Employee` - Create and link employee
  - Transaction handling for user-employee linking
- **DepartmentService**: Manage company department structure
- **EmployeeService**: Handle employee CRUD operations

### Admin Interface
- **Admin Profile Completion Page**: Mandatory setup form for admin self-onboarding
- **Employee Creation Form**: Personal details, employment info, department selection
- Pending users list page (accessible to admins only)
- User approval/rejection actions
- Bulk actions for multiple users
- Filter and search functionality

## Design Reference
- Match landing page styling (full-width sections, blue gradient)
- Use Cathay Metal logo on auth pages
- Keep forms clean and minimal
- Add helpful error messages and validation feedback

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Phased Plan
| Phase | Description | Status |
|-------|--------------|--------|
| 1 | Planning and design | â˜ |
| 2 | Implementation | â˜ |
| 3 | Testing and validation | â˜ |

## Progress

### ✅ Phase 1: Database Migration (COMPLETED)
- Created migration: `2025_10_06_012421_add_user_approval_fields_to_users_table.php`
- Added fields: `status` (enum), `username` (unique), `approved_by` (FK), `approved_at` (timestamp), `rejection_reason` (text)
- Migration executed successfully
- Updated User model with casts, relationships, fillable attributes, and helper methods

### ✅ Phase 2: Middleware (COMPLETED)
- Created `EnsureUserIsActive` middleware
- Blocks pending users with message: "Your account is pending approval..."

### ✅ Phase 6a: Department Model & Seeder (COMPLETED)
- Created Department Eloquent model with proper relationships
- Added department_type enum (office, production, security)
- Created DepartmentSeeder with 11 departments:
  - **Office (5)**: HR, Accounting, Administration, IT, Front Desk
  - **Production (5)**: Rolling Mill 1-5
  - **Security (1)**: Security/Guards
- Added scopes and helper methods (byType, active, isOffice, etc.)
- All departments successfully seeded to database

### ✅ Phase 6b: Employee Model & Relationships (COMPLETED)
- Created Employee Eloquent model with 25+ comprehensive fields
- Implemented bidirectional nullable user relationship
- Added auto-generated employee numbers (EMP-YYYY-NNNN format)
- Created proper migration with foreign key constraints
- Enhanced User model with employee relationship and admin detection
- Added helper methods: hasEmployeeRecord(), isActive(), hasUserAccount()

### ✅ Phase 6c: AdminOnboardingService (COMPLETED)
- Created AdminOnboardingService for admin profile completion workflow
- Implemented key methods:
  - `requiresOnboarding(User $user): bool` - Detects admin needing employee record
  - `createEmployeeForAdmin(User $admin, array $data): Employee` - Creates and links employee
  - `getOnboardingProgress(User $user): array` - Returns completion status
  - `validateEmployeeData(array $data): bool` - Validates employee data
- Transaction handling for safe user-employee linking
- Comprehensive validation and error handling
- Successfully tested with seeded admin user

### ✅ Phase 6d: Admin Profile Completion Form & Workflow (COMPLETED)
- Created AdminProfileController with form display and processing methods
- Built comprehensive React ProfileCompletion component with 4-step progressive form:
  - **Step 1**: Personal Information (name, DOB, gender, civil status, nationality)
  - **Step 2**: Contact Information (email, phone, address, city, state, postal code)
  - **Step 3**: Employment Information (position, department, hire date, salary, schedule)
  - **Step 4**: Additional Information (government IDs, emergency contact)
- Added proper validation for all required fields
- Implemented step-by-step validation with progress bar
- Created missing form components: InputError, InputLabel, TextInput, PrimaryButton
- Added routes for profile completion with proper middleware handling
- Styled with Cathay Metal branding (blue #0056A4)

### ✅ Phase 6e: EnsureAdminHasEmployee Middleware (COMPLETED)
- Created EnsureAdminHasEmployee middleware to detect admins without employee records
- Implemented automatic redirection to profile completion page
- Added proper route exclusions (logout, password reset, verification, etc.)
- Registered middleware in bootstrap/app.php with alias 'admin.has.employee'
- Applied middleware to all authenticated routes requiring employee records
- Added helpful user messages during redirection process
- Tested end-to-end workflow: admin login → detection → redirection → profile completion
- Blocks rejected users with rejection reason
- Blocks suspended users
- Registered as `user.active` alias in bootstrap/app.php
- Applied to authenticated routes in routes/web.php

### ✅ Phase 3: Registration Update (COMPLETED)
- Modified `CreateNewUser` action to set `status = 'pending'` by default
- All new registrations now require admin approval

### ✅ Phase 4: Login Page (COMPLETED)
- Clean design with Cathay Metal logo (blue parallelogram + red triangle)
- Gradient header: from-[#0056A4] to-[#0066B4]
- Email and password fields with validation
- Remember me checkbox
- Error messages with icons
- Link to registration page
- File: `resources/js/Pages/Auth/Login.jsx`

### ✅ Phase 5: Registration Page (COMPLETED)
- Matches login page styling with Cathay Metal logo
- Form fields: name, email, password, password_confirmation
- Terms and conditions checkbox
- Info box explaining approval process
- "What happens next?" guide section
- Link to login page
- File: `resources/js/Pages/Auth/Register.jsx`

### ✅ Additional: Comprehensive Test User Seeders (COMPLETED)
- Created `AdminUserSeeder` with default credentials
  - Email: admin@cathay.com
  - Username: admin
  - Password: password
  - Status: active (can login immediately)
- Created `ApprovedUserSeeder` with 3 active test users
  - john.smith@cathay.com, sarah.johnson@cathay.com, mike.chen@cathay.com
  - All approved by admin, can login successfully
- Created `RejectedUserSeeder` with 3 rejected test users
  - Custom rejection reasons for different scenarios (external email, employment verification, contractor approval)
  - Tests rejection message display functionality
- All seeders registered in `DatabaseSeeder.php` with proper execution order
- Personal teams created automatically for approved users

### 📄 Documentation
- Created `tests/TESTING.md` with complete testing guide
- Includes setup instructions, test scenarios, admin credentials  
- Documents testing workflow for registration and login flows
- **UPDATED**: Added comprehensive test user tables with credentials for all status types
- **UPDATED**: Added seeder commands for individual or bulk database setup
- **UPDATED**: Documented rejection reasons and expected error messages
- **UPDATED**: Moved to tests folder and referenced in README.md for better organization

### ✅ Phase 6a: Department Model & Seeder (COMPLETED)
- ✅ Created Department Eloquent model with relationships (`app/Models/Department.php`)
- ✅ Added department_type enum (office, production, security) with scopes and helper methods  
- ✅ Created DepartmentSeeder with 11 departments across 3 types (`database/seeders/DepartmentSeeder.php`)
- ✅ Database migration created with proper indexes and constraints
- ✅ Departments seeded successfully: HR, Accounting, IT, Administration, Front Desk, RM1-RM5, Security

### ✅ Phase 6b: Employee Model & Relationships (COMPLETED)
- ✅ Created Employee Eloquent model with 25+ fields (`app/Models/Employee.php`)
- ✅ Set up bidirectional nullable relationship with User model
- ✅ Added auto-generated employee_number in format EMP-YYYY-NNNN
- ✅ Created comprehensive Employee migration with all required fields
- ✅ Created EmployeeFactory for testing data generation
- ✅ Added User model employee relationship and helper methods
- ✅ Database migration for users.employee_id and department_id fields

### ✅ Phase 6c: AdminOnboardingService (COMPLETED)
- ✅ Created AdminOnboardingService (`app/Services/AdminOnboardingService.php`)
- ✅ Implemented admin profile completion detection logic
- ✅ Created transaction-safe user-employee linking
- ✅ Added validation for required admin profile fields
- ✅ Added onboarding progress tracking and status methods

**6d. Admin Profile Completion UI**
- Create profile completion page with Cathay Metal branding
- Build comprehensive employee creation form (personal, employment, emergency contact)
- Add department selection dropdown with proper categorization
- Implement form validation and error handling

**6e. Middleware & Routing**
- Create EnsureAdminHasEmployee middleware
- Apply middleware to all authenticated routes except profile completion
- Set up profile completion routes and controller
- Add automatic redirection logic after admin login

### 🚀 Servers Running
- Laravel: http://127.0.0.1:8000
- Vite: Port 5174 (hot reload)

## Questions / Clarifications

**✅ CLARIFIED - Admin Self-Onboarding Workflow:**
- **Q**: How should admin bootstrap themselves in empty system?
- **A**: Admin logs in with seeded account → forced to complete employee profile → automatic linking → full system access

**Current Priority**: Implement Phase 6 (Admin Self-Onboarding) before user approval interface
- This solves the "empty system startup" scenario
- Admin becomes both system user AND employee record
- Enables proper HR module functionality from day one

**Ready to begin Phase 6a: Department Model & Seeder implementation**
_None yet._

## Test Plan
- [ ] Unit tests: â€¦
- [ ] Integration tests: â€¦
- [ ] Manual testing: â€¦

## Related Issues
_None yet._

---

**Linked Issue:** https://github.com/max31337/cameco/issues/1

### AI Workflow
1. Fill in Acceptance Criteria and Phased Plan
2. Get user validation for each phase before implementation
3. Update Progress section after each phase
4. Generate test plan before final phase
5. Archive file after PR merge
