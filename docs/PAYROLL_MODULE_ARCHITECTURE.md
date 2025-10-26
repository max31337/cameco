# Payroll Module - Complete Philippine Production Architecture & Implementation Plan

## Module Overview
The Payroll Module handles salary calculations, deductions, benefits, and comprehensive Philippine tax compliance for Cathay Metal Corporation employees. This production-ready module integrates with HR and Timekeeping data to generate accurate payroll calculations, statutory reports, and all required government submissions per Philippine labor law and BIR/SSS/PhilHealth/Pag-IBIG regulations.

## Module Dependencies
- **HR Module**: Employee records, leave requests, employment details, 201 files
- **Timekeeping Module**: Attendance data, overtime hours, work schedules, biometric logs
 - **Timekeeping Module**: Attendance data, overtime hours, work schedules, RFID (ID) logs
- **Foundation**: User management, roles, permissions, audit logging
- 🔄 **Integrates with**: Philippine government systems (BIR eFPS, SSS eR3, PhilHealth EPRS, Pag-IBIG eSRS)
- **Workforce Management**: For shift-based pay, rotation premiums, night differential
- **Appraisal Module**: For rehire flags and separation adjustments affecting final payouts
- **Finance/Accounting**: For journal entries, cost center allocation, budget tracking

## Module Goals
1. **100% Accurate Payroll Calculations**: Salary, overtime, night diff, holiday pay, leaves, deductions, benefits
2. **Full Philippine Tax Compliance**: BIR withholding tax, 13th month, de minimis, fringe benefits
3. **Government Statutory Compliance**: SSS, PhilHealth, Pag-IBIG contributions and reporting
4. **Complete BIR Submission**: Forms 1601C, 2316, 1604C, 1604CF, Alphalist DAT
5. **Automated Government File Generation**: SSS R3, PhilHealth RF1, Pag-IBIG MCRF, bank files
6. **Payslip Generation**: DOLE-compliant detailed payslips with all components
7. **Statutory Reporting**: All government-required reports and transmittals
8. **Payroll Analytics**: Department-wise cost analysis, labor cost reports, budget variance
9. **Complete Audit Trail**: Full payroll processing history with change tracking
10. **Bank Integration**: ATM payroll file generation for multiple banks (for future phases)

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
- cutoff_date (date) # DTR cutoff for attendance
- pay_date (date)
- 
# Processing Status
- status (enum: draft, importing, calculating, calculated, reviewing, approved, bank_file_generated, paid, closed)
- processed_at (timestamp, nullable)
- approved_by (foreign key to users, nullable)
- approved_at (timestamp, nullable)
- finalized_by (foreign key to users, nullable)
- finalized_at (timestamp, nullable)
- 
# Payroll Summary
- total_employees (integer, default 0)
- total_gross_pay (decimal(14,2), default 0)
- total_deductions (decimal(14,2), default 0)
- total_net_pay (decimal(14,2), default 0)
- total_employer_cost (decimal(14,2), default 0) # Including employer share
- 
# System Fields
- created_by (foreign key to users)
- updated_by (foreign key to users, nullable)
- created_at, updated_at
- deleted_at (nullable) # Soft deletes
```

#### employee_payroll_info
```sql
- id (primary key)
- employee_id (foreign key to employees)
- 
# Salary Information
- salary_type (enum: monthly, daily, hourly, contractual, project_based)
- basic_salary (decimal(10,2))
- daily_rate (decimal(8,2), nullable) # For daily-paid employees
- hourly_rate (decimal(8,2), nullable) # For hourly-paid employees
- 
# Tax Information
- tax_status (enum: Z, S, ME, S1, ME1, S2, ME2, S3, ME3, S4, ME4) # Z = Zero/Exempt, BIR tax table categories
- rdo_code (string, nullable) # BIR Revenue District Office
- withholding_tax_exemption (decimal(8,2), default 0)
- is_tax_exempt (boolean, default false) # For minimum wage earners
- is_substituted_filing (boolean, default false) # BIR substituted filing
- 
# Government Numbers (from HR, cached for payroll)
- sss_number (string, nullable)
- philhealth_number (string, nullable)
- pagibig_number (string, nullable)
- tin_number (string, nullable)
- 
# Government Contribution Settings
- sss_bracket (string, nullable) # Current SSS bracket
- is_sss_voluntary (boolean, default false)
- philhealth_is_indigent (boolean, default false) # Sponsored by government
- pagibig_employee_rate (decimal(4,2), default 1.00) # 1% or 2%
- 
# Bank Information
- payment_method (enum: bank_transfer, cash, check)
- bank_name (string, nullable)
- bank_code (string, nullable) # For bank file generation
- bank_account_number (string, nullable)
- bank_account_name (string, nullable)
- 
# De Minimis and Benefits
- is_entitled_to_rice (boolean, default true)
- is_entitled_to_uniform (boolean, default true)
- is_entitled_to_laundry (boolean, default true)
- is_entitled_to_medical (boolean, default true)
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
- deleted_at (nullable)
```

#### salary_components
```sql
- id (primary key)
- name (string, required) # "Basic Salary", "Overtime", "Rice Allowance", etc.
- code (string, unique) # "BASIC", "OT_REG", "OT_RESTDAY", "ND", "RICE", "SSS", "WTAX"
- component_type (enum: earning, deduction, benefit, tax, contribution, loan, allowance)
- category (enum: regular, overtime, holiday, leave, allowance, deduction, tax, contribution, loan, adjustment)
- 
# Calculation Settings
- calculation_method (enum: fixed_amount, percentage_of_basic, percentage_of_gross, per_hour, per_day, per_unit, percentage_of_component)
- default_amount (decimal(10,2), nullable)
- default_percentage (decimal(5,2), nullable)
- reference_component_id (foreign key to salary_components, nullable) # For percentage calculations
- 
# Overtime and Premium Settings
- ot_multiplier (decimal(4,2), nullable) # 1.25, 1.30, 1.50, 2.00, 2.60, etc.
- is_premium_pay (boolean, default false)
- 
# Tax Treatment
- is_taxable (boolean, default true)
- is_deminimis (boolean, default false) # Rice, uniform, laundry, medical allowance
- deminimis_limit_monthly (decimal(10,2), nullable) # Monthly de minimis limit
- deminimis_limit_annual (decimal(10,2), nullable) # Annual de minimis limit
- is_13th_month (boolean, default false)
- is_other_benefits (boolean, default false) # OBP (Other Benefits Pay)
- 
# Government Contribution Settings
- affects_sss (boolean, default false)
- affects_philhealth (boolean, default false)
- affects_pagibig (boolean, default false)
- affects_gross_compensation (boolean, default true) # For BIR gross income
- 
# Display Settings
- display_order (integer, default 0)
- is_displayed_on_payslip (boolean, default true)
- 
# System Fields
- is_active (boolean, default true)
- is_system_component (boolean, default false) # Cannot be deleted
- created_by (foreign key to users)
- updated_by (foreign key to users, nullable)
- created_at, updated_at
- deleted_at (nullable)
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
- units (decimal(8,2), nullable) # For per-unit calculations
- 
# Frequency and Timing
- frequency (enum: per_payroll, monthly, quarterly, semi_annual, annually, one_time)
- effective_date (date)
- end_date (date, nullable)
- 
# Conditions
- is_prorated (boolean, default false) # Prorate if not full period
- requires_attendance (boolean, default true) # Deduct if absent
- 
# System Fields
- is_active (boolean, default true)
- created_by (foreign key to users)
- updated_by (foreign key to users, nullable)
- created_at, updated_at
- deleted_at (nullable)
```

#### payroll_calculations
```sql
- id (primary key)
- payroll_period_id (foreign key to payroll_periods)
- employee_id (foreign key to employees)
- 
# Employee Snapshot (at time of calculation)
- employee_number (string)
- full_name (string)
- department_id (foreign key to departments)
- position_id (foreign key to positions)
- employment_status (string)
- tin_number (string, nullable)
- sss_number (string, nullable)
- philhealth_number (string, nullable)
- pagibig_number (string, nullable)
- 
# Salary Information
- salary_type (string)
- basic_salary (decimal(10,2))
- daily_rate (decimal(8,2), nullable)
- hourly_rate (decimal(8,2), nullable)
- 
# Time and Attendance Data
- scheduled_days (decimal(4,2))
- days_worked (decimal(4,2))
- days_absent (decimal(4,2), default 0)
- days_late (decimal(4,2), default 0)
- days_undertime (decimal(4,2), default 0)
- 
# Hours Breakdown
- regular_hours (decimal(6,2))
- overtime_regular_hours (decimal(6,2), default 0) # 1.25x
- overtime_restday_hours (decimal(6,2), default 0) # 1.30x
- overtime_special_holiday_hours (decimal(6,2), default 0) # 1.30x
- overtime_regular_holiday_hours (decimal(6,2), default 0) # 2.60x
- night_differential_hours (decimal(6,2), default 0) # 10% of hourly rate (10pm-6am)
- regular_holiday_hours (decimal(6,2), default 0) # 2.00x
- special_holiday_hours (decimal(6,2), default 0) # 1.30x (if worked)
- leave_with_pay_hours (decimal(6,2), default 0)
- leave_without_pay_hours (decimal(6,2), default 0)
- 
# Gross Earnings Breakdown
- basic_pay (decimal(10,2))
- overtime_pay (decimal(10,2), default 0)
- night_differential_pay (decimal(10,2), default 0)
- holiday_pay (decimal(10,2), default 0)
- leave_pay (decimal(10,2), default 0)
- 
# Allowances (Non-taxable/De Minimis)
- rice_allowance (decimal(8,2), default 0) # Max 2,000/month
- uniform_allowance (decimal(8,2), default 0) # Max 6,000/year
- laundry_allowance (decimal(8,2), default 0) # Max 300/month
- medical_allowance (decimal(8,2), default 0) # Max 1,500/month per semester
- 
# Other Earnings
- cola (decimal(8,2), default 0) # Cost of Living Allowance
- transportation_allowance (decimal(8,2), default 0)
- meal_allowance (decimal(8,2), default 0)
- communication_allowance (decimal(8,2), default 0)
- bonuses (decimal(10,2), default 0)
- incentives (decimal(10,2), default 0)
- commissions (decimal(10,2), default 0)
- retroactive_pay (decimal(10,2), default 0)
- other_earnings (decimal(10,2), default 0)
- 
# 13th Month and OBP
- thirteenth_month_pay (decimal(10,2), default 0)
- other_benefits_pay (decimal(10,2), default 0) # OBP
- 
# Total Earnings
- gross_pay (decimal(10,2)) # Taxable gross
- non_taxable_earnings (decimal(10,2), default 0) # De minimis total
- total_earnings (decimal(10,2)) # Gross + non-taxable
- 
# Government Contributions (Employee Share)
- sss_employee (decimal(8,2), default 0)
- sss_ec (decimal(6,2), default 0) # Employee Compensation (employer share only)
- philhealth_employee (decimal(8,2), default 0)
- pagibig_employee (decimal(8,2), default 0)
- 
# Government Contributions (Employer Share)
- sss_employer (decimal(8,2), default 0)
- philhealth_employer (decimal(8,2), default 0)
- pagibig_employer (decimal(8,2), default 0)
- 
# Tax Calculations
- taxable_income (decimal(10,2)) # Gross - non-taxable - contributions
- withholding_tax (decimal(10,2), default 0)
- tax_status (string) # S, ME, S1, etc.
- 
# Company Deductions
- tardiness_deduction (decimal(8,2), default 0)
- undertime_deduction (decimal(8,2), default 0)
- absence_deduction (decimal(8,2), default 0)
- 
# Loans and Advances
- sss_loan (decimal(8,2), default 0)
- pagibig_loan (decimal(8,2), default 0)
- company_loan (decimal(8,2), default 0)
- cash_advance (decimal(8,2), default 0)
- 
# Other Deductions
- insurance_premium (decimal(8,2), default 0)
- hmo_premium (decimal(8,2), default 0)
- uniform_deduction (decimal(8,2), default 0)
- other_deductions (decimal(10,2), default 0)
- 
# Total Deductions
- total_statutory_deductions (decimal(10,2)) # SSS + PhilHealth + Pag-IBIG + Tax
- total_other_deductions (decimal(10,2))
- total_deductions (decimal(10,2))
- 
# Net Pay
- net_pay (decimal(10,2))
- 
# Employer Costs
- employer_contributions (decimal(10,2)) # Employer share of SSS + PhilHealth + Pag-IBIG
- total_employer_cost (decimal(10,2)) # Gross + employer contributions
- 
# Year-to-Date Totals
- ytd_gross (decimal(12,2))
- ytd_tax (decimal(12,2))
- ytd_sss_employee (decimal(10,2))
- ytd_sss_employer (decimal(10,2))
- ytd_philhealth_employee (decimal(10,2))
- ytd_philhealth_employer (decimal(10,2))
- ytd_pagibig_employee (decimal(10,2))
- ytd_pagibig_employer (decimal(10,2))
- ytd_13th_month (decimal(10,2))
- ytd_other_benefits (decimal(10,2))
- ytd_deminimis (decimal(10,2))
- ytd_net_pay (decimal(12,2))
- 
# Calculation Metadata
- calculation_version (integer, default 1) # For recalculations
- calculation_notes (text, nullable)
- has_adjustments (boolean, default false)
- has_errors (boolean, default false)
- error_messages (text, nullable)
- 
# Status Tracking
- is_finalized (boolean, default false)
- is_paid (boolean, default false)
- paid_at (timestamp, nullable)
- 
# System Fields
- calculated_at (timestamp)
- calculated_by (foreign key to users)
- finalized_at (timestamp, nullable)
- finalized_by (foreign key to users, nullable)
- created_at, updated_at
- deleted_at (nullable)

# Indexes
- INDEX(payroll_period_id, employee_id)
- INDEX(employee_id, is_finalized)
- INDEX(payroll_period_id, is_finalized)
```

#### payroll_calculation_details
```sql
- id (primary key)
- payroll_calculation_id (foreign key to payroll_calculations)
- salary_component_id (foreign key to salary_components)
- 
# Calculation Details
- component_name (string) # Snapshot of component name
- component_code (string) # Snapshot of component code
- component_type (string)
- base_amount (decimal(10,2)) # Amount used for calculation
- rate_or_percentage (decimal(8,4)) # Rate/percentage applied
- units (decimal(8,2), nullable) # Hours, days, units
- calculated_amount (decimal(10,2)) # Final amount
- 
# Metadata
- calculation_formula (string, nullable) # Human-readable formula
- calculation_notes (text, nullable)
- is_adjustment (boolean, default false)
- adjusted_by (foreign key to users, nullable)
- 
# System Fields
- created_at
- updated_at (nullable)
```

#### payroll_adjustments
```sql
- id (primary key)
- payroll_calculation_id (foreign key to payroll_calculations)
- salary_component_id (foreign key to salary_components, nullable)
- 
# Adjustment Details
- adjustment_type (enum: add, deduct, override)
- amount (decimal(10,2))
- reason (text, required)
- reference_number (string, nullable) # Memo number, approval number
- 
# Approval
- requested_by (foreign key to users)
- approved_by (foreign key to users, nullable)
- approved_at (timestamp, nullable)
- status (enum: pending, approved, rejected)
- 
# System Fields
- created_at, updated_at
```

#### government_contribution_rates
```sql
- id (primary key)
- contribution_type (enum: sss, sss_ec, philhealth, pagibig)
- 
# SSS Brackets
- bracket_name (string, nullable) # For SSS: "Bracket 1", "Bracket 2", etc.
- min_salary (decimal(10,2))
- max_salary (decimal(10,2), nullable)
- 
# Contribution Amounts
- employee_contribution (decimal(8,2), nullable)
- employer_contribution (decimal(8,2), nullable)
- ec_contribution (decimal(6,2), nullable) # Employee Compensation
- total_contribution (decimal(8,2), nullable)
- 
# Percentage Rates (for PhilHealth, Pag-IBIG)
- employee_rate (decimal(6,4), nullable)
- employer_rate (decimal(6,4), nullable)
- 
# Caps and Floors
- minimum_contribution (decimal(8,2), nullable)
- maximum_contribution (decimal(8,2), nullable)
- 
# Effective Period
- effective_date (date)
- end_date (date, nullable)
- is_active (boolean, default true)
- 
# System Fields
- created_by (foreign key to users)
- updated_by (foreign key to users, nullable)
- created_at, updated_at
- deleted_at (nullable)
```

#### tax_brackets
```sql
- id (primary key)
- tax_status (enum: Z, S, ME, S1, ME1, S2, ME2, S3, ME3, S4, ME4)
- 
# Tax Bracket
- min_income (decimal(10,2))
- max_income (decimal(10,2), nullable)
- base_tax (decimal(10,2))
- tax_rate (decimal(5,4)) # Percentage over excess
- excess_over (decimal(10,2))
- 
# Description
- description (string, nullable) # e.g., "Single, No Dependents"
- 
# Effective Period
- effective_date (date)
- end_date (date, nullable)
- is_active (boolean, default true)
- 
# System Fields
- created_by (foreign key to users)
- updated_by (foreign key to users, nullable)
- created_at, updated_at
- deleted_at (nullable)
```

#### payslips
```sql
- id (primary key)
- payroll_calculation_id (foreign key to payroll_calculations)
- employee_id (foreign key to employees)
- payroll_period_id (foreign key to payroll_periods)
- 
# Payslip Details
- payslip_number (string, unique) # e.g., "PS-2025-10-00123"
- generated_at (timestamp)
- 
# File Information
- pdf_file_path (string, nullable)
- pdf_file_size (integer, nullable)
- pdf_hash (string, nullable) # For integrity verification
- 
# Distribution
- distribution_method (enum: email, portal, printed)
- email_sent (boolean, default false)
- email_sent_at (timestamp, nullable)
- email_address (string, nullable)
- downloaded_by_employee (boolean, default false)
- downloaded_at (timestamp, nullable)
- printed (boolean, default false)
- printed_at (timestamp, nullable)
- printed_by (foreign key to users, nullable)
- 
# Acknowledgment
- acknowledged_by_employee (boolean, default false)
- acknowledged_at (timestamp, nullable)
- 
# System Fields
- generated_by (foreign key to users)
- created_at, updated_at
```

#### government_reports
```sql
- id (primary key)
- report_type (enum: bir_1601c, bir_1604c, bir_1604cf, bir_2316, bir_alphalist, sss_r3, sss_r5, philhealth_rf1, pagibig_mcrf, bank_file)
- reporting_period (string) # "2025-01" (monthly), "2025-Q1" (quarterly), "2025" (annual)
- period_type (enum: monthly, quarterly, annual)
- 
# Period Details
- period_start_date (date)
- period_end_date (date)
- 
# Report Details
- total_employees (integer)
- total_gross_pay (decimal(14,2), default 0)
- total_taxable_income (decimal(14,2), default 0)
- total_contributions (decimal(14,2), default 0)
- total_taxes (decimal(14,2), default 0)
- total_employer_share (decimal(14,2), default 0)
- 
# File Information
- report_file_path (string, nullable)
- report_file_name (string, nullable)
- report_file_size (integer, nullable)
- file_format (enum: pdf, excel, csv, txt, dat) # DAT for BIR Alphalist
- report_file_hash (string, nullable)
- 
# Submission Status
- status (enum: draft, generated, validated, submitted, accepted, rejected)
- generated_at (timestamp, nullable)
- validated_at (timestamp, nullable)
- submitted_at (timestamp, nullable)
- submitted_by (foreign key to users, nullable)
- 
# Government Tracking
- reference_number (string, nullable) # Government tracking/reference number
- acknowledgment_receipt (string, nullable)
- submission_notes (text, nullable)
- 
# System Fields
- generated_by (foreign key to users)
- created_at, updated_at
- deleted_at (nullable)
```

#### government_remittances
```sql
- id (primary key)
- remittance_type (enum: sss, philhealth, pagibig, bir_tax)
- reporting_period (string) # "2025-01"
- 
# Remittance Details
- total_employee_contribution (decimal(12,2))
- total_employer_contribution (decimal(12,2))
- total_ec_contribution (decimal(10,2), default 0) # SSS EC
- total_amount (decimal(12,2))
- 
# Payment Information
- payment_date (date, nullable)
- payment_method (enum: online, otc, bank) # Online, Over-the-Counter, Bank
- payment_reference_number (string, nullable)
- 
# Bank Details (if applicable)
- bank_name (string, nullable)
- check_number (string, nullable)
- transaction_number (string, nullable)
- 
# Status
- status (enum: pending, paid, confirmed)
- paid_by (foreign key to users, nullable)
- confirmed_by (foreign key to users, nullable)
- confirmed_at (timestamp, nullable)
- 
# Attachments
- payment_proof_path (string, nullable) # Scanned receipt/confirmation
- 
# System Fields
- created_by (foreign key to users)
- updated_by (foreign key to users, nullable)
- created_at, updated_at
```

#### bank_payroll_files
```sql
- id (primary key)
- payroll_period_id (foreign key to payroll_periods)
- bank_name (string) # "BPI", "BDO", "Metrobank", etc.
- bank_code (string, nullable)
- 
# File Details
- file_name (string)
- file_path (string)
- file_format (enum: csv, txt, excel, fixed_width)
- file_size (integer)
- file_hash (string)
- 
# Payroll Summary
- total_employees (integer)
- total_amount (decimal(14,2))
- 
# Upload Status
- status (enum: generated, uploaded, processed, confirmed, failed)
- generated_at (timestamp)
- uploaded_at (timestamp, nullable)
- uploaded_by (foreign key to users, nullable)
- confirmation_number (string, nullable)
- 
# System Fields
- created_at, updated_at
```

#### payroll_journal_entries
```sql
- id (primary key)
- payroll_period_id (foreign key to payroll_periods)
- 
# Journal Entry Details
- journal_entry_number (string, unique)
- journal_date (date)
- 
# Accounting Entries
- total_salaries_wages (decimal(14,2))
- total_employer_contributions (decimal(12,2))
- total_employee_deductions (decimal(12,2))
- total_tax_payable (decimal(12,2))
- 
# Status
- status (enum: draft, posted, exported)
- posted_at (timestamp, nullable)
- posted_by (foreign key to users, nullable)
- exported_at (timestamp, nullable)
- 
# Export Information
- export_file_path (string, nullable)
- exported_to_system (string, nullable) # "QuickBooks", "SAP", etc.
- 
# System Fields
- created_by (foreign key to users)
- created_at, updated_at
```

#### employee_loans
```sql
- id (primary key)
- employee_id (foreign key to employees)
- loan_type (enum: sss, pagibig, company, cash_advance)
- 
# Loan Details
- loan_number (string, unique)
- principal_amount (decimal(10,2))
- interest_rate (decimal(5,2), nullable)
- total_amount (decimal(10,2)) # Principal + interest
- 
# Payment Details
- monthly_amortization (decimal(8,2))
- number_of_installments (integer)
- installments_paid (integer, default 0)
- remaining_balance (decimal(10,2))
- 
# Deduction Settings
- start_deduction_period_id (foreign key to payroll_periods)
- last_deduction_period_id (foreign key to payroll_periods, nullable)
- 
# Dates
- loan_date (date)
- start_date (date) # Start of deductions
- maturity_date (date)
- 
# Status
- status (enum: active, completed, cancelled, restructured)
- is_active (boolean, default true)
- 
# Approval
- approved_by (foreign key to users, nullable)
- approved_at (timestamp, nullable)
- 
# System Fields
- created_by (foreign key to users)
- updated_by (foreign key to users, nullable)
- created_at, updated_at
- deleted_at (nullable)
```

#### loan_payments
```sql
- id (primary key)
- employee_loan_id (foreign key to employee_loans)
- payroll_calculation_id (foreign key to payroll_calculations)
- payroll_period_id (foreign key to payroll_periods)
- 
# Payment Details
- payment_amount (decimal(8,2))
- principal_payment (decimal(8,2))
- interest_payment (decimal(8,2), default 0)
- balance_after_payment (decimal(10,2))
- 
# System Fields
- created_at
```

#### payroll_audit_logs
```sql
- id (primary key)
- payroll_period_id (foreign key to payroll_periods, nullable)
- payroll_calculation_id (foreign key to payroll_calculations, nullable)
- 
# Audit Details
- action (string) # "created", "calculated", "adjusted", "approved", "finalized", etc.
- entity_type (string) # "PayrollPeriod", "PayrollCalculation", etc.
- entity_id (integer)
- 
# Change Details
- old_values (json, nullable)
- new_values (json, nullable)
- changes_summary (text, nullable)
- 
# User Information
- user_id (foreign key to users)
- ip_address (string, nullable)
- user_agent (string, nullable)
- 
# System Fields
- created_at
```

---

## Complete Philippine Payroll Processing Workflow

### Pre-Payroll Setup Phase

#### 1. Company Setup
- **Company Registration**: BIR, SSS, PhilHealth, Pag-IBIG registration
- **RDO Assignment**: Register with appropriate Revenue District Office
- **Business Permits**: Mayor's permit, DTI/SEC registration
- **Employer Numbers**: Obtain all government employer numbers

#### 2. Employee Masterfile Setup
- **Personal Information**: Complete 201 file data
- **Government Numbers**: TIN, SSS, PhilHealth, Pag-IBIG numbers
- **Tax Status**: Determine correct BIR tax table (S, ME, S1-S4, ME1-ME4, Z)
- **Dependents**: Record qualified dependents for tax exemption
- **Bank Details**: Bank name, account number, account name
- **Employment Details**: Position, department, hire date, salary structure
- **De Minimis Benefits**: Rice, uniform, laundry, medical allowance entitlements
- **Contact Information**: Emergency contacts, current address

#### 3. Payroll Configuration
- **Pay Period Definition**: Weekly, bi-weekly, semi-monthly, or monthly
- **Cutoff Dates**: DTR cutoff, payroll processing dates, pay dates
- **Salary Components**: Configure all earnings, deductions, allowances
- **Overtime Rates**: Regular OT (1.25x), restday (1.30x), holiday (2.00x, 2.60x)
- **Night Differential**: 10% of hourly rate (10:00 PM to 6:00 AM)
- **Holiday Calendar**: Regular and special holidays per year
- **Government Rates**: Upload current SSS, PhilHealth, Pag-IBIG, BIR tax tables

#### 4. Bank Setup
- **Payroll Account**: Open company payroll account
- **Employee Enrollment**: Enroll employees in ATM payroll program
- **File Format**: Obtain bank's payroll file format specifications
- **Testing**: Test file upload and processing with bank

---

### Monthly Payroll Processing Workflow (Production)

#### Week 1: Pre-Processing (Days 1-7 of Month)

**Day 1-5: Attendance Monitoring**
1. Monitor daily attendance via timekeeping system
2. Track overtime approvals and night shift schedules
3. Record leave applications (with pay / without pay)
4. Note holidays and special work schedules

**Day 6-7: Cutoff Preparation**
1. Prepare for cutoff date reminders
2. Ensure all overtime pre-approvals are documented
3. Verify attendance records are up to date
4. Prepare adjustment memos (if any)

#### Week 2: Cutoff and Data Gathering (Days 8-15)

**Cutoff Day (Usually Day 10 or 15 for semi-monthly)**
1. **DTR Cutoff**: Lock attendance/timekeeping system
2. **Final Attendance**: Generate final attendance reports
3. **Overtime Validation**: Review and approve all overtime claims
4. **Leave Processing**: Process approved leave requests
5. **Adjustment Collection**: Gather all adjustment memos:
   - Salary increases/decreases
   - New hires (prorated salary)
   - Resignations (last pay computation)
   - Promotions/demotions
   - Bonus/incentive approvals
   - Loan deductions
   - Other deductions (uniform, cash advances, etc.)

**Day After Cutoff (Day 11 or 16)**
1. **Data Validation**: Cross-check attendance vs schedules
2. **Discrepancy Resolution**: Address missing punches, overtime disputes
3. **Special Cases**: Handle absent employees, late filings
4. **Data Import**: Import finalized attendance to payroll system

#### Week 3: Payroll Calculation and Review (Days 16-22)

**Days 16-17: Payroll Calculation**
1. **Create Payroll Period**: Define period in system
2. **Import Attendance**: Load timekeeping data
3. **Run Calculations**:
   - Basic pay computation
   - Overtime calculations (all types)
   - Night differential (10pm-6am)
   - Holiday pay (regular 200%, special 130%)
   - Allowances (rice, COLA, transportation, etc.)
   - De minimis benefits (within tax-free limits)
   - 13th month accrual (if applicable)
   
4. **Government Deductions**:
   - **SSS**: Based on monthly compensation bracket
   - **PhilHealth**: 5% of monthly basic (2.5% each, max 5,000)
   - **Pag-IBIG**: 1-2% employee, 2% employer (max 5,000)
   - **Withholding Tax**: Per BIR tax table and status
   
5. **Other Deductions**:
   - Tardiness/undertime/absence deductions
   - SSS/Pag-IBIG loan amortizations
   - Company loans
   - Cash advances
   - Insurance premiums
   - Other authorized deductions

**Days 18-19: Payroll Review**
1. **Generate Payroll Register**: Detailed report by department
2. **Exception Reports**:
   - Zero net pay employees
   - Negative net pay (overloan)
   - High variance from previous payroll
   - New employees/resignees
   - Tax computation anomalies
   
3. **Department Review**: Send to department heads for validation
4. **Corrections**: Process necessary adjustments
5. **Recalculation**: Run payroll again if needed

**Days 20-21: Management Review**
1. **Summary Reports**: Present to HR Manager, Finance Manager
2. **Cost Analysis**: Compare to budget and previous periods
3. **Cash Flow Check**: Ensure sufficient funds for payroll
4. **Final Adjustments**: Last-minute approved changes

**Day 22: Payroll Approval**
1. **Approval Workflow**:
   - HR Manager approval
   - Finance Manager approval
   - General Manager/CEO final approval
2. **Lock Payroll**: Finalize calculations (no further changes)
3. **Update YTD**: Update year-to-date totals for all employees

#### Week 4: Payslip Generation and Payment (Days 23-30)

**Day 23: Payslip Generation**
1. **Generate All Payslips**: Create PDF payslips for all employees
2. **Payslip Validation**: Spot-check accuracy
3. **Payslip Distribution Preparation**:
   - Email distribution list
   - Portal upload
   - Printed copies (if applicable)

**Day 24: Bank File Generation**
1. **Create Bank Upload File**:
   - Format per bank specifications (BPI, BDO, etc.)
   - Include: Employee name, account number, net pay amount
   - Generate control totals
   
2. **File Validation**:
   - Verify total amount matches payroll
   - Check employee count
   - Validate account numbers format
   
3. **Bank Submission**:
   - Upload file to bank portal
   - Or submit physical file to bank branch
   - Obtain bank reference number

**Day 25: Payment Processing**
1. **Bank Processing**: Wait for bank to credit accounts
2. **Confirmation**: Receive bank confirmation of successful credits
3. **Failed Transactions**: Handle any bounced/failed transfers
4. **Alternative Payment**: Arrange check/cash for failed transfers

**Day 25-26: Payslip Distribution**
1. **Email Distribution**: Send payslips via email
2. **Portal Upload**: Make available on employee portal
3. **Print Distribution**: Print and distribute physical copies (if needed)
4. **Acknowledgment**: Track employee payslip downloads/receipt

**Day 27-28: Government Remittances Preparation**
1. **SSS Remittance**:
   - Generate R3 report file
   - Calculate total employee + employer + EC contributions
   - Prepare payment (online or OTC)
   
2. **PhilHealth Remittance**:
   - Generate RF1 report file
   - Calculate total contributions
   - Prepare payment (online via EPRS)
   
3. **Pag-IBIG Remittance**:
   - Generate MCRF file
   - Calculate total contributions
   - Prepare payment (online via eSRS)
   
4. **BIR Withholding Tax**:
   - Generate 1601C (Monthly Remittance)
   - Calculate total tax withheld
   - Prepare payment (via eFPS or authorized agent bank)

**Day 29-30: Government Submissions and Payments**
1. **Submit Reports**: Upload to government portals
2. **Make Payments**: Pay contributions online or at banks
3. **File Documents**: Save reference numbers, receipts
4. **Generate Transmittals**: Print transmittal forms for records

---

### Quarterly Processes

#### Every Quarter (March, June, September, December)
1. **Quarterly SSS Review**: Verify contributions are correct
2. **Quarterly PhilHealth Review**: Verify premium payments
3. **Quarterly BIR Review**: Prepare for annual tax filing
4. **YTD Verification**: Audit year-to-date totals for accuracy

---

### Annual Processes

#### December (13th Month Pay)
1. **13th Month Computation**:
   - Total basic salary paid for the year ÷ 12
   - For new hires: Prorated based on months worked
   - Must be paid by December 24
   
2. **13th Month Tax Treatment**:
   - First ₱90,000 is tax-exempt
   - Excess over ₱90,000 is taxable
   - Add to December payroll or separate payout

3. **Bonus Computation** (if applicable):
   - Christmas bonus, performance bonus
   - Fully taxable (subject to withholding tax)

#### January (Year-End Tax Reconciliation)
1. **Final Tax Computation**:
   - Total gross compensation for the year
   - Total tax withheld for the year
   - Compute actual tax due per BIR tax table
   - Determine under/over-withholding
   
2. **Tax Adjustment**:
   - Under-withheld: Deduct balance from last pay
   - Over-withheld: Refund to employee or carry forward
   
3. **BIR Form 2316 (Annual)**:
   - Generate for EACH employee
   - Includes: Gross income, deductions, tax withheld
   - Provide to employees by January 31
   - Employees use for annual ITR filing
   
4. **BIR Form 1604C (Annual)**:
   - Summary of all compensation payments
   - Total employees, total salaries, total taxes
   - Submit by January 31 of following year
   
5. **BIR Form 1604CF (Annual)**:
   - Certificate for filing of Form 1604C
   - Accompanies Form 1604C
   
6. **BIR Alphalist**:
   - Create DAT file with all employee details
   - Strict BIR format (Schedule 7.1, 7.3, 7.5)
   - Electronic submission via eBIRForms
   - Submit with Form 1604C

#### Annual Compliance Review
1. **SSS Annual Review**: Verify all R3 submissions
2. **PhilHealth Annual Review**: Verify all RF1 submissions
3. **Pag-IBIG Annual Review**: Verify all MCRF submissions
4. **BIR Annual Review**: Verify all 1601C submissions
5. **Audit Trail**: Ensure all documents are archived

---

## Government Contribution Calculations (2024-2025 Rates)

### SSS (Social Security System)

#### SSS Contribution Table
```
Monthly Salary Bracket | Employee | Employer | EC  | Total
₱4,250 - ₱4,749.99    | ₱191.25  | ₱382.50  | ₱10 | ₱583.75
₱4,750 - ₱5,249.99    | ₱213.75  | ₱427.50  | ₱10 | ₱651.25
₱5,250 - ₱5,749.99    | ₱236.25  | ₱472.50  | ₱10 | ₱718.75
₱5,750 - ₱6,249.99    | ₱258.75  | ₱517.50  | ₱10 | ₱786.25
₱6,250 - ₱6,749.99    | ₱281.25  | ₱562.50  | ₱10 | ₱853.75
₱6,750 - ₱7,249.99    | ₱303.75  | ₱607.50  | ₱10 | ₱921.25
₱7,250 - ₱7,749.99    | ₱326.25  | ₱652.50  | ₱10 | ₱988.75
₱7,750 - ₱8,249.99    | ₱348.75  | ₱697.50  | ₱10 | ₱1,056.25
₱8,250 - ₱8,749.99    | ₱371.25  | ₱742.50  | ₱10 | ₱1,123.75
₱8,750 - ₱9,249.99    | ₱393.75  | ₱787.50  | ₱10 | ₱1,191.25
₱9,250 - ₱9,749.99    | ₱416.25  | ₱832.50  | ₱10 | ₱1,258.75
₱9,750 - ₱10,249.99   | ₱438.75  | ₱877.50  | ₱10 | ₱1,326.25
₱10,250 - ₱10,749.99  | ₱461.25  | ₱922.50  | ₱10 | ₱1,393.75
₱10,750 - ₱11,249.99  | ₱483.75  | ₱967.50  | ₱10 | ₱1,461.25
₱11,250 - ₱11,749.99  | ₱506.25  | ₱1,012.50| ₱10 | ₱1,528.75
₱11,750 - ₱12,249.99  | ₱528.75  | ₱1,057.50| ₱10 | ₱1,596.25
₱12,250 - ₱12,749.99  | ₱551.25  | ₱1,102.50| ₱10 | ₱1,663.75
₱12,750 - ₱13,249.99  | ₱573.75  | ₱1,147.50| ₱10 | ₱1,731.25
₱13,250 - ₱13,749.99  | ₱596.25  | ₱1,192.50| ₱10 | ₱1,798.75
₱13,750 - ₱14,249.99  | ₱618.75  | ₱1,237.50| ₱10 | ₱1,866.25
₱14,250 - ₱14,749.99  | ₱641.25  | ₱1,282.50| ₱10 | ₱1,933.75
₱14,750 - ₱15,249.99  | ₱663.75  | ₱1,327.50| ₱10 | ₱2,001.25
₱15,250 - ₱15,749.99  | ₱686.25  | ₱1,372.50| ₱10 | ₱2,068.75
₱15,750 - ₱16,249.99  | ₱708.75  | ₱1,417.50| ₱10 | ₱2,136.25
₱16,250 - ₱16,749.99  | ₱731.25  | ₱1,462.50| ₱10 | ₱2,203.75
₱16,750 - ₱17,249.99  | ₱753.75  | ₱1,507.50| ₱10 | ₱2,271.25
₱17,250 - ₱17,749.99  | ₱776.25  | ₱1,552.50| ₱10 | ₱2,338.75
₱17,750 - ₱18,249.99  | ₱798.75  | ₱1,597.50| ₱10 | ₱2,406.25
₱18,250 - ₱18,749.99  | ₱821.25  | ₱1,642.50| ₱10 | ₱2,473.75
₱18,750 - ₱19,249.99  | ₱843.75  | ₱1,687.50| ₱10 | ₱2,541.25
₱19,250 - ₱19,749.99  | ₱866.25  | ₱1,732.50| ₱10 | ₱2,608.75
₱19,750 - ₱20,249.99  | ₱888.75  | ₱1,777.50| ₱10 | ₱2,676.25
₱20,250 - ₱20,749.99  | ₱911.25  | ₱1,822.50| ₱10 | ₱2,743.75
₱20,750 - ₱21,249.99  | ₱933.75  | ₱1,867.50| ₱10 | ₱2,811.25
₱21,250 - ₱21,749.99  | ₱956.25  | ₱1,912.50| ₱10 | ₱2,878.75
₱21,750 - ₱22,249.99  | ₱978.75  | ₱1,957.50| ₱10 | ₱2,946.25
₱22,250 - ₱22,749.99  | ₱1,001.25| ₱2,002.50| ₱10 | ₱3,013.75
₱22,750 - ₱23,249.99  | ₱1,023.75| ₱2,047.50| ₱10 | ₱3,081.25
₱23,250 - ₱23,749.99  | ₱1,046.25| ₱2,092.50| ₱10 | ₱3,148.75
₱23,750 - ₱24,249.99  | ₱1,068.75| ₱2,137.50| ₱10 | ₱3,216.25
₱24,250 - ₱24,749.99  | ₱1,091.25| ₱2,182.50| ₱10 | ₱3,283.75
₱24,750 and above     | ₱1,125.00| ₱2,250.00| ₱10 | ₱3,385.00
```

**Notes:**
- EC (Employee Compensation) is ₱10 flat, employer share only
- Based on monthly salary credit (MSC)
- Maximum MSC: ₱25,000/month

### PhilHealth (Philippine Health Insurance)

#### PhilHealth Premium Rate: 5% of Monthly Basic Salary
- **Employee Share**: 2.5%
- **Employer Share**: 2.5%
- **Minimum Monthly Premium**: ₱500 (₱250 each)
- **Maximum Monthly Premium**: ₱5,000 (₱2,500 each)
- **Maximum Salary Base**: ₱100,000/month

**Calculation:**
```
Monthly Basic Salary × 5% = Total Premium
Employee pays 50% (2.5%)
Employer pays 50% (2.5%)

Example: ₱30,000 salary
₱30,000 × 5% = ₱1,500
Employee: ₱750
Employer: ₱750
```

### Pag-IBIG (Home Development Mutual Fund)

#### Pag-IBIG Contribution Rates
- **Employee**: 1% or 2% of monthly compensation (employee's choice)
- **Employer**: 2% of monthly compensation
- **Minimum**: ₱24/month (₱12 employee + ₱12 employer)
- **Maximum**: ₱10,000/month (₱5,000 employee + ₱5,000 employer)
- **Maximum Salary Base**: ₱250,000/month for 2% employee rate

**Calculation:**
```
Monthly Compensation × Rate = Contribution

Example: ₱30,000 salary, 2% employee rate
Employee: ₱30,000 × 2% = ₱600
Employer: ₱30,000 × 2% = ₱600
Total: ₱1,200
```

### BIR Withholding Tax

#### Tax Table (Effective 2023 - TRAIN Law)

**For MONTHLY Compensation:**

##### Single/Married but not claiming additional exemption (S/ME)
```
Monthly Income Range          | Base Tax | Rate on Excess
₱0 - ₱20,833                 | ₱0       | 0%
₱20,833 - ₱33,333           | ₱0       | 15%
₱33,333 - ₱66,667           | ₱1,875   | 20%
₱66,667 - ₱166,667          | ₱8,541.80| 25%
₱166,667 - ₱666,667         | ₱33,541.80| 30%
₱666,667 and above           | ₱183,541.80| 35%
```

##### With 1 Dependent (S1/ME1)
```
Monthly Income Range          | Base Tax | Rate on Excess
₱0 - ₱25,000                 | ₱0       | 0%
₱25,000 - ₱35,417           | ₱0       | 15%
₱35,417 - ₱70,833           | ₱1,562.50| 20%
₱70,833 - ₱179,167          | ₱8,645.83| 25%
₱179,167 - ₱687,500         | ₱35,729.17| 30%
₱687,500 and above           | ₱188,229.17| 35%
```

##### With 2 Dependents (S2/ME2)
```
Monthly Income Range          | Base Tax | Rate on Excess
₱0 - ₱29,167                 | ₱0       | 0%
₱29,167 - ₱37,500           | ₱0       | 15%
₱37,500 - ₱75,000           | ₱1,250   | 20%
₱75,000 - ₱191,667          | ₱8,750   | 25%
₱191,667 - ₱708,333         | ₱37,916.67| 30%
₱708,333 and above           | ₱192,916.67| 35%
```

##### With 3 Dependents (S3/ME3)
```
Monthly Income Range          | Base Tax | Rate on Excess
₱0 - ₱33,333                 | ₱0       | 0%
₱33,333 - ₱39,583           | ₱0       | 15%
₱39,583 - ₱79,167           | ₱937.50  | 20%
₱79,167 - ₱204,167          | ₱8,854.17| 25%
₱204,167 - ₱729,167         | ₱40,104.17| 30%
₱729,167 and above           | ₱197,604.17| 35%
```

##### With 4 Dependents (S4/ME4)
```
Monthly Income Range          | Base Tax | Rate on Excess
₱0 - ₱37,500                 | ₱0       | 0%
₱37,500 - ₱41,667           | ₱0       | 15%
₱41,667 - ₱83,333           | ₱625     | 20%
₱83,333 - ₱216,667          | ₱8,958.33| 25%
₱216,667 - ₱750,000         | ₱42,291.67| 30%
₱750,000 and above           | ₱202,291.67| 35%
```

**Special Tax Status:**
- **Z (Zero-rated)**: Minimum wage earners - EXEMPT from withholding tax
- Must be earning minimum wage or below per region
- Still subject to SSS, PhilHealth, Pag-IBIG

#### Tax Calculation Formula
```
1. Compute Taxable Income:
   Gross Pay 
   - Non-taxable allowances (de minimis)
   - SSS contribution
   - PhilHealth contribution
   - Pag-IBIG contribution
   = Taxable Income

2. Find appropriate tax bracket based on tax status

3. Compute Tax:
   Base Tax + (Taxable Income - Excess Over) × Tax Rate
```

#### 13th Month Pay Tax Treatment
- First ₱90,000 per year: TAX-EXEMPT
- Excess over ₱90,000: TAXABLE
- Add taxable portion to regular compensation for withholding

---

## De Minimis Benefits (Tax-Exempt Allowances)

### BIR-Approved De Minimis Benefits and Limits

1. **Rice Allowance**
   - Maximum: ₱2,000/month or ₱24,000/year
   - Can be actual rice or cash equivalent

2. **Uniform and Clothing Allowance**
   - Maximum: ₱6,000/year
   - Actual uniforms or cash allowance

3. **Laundry Allowance**
   - Maximum: ₱300/month or ₱3,600/year
   - For employees required to wear uniforms

4. **Medical Cash Allowance**
   - Maximum: ₱1,500/employee/semester or ₱3,000/year
   - Does not include actual medical assistance

5. **Annual Medical/Physical Examination**
   - Maximum: ₱1,500/employee/year
   - Actual examination cost

6. **Gifts During Christmas and Major Occasions**
   - Maximum: ₱5,000/year total for all gifts
   - Birthday, wedding, etc.

7. **Daily Meal Allowance for Overtime**
   - Maximum: ₱25/meal
   - When OT is at least 2 hours

8. **Benefits to Rank-and-File Employees**
   - Vacation and sick leave credits convertible to cash: Maximum ₱10,000/year
   - Medical assistance up to ₱10,000/year
   - Rice subsidy up to ₱2,000/month or ₱24,000/year
   - Uniform and clothing allowance up to ₱6,000/year
   - Actual medical assistance (hospitalization, medical emergencies)
   - Laundry allowance up to ₱300/month
   - Employee achievement awards (length of service, safety achievement)
   - Gifts of small value during Christmas, birthday, etc. up to ₱5,000/year

**IMPORTANT**: 
- De minimis benefits are tax-exempt ONLY within the limits
- Excess over limits is taxable income
- Must be properly documented and justified

---

## BIR Forms and Government Filing Requirements

### BIR Forms (Bureau of Internal Revenue)

#### 1. BIR Form 1601C - Monthly Remittance Return of Income Taxes Withheld on Compensation
**Filing Frequency**: Monthly  
**Deadline**: Within 10 days after month-end  
**Filing Method**: eFPS (Electronic Filing and Payment System) or eBIRForms  

**Required Information:**
- Employer TIN and details
- Month covered
- Total compensation paid
- Total withholding tax
- Detailed breakdown by tax type
- Payment details

**Submission Process:**
1. Prepare monthly payroll summary
2. Compute total withholding tax for the month
3. File electronically via eFPS/eBIRForms
4. Pay tax due via authorized agent banks or online
5. Print confirmation/reference number
6. Attach payment proof to filed form

#### 2. BIR Form 2316 - Certificate of Compensation Payment/Tax Withheld
**Filing Frequency**: Annual  
**Deadline**: January 31 of following year  
**Distribution**: Must provide to EACH employee  

**Required Information (Per Employee):**
- Employee's TIN, name, address
- Employer's TIN, name, address
- Gross compensation (basic + taxable allowances + bonuses)
- Non-taxable compensation (13th month up to ₱90k, de minimis)
- Taxable 13th month (excess over ₱90k)
- Other benefits (taxable)
- SSS, PhilHealth, Pag-IBIG, union dues
- Net taxable compensation
- Tax withheld
- Tax status and exemptions

**Submission Process:**
1. Generate for each employee after year-end
2. Print 2 copies: 1 for employee, 1 for company records
3. Employee signs acknowledgment of receipt
4. Provide by January 31
5. Employee uses for filing Annual ITR (Form 1700/1701)
6. Compile all 2316s for inclusion in Alphalist

#### 3. BIR Form 1604C - Annual Information Return of Income Taxes Withheld on Compensation
**Filing Frequency**: Annual  
**Deadline**: January 31 of following year  
**Filing Method**: eFPS/eBIRForms  

**Required Information:**
- Summary of all compensation payments for the year
- Total number of employees
- Total gross compensation
- Total withholding tax
- Breakdown by month

**Submission Process:**
1. Consolidate all monthly payroll data for the year
2. Prepare summary totals
3. File electronically with BIR
4. Submit together with BIR Form 1604CF and Alphalist

#### 4. BIR Form 1604CF - Certificate of Compensation Paid/Tax Withheld for Expansion
**Filing Frequency**: Annual  
**Deadline**: January 31 of following year  
**Filing Method**: Accompanies Form 1604C  

**Purpose**: Certificate attesting to the accuracy and completeness of information in Form 1604C

#### 5. BIR Alphalist of Employees (DAT File)
**Filing Frequency**: Annual  
**Deadline**: January 31 of following year  
**Filing Method**: Electronic submission via eBIRForms  
**Format**: Strictly formatted DAT file per BIR specifications  

**Required Information (Per Employee):**
- Schedule 7.1: Compensation Income Tax Return Details
- Schedule 7.3: Taxpayers with Tax Withheld as of December 31
- Schedule 7.5: Summary of Monthly Tax Remittance

**File Structure:**
```
Header Record: Company details
Detail Records: Each employee's annual compensation details
  - TIN
  - Name (Last, First, Middle)
  - RDO Code
  - Gross compensation
  - Premium paid on Health/Hospitalization
  - 13th month pay and other benefits
  - De minimis benefits
  - SSS, PhilHealth, Pag-IBIG, union dues
  - Salaries, wages, allowances
  - 13th month pay (taxable portion)
  - Other benefits (taxable)
  - Taxable compensation income
  - Premium paid on Health/Hospitalization
  - SSS, PhilHealth, Pag-IBIG, union dues
  - Taxable compensation income
  - Tax withheld (per month: Jan-Dec)
Control Record: Total employees, total amounts
```

**Submission Process:**
1. Export payroll data in strict BIR DAT format
2. Validate file using BIR Alphalist Data Entry and Validation Module (ADEVM)
3. Submit electronically via eBIRForms
4. Print validation receipt
5. Submit with Forms 1604C and 1604CF

---

### SSS Forms (Social Security System)

#### 1. SSS Form R3 - Monthly Collection List
**Filing Frequency**: Monthly  
**Deadline**: By the 10th day of the month following the applicable month  
**Filing Method**: Online via SSS R3/eR3 portal or manual submission  

**Required Information:**
- Employer SSS number
- Month and year covered
- For EACH employee:
  - SSS number
  - Full name (Last, First, Middle)
  - Monthly salary credit (MSC)
  - Employee contribution
  - Employer contribution
  - EC (Employee Compensation)
  - Total contribution

**File Format** (Text file for upload):
```
Fixed-width format with specific positions:
Column 1-10: SSS Number
Column 11-40: Employee Name
Column 41-50: MSC (Monthly Salary Credit)
Column 51-58: Employee Share
Column 59-66: Employer Share
Column 67-72: EC
Column 73-80: Total
```

**Submission Process:**
1. Generate R3 file from payroll system
2. Validate file format (must be exact)
3. Upload to SSS R3 portal or eR3 online
4. Generate PRN (Payment Reference Number)
5. Pay contributions via:
   - SSS website (online payment)
   - Authorized payment centers
   - Banks (over-the-counter with PRN)
6. Print confirmation/official receipt
7. Generate and print Transmittal List
8. File documents for records

#### 2. SSS Form R5 - Payment Return/Remittance Form
**Filing Frequency**: Monthly (with payment)  
**Deadline**: With the contribution payment  
**Filing Method**: Manual submission at banks/payment centers  

**When to Use**: For over-the-counter payments at banks

**Required Information:**
- Employer SSS number and name
- Month covered
- Total number of employees
- Total employee contributions
- Total employer contributions
- Total EC contributions
- Grand total

#### 3. SSS Transmittal List
**Filing Frequency**: Monthly  
**Purpose**: Summary sheet for R3 submissions  

**Contains**:
- List of all employees
- Summary totals
- Certification by employer
- Date and signature

---

### PhilHealth Forms

#### 1. PhilHealth RF1 - Monthly Remittance Form
**Filing Frequency**: Monthly  
**Deadline**: By the 10th day of the month following the applicable month  
**Filing Method**: Online via PhilHealth EPRS (Employer Portal Reporting System)  

**Required Information:**
- Employer PhilHealth number
- Month and year covered
- For EACH employee:
  - PhilHealth number
  - Full name
  - Monthly basic salary
  - Employee premium (2.5%)
  - Employer premium (2.5%)
  - Total premium

**File Format**: Excel file or text file per PhilHealth specifications

**Submission Process:**
1. Generate RF1 file from payroll system
2. Log in to PhilHealth EPRS portal
3. Upload RF1 file
4. System validates file
5. Generate PRN (Payment Reference Number)
6. Pay premium via:
   - PhilHealth website
   - Authorized collecting agents
   - Banks with PRN
7. Upload proof of payment to EPRS
8. Print confirmation and transmittal
9. File for records

#### 2. PhilHealth Transmittal List
**Filing Frequency**: Monthly  
**Purpose**: Summary sheet for RF1 submissions  

**Contains**:
- Total number of members
- Total premium (employee + employer)
- Certification
- Employer details

---

### Pag-IBIG Forms

#### 1. Pag-IBIG MCRF - Monthly Contribution Remittance Form
**Filing Frequency**: Monthly  
**Deadline**: By the 10th day of the month following the applicable month  
**Filing Method**: Online via Pag-IBIG eSRS (Electronic Submission and Reporting System)  

**Required Information:**
- Employer Pag-IBIG number
- Month and year covered
- For EACH employee:
  - Pag-IBIG MID number
  - Full name
  - Monthly compensation
  - Employee contribution (1% or 2%)
  - Employer contribution (2%)
  - Total contribution

**File Format**: Excel file per Pag-IBIG specifications

**Submission Process:**
1. Generate MCRF file from payroll system
2. Log in to Pag-IBIG eSRS portal
3. Upload MCRF file
4. System validates file
5. Generate PRN (Payment Reference Number)
6. Pay contributions via:
   - Pag-IBIG website
   - Authorized collecting agents
   - Banks with PRN
7. Upload proof of payment to eSRS
8. Print confirmation and transmittal
9. File for records

#### 2. Pag-IBIG Transmittal List
**Filing Frequency**: Monthly  
**Purpose**: Summary sheet for MCRF submissions  

**Contains**:
- Total number of members
- Total contributions (employee + employer)
- Certification
- Employer details

---

## Bank Payroll Files

### Bank ATM Payroll File Generation

Different banks have different file format requirements. Below are the common formats:

#### 1. BPI (Bank of the Philippine Islands) Format
**File Type**: Text file (TXT)  
**Format**: Fixed-width or CSV  

**Fields Required**:
```
Account Number (16 digits)
Employee Name (40 characters)
Amount (12 digits, 2 decimals)
Transaction Code (usually "PAYROLL")
Reference Number
```

#### 2. BDO (Banco de Oro) Format
**File Type**: Excel or CSV  

**Columns**:
```
Column A: Account Number
Column B: Account Name
Column C: Amount
Column D: Particulars/Reference
```

#### 3. Metrobank Format
**File Type**: Excel or Fixed-width text  

**Fields**:
```
Sequence Number
Account Number
Account Name
Amount
Debit Account (company account)
```

#### 4. Security Bank Format
**File Type**: CSV  

**Format**: Similar to BDO with specific validation rules

**General Submission Process**:
1. Generate bank file from payroll system
2. Validate file format and totals
3. Submit file to bank:
   - Upload via bank's corporate internet banking portal
   - Or email to designated payroll officer
   - Or submit via USB/CD at branch
4. Bank processes file (usually same day or next banking day)
5. Receive confirmation of successful crediting
6. Handle any failed/bounced transactions
7. File bank confirmation for audit trail

---

## Payslip Requirements (DOLE Compliance)

### Payslip Format (per DOLE Labor Advisory No. 06, Series of 2020)

**Minimum Required Information**:

1. **Employer Information**
   - Company name and address
   - Employer identification numbers

2. **Employee Information**
   - Employee name and ID number
   - Position/designation
   - Department

3. **Pay Period Information**
   - Period covered (start and end dates)
   - Pay date
   - Cutoff date

4. **Earnings (Detailed Breakdown)**
   - Basic salary/wage
   - Overtime pay (by type: regular, restday, holiday)
   - Night differential
   - Holiday pay
   - Leave with pay
   - Allowances (itemized)
   - Bonuses and incentives
   - 13th month pay (when applicable)
   - Other earnings
   - **GROSS PAY**

5. **Deductions (Itemized)**
   - SSS contribution
   - PhilHealth contribution
   - Pag-IBIG contribution
   - Withholding tax
   - Tardiness/absence deductions
   - Loans (SSS, Pag-IBIG, company)
   - Cash advances
   - Other deductions
   - **TOTAL DEDUCTIONS**

6. **Net Pay**
   - Gross pay minus total deductions

7. **Year-to-Date Summary**
   - YTD gross income
   - YTD tax withheld
   - YTD SSS contributions
   - YTD PhilHealth contributions
   - YTD Pag-IBIG contributions

8. **Government Numbers**
   - TIN
   - SSS number
   - PhilHealth number
   - Pag-IBIG number

### Sample Payslip Layout

```
═══════════════════════════════════════════════════════════════════
                    CATHAY METAL CORPORATION
              [Address], [City], [Province] [Zip Code]
                    TIN: [Company TIN]
═══════════════════════════════════════════════════════════════════

                          PAYSLIP
                   
Employee Name    : [LAST NAME, FIRST NAME MIDDLE INITIAL]
Employee Number  : [EMP-0000]
Position         : [Job Title]
Department       : [Department Name]

TIN              : [000-000-000-000]
SSS No.          : [00-0000000-0]
PhilHealth No.   : [00-000000000-0]
Pag-IBIG No.     : [0000-0000-0000]

Pay Period       : [Start Date] to [End Date]
Pay Date         : [Payment Date]
───────────────────────────────────────────────────────────────────

EARNINGS                                              AMOUNT
───────────────────────────────────────────────────────────────────
Basic Salary                                        ₱ 25,000.00
Overtime Pay - Regular (20.5 hrs @ ₱179.69)         ₱  3,683.65
Night Differential (15 hrs @ ₱17.97)                 ₱    269.55
Holiday Pay - Regular (16 hrs @ ₱287.50)            ₱  4,600.00
Rice Allowance                                       ₱  2,000.00
COLA (Cost of Living Allowance)                      ₱  1,500.00
Transportation Allowance                             ₱  1,000.00
                                                    ───────────────
GROSS PAY                                           ₱ 38,053.20
                                                    ═══════════════

DEDUCTIONS                                            AMOUNT
───────────────────────────────────────────────────────────────────
SSS Contribution                                     ₱    956.25
PhilHealth Contribution                              ₱    950.00
Pag-IBIG Contribution                                ₱    500.00
Withholding Tax                                      ₱  4,250.50
                                                    ───────────────
Tardiness (2.5 hrs)                                  ₱    359.38
Absence (1 day)                                      ₱  1,436.50
SSS Loan                                             ₱  1,200.00
Company Loan                                         ₱  2,000.00
Cash Advance                                         ₱    500.00
                                                    ───────────────
TOTAL DEDUCTIONS                                    ₱ 12,152.63
                                                    ═══════════════

NET PAY                                             ₱ 25,900.57
                                                    ═══════════════

YEAR-TO-DATE SUMMARY (As of [Date])
───────────────────────────────────────────────────────────────────
YTD Gross Income                                   ₱ 380,532.00
YTD Tax Withheld                                   ₱  42,505.00
YTD SSS Contributions                              ₱   9,562.50
YTD PhilHealth Contributions                       ₱   9,500.00
YTD Pag-IBIG Contributions                         ₱   5,000.00
YTD 13th Month Pay                                 ₱  31,711.00
YTD Net Pay                                        ₱ 259,005.70

───────────────────────────────────────────────────────────────────
This payslip is computer-generated and does not require signature.

For inquiries, please contact HR Department.
Email: hr@cathaymetal.com | Tel: (000) 000-0000

═══════════════════════════════════════════════════════════════════
```

---

## Overtime Pay Calculations

### Overtime Multipliers (Philippine Labor Code)

#### 1. Regular Overtime (Beyond 8 hours)
- **Rate**: 125% (1.25x) of hourly rate
- **Applies to**: Work beyond 8 hours on regular workday

#### 2. Restday/Special Holiday Overtime
- **Restday work (not exceeding 8 hours)**: 130% (1.30x)
- **Restday overtime (beyond 8 hours)**: 169% (1.69x)
  - Calculation: 130% × 130% = 169%
- **Special holiday work**: 130% (1.30x)
- **Special holiday overtime**: 169% (1.69x)

#### 3. Regular Holiday Overtime
- **Regular holiday work (not exceeding 8 hours)**: 200% (2.00x)
- **Regular holiday overtime (beyond 8 hours)**: 260% (2.60x)
  - Calculation: 200% × 130% = 260%

#### 4. Night Differential
- **Rate**: Additional 10% of hourly rate
- **Time**: 10:00 PM to 6:00 AM
- **Applies to**: All work during night shift hours
- **Can combine with**: Overtime rates

**Example Combinations**:
```
Regular OT + Night Diff = 125% + 10% = 135% (1.35x)
Restday OT + Night Diff = 169% + 10% = 179% (1.79x)
Holiday OT + Night Diff = 260% + 10% = 270% (2.70x)
```

### Sample Overtime Calculations

**Given**:
- Monthly Salary: ₱25,000
- Daily Rate: ₱25,000 ÷ 30 = ₱833.33
- Hourly Rate: ₱833.33 ÷ 8 = ₱104.17

**Scenario 1: Regular Overtime (2 hours)**
```
₱104.17 × 1.25 × 2 hours = ₱260.43
```

**Scenario 2: Restday Work (8 hours) + Overtime (2 hours)**
```
Restday: ₱104.17 × 1.30 × 8 = ₱1,083.36
Restday OT: ₱104.17 × 1.69 × 2 = ₱352.09
Total: ₱1,435.45
```

**Scenario 3: Regular Holiday Work (8 hours) + Night Diff (4 hours)**
```
Holiday: ₱104.17 × 2.00 × 8 = ₱1,666.72
Night Diff: ₱104.17 × 0.10 × 4 = ₱41.67
Total: ₱1,708.39
```

**Scenario 4: Holiday Overtime (2 hours) + Night Diff**
```
Holiday OT with Night Diff: ₱104.17 × 2.70 × 2 = ₱562.52
```

---

## Leave Calculations

### Leave Types (Philippine Labor Code)

#### 1. Service Incentive Leave (SIL)
- **Minimum**: 5 days per year (for employees with 1+ year service)
- **Accumulation**: Can be carried over or converted to cash
- **Monetization**: Unused SIL can be converted to cash (de minimis up to ₱10,000/year for rank-and-file)

#### 2. Vacation Leave (Company Policy)
- Not mandated by law for private sector
- Typically: 10-15 days per year
- Can be cumulative or expiring per company policy

#### 3. Sick Leave (Company Policy)
- Not mandated by law for private sector
- Typically: 10-15 days per year
- Usually requires medical certificate for 3+ consecutive days

#### 4. Maternity Leave (Per Law)
- **Duration**: 105 days (extendable by 30 days)
- **For solo mothers**: 120 days
- **Paid by**: 100% of average daily salary credit
- **Reimbursement**: Employer advances, then claims from SSS

#### 5. Paternity Leave (Per Law)
- **Duration**: 7 days
- **Paid by**: Employer (100% of salary)

#### 6. Parental Leave for Solo Parents
- **Duration**: 7 days per year
- **Paid by**: Employer

#### 7. Special Leave for Women (Gynecological Surgery)
- **Duration**: 2 months
- **Paid by**: SSS (sickness benefit)

#### 8. VAWC Leave (Violence Against Women and Children)
- **Duration**: 10 days per year
- **Paid by**: Employer

### Leave Computation

**Leave with Pay Calculation**:
```
Daily Rate × Number of Leave Days = Leave Pay

Example:
Monthly Salary: ₱25,000
Daily Rate: ₱25,000 ÷ 30 = ₱833.33
Leave Days: 3 days
Leave Pay: ₱833.33 × 3 = ₱2,500.00
```

**Leave without Pay**:
```
Deduction = Daily Rate × Absent Days

Example:
Absent: 2 days
Deduction: ₱833.33 × 2 = ₱1,666.67
```

---

## 13th Month Pay Calculation

### Requirements (Per Presidential Decree 851)
- **Entitled**: All rank-and-file employees who worked at least 1 month
- **Amount**: 1/12 of total basic salary earned within the calendar year
- **Deadline**: On or before December 24
- **Tax Treatment**: First ₱90,000 is tax-exempt, excess is taxable

### Calculation Formula

**Formula**:
```
13th Month Pay = Total Basic Salary for the Year ÷ 12
```

**What's Included in "Basic Salary"**:
- Monthly basic pay
- Does NOT include: overtime, night diff, holiday pay, allowances, bonuses

### Examples

**Example 1: Full Year Employee**
```
Monthly Basic Salary: ₱25,000
Months Worked: 12 months
Total Basic Salary: ₱25,000 × 12 = ₱300,000
13th Month Pay: ₱300,000 ÷ 12 = ₱25,000
```

**Example 2: New Hire (Prorated)**
```
Monthly Basic Salary: ₱30,000
Start Date: April 1
Months Worked: 9 months (April to December)
Total Basic Salary: ₱30,000 × 9 = ₱270,000
13th Month Pay: ₱270,000 ÷ 12 = ₱22,500
```

**Example 3: With Salary Increase**
```
Jan-June: ₱20,000/month = ₱120,000
July-Dec: ₱25,000/month = ₱150,000
Total Basic Salary: ₱270,000
13th Month Pay: ₱270,000 ÷ 12 = ₱22,500
```

**Example 4: Resigned Employee**
```
Monthly Basic Salary: ₱28,000
Worked: January to August (8 months)
Total Basic Salary: ₱28,000 × 8 = ₱224,000
13th Month Pay: ₱224,000 ÷ 12 = ₱18,666.67
(Paid on final pay)
```

### Tax Treatment on 13th Month Pay

**Tax-Exempt Portion**: ₱90,000 per year
**Taxable Portion**: Any amount exceeding ₱90,000

**Example**:
```
13th Month Pay: ₱100,000
Tax-Exempt: ₱90,000
Taxable: ₱100,000 - ₱90,000 = ₱10,000

The ₱10,000 is added to regular compensation for tax withholding
```

---

## Final Pay / Separation Pay Calculation

### Components of Final Pay

#### 1. Last Salary
- Prorated salary up to last working day
- Unpaid overtime, night diff, holiday pay

#### 2. Unused Leave Credits
- Accumulated vacation leave
- Accumulated sick leave (if convertible)
- Service Incentive Leave (SIL)

#### 3. Prorated 13th Month Pay
- Total basic salary earned in the year ÷ 12

#### 4. Separation Pay (if applicable)
**When Required**:
- Authorized causes (redundancy, retrenchment, closure, disease)
- Illegal dismissal (if ordered by NLRC)

**Computation**:
- **Redundancy/Retrenchment/Closure**: 1 month pay per year of service (or ½ month per year, whichever is higher)
- **Disease**: 1 month pay or ½ month per year of service (whichever is greater)

#### 5. Other Benefits (if applicable)
- Retirement pay (if applicable)
- Company-specific benefits
- Tax refund (if over-withheld)

### Less: Final Deductions

#### 1. Government Deductions (Last Month)
- SSS contribution
- PhilHealth contribution
- Pag-IBIG contribution
- Withholding tax

#### 2. Unpaid Loans
- SSS loan balance
- Pag-IBIG loan balance
- Company loan balance
- Cash advances

#### 3. Accountabilities
- Unreturned company property
- Uniform charges
- Cash shortages
- Other liabilities

### Final Pay Example

**Given**:
- Last Working Day: October 15, 2025
- Monthly Salary: ₱30,000
- Service Period: 3 years and 6 months
- Unused VL: 10 days
- Unused SL: 5 days
- SSS Loan: ₱15,000
- Company Loan: ₱5,000

**Calculation**:
```
1. Prorated Salary (Oct 1-15)
   ₱30,000 ÷ 30 × 15 days = ₱15,000

2. Unused Vacation Leave
   (₱30,000 ÷ 30) × 10 days = ₱10,000

3. Unused Sick Leave (if convertible)
   (₱30,000 ÷ 30) × 5 days = ₱5,000

4. Prorated 13th Month Pay
   (₱30,000 × 10 months) ÷ 12 = ₱25,000

5. Separation Pay (Redundancy, 1 month per year)
   ₱30,000 × 3.5 years = ₱105,000

TOTAL GROSS FINAL PAY: ₱160,000

LESS: Deductions
SSS Contribution (Oct): ₱1,125
PhilHealth (Oct): ₱750
Pag-IBIG (Oct): ₱600
Withholding Tax: (computed based on annualized income)
SSS Loan Balance: ₱15,000
Company Loan: ₱5,000

TOTAL DEDUCTIONS: ₱22,475 (assuming ₱0 tax due)

NET FINAL PAY: ₱137,525
```

---

## Implementation Phases (Detailed)

### Phase 1: Foundation Setup (Week 1)

**Day 1-2: Database Setup**
- [ ] Create all payroll tables via migrations
- [ ] Set up proper indexes for performance
- [ ] Configure foreign key relationships
- [ ] Set up soft deletes where applicable

**Day 3-4: Government Rate Configuration**
- [ ] Seed SSS contribution table (all brackets)
- [ ] Seed PhilHealth rate configuration
- [ ] Seed Pag-IBIG rate configuration
- [ ] Seed BIR tax brackets (all tax statuses: Z, S, ME, S1-S4, ME1-ME4)

**Day 5: Salary Components Setup**
- [ ] Create standard salary components:
  - BASIC (Basic Salary)
  - OT_REG (Regular Overtime 1.25x)
  - OT_RESTDAY (Restday Overtime 1.69x)
  - OT_HOLIDAY (Holiday Overtime 2.60x)
  - ND (Night Differential)
  - HOLIDAY_PAY (Holiday Pay)
  - LEAVE_PAY (Leave with Pay)
  - RICE (Rice Allowance)
  - COLA (Cost of Living Allowance)
  - TRANS (Transportation Allowance)
  - MEAL (Meal Allowance)
  - 13TH_MONTH (13th Month Pay)
  - SSS_EE (SSS Employee)
  - PHILHEALTH_EE (PhilHealth Employee)
  - PAGIBIG_EE (Pag-IBIG Employee)
  - WTAX (Withholding Tax)
  - TARDINESS (Tardiness Deduction)
  - ABSENCE (Absence Deduction)
  - SSS_LOAN (SSS Loan)
  - PAGIBIG_LOAN (Pag-IBIG Loan)
  - COMPANY_LOAN (Company Loan)
  - CASH_ADVANCE (Cash Advance)

### Phase 2: Calculation Engine (Week 2-3)

**Day 6-8: Core Calculation Services**
- [ ] PayrollCalculationService class
- [ ] Basic pay calculation (monthly/daily/hourly)
- [ ] Prorated salary computation
- [ ] Overtime calculations (all types)
- [ ] Night differential calculation
- [ ] Holiday pay calculation
- [ ] Leave pay calculation

**Day 9-11: Government Contribution Calculations**
- [ ] SSS contribution calculator (lookup table method)
- [ ] SSS EC computation
- [ ] PhilHealth calculator (5% with min/max)
- [ ] Pag-IBIG calculator (1%/2% with caps)

**Day 12-14: Tax Calculation Engine**
- [ ] BIR withholding tax calculator
- [ ] Tax bracket lookup by status
- [ ] Annualized tax computation
- [ ] 13th month tax treatment
- [ ] De minimis benefits handler
- [ ] YTD tax reconciliation

**Day 15: Deductions Engine**
- [ ] Tardiness/absence deduction calculator
- [ ] Loan amortization processor
- [ ] Other deductions handler

### Phase 3: Repository & Service Layer (Week 3-4)

**Day 16-17: Repository Pattern**
- [ ] PayrollPeriodRepository
- [ ] PayrollCalculationRepository
- [ ] EmployeePayrollInfoRepository
- [ ] SalaryComponentRepository
- [ ] GovernmentRateRepository
- [ ] TaxBracketRepository
- [ ] LoanRepository

**Day 18-19: Service Classes**
- [ ] PayrollProcessingService (orchestrates workflow)
- [ ] EmployeePayrollService (employee setup)
- [ ] GovernmentReportingService (report generation)
- [ ] PayslipGenerationService (PDF creation)
- [ ] BankFileGenerationService (bank files)

**Day 20-21: Transaction Management**
- [ ] Implement database transactions for payroll runs
- [ ] Add rollback capabilities
- [ ] Implement audit logging
- [ ] Add error handling and recovery

### Phase 4: Payroll Processing Workflow (Week 4-5)

**Day 22-24: Payroll Period Management**
- [ ] Create payroll period interface
- [ ] Period status workflow (draft → calculating → calculated → approved → paid → closed)
- [ ] Attendance import from Timekeeping module
- [ ] Data validation and exception handling

**Day 25-27: Batch Calculation Processing**
- [ ] Batch employee calculation (Laravel queues)
- [ ] Progress tracking
- [ ] Exception handling for individual employees
- [ ] Recalculation mechanism
- [ ] Manual adjustment interface

**Day 28-29: Approval Workflow**
- [ ] Multi-level approval system
- [ ] Email notifications for approvers
- [ ] Approval history tracking
- [ ] Rejection and revision handling

**Day 30-31: Finalization and Locking**
- [ ] Payroll finalization process
- [ ] YTD update mechanism
- [ ] Audit trail generation
- [ ] Period locking (prevent changes)

### Phase 5: Document Generation (Week 5-6)

**Day 32-34: Payslip PDF Generation**
- [ ] Create DOLE-compliant payslip template (Laravel DomPDF/Snappy)
- [ ] Dynamic data binding
- [ ] Bulk payslip generation (queue processing)
- [ ] PDF watermarking (optional)
- [ ] PDF encryption (optional)

**Day 35-37: Government Report Generators**
- [ ] BIR Form 1601C generator (monthly)
- [ ] BIR Form 2316 generator (annual, per employee)
- [ ] BIR Form 1604C generator (annual summary)
- [ ] BIR Alphalist DAT file generator (strict format)
- [ ] SSS R3 file generator (fixed-width text)
- [ ] PhilHealth RF1 generator (Excel/CSV)
- [ ] Pag-IBIG MCRF generator (Excel/CSV)

**Day 38-39: Bank File Generators**
- [ ] BPI format generator
- [ ] BDO format generator
- [ ] Metrobank format generator
- [ ] Security Bank format generator
- [ ] Generic/configurable bank format

**Day 40-41: Distribution System**
- [ ] Email service for payslip distribution
- [ ] Employee portal payslip access
- [ ] Download tracking
- [ ] Acknowledgment system

**Day 42: Document Management**
- [ ] Secure file storage
- [ ] File archiving system
- [ ] Document retention policy (10 years)
- [ ] Document search and retrieval

### Phase 6: Controller & Frontend (Week 6-7)

**Day 43-45: Controller Layer**
- [ ] PayrollPeriodController (CRUD)
- [ ] PayrollCalculationController
- [ ] EmployeePayrollInfoController
- [ ] GovernmentReportController
- [ ] PayslipController
- [ ] BankFileController
- [ ] API endpoints with proper validation

**Day 46-49: Frontend Interface (Inertia.js + Vue/React)**
- [ ] Payroll dashboard (KPI cards, charts)
- [ ] Payroll period management UI
- [ ] Payroll calculation review interface
- [ ] Employee payroll setup forms
- [ ] Payroll adjustment interface
- [ ] Approval workflow UI
- [ ] Report generation interface
- [ ] Payslip distribution interface

**Day 50-52: Employee Self-Service Portal**
- [ ] Employee login
- [ ] Payslip viewing/download
- [ ] YTD summary view
- [ ] Tax certificate download (BIR 2316)
- [ ] Loan balance inquiry

### Phase 7: Integration & Testing (Week 7-8)

**Day 53-54: Module Integration**
- [ ] HR module integration (employee data sync)
- [ ] Timekeeping module integration (attendance import)
- [ ] Finance module integration (journal entries)

**Day 55-57: Testing**
- [ ] Unit tests (calculation accuracy)
- [ ] Integration tests (workflow)
- [ ] Government calculation tests (SSS, PhilHealth, Pag-IBIG, BIR)
- [ ] Sample employee payroll run (multiple scenarios)
- [ ] Performance testing (1000+ employees)

**Day 58-59: Security & Compliance Testing**
- [ ] Penetration testing
- [ ] Data encryption verification
- [ ] Access control testing
- [ ] Audit trail verification

**Day 60-61: Documentation**
- [ ] User manual (HR/Payroll staff)
- [ ] Administrator guide
- [ ] Employee self-service guide
- [ ] Technical documentation
- [ ] API documentation

**Day 62: Production Deployment**
- [ ] Final code review
- [ ] Deployment plan creation
- [ ] Production environment setup
- [ ] Data migration strategy
- [ ] Go-live checklist