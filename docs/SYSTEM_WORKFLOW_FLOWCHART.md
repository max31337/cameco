# SyncingSteel System - User Workflow Flowchart

## Overview
This document provides detailed workflow flowcharts for all user roles in the SyncingSteel System, showing how different types of users interact with the system modules.

## User Roles
1. **Superadmin** - Oversees all server, system, and deployment management. Full access to system settings, logs, metrics, and user/role management. Can invite Admin Officers and initialize system onboarding.
2. **Admin Officer / Office Admin** - Handles HRIS configuration, onboarding, and high-level HR operations. Can manage all modules except system/server settings.
3. **HR Staff** - Human resources personnel managing employees
4. **Accounting Staff** - Finance team managing payroll and finances
5. **Office Staff** - Regular employees with self-service access

---


## Complete System Workflow

```mermaid
graph TD
    Start([User Accesses System]) --> Login{User Login}
    Login -->|New User| Register[Register Account]
    Login -->|Existing User| Auth[Authenticate]
    
    Register --> Pending[Account Status: Pending]
    Pending --> AdminReview{Admin Reviews Registration}
    AdminReview -->|Approve| Approved[Account Activated]
    AdminReview -->|Reject| Rejected[Account Rejected]
    Rejected --> End1([Registration Denied])
    
    Approved --> Auth
    Auth --> CheckEmployee{Has Employee Record?}
    
    CheckEmployee -->|No - Admin| SelfOnboard[Admin Self-Onboarding]
    CheckEmployee -->|Yes| RoleCheck{Check User Role}
    
    SelfOnboard --> CompleteProfile[Complete Employee Profile]
    CompleteProfile --> LinkEmployee[Link User to Employee]
    LinkEmployee --> RoleCheck
    
    RoleCheck -->|Superadmin| SuperadminDash[Superadmin Dashboard]
    RoleCheck -->|Admin Officer| AdminDash[Admin Officer Dashboard]
    RoleCheck -->|HR Staff| HRDash[HR Staff Dashboard]
    RoleCheck -->|Accounting| AcctDash[Accounting Dashboard]
    RoleCheck -->|Office Staff| StaffDash[Employee Dashboard]

    SuperadminDash --> SystemMgmt[System & Server Management]
    SuperadminDash --> UserMgmt[User & Role Management]
    SuperadminDash --> InviteAdmins[Invite Admin Officers]
    SuperadminDash --> ViewLogs[View System Logs]
    SuperadminDash --> Metrics[View Metrics]
    SuperadminDash --> AllModules[Access All Modules]
    AllModules --> Logout([Logout])
    SystemMgmt --> Logout
    UserMgmt --> Logout
    InviteAdmins --> Logout
    ViewLogs --> Logout
    Metrics --> Logout

    AdminDash --> AdminModules[Access All Modules Except System]
    AdminModules --> Logout
    HRDash --> HRModules[Access HR Modules]
    AcctDash --> AcctModules[Access Payroll Modules]
    StaffDash --> StaffModules[Access Self-Service]
    HRModules --> ATS[Access ATS & Onboarding]
    HRModules --> Workforce[Access Workforce Management]
    HRModules --> Appraisal[Access Appraisal & Rehire]
    HRModules --> Logout
    AcctModules --> Logout
    StaffModules --> Logout

```

---

## Superadmin Workflow

```mermaid
graph TD
    SuperadminLogin([Superadmin Login]) --> SuperadminDash[Superadmin Dashboard]
    SuperadminDash --> SystemMgmt[Manage System & Server Settings]
    SuperadminDash --> UserMgmt[Manage Users & Roles]
    SuperadminDash --> InviteAdmins[Invite Admin Officers]
    SuperadminDash --> ViewLogs[View System Logs]
    SuperadminDash --> Metrics[View System Metrics]
    SuperadminDash --> AllModules[Access All Modules]
    SystemMgmt --> ConfirmChanges{Confirm System Changes?}
    ConfirmChanges -->|Yes| ApplyChanges[Apply Changes]
    ConfirmChanges -->|No| CancelChanges[Cancel Changes]
    ApplyChanges --> SuperadminDash
    CancelChanges --> SuperadminDash
    UserMgmt --> SuperadminDash
    InviteAdmins --> SuperadminDash
    ViewLogs --> SuperadminDash
    Metrics --> SuperadminDash
    AllModules --> Logout([Logout])

```

---

## Admin Officer / Office Admin Workflow

```mermaid
graph TD
    AdminLogin([Admin Login]) --> AdminDash[Admin Dashboard]
    
    AdminDash --> ManageUsers[Manage User Accounts]
    AdminDash --> ManageEmployees[Manage Employees]
    AdminDash --> ManageTimekeeping[Manage Timekeeping]
    AdminDash --> ManagePayroll[Manage Payroll]
    AdminDash --> ManageReports[Generate Reports]
    AdminDash --> ManageVisitors[Manage Visitors]
    AdminDash --> ManagePerformance[Manage Performance]
    
    %% User Management
    ManageUsers --> ReviewReg[Review Registrations]
    ReviewReg --> ApproveUser{Approve User?}
    ApproveUser -->|Yes| ActivateUser[Activate User Account]
    ApproveUser -->|No| RejectUser[Reject Registration]
    ActivateUser --> LinkToEmployee{Link to Employee?}
    LinkToEmployee -->|Yes| SearchEmployee[Search Employee Record]
    LinkToEmployee -->|No| CreateEmployee[Create New Employee]
    SearchEmployee --> Link[Link User-Employee]
    CreateEmployee --> Link
    Link --> UserManagementEnd([User Setup Complete])
    RejectUser --> UserManagementEnd
    
    %% Employee Management
    ManageEmployees --> EmployeeActions{Select Action}
    EmployeeActions --> ViewEmployees[View All Employees]
    EmployeeActions --> AddEmployee[Add New Employee]
    EmployeeActions --> EditEmployee[Edit Employee]
    EmployeeActions --> DeleteEmployee[Archive Employee]
    
    AddEmployee --> EmployeeForm[Fill Employee Form]
    EmployeeForm --> PersonalInfo[Personal Information]
    PersonalInfo --> EmploymentInfo[Employment Details]
    EmploymentInfo --> GovtIDs[Government IDs]
    GovtIDs --> FamilyInfo[Family Information]
    FamilyInfo --> SaveEmployee[Save Employee Record]
    SaveEmployee --> GenerateContract[Generate Employment Contract]
    GenerateContract --> EmployeeEnd([Employee Created])
    
    ViewEmployees --> EmployeeEnd
    EditEmployee --> EmployeeForm
    DeleteEmployee --> ConfirmDelete{Confirm Delete?}
    ConfirmDelete -->|Yes| SoftDelete[Soft Delete Record]
    ConfirmDelete -->|No| EmployeeEnd
    SoftDelete --> EmployeeEnd
    
    %% Timekeeping Management
    ManageTimekeeping --> TimekeepingActions{Select Action}
    TimekeepingActions --> ViewAttendance[View Attendance]
    TimekeepingActions --> ManualEntry[Manual Time Entry]
    TimekeepingActions --> ImportTimesheet[Import Timesheet]
    TimekeepingActions --> ManageSchedules[Manage Work Schedules]
    
    ManualEntry --> SelectEmployee1[Select Employee]
    SelectEmployee1 --> RecordTime[Record Time In/Out]
    RecordTime --> TimekeepingEnd([Time Recorded])
    
    ImportTimesheet --> UploadFile[Upload CSV/Excel]
    UploadFile --> ValidateData[Validate Import Data]
    ValidateData --> ImportSuccess{Valid Data?}
    ImportSuccess -->|Yes| ProcessImport[Process Import]
    ImportSuccess -->|No| ShowErrors[Show Validation Errors]
    ShowErrors --> FixErrors[Fix Data Issues]
    FixErrors --> UploadFile
    ProcessImport --> TimekeepingEnd
    
    ViewAttendance --> TimekeepingEnd
    ManageSchedules --> TimekeepingEnd
    
    %% Payroll Management
    ManagePayroll --> PayrollActions{Select Action}
    PayrollActions --> ViewPayroll[View Payroll Records]
    PayrollActions --> ProcessPayroll[Process Payroll Period]
    PayrollActions --> ManageSalary[Manage Salary Components]
    PayrollActions --> GeneratePayslips[Generate Payslips]
    
    ProcessPayroll --> CreatePeriod[Create Payroll Period]
    CreatePeriod --> FetchAttendance[Fetch Attendance Data]
    FetchAttendance --> CalculateSalary[Calculate Salaries]
    CalculateSalary --> ApplyDeductions[Apply Deductions]
    ApplyDeductions --> CalculateTax[Calculate Taxes]
    CalculateTax --> ReviewPayroll{Review & Approve?}
    ReviewPayroll -->|Approve| FinalizePayroll[Finalize Payroll]
    ReviewPayroll -->|Reject| AdjustPayroll[Make Adjustments]
    AdjustPayroll --> CalculateSalary
    FinalizePayroll --> PayrollEnd([Payroll Processed])
    
    ViewPayroll --> PayrollEnd
    ManageSalary --> PayrollEnd
    GeneratePayslips --> PayrollEnd
    
    %% Reports
    ManageReports --> ReportType{Select Report Type}
    ReportType --> PayrollReport[Payroll Reports]
    ReportType --> AttendanceReport[Attendance Reports]
    ReportType --> EmployeeReport[Employee Reports]
    ReportType --> FinancialReport[Financial Reports]
    
    PayrollReport --> SelectPeriod[Select Period]
    AttendanceReport --> SelectPeriod
    EmployeeReport --> SelectPeriod
    FinancialReport --> SelectPeriod
    
    SelectPeriod --> GenerateReport[Generate Report]
    GenerateReport --> ExportFormat{Export Format}
    ExportFormat --> ExportPDF[Export as PDF]
    ExportFormat --> ExportExcel[Export as Excel]
    ExportPDF --> ReportEnd([Report Generated])
    ExportExcel --> ReportEnd
    
    %% Visitors Management
    ManageVisitors --> VisitorActions{Select Action}
    VisitorActions --> RegisterVisitor[Register New Visitor]
    VisitorActions --> CheckInOut[Check In/Out Visitor]
    VisitorActions --> ViewVisitorLog[View Visitor Log]
    
    RegisterVisitor --> VisitorForm[Fill Visitor Form]
    VisitorForm --> AssignBadge[Assign Badge Number]
    AssignBadge --> NotifyHost[Notify Host Employee]
    NotifyHost --> VisitorEnd([Visitor Registered])
    
    CheckInOut --> VisitorEnd
    ViewVisitorLog --> VisitorEnd
    
    %% Performance Management
    ManagePerformance --> PerformanceActions{Select Action}
    PerformanceActions --> CreateReview[Create Performance Review]
    PerformanceActions --> ViewReviews[View All Reviews]
    PerformanceActions --> ScheduleReview[Schedule Review]
    
    CreateReview --> SelectEmployee2[Select Employee]
    SelectEmployee2 --> ReviewForm[Fill Review Form]
    ReviewForm --> RatePerformance[Rate Performance Criteria]
    RatePerformance --> AddComments[Add Comments & Feedback]
    AddComments --> SubmitReview[Submit Review]
    SubmitReview --> PerformanceEnd([Review Completed])
    
    ViewReviews --> PerformanceEnd
    ScheduleReview --> PerformanceEnd

```

---

## HR Staff Workflow

```mermaid
graph TD
    HRLogin([HR Staff Login]) --> HRDash[HR Staff Dashboard]
    HRDash --> ManageCandidates[Manage Candidates & Interviews]
    HRDash --> RunOnboarding[Start Onboarding Tasks]
    HRDash --> ManageWorkforce[Manage Schedules & Rotations]
    
    HRDash --> HREmployees[Employee Management]
    HRDash --> HRLeave[Leave Management]
    HRDash --> HRRecruitment[Recruitment]
    HRDash --> HRPerformance[Performance Reviews]
    HRDash --> HRReports[HR Reports]
    
    %% Employee Management
    HREmployees --> HREmployeeActions{Select Action}
    HREmployeeActions --> ViewAllEmployees[View All Employees]
    HREmployeeActions --> AddNewEmployee[Add New Employee]
    HREmployeeActions --> UpdateEmployee[Update Employee Info]
    HREmployeeActions --> DeleteEmployee[Delete/Archive Employee]
    HREmployeeActions --> ManageDocuments[Generate/Print/Send Documents]
    
    %% Rolling Mills Management
    ViewAllEmployees --> FilterRollingMills[Filter: Rolling Mills Department]
    FilterRollingMills --> ViewRMEmployees[View Rolling Mills Employees]
    AddNewEmployee --> AddRMEmployee{Add to Which Department?}
    AddRMEmployee -->|Rolling Mills| AddRMForm[Fill Rolling Mills Employee Form]
    AddRMEmployee -->|Other| HREmployeeForm[Fill Employee Form]
    AddRMForm --> SaveRMEmployee[Save Rolling Mills Employee Record]
    SaveRMEmployee --> RMEmployeeEnd([Rolling Mills Employee Added])
    HREmployeeForm --> SaveEmployeeRecord[Save Employee Record]
    SaveEmployeeRecord --> EmployeeEnd([Employee Added])
    
    UpdateEmployee --> UpdateRMEmployee{Update Which Department?}
    UpdateRMEmployee -->|Rolling Mills| UpdateRMForm[Update Rolling Mills Employee Info]
    UpdateRMEmployee -->|Other| UpdateEmployeeForm[Update Employee Info]
    UpdateRMForm --> SaveRMUpdate[Save Changes]
    SaveRMUpdate --> RMUpdateEnd([Rolling Mills Employee Updated])
    UpdateEmployeeForm --> SaveUpdate[Save Changes]
    SaveUpdate --> UpdateEnd([Employee Updated])
    
    DeleteEmployee --> DeleteRMEmployee{Delete From Which Department?}
    DeleteRMEmployee -->|Rolling Mills| ConfirmDeleteRM[Confirm Delete]
    DeleteRMEmployee -->|Other| ConfirmDelete[Confirm Delete]
    ConfirmDeleteRM --> ArchiveRMEmployee[Archive Rolling Mills Employee]
    ArchiveRMEmployee --> RMDeleteEnd([Rolling Mills Employee Archived])
    ConfirmDelete --> ArchiveEmployee[Archive Employee]
    ArchiveEmployee --> DeleteEnd([Employee Archived])
    
    ManageDocuments --> SelectDocType{Select Document Type}
    SelectDocType --> ContractDoc[Employment Contract]
    SelectDocType --> CertificateDoc[Certificate]
    SelectDocType --> PayslipDoc[Payslip]
    SelectDocType --> OtherDoc[Other Document]
    ContractDoc --> PrintContract[Print/Send Contract]
    CertificateDoc --> PrintCertificate[Print/Send Certificate]
    PayslipDoc --> PrintPayslip[Print/Send Payslip]
    OtherDoc --> PrintOtherDoc[Print/Send Document]
    PrintContract --> DocEnd([Document Generated])
    PrintCertificate --> DocEnd
    PrintPayslip --> DocEnd
    PrintOtherDoc --> DocEnd
    
    %% Leave Management
    HRLeave --> LeaveActions{Select Action}
    LeaveActions --> ViewLeaveRequests[View Leave Requests]
    LeaveActions --> ApproveLeave[Approve/Reject Leave]
    LeaveActions --> ManageLeaveBalances[Manage Leave Balances]
    LeaveActions --> ViewLeaveHistory[View Leave History]
    
    ViewLeaveRequests --> SelectRequest[Select Leave Request]
    SelectRequest --> ReviewRequest[Review Request Details]
    ReviewRequest --> CheckBalance{Check Leave Balance}
    CheckBalance -->|Sufficient| ApproveDecision{Approve or Reject?}
    CheckBalance -->|Insufficient| AutoReject[Auto-Reject - Insufficient Balance]
    ApproveDecision -->|Approve| ApproveRequest[Approve Leave Request]
    ApproveDecision -->|Reject| RejectRequest[Reject with Reason]
    ApproveRequest --> UpdateBalance[Update Leave Balance]
    UpdateBalance --> NotifyEmployee[Notify Employee]
    RejectRequest --> NotifyEmployee
    AutoReject --> NotifyEmployee
    NotifyEmployee --> LeaveEnd([Leave Request Processed])
    
    ManageLeaveBalances --> LeaveEnd
    ViewLeaveHistory --> LeaveEnd
    
    %% Recruitment
    HRRecruitment --> RecruitmentActions{Select Action}
    RecruitmentActions --> ManageJobPostings[Manage Job Postings]
    RecruitmentActions --> ReviewApplications[Review Applications]
    RecruitmentActions --> ScheduleInterviews[Schedule Interviews]
    RecruitmentActions --> ManageOffers[Manage Job Offers]
    
    ReviewApplications --> SelectApplication[Select Application]
    SelectApplication --> EvaluateCandidate[Evaluate Candidate]
    EvaluateCandidate --> CandidateDecision{Decision}
    CandidateDecision -->|Interview| ScheduleInterview[Schedule Interview]
    CandidateDecision -->|Reject| RejectCandidate[Send Rejection Email]
    ScheduleInterview --> RegisterVisitorAppt[Register as Visitor]
    RegisterVisitorAppt --> RecruitmentEnd([Process Complete])
    RejectCandidate --> RecruitmentEnd
    
    ManageJobPostings --> RecruitmentEnd
    ScheduleInterviews --> RecruitmentEnd
    ManageOffers --> RecruitmentEnd
    
    %% Performance Reviews
    HRPerformance --> HRPerfActions{Select Action}
    HRPerfActions --> InitiateReview[Initiate Review Cycle]
    HRPerfActions --> MonitorProgress[Monitor Review Progress]
    HRPerfActions --> ViewPerfReports[View Performance Reports]
    
    InitiateReview --> SelectReviewPeriod[Select Review Period]
    SelectReviewPeriod --> SelectEmployeesReview[Select Employees]
    SelectEmployeesReview --> AssignReviewers[Assign Reviewers]
    AssignReviewers --> SendNotifications[Send Review Notifications]
    SendNotifications --> HRPerfEnd([Review Cycle Started])
    
    MonitorProgress --> HRPerfEnd
    ViewPerfReports --> HRPerfEnd
    
    %% HR Reports
    HRReports --> HRReportType{Select Report}
    HRReportType --> HeadcountReport[Headcount Report]
    HRReportType --> TurnoverReport[Turnover Report]
    HRReportType --> LeaveReport[Leave Utilization Report]
    HRReportType --> DemographicsReport[Demographics Report]
    
    HeadcountReport --> SelectDept[Select Department/Period]
    TurnoverReport --> SelectDept
    LeaveReport --> SelectDept
    DemographicsReport --> SelectDept
    
    SelectDept --> GenerateHRReport[Generate Report]
    GenerateHRReport --> ExportHRReport{Export Format}
    ExportHRReport --> ExportPDF1[PDF]
    ExportHRReport --> ExportExcel1[Excel]
    ExportPDF1 --> HRReportEnd([Report Generated])
    ExportExcel1 --> HRReportEnd

```

---

## Accounting Staff Workflow

```mermaid
graph TD
    AcctLogin([Accounting Staff Login]) --> AcctDash[Accounting Dashboard]
    
    AcctDash --> ProcessPayroll[Process Payroll]
    AcctDash --> ManageContributions[Manage Gov't Contributions]
    AcctDash --> ManageTaxes[Manage Taxes]
    AcctDash --> GenerateReports[Generate Financial Reports]
    AcctDash --> ManageBenefits[Manage Benefits]
    
    %% Process Payroll
    ProcessPayroll --> SelectPayPeriod[Select Pay Period]
    SelectPayPeriod --> ReviewAttendance[Review Attendance Data]
    ReviewAttendance --> AttendanceValid{Data Valid?}
    AttendanceValid -->|No| RequestCorrection[Request Correction from HR]
    AttendanceValid -->|Yes| CalculatePayroll[Calculate Payroll]
    RequestCorrection --> WaitCorrection[Wait for Correction]
    WaitCorrection --> ReviewAttendance
    
    CalculatePayroll --> CalcBasicPay[Calculate Basic Pay]
    CalcBasicPay --> CalcOvertime[Calculate Overtime]
    CalcOvertime --> CalcAllowances[Calculate Allowances]
    CalcAllowances --> CalcBenefits[Calculate Benefits]
    CalcBenefits --> CalcDeductions[Calculate Deductions]
    CalcDeductions --> CalcSSSContrib[SSS Contribution]
    CalcSSSContrib --> CalcPhilHealth[PhilHealth Contribution]
    CalcPhilHealth --> CalcPagIBIG[Pag-IBIG Contribution]
    CalcPagIBIG --> CalcWithholdingTax[Withholding Tax]
    CalcWithholdingTax --> CalcNetPay[Calculate Net Pay]
    
    CalcNetPay --> ReviewPayrollCalc{Review Calculations}
    ReviewPayrollCalc -->|Issues Found| AdjustCalc[Make Adjustments]
    ReviewPayrollCalc -->|Approved| GeneratePayslips[Generate Payslips]
    AdjustCalc --> CalculatePayroll
    
    GeneratePayslips --> PreviewPayslips[Preview Payslips]
    PreviewPayslips --> FinalApproval{Final Approval?}
    FinalApproval -->|Approve| FinalizePayrollAcct[Finalize Payroll]
    FinalApproval -->|Reject| AdjustCalc
    FinalizePayrollAcct --> DistributePayslips[Distribute Payslips]
    DistributePayslips --> ProcessBankTransfer[Process Bank Transfers]
    ProcessBankTransfer --> PayrollComplete([Payroll Completed])
    
    %% Government Contributions
    ManageContributions --> ContribType{Select Contribution}
    ContribType --> SSSManage[SSS Management]
    ContribType --> PhilHealthManage[PhilHealth Management]
    ContribType --> PagIBIGManage[Pag-IBIG Management]
    
    SSSManage --> ViewSSSContrib[View SSS Contributions]
    ViewSSSContrib --> GenerateSSSReport[Generate SSS Report]
    GenerateSSSReport --> DownloadSSSFile[Download Remittance File]
    DownloadSSSFile --> RecordSSSPayment[Record Payment]
    RecordSSSPayment --> ContribEnd([Contribution Processed])
    
    PhilHealthManage --> ViewPhilHealthContrib[View PhilHealth Contributions]
    ViewPhilHealthContrib --> GeneratePhilHealthReport[Generate PhilHealth Report]
    GeneratePhilHealthReport --> DownloadPhilHealthFile[Download Remittance File]
    DownloadPhilHealthFile --> RecordPhilHealthPayment[Record Payment]
    RecordPhilHealthPayment --> ContribEnd
    
    PagIBIGManage --> ViewPagIBIGContrib[View Pag-IBIG Contributions]
    ViewPagIBIGContrib --> GeneratePagIBIGReport[Generate Pag-IBIG Report]
    GeneratePagIBIGReport --> DownloadPagIBIGFile[Download Remittance File]
    DownloadPagIBIGFile --> RecordPagIBIGPayment[Record Payment]
    RecordPagIBIGPayment --> ContribEnd
    
    %% Tax Management
    ManageTaxes --> TaxActions{Select Tax Action}
    TaxActions --> ViewWithholding[View Withholding Tax]
    TaxActions --> GenerateBIRForms[Generate BIR Forms]
    TaxActions --> File2316[File Form 2316]
    TaxActions --> FileAlphalist[File Alphalist]
    
    GenerateBIRForms --> SelectTaxPeriod[Select Tax Period]
    SelectTaxPeriod --> SelectForm{Select BIR Form}
    SelectForm --> Form2316[Form 2316 - Annual ITR]
    SelectForm --> Form1601C[Form 1601-C - Monthly Remittance]
    SelectForm --> Form1604CF[Form 1604-CF - Annual Summary]
    
    Form2316 --> GenerateTaxForm[Generate Form]
    Form1601C --> GenerateTaxForm
    Form1604CF --> GenerateTaxForm
    GenerateTaxForm --> ReviewTaxForm[Review Form]
    ReviewTaxForm --> DownloadTaxForm[Download Form]
    DownloadTaxForm --> TaxEnd([Tax Form Generated])
    
    ViewWithholding --> TaxEnd
    File2316 --> TaxEnd
    FileAlphalist --> TaxEnd
    
    %% Financial Reports
    GenerateReports --> ReportTypeAcct{Select Report Type}
    ReportTypeAcct --> PayrollSummary[Payroll Summary Report]
    ReportTypeAcct --> LaborCost[Labor Cost Report]
    ReportTypeAcct --> TaxReport[Tax Compliance Report]
    ReportTypeAcct --> ContribReport[Gov't Contribution Report]
    ReportTypeAcct --> BenefitsReport[Benefits Report]
    
    PayrollSummary --> SelectReportPeriod[Select Period]
    LaborCost --> SelectReportPeriod
    TaxReport --> SelectReportPeriod
    ContribReport --> SelectReportPeriod
    BenefitsReport --> SelectReportPeriod
    
    SelectReportPeriod --> GenAcctReport[Generate Report]
    GenAcctReport --> ReviewAcctReport[Review Report]
    ReviewAcctReport --> ExportAcctReport{Export Format}
    ExportAcctReport --> PDFExport[Export PDF]
    ExportAcctReport --> ExcelExport[Export Excel]
    PDFExport --> AcctReportEnd([Report Generated])
    ExcelExport --> AcctReportEnd
    
    %% Manage Benefits
    ManageBenefits --> BenefitActions{Select Action}
    BenefitActions --> View13thMonth[13th Month Pay]
    BenefitActions --> ViewBonuses[Bonuses]
    BenefitActions --> ViewAllowances[Allowances]
    BenefitActions --> ViewLoans[Employee Loans]
    
    View13thMonth --> Calculate13th[Calculate 13th Month Pay]
    Calculate13th --> Approve13th{Approve Calculation?}
    Approve13th -->|Yes| Process13th[Process Payment]
    Approve13th -->|No| Adjust13th[Adjust Calculation]
    Adjust13th --> Calculate13th
    Process13th --> BenefitEnd([Benefit Processed])
    
    ViewBonuses --> BenefitEnd
    ViewAllowances --> BenefitEnd
    ViewLoans --> BenefitEnd

```

---

## Office Staff (Regular Employee) Workflow

```mermaid
graph TD
    StaffLogin([Employee Login]) --> StaffDash[Employee Dashboard]
    
    StaffDash --> ViewProfile[View My Profile]
    StaffDash --> ViewPayslip[View My Payslips]
    StaffDash --> RequestLeave[Request Leave]
    StaffDash --> ViewAttendance[View My Attendance]
    StaffDash --> ViewPerformance[View My Performance]
    StaffDash --> UpdateInfo[Update Personal Info]
    
    %% View Profile
    ViewProfile --> DisplayProfile[Display Personal Information]
    DisplayProfile --> ViewEmployment[View Employment Details]
    ViewEmployment --> ViewFamily[View Family Information]
    ViewFamily --> ViewEmergency[View Emergency Contacts]
    ViewEmergency --> ProfileEnd([Profile Viewed])
    
    %% View Payslips
    ViewPayslip --> SelectPayPeriod2[Select Pay Period]
    SelectPayPeriod2 --> DisplayPayslip[Display Payslip]
    DisplayPayslip --> ViewBreakdown[View Salary Breakdown]
    ViewBreakdown --> ViewDeductions2[View Deductions]
    ViewDeductions2 --> ViewContributions[View Gov't Contributions]
    ViewContributions --> ViewTaxes[View Taxes]
    ViewTaxes --> DownloadPayslip{Download Payslip?}
    DownloadPayslip -->|Yes| DownloadPDF[Download as PDF]
    DownloadPayslip -->|No| PayslipEnd([Payslip Viewed])
    DownloadPDF --> PayslipEnd
    
    %% Request Leave
    RequestLeave --> SelectLeaveType[Select Leave Type]
    SelectLeaveType --> LeaveTypeChoice{Leave Type}
    LeaveTypeChoice --> VacationLeave[Vacation Leave]
    LeaveTypeChoice --> SickLeave[Sick Leave]
    LeaveTypeChoice --> EmergencyLeave[Emergency Leave]
    LeaveTypeChoice --> MaternityLeave[Maternity/Paternity Leave]
    
    VacationLeave --> CheckLeaveBalance[Check Leave Balance]
    SickLeave --> CheckLeaveBalance
    EmergencyLeave --> CheckLeaveBalance
    MaternityLeave --> CheckLeaveBalance
    
    CheckLeaveBalance --> BalanceCheck{Sufficient Balance?}
    BalanceCheck -->|No| InsufficientBalance[Show Insufficient Balance]
    BalanceCheck -->|Yes| FillLeaveForm[Fill Leave Request Form]
    InsufficientBalance --> LeaveEnd([Request Cancelled])
    
    FillLeaveForm --> SelectDates[Select Start/End Dates]
    SelectDates --> EnterReason[Enter Reason]
    EnterReason --> AttachDocuments{Attach Documents?}
    AttachDocuments -->|Yes| UploadDocs[Upload Supporting Documents]
    AttachDocuments -->|No| SubmitLeaveRequest[Submit Leave Request]
    UploadDocs --> SubmitLeaveRequest
    
    SubmitLeaveRequest --> NotifySupervisor[Notify Supervisor]
    NotifySupervisor --> WaitApproval[Wait for Approval]
    WaitApproval --> ApprovalStatus{Approval Status}
    ApprovalStatus -->|Approved| LeaveApproved[Leave Approved]
    ApprovalStatus -->|Rejected| LeaveRejected[Leave Rejected]
    ApprovalStatus -->|Pending| WaitApproval
    LeaveApproved --> UpdateLeaveBalance2[Update Leave Balance]
    UpdateLeaveBalance2 --> LeaveEnd
    LeaveRejected --> LeaveEnd
    
    %% View Attendance
    ViewAttendance --> SelectAttendancePeriod[Select Period]
    SelectAttendancePeriod --> DisplayAttendance[Display Attendance Records]
    DisplayAttendance --> ViewTimeInOut[View Time In/Out]
    ViewTimeInOut --> ViewHoursWorked[View Hours Worked]
    ViewHoursWorked --> ViewLateUndertime[View Late/Undertime]
    ViewLateUndertime --> ViewOvertimeHours[View Overtime Hours]
    ViewOvertimeHours --> AttendanceStats[View Attendance Statistics]
    AttendanceStats --> AttendanceEnd([Attendance Viewed])
    
    %% View Performance
    ViewPerformance --> DisplayReviews[Display Performance Reviews]
    DisplayReviews --> ViewRatings[View Ratings]
    ViewRatings --> ViewFeedback[View Feedback]
    ViewFeedback --> ViewGoals[View Goals]
    ViewGoals --> DownloadReview{Download Review?}
    DownloadReview -->|Yes| DownloadPerfPDF[Download as PDF]
    DownloadReview -->|No| PerformanceEnd([Performance Viewed])
    DownloadPerfPDF --> PerformanceEnd
    
    %% Update Personal Info
    UpdateInfo --> SelectInfoType{What to Update?}
    SelectInfoType --> UpdateContact[Update Contact Information]
    SelectInfoType --> UpdateAddress[Update Address]
    SelectInfoType --> UpdateEmergencyContact[Update Emergency Contact]
    SelectInfoType --> UpdateBankInfo[Update Bank Information]
    
    UpdateContact --> FillContactForm[Fill Contact Form]
    UpdateAddress --> FillAddressForm[Fill Address Form]
    UpdateEmergencyContact --> FillEmergencyForm[Fill Emergency Contact Form]
    UpdateBankInfo --> FillBankForm[Fill Bank Information Form]
    
    FillContactForm --> SubmitUpdate[Submit Update]
    FillAddressForm --> SubmitUpdate
    FillEmergencyForm --> SubmitUpdate
    FillBankForm --> SubmitUpdate
    
    SubmitUpdate --> HRReview[HR Reviews Update]
    HRReview --> UpdateApproval{Approved?}
    UpdateApproval -->|Yes| UpdateRecord[Update Employee Record]
    UpdateApproval -->|No| RejectUpdate[Update Rejected]
    UpdateRecord --> NotifyEmployeeUpdate[Notify Employee]
    RejectUpdate --> NotifyEmployeeUpdate
    NotifyEmployeeUpdate --> UpdateEnd([Update Processed])

```

---

## Leave Request Approval Workflow (Multi-Level)

```mermaid
graph TD
    EmployeeSubmit([Employee Submits Leave Request]) --> CheckType{Leave Type & Duration}
    
    CheckType -->|1-3 Days| ImmediateSupervisor[Route to Immediate Supervisor]
    CheckType -->|4-7 Days| DepartmentHead[Route to Department Head]
    CheckType -->|8+ Days or Special| HRManager[Route to HR Manager]
    
    ImmediateSupervisor --> SupervisorReview{Supervisor Decision}
    SupervisorReview -->|Approve| LeaveApproved1[Leave Approved]
    SupervisorReview -->|Reject| LeaveRejected1[Leave Rejected]
    SupervisorReview -->|Escalate| DepartmentHead
    
    DepartmentHead --> HeadReview{Department Head Decision}
    HeadReview -->|Approve| LeaveApproved2[Leave Approved]
    HeadReview -->|Reject| LeaveRejected2[Leave Rejected]
    HeadReview -->|Escalate| HRManager
    
    HRManager --> HRReview2{HR Manager Decision}
    HRReview2 -->|Approve| NeedsCEO{Requires CEO Approval?}
    HRReview2 -->|Reject| LeaveRejected3[Leave Rejected]
    
    NeedsCEO -->|Yes| CEOReview[Route to CEO]
    NeedsCEO -->|No| LeaveApproved3[Leave Approved]
    
    CEOReview --> CEODecision{CEO Decision}
    CEODecision -->|Approve| LeaveApproved4[Leave Approved]
    CEODecision -->|Reject| LeaveRejected4[Leave Rejected]
    
    LeaveApproved1 --> UpdateBalance3[Update Leave Balance]
    LeaveApproved2 --> UpdateBalance3
    LeaveApproved3 --> UpdateBalance3
    LeaveApproved4 --> UpdateBalance3
    
    UpdateBalance3 --> NotifyEmployee2[Notify Employee - Approved]
    LeaveRejected1 --> NotifyEmployee3[Notify Employee - Rejected]
    LeaveRejected2 --> NotifyEmployee3
    LeaveRejected3 --> NotifyEmployee3
    LeaveRejected4 --> NotifyEmployee3
    
    NotifyEmployee2 --> UpdateCalendar[Update Department Calendar]
    NotifyEmployee3 --> LeaveEnd2([Leave Request Processed])
    UpdateCalendar --> LeaveEnd2

```

---

## Payroll Processing Complete Workflow

```mermaid
graph TD
    StartPayroll([Start Payroll Period]) --> CreatePeriod2[Create Payroll Period]
    CreatePeriod2 --> SetDates[Set Period Dates]
    SetDates --> SetPayDate[Set Pay Date]
    SetPayDate --> LockPeriod[Lock Previous Period]
    
    LockPeriod --> FetchData[Fetch Data Sources]
    FetchData --> GetAttendance[Get Attendance Data]
    GetAttendance --> GetLeave[Get Leave Data]
    GetLeave --> GetOvertime[Get Overtime Data]
    GetOvertime --> GetSalaryInfo[Get Salary Information]
    
    GetSalaryInfo --> ValidateData2{Data Complete?}
    ValidateData2 -->|No| NotifyHR[Notify HR - Missing Data]
    ValidateData2 -->|Yes| StartCalculation[Start Calculation]
    NotifyHR --> WaitData[Wait for Data Completion]
    WaitData --> ValidateData2
    
    StartCalculation --> LoopEmployees[Loop Through Employees]
    LoopEmployees --> CalcBasicSalary[Calculate Basic Salary]
    CalcBasicSalary --> CalcDays[Calculate Days Worked]
    CalcDays --> CalcHours[Calculate Hours Worked]
    CalcHours --> CalcOT[Calculate Overtime Pay]
    CalcOT --> CalcNightDiff[Calculate Night Differential]
    CalcNightDiff --> CalcHolidayPay[Calculate Holiday Pay]
    CalcHolidayPay --> CalcLeaveCredits[Calculate Leave Credits]
    
    CalcLeaveCredits --> GrossPay[Calculate Gross Pay]
    GrossPay --> StartDeductions[Calculate Deductions]
    
    StartDeductions --> CalcSSS[Calculate SSS Contribution]
    CalcSSS --> CalcPhilHealth2[Calculate PhilHealth]
    CalcPhilHealth2 --> CalcPagIBIG2[Calculate Pag-IBIG]
    CalcPagIBIG2 --> CalcTax[Calculate Withholding Tax]
    CalcTax --> CalcLoans[Calculate Loan Deductions]
    CalcLoans --> CalcOtherDeductions[Calculate Other Deductions]
    
    CalcOtherDeductions --> TotalDeductions[Total Deductions]
    TotalDeductions --> CalcNet[Calculate Net Pay]
    
    CalcNet --> MoreEmployees{More Employees?}
    MoreEmployees -->|Yes| LoopEmployees
    MoreEmployees -->|No| GenerateSummary[Generate Summary Report]
    
    GenerateSummary --> AccountingReview[Accounting Reviews]
    AccountingReview --> ReviewOK{Review Status}
    ReviewOK -->|Issues| IdentifyIssues[Identify Issues]
    ReviewOK -->|Approved| HRReview3[HR Manager Reviews]
    IdentifyIssues --> CorrectIssues[Correct Issues]
    CorrectIssues --> StartCalculation
    
    HRReview3 --> HRApproval{HR Approval}
    HRApproval -->|Reject| CorrectIssues
    HRApproval -->|Approve| FinalReview[Finance Manager Reviews]
    
    FinalReview --> FinalApproval2{Final Approval}
    FinalApproval2 -->|Reject| CorrectIssues
    FinalApproval2 -->|Approve| GeneratePayslips2[Generate Payslips]
    
    GeneratePayslips2 --> EmailPayslips[Email Payslips to Employees]
    EmailPayslips --> PrepareBankFile[Prepare Bank Transfer File]
    PrepareBankFile --> ProcessTransfers[Process Bank Transfers]
    ProcessTransfers --> VerifyTransfers[Verify Transfers]
    
    VerifyTransfers --> UpdateRecords[Update Payroll Records]
    UpdateRecords --> ClosePeriod[Close Payroll Period]
    ClosePeriod --> ArchiveData[Archive Payroll Data]
    ArchiveData --> PayrollCompleted([Payroll Period Completed])

```

---

## System Access Control Matrix

| Module | Superadmin | Admin Officer | HR Staff | Accounting | Office Staff |
|--------|------------|--------------|----------|------------|--------------|
| **System Management** | Full Access | No Access | No Access | No Access | No Access |
| **User Management** | Full Access | Full Access | View Only | No Access | No Access |
| **Employee Management** | Full Access | Full Access | Full Access | View Only | View Own |
| **Timekeeping** | Full Access | Full Access | Full Access | View Only | View Own |
| **Payroll** | Full Access | Full Access | View Only | Full Access | View Own Payslip |
| **Reports** | Full Access | Full Access | HR Reports | Financial Reports | Own Reports |
| **Visitors** | Full Access | Full Access | Full Access | No Access | No Access |
| **Performance** | Full Access | Full Access | Full Access | View Only | View Own |
| **Leave Management** | Full Access | Full Access | Full Access | View Only | Submit Requests |

---

## Key Workflow Notes

### Authentication & Authorization
- All users must be authenticated before accessing the system
- Role-based access control (RBAC) determines available features
- Admins can perform all actions across all modules
- Staff users have limited access to self-service features

### Data Flow
- **HR Module** → Provides employee data to all modules
- **Timekeeping Module** → Provides attendance data to Payroll
- **Payroll Module** → Uses data from HR and Timekeeping
- **Reports Module** → Aggregates data from all modules

### Approval Workflows
- Leave requests require supervisor approval
- Payroll requires multi-level approval (Accounting → HR → Finance)
- Employee updates require HR approval
- Performance reviews require manager submission and HR acknowledgment

### Notifications
- Email notifications sent for leave approvals/rejections
- Payslips automatically emailed to employees
- Performance review notifications sent to reviewers
- System alerts for pending approvals

---

**Document Version:** 1.0  
**Last Updated:** October 6, 2025  
**Related Documents:**
- [System Architecture Plan](SYNCINGSTEEL_ARCHITECTURE_PLAN.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [HR Module Architecture](HR_MODULE_ARCHITECTURE.md)
- [Timekeeping Module Architecture](TIMEKEEPING_MODULE_ARCHITECTURE.md)
- [Payroll Module Architecture](PAYROLL_MODULE_ARCHITECTURE.md)
