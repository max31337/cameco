/**
 * BIR (Bureau of Internal Revenue) Reporting Page Types
 * Philippine Government Tax Compliance and Reporting
 */

// ============================================================================
// BIR PAGE PROPS & MAIN INTERFACES
// ============================================================================

/**
 * Main BIR Reports Page Props
 * Passed from BIRController@index() via Inertia
 */
export interface BIRPageProps {
    reports: BIRReport[];
    periods: BIRPeriod[];
    summary: BIRSummary;
    generated_reports: GeneratedBIRReport[];
}

/**
 * BIR Report Period Selection
 */
export interface BIRPeriod {
    id: string | number;
    name: string;
    start_date: string; // YYYY-MM-DD
    end_date: string; // YYYY-MM-DD
    status: 'draft' | 'ready' | 'generated' | 'submitted' | 'approved';
}

/**
 * BIR Summary Metrics
 */
export interface BIRSummary {
    total_employees: number;
    total_gross_compensation: number;
    total_withholding_tax: number;
    reports_generated_count: number;
    reports_submitted_count: number;
    last_submission_date: string | null;
    next_deadline: string;
}

/**
 * BIR Report Record
 */
export interface BIRReport {
    id: string | number;
    type: '1601C' | '2316' | '1604C' | '1604CF' | 'Alphalist' | 'BIR1601E';
    period_id: string | number;
    period_name: string;
    status: 'draft' | 'ready' | 'generated' | 'submitted' | 'approved' | 'rejected';
    generated_at: string | null;
    submitted_at: string | null;
    file_name: string | null;
    file_size: number | null;
    employee_count: number;
    total_amount: number;
    created_at: string;
    updated_at: string;
}

/**
 * Generated BIR Report (actual files)
 */
export interface GeneratedBIRReport {
    id: string | number;
    report_type: '1601C' | '2316' | '1604C' | '1604CF' | 'Alphalist' | 'BIR1601E';
    period: string;
    file_name: string;
    file_path: string;
    file_size: number;
    generated_at: string;
    submitted: boolean;
    submission_status: 'pending' | 'submitted' | 'accepted' | 'rejected';
    rejection_reason: string | null;
}

// ============================================================================
// 1601C: MONTHLY REMITTANCE FORM
// ============================================================================

/**
 * BIR 1601C - Monthly Remittance of Income Tax Withheld
 * For withholding agents (employers) remitting employee income tax
 */
export interface BIR1601CFormData {
    reporting_month: string; // YYYY-MM
    reporting_period_start: string; // YYYY-MM-DD
    reporting_period_end: string; // YYYY-MM-DD
    rdo_code: string; // Revenue District Office code
    tin: string; // Tax Identification Number of withholding agent
    company_name: string;
    company_address: string;
}

export interface BIR1601CSummary {
    period: string;
    total_compensation: number;
    total_withholding_tax: number;
    employee_count: number;
    rdo_code: string;
    submission_status: 'pending' | 'submitted' | 'approved';
}

export interface BIR1601CEmployee {
    employee_id: string;
    tin: string;
    employee_name: string;
    gross_compensation: number;
    withholding_tax: number;
}

export interface BIR1601CPageProps {
    period: BIRPeriod;
    form_data: BIR1601CFormData;
    summary: BIR1601CSummary;
    employees: BIR1601CEmployee[];
    can_generate: boolean;
    can_submit: boolean;
}

// ============================================================================
// 2316: ANNUAL CERTIFICATE (Per Employee)
// ============================================================================

/**
 * BIR 2316 - Certificate of Compensation Income Withheld on Wages
 * Annual certificate issued to each employee
 */
export interface BIR2316Certificate {
    id: string | number;
    employee_id: string;
    tin: string;
    employee_name: string;
    employee_address: string;
    employer_tin: string;
    employer_name: string;
    tax_year: number;
    gross_compensation: number;
    non_taxable_compensation: number; // e.g., 13th month, bonus, COLA up to limits
    taxable_compensation: number;
    tax_withheld: number;
    deductions_from_compensation: number;
    net_compensation: number;
    generated_at: string | null;
    issued_at: string | null;
}

export interface BIR2316Summary {
    tax_year: number;
    total_certificates_generated: number;
    total_gross_compensation: number;
    total_taxable_compensation: number;
    total_tax_withheld: number;
    generation_status: 'pending' | 'in_progress' | 'completed' | 'submitted';
}

export interface BIR2316PageProps {
    period: BIRPeriod;
    summary: BIR2316Summary;
    certificates: BIR2316Certificate[];
    can_generate: boolean;
}

// ============================================================================
// ALPHALIST: EMPLOYEE LISTING (DAT Format)
// ============================================================================

/**
 * BIR Alphalist - DAT file format for employee listing
 * Contains employee TIN, annual gross, and annual tax withheld
 */
export interface AlphalistEmployee {
    sequence_number: number;
    tin: string;
    employee_name: string;
    address: string;
    birth_date: string;
    gender: 'M' | 'F';
    civil_status: string;
    annual_gross_compensation: number;
    annual_non_taxable_compensation: number;
    annual_taxable_compensation: number;
    annual_tax_withheld: number;
    status_flag: string; // Resigned, Transferred, etc.
}

export interface AlphalistSummary {
    tax_year: number;
    reporting_date: string;
    total_employees: number;
    total_gross_compensation: number;
    total_taxable_compensation: number;
    total_tax_withheld: number;
    validation_status: 'valid' | 'invalid' | 'pending';
    validation_errors: string[];
}

export interface AlphalistPageProps {
    period: BIRPeriod;
    summary: AlphalistSummary;
    employees: AlphalistEmployee[];
    can_generate: boolean;
    can_validate: boolean;
}

// ============================================================================
// 1604C & 1604CF: CERTIFICATE OF TAX WITHHELD
// ============================================================================

/**
 * BIR 1604C - Certificate of Tax Withheld at Source (individual transactions)
 * BIR 1604CF - Certificate of Tax Withheld at Source (final)
 */
export interface BIR1604CRecord {
    id: string | number;
    payee_tin: string;
    payee_name: string;
    income_type: string; // Professional fees, royalties, prizes, etc.
    gross_amount: number;
    tax_rate: number;
    tax_withheld: number;
    net_amount: number;
    payment_date: string;
}

export interface BIR1604CSummary {
    period: string;
    total_transactions: number;
    total_gross_amount: number;
    total_tax_withheld: number;
    income_type_breakdown: Record<string, number>;
}

export interface BIR1604CPageProps {
    period: BIRPeriod;
    summary: BIR1604CSummary;
    records: BIR1604CRecord[];
    can_generate: boolean;
}

// ============================================================================
// FORM GENERATION & SUBMISSION
// ============================================================================

/**
 * Generic BIR Report Generation Request
 */
export interface GenerateBIRReportRequest {
    report_type: '1601C' | '2316' | '1604C' | '1604CF' | 'Alphalist' | 'BIR1601E';
    period_id: string | number;
    options?: {
        include_rejected?: boolean;
        include_employees?: string[]; // Specific employees only
        format?: 'pdf' | 'dat' | 'xls' | 'json';
    };
}

/**
 * BIR Report Submission Status
 */
export interface BIRSubmission {
    id: string | number;
    report_id: string | number;
    report_type: string;
    submitted_at: string;
    submission_reference: string;
    status: 'pending' | 'received' | 'processing' | 'accepted' | 'rejected';
    rejection_reason: string | null;
    acceptance_date: string | null;
    acceptance_reference: string | null;
}

/**
 * BIR Submission Tracking
 */
export interface BIRSubmissionTracker {
    total_submissions: number;
    pending_submissions: number;
    accepted_submissions: number;
    rejected_submissions: number;
    last_submission: BIRSubmission | null;
}
