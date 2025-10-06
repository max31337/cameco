# Payroll Module - Architecture & Implementation Plan

## Module Overview
The Payroll Module handles salary calculations, deductions, benefits, and Philippine tax compliance for Cathay Metal Corporation employees. This module integrates with HR and Timekeeping data to generate accurate payroll calculations and statutory reports.

## Module Dependencies
- **HR Module**: Employee records, leave requests, employment details
- **Timekeeping Module**: Attendance data, overtime hours, work schedules
- **Foundation**: User management, roles, permissions
- 🔄 **Integrates with**: Philippine government systems (BIR, SSS, PhilHealth, Pag-IBIG)

## Module Goals
1. **Accurate Payroll Calculations**: Salary, overtime, deductions, benefits
2. **Philippine Tax Compliance**: BIR, SSS, PhilHealth, Pag-IBIG calculations
3. **Payslip Generation**: Detailed payslips with all components
4. **Statutory Reporting**: Government-required reports and forms
5. **Payroll Analytics**: Cost analysis and budgeting reports
6. **Audit Trail**: Complete payroll processing history

---

## Database Schema (Payroll Module)

### Payroll Structure Tables

#### payroll_periods
```sql
- id (primary key)
- name (string, required) # "October 2025 - 1st Half", "Monthly - October 2025"
- period_type (enum: weekly, bi_weekly, semi_monthly, monthly)
- start_date (date)
- end_date (date)
- pay_date (date)
- 
# Processing Status
- status (enum: draft, processing, calculated, approved, paid, closed)
- processed_at (timestamp, nullable)
- approved_by (foreign key to users, nullable)
- approved_at (timestamp, nullable)
- 
# System Fields
- created_by (foreign key to users)
- created_at, updated_at
```

#### employee_payroll_info
```sql
- id (primary key)
- employee_id (foreign key to employees)
- 
# Salary Information
- salary_type (enum: monthly, daily, hourly, contractual)
- basic_salary (decimal(10,2))
- daily_rate (decimal(8,2), nullable)
- hourly_rate (decimal(8,2), nullable)
- 
# Tax Information
- tax_status (enum: S, ME, S1, ME1, S2, ME2, S3, ME3, S4, ME4) # BIR tax table categories
- withholding_tax_exemption (decimal(8,2), default 0)
- 
# Government Numbers (duplicated from HR for payroll-specific use)
- sss_number (string, nullable)
- philhealth_number (string, nullable)
- pagibig_number (string, nullable)
- tin_number (string, nullable)
- 
# Bank Information
- bank_name (string, nullable)
- bank_account_number (string, nullable)
- bank_account_name (string, nullable)
- 
# Effective Dates
- effective_date (date)
- end_date (date, nullable)
- is_active (boolean, default true)
- 
# System Fields
- created_by (foreign key to users)
- updated_by (foreign key to users, nullable)
- created_at, updated_at
```

#### salary_components
```sql
- id (primary key)
- name (string, required) # "Basic Salary", "Overtime", "Rice Allowance", etc.
- code (string, unique) # "BASIC", "OT", "RICE", "SSS", "TAX"
- component_type (enum: earning, deduction, benefit, tax, contribution)
- 
# Calculation Settings
- calculation_method (enum: fixed_amount, percentage_of_basic, percentage_of_gross, per_hour, per_day)
- default_amount (decimal(10,2), nullable)
- default_percentage (decimal(5,2), nullable)
- 
# Tax Treatment
- is_taxable (boolean, default true)
- is_deminimis (boolean, default false) # 13th month, rice allowance, etc.
- 
# Government Contribution Settings
- affects_sss (boolean, default false)
- affects_philhealth (boolean, default false)
- affects_pagibig (boolean, default false)
- 
# System Fields
- is_active (boolean, default true)
- created_by (foreign key to users)
- created_at, updated_at
```

#### employee_salary_components
```sql
- id (primary key)
- employee_id (foreign key to employees)
- salary_component_id (foreign key to salary_components)
- 
# Component Settings
- amount (decimal(10,2), nullable)
- percentage (decimal(5,2), nullable)
- 
# Frequency and Timing
- frequency (enum: per_payroll, monthly, quarterly, annually, one_time)
- effective_date (date)
- end_date (date, nullable)
- 
# System Fields
- is_active (boolean, default true)
- created_by (foreign key to users)
- created_at, updated_at
```

#### payroll_calculations
```sql
- id (primary key)
- payroll_period_id (foreign key to payroll_periods)
- employee_id (foreign key to employees)
- 
# Time and Attendance Data
- days_worked (decimal(4,2))
- regular_hours (decimal(6,2))
- overtime_hours (decimal(6,2))
- night_differential_hours (decimal(6,2), default 0)
- holiday_hours (decimal(6,2), default 0)
- leave_hours_paid (decimal(6,2), default 0)
- 
# Gross Earnings
- basic_pay (decimal(10,2))
- overtime_pay (decimal(10,2), default 0)
- night_differential_pay (decimal(10,2), default 0)
- holiday_pay (decimal(10,2), default 0)
- allowances (decimal(10,2), default 0)
- bonuses (decimal(10,2), default 0)
- other_earnings (decimal(10,2), default 0)
- gross_pay (decimal(10,2))
- 
# Deductions
- sss_contribution (decimal(8,2), default 0)
- philhealth_contribution (decimal(8,2), default 0)
- pagibig_contribution (decimal(8,2), default 0)
- withholding_tax (decimal(10,2), default 0)
- other_deductions (decimal(10,2), default 0)
- total_deductions (decimal(10,2))
- 
# Net Pay
- net_pay (decimal(10,2))
- 
# Year-to-Date Totals
- ytd_gross (decimal(12,2))
- ytd_tax (decimal(12,2))
- ytd_sss (decimal(10,2))
- ytd_philhealth (decimal(10,2))
- ytd_pagibig (decimal(10,2))
- 
# System Fields
- calculated_at (timestamp)
- is_finalized (boolean, default false)
- created_at, updated_at
```

#### payroll_calculation_details
```sql
- id (primary key)
- payroll_calculation_id (foreign key to payroll_calculations)
- salary_component_id (foreign key to salary_components)
- 
# Calculation Details
- base_amount (decimal(10,2)) # Amount used for calculation
- rate_or_percentage (decimal(8,4)) # Rate/percentage applied
- calculated_amount (decimal(10,2)) # Final amount
- 
# Metadata
- calculation_notes (text, nullable)
- created_at
```

#### government_contribution_rates
```sql
- id (primary key)
- contribution_type (enum: sss, philhealth, pagibig, withholding_tax)
- 
# Rate Brackets
- min_salary (decimal(10,2))
- max_salary (decimal(10,2), nullable)
- employee_rate (decimal(6,4))
- employer_rate (decimal(6,4))
- total_contribution (decimal(8,2), nullable) # For fixed amounts
- 
# Effective Period
- effective_date (date)
- end_date (date, nullable)
- is_active (boolean, default true)
- 
# System Fields
- created_by (foreign key to users)
- created_at, updated_at
```

#### tax_brackets
```sql
- id (primary key)
- tax_status (enum: S, ME, S1, ME1, S2, ME2, S3, ME3, S4, ME4)
- 
# Tax Bracket
- min_income (decimal(10,2))
- max_income (decimal(10,2), nullable)
- base_tax (decimal(10,2))
- tax_rate (decimal(5,4)) # Percentage over excess
- excess_over (decimal(10,2))
- 
# Effective Period
- effective_date (date)
- end_date (date, nullable)
- is_active (boolean, default true)
- 
# System Fields
- created_by (foreign key to users)
- created_at, updated_at
```

#### payslips
```sql
- id (primary key)
- payroll_calculation_id (foreign key to payroll_calculations)
- employee_id (foreign key to employees)
- payroll_period_id (foreign key to payroll_periods)
- 
# Payslip Details
- payslip_number (string, unique)
- generated_at (timestamp)
- 
# File Information
- pdf_file_path (string, nullable)
- pdf_file_size (integer, nullable)
- 
# Distribution
- email_sent (boolean, default false)
- email_sent_at (timestamp, nullable)
- downloaded_by_employee (boolean, default false)
- downloaded_at (timestamp, nullable)
- 
# System Fields
- generated_by (foreign key to users)
- created_at, updated_at
```

#### government_reports
```sql
- id (primary key)
- report_type (enum: bir_2316, sss_r3, philhealth_rf1, pagibig_mcrf)
- reporting_period (string) # "2025-Q1", "2025-Annual"
- 
# Report Details
- total_employees (integer)
- total_gross_pay (decimal(12,2))
- total_contributions (decimal(12,2))
- total_taxes (decimal(12,2))
- 
# File Information
- report_file_path (string, nullable)
- report_file_size (integer, nullable)
- 
# Submission Status
- status (enum: draft, generated, submitted, accepted)
- generated_at (timestamp, nullable)
- submitted_at (timestamp, nullable)
- 
# System Fields
- generated_by (foreign key to users)
- created_at, updated_at
```

---

## Implementation Phases

### Phase 1: Foundation Setup (Week 1)
- [ ] Create Payroll Eloquent models with relationships
- [ ] Create database migrations for all payroll tables
- [ ] Set up government contribution rate tables
- [ ] Create tax bracket configuration tables
- [ ] Seed initial payroll configuration data

### Phase 2: Calculation Engine (Week 2-3)
- [ ] Create PayrollCalculationService with core algorithms
- [ ] Implement government contribution calculations (SSS, PhilHealth, Pag-IBIG)
- [ ] Build withholding tax calculation engine
- [ ] Create overtime and special pay calculations
- [ ] Add year-to-date tracking and updates

### Phase 3: Repository & Service Layer (Week 3-4)
- [ ] Create repository interfaces for all payroll entities
- [ ] Implement Eloquent repositories with complex queries
- [ ] Create PayrollService for payroll processing workflow
- [ ] Build ReportingService for government reports
- [ ] Add transaction handling and rollback capabilities

### Phase 4: Payroll Processing Workflow (Week 4-5)
- [ ] Create payroll period management
- [ ] Build payroll calculation batch processing
- [ ] Implement payroll approval workflow
- [ ] Add payroll recalculation and adjustment features
- [ ] Create payroll finalization and locking

### Phase 5: Document Generation (Week 5-6)
- [ ] Set up payslip PDF generation with templates
- [ ] Create government report generators (BIR 2316, SSS R3, etc.)
- [ ] Build bulk payslip generation and distribution
- [ ] Add email notification system for payslips
- [ ] Create document management and archiving

### Phase 6: Controller & Frontend (Week 6-7)
- [ ] Create Payroll controllers with proper DI
- [ ] Build payroll processing interface
- [ ] Create employee payroll information management
- [ ] Add payroll reporting and analytics dashboard
- [ ] Implement payslip distribution and download

### Phase 7: Integration & Testing (Week 7-8)
- [ ] Integrate with HR module for employee data
- [ ] Integrate with Timekeeping for attendance data
- [ ] Create comprehensive test suite
- [ ] Add performance optimization and caching
- [ ] Create detailed documentation and user guides

---

## Philippine Tax & Contribution Calculations

### SSS (Social Security System) Contributions
```php
// Monthly Contribution Table (2024 rates)
// Salary ranges and corresponding contributions
$sssRates = [
    ['min' => 4250, 'max' => 4749.99, 'employee' => 191.25, 'employer' => 382.50],
    ['min' => 4750, 'max' => 5249.99, 'employee' => 213.75, 'employer' => 427.50],
    // ... additional brackets
    ['min' => 24750, 'max' => null, 'employee' => 1125.00, 'employer' => 2250.00],
];
```

### PhilHealth Contributions
```php
// Premium Rate: 5% of monthly salary (2.5% employee, 2.5% employer)
// Minimum: P500/month, Maximum: P5,000/month
$philHealthRate = 0.05; // 5% total (2.5% each)
$philHealthMin = 500;
$philHealthMax = 5000;
```

### Pag-IBIG Contributions
```php
// Employee: 1% or 2% of monthly salary (employee's choice)
// Employer: 2% of monthly salary
// Minimum: P24/month, Maximum: P5,000/month
$pagibigEmployeeRate = 0.01; // or 0.02
$pagibigEmployerRate = 0.02;
$pagibigMin = 24;
$pagibigMax = 5000;
```

### Withholding Tax (BIR)
```php
// Monthly Tax Table for 2024
$taxBrackets = [
    'S' => [ // Single
        ['min' => 0, 'max' => 25000, 'rate' => 0, 'base' => 0],
        ['min' => 25000, 'max' => 33333, 'rate' => 0.15, 'base' => 0],
        ['min' => 33333, 'max' => 66667, 'rate' => 0.20, 'base' => 1250],
        ['min' => 66667, 'max' => 166667, 'rate' => 0.25, 'base' => 8916.80],
        ['min' => 166667, 'max' => 666667, 'rate' => 0.30, 'base' => 33916.80],
        ['min' => 666667, 'max' => null, 'rate' => 0.35, 'base' => 183916.80],
    ],
    // Additional brackets for ME, S1, ME1, etc.
];
```

---

## Key Features & Workflows

### Payroll Processing Workflow
1. **Create Payroll Period** (define dates and employee scope)
2. **Import Attendance Data** (from Timekeeping module)
3. **Calculate Gross Pay** (basic + overtime + allowances + bonuses)
4. **Calculate Deductions** (government contributions + taxes + other)
5. **Generate Net Pay** (gross - total deductions)
6. **Review and Adjust** (manual adjustments if needed)
7. **Approve Payroll** (management approval)
8. **Generate Payslips** (PDF creation and distribution)
9. **Finalize Payroll** (lock calculations, update YTD)

### Employee Payroll Setup Workflow
1. **Set Basic Salary Information** (salary type, amount, tax status)
2. **Configure Salary Components** (allowances, deductions, benefits)
3. **Set Government Information** (SSS, PhilHealth, Pag-IBIG numbers)
4. **Add Bank Details** (for payroll distribution)
5. **Activate Payroll Profile** (effective date settings)

### Government Report Generation
1. **Select Reporting Period** (monthly, quarterly, annual)
2. **Gather Payroll Data** (all relevant payroll calculations)
3. **Apply Report Format** (BIR 2316, SSS R3, PhilHealth RF1, etc.)
4. **Generate Report File** (Excel/CSV format per government requirements)
5. **Validate Report Data** (cross-check totals and details)
6. **Submit to Government** (electronic filing or manual submission)

---

## User Interface Design

### Payroll Dashboard
- **Current Payroll Status**: Active periods, processing status
- **Quick Actions**: Start new payroll, approve pending calculations
- **Statistics**: Total employees, gross payroll, tax contributions
- **Recent Activity**: Latest payroll runs, approvals, reports

### Payroll Processing Interface
- **Period Management**: Create and manage payroll periods
- **Calculation Status**: Track calculation progress for all employees
- **Exception Handling**: Review and resolve calculation errors
- **Bulk Actions**: Mass approval, recalculation, adjustment

### Employee Payroll Management
- **Salary Information**: Configure basic salary and components
- **Deduction Setup**: Manage loans, advances, other deductions
- **Tax Settings**: Configure tax status and exemptions
- **Payroll History**: View historical payroll calculations

### Reporting & Analytics
- **Payroll Reports**: Detailed payroll registers and summaries by department
- **Department Analysis**: Office (HR, Accounting, IT, Front Desk) vs Production (RM1-RM5) vs Security cost breakdown
- **Rolling Mill Reports**: Individual Rolling Mill 1-5 labor cost analysis
- **Government Reports**: BIR, SSS, PhilHealth, Pag-IBIG reports by department
- **Cost Analysis**: Department costs, overtime analysis per department type
- **Year-End Reports**: 13th month, tax certificates, annual summaries by department

---

## Document Templates

### Payslip Template Structure
```
CATHAY METAL CORPORATION
Pay Slip for [Period]

Employee: [Name] ([Employee Number])
Department: [Department]
Position: [Position]

EARNINGS:
Basic Salary: [Amount]
Overtime Pay: [Amount]
Allowances: [Amount]
Other Earnings: [Amount]
GROSS PAY: [Amount]

DEDUCTIONS:
SSS Contribution: [Amount]
PhilHealth: [Amount]
Pag-IBIG: [Amount]
Withholding Tax: [Amount]
Other Deductions: [Amount]
TOTAL DEDUCTIONS: [Amount]

NET PAY: [Amount]

YTD SUMMARY:
Gross Income: [Amount]
Total Tax: [Amount]
```

### Government Report Templates
- **BIR Form 2316**: Annual Income Tax Return
- **SSS Form R3**: Monthly Remittance Report
- **PhilHealth RF1**: Monthly Premium Remittance
- **Pag-IBIG MCRF**: Monthly Collection Report

---

## Integration Points

### HR Module Integration
- **Employee Master Data**: Basic information, employment details
- **Leave Requests**: Paid/unpaid leave affecting payroll
- **Employment Changes**: Salary adjustments, promotions, terminations
- **Department Structure**: For reporting and cost center analysis

### Timekeeping Module Integration
- **Attendance Data**: Regular hours, overtime, absences
- **Work Schedules**: Standard hours for overtime calculation
- **Time Corrections**: Approved time adjustments
- **Holiday Calendar**: Holiday pay calculations

### Banking Integration (Future)
- **Payroll Distribution**: Electronic fund transfer to employee accounts
- **Bank File Generation**: Generate bank upload files
- **Payment Confirmation**: Track successful transfers
- **Failed Payment Handling**: Manage bounced or failed transfers

---

## Compliance & Security

### Philippine Labor Law Compliance
- **Minimum Wage**: Enforce regional minimum wage rates
- **Overtime Rules**: Proper overtime rate calculations (1.5x, 2x)
- **Holiday Pay**: Regular/special holiday pay calculations
- **13th Month Pay**: Automatic calculation and distribution
- **Tax Exemptions**: Proper handling of de minimis benefits

### Data Security
- **Payroll Data Encryption**: Encrypt sensitive salary information
- **Access Controls**: Role-based access to payroll functions
- **Audit Trail**: Complete log of all payroll changes
- **Backup Strategy**: Regular encrypted backups of payroll data

### Government Reporting
- **Accurate Calculations**: Ensure compliance with government rates
- **Timely Reporting**: Generate reports within filing deadlines  
- **Report Validation**: Cross-check report totals and details
- **Filing History**: Maintain records of all government submissions

---

## Performance Considerations

### Calculation Optimization
- **Batch Processing**: Process multiple employees simultaneously
- **Caching**: Cache government rates and tax brackets
- **Parallel Processing**: Use Laravel queues for large payrolls
- **Database Optimization**: Optimize queries for YTD calculations

### Report Generation
- **Chunked Processing**: Handle large datasets efficiently
- **Memory Management**: Stream large reports to avoid memory issues
- **Background Processing**: Generate reports asynchronously
- **File Compression**: Compress large report files

---

## Testing Strategy

### Calculation Tests  
- **Government Contribution Tests**: Verify SSS, PhilHealth, Pag-IBIG calculations
- **Tax Calculation Tests**: Test withholding tax across all brackets
- **Overtime Calculation Tests**: Verify overtime rates and calculations
- **Year-to-Date Tests**: Ensure accurate YTD tracking

### Integration Tests
- **HR Data Integration**: Test employee data synchronization
- **Timekeeping Integration**: Verify attendance data import
- **Payslip Generation**: Test complete payslip creation process
- **Government Reports**: Validate report generation accuracy

### Performance Tests
- **Large Payroll Processing**: Test with 1000+ employees
- **Concurrent Processing**: Test multiple payroll periods
- **Report Generation**: Test large report creation
- **Database Performance**: Test query performance under load

---

**Module Completion Criteria:**
- [ ] Accurate payroll calculations for all employee types
- [ ] Government contribution calculations compliant with Philippine law
- [ ] Payslip generation and distribution functional
- [ ] Government reporting capability operational
- [ ] Integration with HR and Timekeeping complete
- [ ] Comprehensive audit trail and security measures

**Estimated Timeline:** 8 weeks  
**Resources Required:** 1 Full-stack developer + 1 Accounting/Payroll consultant  
**Dependencies:** HR Module (employee data), Timekeeping Module (attendance data)