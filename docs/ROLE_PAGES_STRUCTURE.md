# HRIS Role-Based Pages Structure

**Project:** Cathay Metal Corporation HRIS  
**System Type:** On-Premise with integrated modules  
**Last Updated:** November 11, 2025

## System Modules Overview
- ✅ **ATS** (Applicant Tracking System)
- ✅ **HR Module** (Employee, Department, Position Management)
- ✅ **Payroll** (Salary, Deductions, Government Compliance)
- ✅ **Timekeeping** (Integrated with edge RFID scanner)
- ✅ **Workforce Management** (Scheduling & Employee Rotation)
- ✅ **Appraisal System** (Performance Management based on Attendance & Behavior)

## Current Access Policy & Future Plans

### **Current State (Phase 1):**
- **HR Staff** handles all workforce management data entry and scheduling
- **No employee portal** - all employee requests go through HR Staff
- **No supervisor access** - supervisors do not have direct system access
- Manufacturing employees and office employees do not log into the system

### **Future State (Optional - Phase 2+):**
When enabled by client, the system will support:

1. **Employee Self-Service Portal**
   - Employees can view their own schedules, attendance, and payslips
   - Submit leave requests and document requests
   - View performance appraisals
   - Update personal contact information

2. **Supervisor Portal (for Workforce Management)**
   - **Production Supervisors** can:
     - View team schedules and assignments
     - Submit attendance corrections for their team
     - Approve overtime requests
     - Input daily attendance (time-in/out)
     - View team performance metrics
   - **Department Supervisors** can:
     - Manage team rotations and shifts
     - Submit leave approvals (first level)
     - View team attendance reports
     - Input behavior remarks and performance notes

3. **Mobile Access (Future)**
   - RFID/biometric integration with mobile app
   - Real-time attendance notifications
   - Mobile leave request submission
   - Push notifications for schedule changes

**Note:** All future access is **disabled by default** and requires explicit client approval and configuration before enabling.

---

## Legend
- **[x]** = Working with frontend and backend
- **[-]** = Working frontend only (mock data)
- **[ ]** = Not yet implemented

---

# 1. SUPERADMIN (Application and Server Admin)

## Dashboard
- **[x] Overview Dashboard**
  - System health summary
  - Active users
  - Module status
  - Recent alerts and notifications

## System Administration
- **[x] System Health**
  - Server metrics (CPU, memory, disk usage)
  - Database status
  - Service uptime
  - Performance monitoring
  
- **[x] SLA Monitoring**
  - Service level agreements
  - Uptime tracking
  - Response time metrics
  - Incident tracking
  
- **[x] Storage**
  - Disk usage analytics
  - File system monitoring
  - Backup storage status
  - Cleanup utilities
  
- **[x] Backups**
  - Backup schedules
  - Backup history
  - Restore operations
  - Backup verification
  
- **[x] Security Audit**
  - Login attempts
  - Failed authentication logs
  - Security events
  - Access patterns
  
- **[x] Error Logs**
  - Application errors
  - System errors
  - Error trends
  - Error resolution tracking
  
- **[x] Patches**
  - Available patches
  - Patch history
  - Patch deployment
  - Rollback management
  
- **[x] Cron Jobs**
  - Scheduled jobs
  - Job execution history
  - Job failure alerts
  - Manual job triggers
  
- **[x] Updates**
  - System updates
  - Module updates
  - Update history
  - Version management

## Security & Access
- **[x] User Management**
  - User accounts
  - User activation/deactivation
  - User invitations
  - Account lockout management
  
- **[x] Roles and Permissions**
  - Role management
  - Permission assignment
  - Permission matrix
  - Role templates
  
- **[x] Security Policies**
  - Password policies
  - Session timeout settings
  - Two-factor authentication
  - Account lockout policies
  
- **[x] IP Allowlist/Blocklist**
  - IP whitelist management
  - IP blacklist management
  - Geographic restrictions
  - Access logs by IP

## Organization
- **[x] Overview**
  - System onboarding
  - Organization setup
  - Configuration management
  - System initialization
  
- **[x] Departments**
  - Department creation
  - Department hierarchy
  - Department activation/deactivation
  - Department reporting structure
  
- **[x] Positions & Hierarchy**
  - Position definitions
  - Organizational chart
  - Position requirements
  - Reporting structure

## Reports
- **[x] Usage Analytics**
  - User activity reports
  - Module usage statistics
  - Feature adoption metrics
  - Performance analytics
  
- **[x] Security Reports**
  - Access reports
  - Security incident reports
  - Compliance reports
  - Audit trails
  
- **[x] Payroll Reports**
  - Payroll generation logs
  - Payment batches
  - Error logs
  - Processing history
  
- **[x] Compliance Reports**
  - Regulatory compliance
  - Data protection compliance
  - Labor law compliance
  - Government filing status

---

# 2. OFFICE ADMIN / ADMIN OFFICER

## Dashboard
- **[x] Overview Dashboard**
  - Organization metrics
  - Employee summary
  - Pending approvals
  - Recent activities

## Employee Management
- **[x] Employees**
  - Employee list
  - Employee profiles
  - Employee activation/deactivation
  - Employee search and filters
  
- **[x] Departments**
  - Department management
  - Department employees
  - Department statistics
  - Department transfers
  
- **[x] Positions**
  - Position management
  - Position assignments
  - Position requirements
  - Position history

## User Management
- **[ ] User Accounts**
  - User creation
  - User-employee linking
  - User role assignment
  - User approval workflow
  
- **[ ] User Invitations**
  - Send invitations
  - Track invitation status
  - Resend/revoke invitations
  - Invitation templates

## Leave Management
- **[ ] Leave Requests**
  - Approve/reject requests
  - Leave request history
  - Bulk leave approvals
  - Leave calendar view
  
- **[ ] Leave Balances**
  - View employee balances
  - Adjust leave balances
  - Leave accrual management
  - Leave balance reports
  
- **[ ] Leave Policies**
  - Policy configuration
  - Leave type management
  - Accrual rules
  - Policy enforcement

## Document Management
- **[ ] Document Templates**
  - Employment contracts
  - Certificate templates
  - Memo templates
  - Policy documents
  
- **[ ] Generated Documents**
  - Document generation
  - Document history
  - Document approval
  - Document archive

## Reports
- **[ ] Employee Reports**
  - Employee statistics
  - Department breakdown
  - Employment status reports
  - Tenure analysis
  
- **[ ] Leave Reports**
  - Leave utilization
  - Leave trends
  - Department leave reports
  - Leave balance reports
  
- **[ ] Analytics**
  - HR metrics
  - Turnover analysis
  - Headcount trends
  - Demographic reports

## Organization Settings
- **[ ] Department Management**
  - Create/edit departments
  - Department budget allocation
  - Department policies
  - Cost center assignment
  
- **[ ] System Configuration**
  - Organization settings
  - Business rules
  - Approval workflows
  - Notification settings

---

# 3. HR MANAGER

## Dashboard
- **[x] Overview Dashboard**
  - HR metrics summary
  - Employee statistics
  - Pending tasks
  - Quick actions

## Employee Management
- **[x] Employees**
  - Employee CRUD operations
  - Employee profiles (full access)
  - Employee documents
  - Employee history
  
- **[x] Departments**
  - View departments
  - Department analytics
  - Department planning
  - Headcount management
  
- **[x] Positions**
  - View positions
  - Position planning
  - Position requirements
  - Succession planning

## Leave Management
- **[-] Leave Requests**
  - View all requests
  - Approve/reject requests
  - Leave request analytics
  - Override leave policies (with justification)
  
- **[-] Leave Balances**
  - View all balances
  - Adjust balances (with audit)
  - Mass balance adjustments
  - Leave accrual monitoring
  
- **[-] Leave Policies**
  - View policies
  - Recommend policy changes
  - Policy compliance monitoring
  - Policy effectiveness reports

## Recruitment (ATS)
- **[-] Job Postings**
  - Create/edit job postings
  - Post to social media
  - Job posting analytics
  - Closing management
  
- **[-] Candidates**
  - Candidate pipeline
  - Candidate screening
  - Candidate communications
  - Candidate evaluation
  
- **[-] Applications**
  - Review applications
  - Application tracking
  - Application status updates
  - Application analytics
  
- **[ ] Interviews**
  - Schedule interviews
  - Interview feedback
  - Interview evaluation
  - Interview analytics
  
- **[ ] Hiring Pipeline**
  - Pipeline overview
  - Offer management
  - Pre-employment requirements
  - Onboarding handoff

## Workforce Management
- **[ ] Work Schedules**
  - Create/edit schedules
  - Schedule templates
  - Schedule assignments
  - Schedule conflicts
  
- **[ ] Employee Rotations**
  - Rotation planning
  - Rotation patterns (4x2, 6x1, etc.)
  - Rotation assignments
  - Rotation analytics
  
- **[ ] Shift Assignments**
  - Daily assignments
  - Shift coverage
  - Assignment conflicts
  - Assignment history

**Note:** Currently, HR Staff handles all workforce management data entry. In the future, this module can be extended to allow Production Supervisors and Department Supervisors to manage their own team schedules, rotations, and daily assignments through a dedicated Supervisor Portal.

## Timekeeping
- **[ ] Attendance Overview**
  - Daily attendance summary
  - Attendance patterns
  - Attendance issues
  - Attendance analytics
  
- **[ ] Attendance Records**
  - View all records
  - Attendance corrections
  - Attendance disputes
  - Attendance approval
  
- **[ ] Overtime Requests**
  - Review overtime
  - Approve/reject overtime
  - Overtime budget tracking
  - Overtime analytics
  
- **[ ] Import Management**
  - Import attendance files
  - Import validation
  - Import error resolution
  - Import history

## Performance & Appraisal
- **[ ] Appraisal Cycles**
  - Create appraisal cycles
  - Assign appraisals
  - Monitor completion
  - Cycle analytics
  
- **[ ] Appraisals**
  - View all appraisals
  - Appraisal approval
  - Performance scores
  - Appraisal calibration
  
- **[ ] Performance Metrics**
  - Attendance metrics
  - Behavior remarks
  - Performance trends
  - High/low performers
  
- **[ ] Rehire Recommendations**
  - View recommendations
  - Approve/override recommendations
  - Rehire eligibility tracking
  - Historical rehire data

## Document Management
- **[ ] Document Templates**
  - Create/edit templates
  - Template approval
  - Template versioning
  - Template library
  
- **[ ] Generated Documents**
  - Generate documents
  - Document approval workflow
  - Document signing
  - Document repository

## Reports
- **[-] Employee Reports**
  - Comprehensive employee analytics
  - Department comparisons
  - Employment status breakdown
  - Tenure and turnover analysis
  
- **[-] Leave Reports**
  - Leave utilization by department
  - Leave trends and forecasting
  - Leave cost analysis
  - Leave policy effectiveness
  
- **[x] Analytics**
  - HR dashboard metrics
  - Predictive analytics --not-yet-applied (TODO: apply-frontend-only-first)
  - Cost per hire --not-yet-applied (TODO: apply-frontend-only-first)
  - Time to fill positions --not-yet-applied (TODO: apply-frontend-only-first)

## Payroll Support
- **[ ] Payroll Review**
  - Review payroll calculations
  - Approve payroll adjustments
  - Payroll variance analysis
  - Payroll audit trail
  
- **[ ] Salary Components**
  - View salary structures
  - Recommend adjustments
  - Component analysis
  - Compensation benchmarking

---

# 4. HR STAFF

## Dashboard
- **[ ] Overview Dashboard**
  - My tasks
  - Pending items
  - Recent activities
  - Quick links

## Employee Management
- **[ ] Employees**
  - Create/edit employees (limited fields)
  - View employee profiles
  - Employee onboarding
  - Employee data entry
  
- **[ ] Departments**
  - View departments
  - Department employee lists
  - Department statistics (read-only)
  
- **[ ] Positions**
  - View positions
  - Position assignments (read-only)

## Leave Management
- **[ ] Leave Requests**
  - View leave requests
  - Process requests (first-level)
  - Leave request data entry
  - Follow-up on approvals
  
- **[ ] Leave Balances**
  - View employee balances
  - Update balance records
  - Track leave usage
  - Balance inquiries
  
- **[ ] Leave Policies**
  - View policies (read-only)
  - Policy reference
  - Leave calculation guide

## Recruitment Support (ATS)
- **[ ] Candidates**
  - Add candidate records
  - Update candidate information
  - Schedule initial screenings
  - Candidate communications
  
- **[ ] Applications**
  - Record applications
  - Update application status
  - Candidate screening
  - Application filing
  
- **[ ] Interviews**
  - Schedule interviews (basic)
  - Record interview details
  - Collect feedback
  - Interview coordination

## Timekeeping
- **[ ] Attendance Entry**
  - Manual attendance entry
  - Attendance corrections (pending approval)
  - Daily attendance recording
  - Employee time-in/out
  
- **[ ] Attendance Records**
  - View attendance
  - Generate attendance reports
  - Attendance inquiries
  - Export attendance data
  
- **[ ] Import Management**
  - Upload attendance files
  - Import preview
  - Error correction
  - Import submission

## Performance Support
- **[ ] Appraisals**
  - Input appraisal data
  - Collect supervisor feedback
  - Schedule appraisal meetings
  - Appraisal notifications
  
- **[ ] Performance Records**
  - Record behavior remarks
  - Update attendance records
  - Performance documentation
  - Performance file maintenance

## Document Processing
- **[ ] Document Generation**
  - Generate standard documents
  - Document data entry
  - Document distribution
  - Document filing
  
- **[ ] Document Requests**
  - Process employee requests
  - Certificate of employment
  - Payslip reprints
  - Document verification

## Employee Inquiries
- **[ ] Information Desk**
  - Handle employee inquiries
  - Provide policy information
  - Benefits inquiries
  - Leave balance inquiries
  
- **[ ] Request Processing**
  - Process employee requests
  - Document requests
  - Information updates
  - Request tracking

## Reports
- **[ ] Basic Reports**
  - Employee lists
  - Attendance summaries
  - Leave summaries
  - Department reports

---

# 5. PAYROLL OFFICER

## Dashboard
- **[ ] Overview Dashboard**
  - Payroll summary
  - Pending payroll periods
  - Recent activities
  - Alerts and notifications

## Payroll Processing
- **[ ] Payroll Periods**
  - Create payroll periods
  - Period configuration
  - Payroll calendar
  - Period status tracking
  
- **[ ] Payroll Calculation**
  - Import attendance data
  - Calculate payroll
  - Review calculations
  - Payroll adjustments
  
- **[ ] Payroll Review**
  - Review payroll results
  - Variance analysis
  - Exception handling
  - Payroll corrections
  
- **[ ] Payroll Approval**
  - Submit for approval
  - Approval tracking
  - Payroll finalization
  - Payment processing

## Salary Administration
- **[ ] Employee Payroll Info**
  - View employee salary details
  - Update salary components
  - Tax information
  - Bank information
  
- **[ ] Salary Components**
  - Manage salary components
  - Component configuration
  - Component assignment
  - Component history
  
- **[ ] Allowances & Deductions**
  - Regular allowances
  - One-time payments
  - Deductions (loans, advances)
  - Adjustment management

## Government Compliance
- **[ ] Tax Compliance (BIR)**
  - Withholding tax calculation
  - 1601C generation
  - 2316 (Annual) generation
  - BIR Alphalist
  
- **[ ] SSS Contributions**
  - SSS calculation
  - R3 report generation
  - SSS remittance tracking
  - SSS reconciliation
  
- **[ ] PhilHealth Contributions**
  - PhilHealth calculation
  - RF1 report generation
  - PhilHealth remittance
  - PhilHealth reconciliation
  
- **[ ] Pag-IBIG Contributions**
  - Pag-IBIG calculation
  - MCRF generation
  - Pag-IBIG remittance
  - Pag-IBIG reconciliation
  
- **[ ] 13th Month Pay**
  - 13th month calculation
  - Pro-rated computation
  - 13th month distribution
  - Tax treatment

## Bank & Payment
- **[ ] Bank File Generation**
  - ATM payroll file
  - Bank format configuration
  - File validation
  - Bank submission tracking
  
- **[ ] Payment Tracking**
  - Payment status
  - Payment confirmation
  - Payment exceptions
  - Payment history
  
- **[ ] Cash Payments**
  - Cash payroll preparation
  - Payroll envelope printing
  - Cash distribution tracking
  - Cash accountability

## Loans & Advances
- **[ ] Loan Management**
  - Employee loans
  - Loan applications
  - Loan schedules
  - Loan deductions
  
- **[ ] Advances**
  - Cash advances
  - Advance requests
  - Advance deductions
  - Advance tracking

## Reports & Analytics
- **[ ] Payroll Reports**
  - Payroll register
  - Department payroll summary
  - Cost center reports
  - Labor cost analysis
  
- **[ ] Government Reports**
  - SSS reports
  - PhilHealth reports
  - Pag-IBIG reports
  - BIR reports
  
- **[ ] Tax Reports**
  - Monthly withholding tax
  - Quarterly tax reports
  - Annual tax reports
  - Tax reconciliation
  
- **[ ] Payslips**
  - Generate payslips
  - Payslip distribution
  - Payslip reprints
  - Payslip archive
  
- **[ ] Analytics**
  - Payroll trends
  - Cost analysis
  - Budget variance
  - Labor cost forecasting

## Audit & Compliance
- **[ ] Payroll Audit Trail**
  - View payroll history
  - Change tracking
  - Adjustment logs
  - Approval history
  
- **[ ] Compliance Monitoring**
  - Minimum wage compliance
  - Overtime compliance
  - Holiday pay compliance
  - Labor law compliance
  
- **[ ] Reconciliation**
  - Bank reconciliation
  - Government remittance reconciliation
  - GL reconciliation
  - Payroll variance analysis

## Integration Management
- **[ ] Timekeeping Integration**
  - Import attendance data
  - Attendance validation
  - Overtime import
  - Attendance corrections
  
- **[ ] HR Data Sync**
  - Employee master data
  - New hire sync
  - Separation sync
  - Employee changes
  
- **[ ] Accounting Integration**
  - Journal entry export
  - Cost center allocation
  - GL posting
  - Financial reconciliation

---

# 6. EMPLOYEE (Self-Service Portal) - OPTIONAL / FUTURE

**Current Status:** Disabled by default. Employees do NOT have system access.  
**Implementation:** Phase 2+ (requires client approval)

**Note:** By default, employees do NOT have system access. All requests go through HR Staff. This portal is disabled by default and should be enabled only if client requests it.

## Dashboard
- **[ ] My Dashboard**
  - Personal information summary
  - Announcements
  - Upcoming events
  - Quick links

## My Profile
- **[ ] Personal Information**
  - View profile (read-only most fields)
  - Update contact information
  - Emergency contacts
  - Dependents

## My Attendance
- **[ ] Attendance Records**
  - View attendance history
  - Attendance summary
  - Attendance calendar
  
- **[ ] Overtime Records**
  - View overtime records
  - Overtime summary

## My Leaves
- **[ ] Leave Requests**
  - Submit leave requests
  - View request status
  - Leave history
  - Cancel pending requests
  
- **[ ] Leave Balance**
  - View leave balances
  - Leave usage history
  - Leave accrual tracking

## My Payroll
- **[ ] Payslips**
  - View payslips
  - Download payslips
  - Payslip history
  
- **[ ] YTD Summary**
  - Year-to-date earnings
  - Year-to-date deductions
  - Tax withheld
  - Government contributions

## My Performance
- **[ ] Appraisals**
  - View appraisal results
  - Performance feedback
  - Performance goals
  - Acknowledgment

## Documents
- **[ ] My Documents**
  - Certificates of employment
  - Company documents
  - Policy documents
  - Training certificates

## Requests
- **[ ] Document Requests**
  - Request certificates
  - Request payslip reprints
  - Request status tracking

---

# 7. SUPERVISOR (Workforce Management Portal) - FUTURE

**Current Status:** Not implemented. HR Staff manages all workforce data entry.  
**Implementation:** Phase 2+ (requires client approval)  
**Target Users:** Production Supervisors, Department Supervisors, Team Leads

**Note:** This role is planned for future implementation to allow supervisors to manage their team's schedules, attendance, and performance directly. Currently, all workforce management is handled by HR Staff.

## Dashboard
- **[ ] Team Dashboard**
  - Team overview
  - Today's attendance summary
  - Pending approvals
  - Team alerts and notifications

## Team Management
- **[ ] My Team**
  - View team members
  - Team roster
  - Team structure
  - Employee contact information

## Workforce Scheduling
- **[ ] Team Schedule**
  - View team schedule
  - Request schedule changes
  - View rotation assignments
  - Schedule calendar
  
- **[ ] Shift Assignments**
  - View daily assignments
  - Submit assignment requests
  - Shift coverage view
  - Assignment history

## Attendance Management
- **[ ] Daily Attendance**
  - Record team attendance
  - Manual time-in/time-out entry
  - Attendance corrections (pending HR approval)
  - View RFID logs
  
- **[ ] Attendance Reports**
  - Team attendance summary
  - Late/absent tracking
  - Attendance patterns
  - Export team reports
  
- **[ ] Overtime Management**
  - Submit overtime requests
  - Approve team overtime (first level)
  - Overtime tracking
  - Overtime budget monitoring

## Leave Management
- **[ ] Team Leave Requests**
  - View team leave requests
  - First-level approval
  - Leave calendar view
  - Leave coverage planning
  
- **[ ] Leave Balances**
  - View team leave balances (read-only)
  - Leave usage tracking

## Performance Management
- **[ ] Behavior Remarks**
  - Record positive/negative remarks
  - View team behavior history
  - Incident reporting
  - Performance documentation
  
- **[ ] Performance Input**
  - Input performance scores
  - Provide feedback
  - Performance goals tracking

## Reports
- **[ ] Team Reports**
  - Attendance summaries
  - Productivity metrics
  - Team performance overview
  - Custom reports

---

# Implementation Priority Recommendations

## Phase 1: Complete HR Manager Pages (Current Priority)
1. ✅ Leave Management Pages (Frontend)
2. ✅ Reports Pages (Frontend with mock data)
3. **[ ] ATS Module Pages** (High Priority - Next)
4. **[ ] Workforce Management Pages** (HR Staff manages for now)
5. **[ ] Timekeeping Pages** (HR Staff manages for now)
6. **[ ] Performance/Appraisal Pages**

## Phase 2: HR Staff Pages
1. Employee Management (limited)
2. Leave Processing
3. **Attendance Entry** (Primary workforce management input)
4. **Workforce Scheduling** (Data entry for schedules and rotations)
5. Document Processing
6. Employee Inquiries

## Phase 3: Payroll Officer Pages
1. Payroll Processing Core
2. Government Compliance
3. Reports & Payslips
4. Bank File Generation

## Phase 4: Office Admin Pages
1. User Management
2. Document Templates
3. Organization Settings
4. Advanced Reports

## Phase 5: Employee Self-Service (Optional - Future)
1. Profile & Attendance
2. Leave Requests
3. Payslips
4. Documents

## Phase 6: Supervisor Portal (Optional - Future)
1. Team Dashboard & Attendance Entry
2. Schedule View & Workforce Management
3. Leave Approval & Overtime Management
4. Performance Input & Behavior Remarks

---

# Technical Notes

## Permission Naming Convention
Use dot-separated format: `module.resource.action`

Examples:
- `hr.employees.create`
- `hr.employees.update`
- `leave.requests.approve`
- `payroll.periods.create`
- `timekeeping.attendance.import`
- `ats.candidates.create`
- `workforce.schedules.create`
- `appraisal.cycles.create`

## Route Naming Convention
Use dash-separated format: `role.module.resource.action`

Examples:
- `hr-manager.employees.index`
- `hr-staff.attendance.create`
- `payroll.periods.store`
- `ats.candidates.show`

## Navigation Structure
Each role has a dedicated navigation component:
- `nav-superadmin.tsx`
- `nav-office-admin.tsx`
- `nav-hr-manager.tsx` (existing)
- `nav-hr-staff.tsx`
- `nav-payroll.tsx`
- `nav-employee.tsx` (optional - future)
- `nav-supervisor.tsx` (optional - future)

## Future Roles & Extensions

### Supervisor Role (Future - Phase 6)
- Will have workforce management capabilities for their assigned teams
- Can input daily attendance, approve leave (first level), manage team schedules
- Limited to their department/team scope only
- Requires explicit client approval and training before rollout

### Employee Self-Service (Future - Phase 5)
- Portal for employees to view personal information and submit requests
- Reduces HR Staff workload by allowing self-service for routine tasks
- Requires client approval and change management planning

---

**End of Document**
