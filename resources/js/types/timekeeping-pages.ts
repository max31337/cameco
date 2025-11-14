/**
 * Timekeeping Module Page Props and Interfaces
 * 
 * This file contains TypeScript interfaces for all Timekeeping module pages,
 * ensuring type-safe props when rendering Inertia pages from Laravel controllers.
 */

import { CommonFilters } from './hr-pages';

// ============================================================================
// SUPPORTING TYPES
// ============================================================================

/**
 * Attendance data source types
 * Primary: edge_machine (RFID card taps)
 * Secondary: manual (HR staff entry for exceptions)
 * Tertiary: imported (bulk CSV/Excel import)
 */
export type AttendanceSource = 'edge_machine' | 'manual' | 'imported';

/**
 * Attendance event types for time tracking
 */
export type EventType = 
    | 'time_in' 
    | 'time_out' 
    | 'break_start' 
    | 'break_end' 
    | 'overtime_start' 
    | 'overtime_end';

/**
 * Attendance status classifications
 */
export type AttendanceStatus = 
    | 'present'      // On time and present
    | 'late'         // Arrived after scheduled time
    | 'absent'       // No attendance record
    | 'on_leave'     // Approved leave
    | 'undertime'    // Left before scheduled time
    | 'overtime';    // Worked beyond scheduled hours

/**
 * Overtime request status workflow
 * Note: HR Manager creates overtime records directly (no approval workflow needed)
 */
export type OvertimeStatus = 
    | 'planned'      // Scheduled overtime
    | 'in_progress'  // Currently in overtime shift
    | 'completed'    // Overtime finished
    | 'cancelled';   // Overtime cancelled

/**
 * Import batch processing status
 */
export type ImportStatus = 
    | 'pending'      // File uploaded, awaiting processing
    | 'processing'   // Currently validating and importing
    | 'completed'    // Successfully imported all records
    | 'failed'       // Import failed completely
    | 'partial';     // Some records imported, some failed

/**
 * Correction status for attendance corrections
 * Note: HR Manager makes direct corrections (no approval needed)
 */
export type CorrectionStatus = 
    | 'applied'      // Correction applied successfully
    | 'reverted';    // Correction was reverted

/**
 * Edge machine device status
 */
export type EdgeDeviceStatus = 'online' | 'offline' | 'maintenance';

// ============================================================================
// CORE ENTITY INTERFACES
// ============================================================================

/**
 * Employee basic information
 * Used throughout timekeeping module for employee references
 */
export interface EmployeeBasic {
    id: number;
    name: string;
    employee_number: string;
    department_id: number;
    department_name: string;
    position?: string;
    schedule_id?: number;
    schedule_name?: string;
}

/**
 * RFID Edge Machine Device
 * Physical devices where employees tap their ID cards
 */
export interface EdgeMachineDevice {
    id: string;              // Device identifier (e.g., DEVICE-001)
    name: string;            // Human-readable name
    location: string;        // Physical location description
    status: EdgeDeviceStatus;
    last_sync?: string | null;  // Last sync timestamp
    total_taps_today?: number;  // Count of taps today
}

/**
 * Attendance Event
 * Individual time tracking events (tap-in, tap-out, etc.)
 */
export interface AttendanceEvent {
    id: number;
    attendance_record_id: number;
    event_type: EventType;
    timestamp: string;           // YYYY-MM-DD HH:MM:SS
    source: AttendanceSource;
    device_id?: string | null;   // For edge_machine source
    device_location?: string | null;
    manual_entry_reason?: string | null;  // For manual source
    created_by?: number | null;
    created_by_name?: string | null;
}

/**
 * Attendance Record
 * Complete daily attendance record for an employee
 */
export interface AttendanceRecord {
    id: number;
    employee_id: number;
    employee_name: string;
    employee_number: string;
    
    // Date and time fields
    date: string;                    // YYYY-MM-DD
    time_in?: string | null;         // HH:MM:SS
    time_out?: string | null;        // HH:MM:SS
    break_start?: string | null;     // HH:MM:SS
    break_end?: string | null;       // HH:MM:SS
    
    // Hours calculations
    total_hours: number;             // Total worked hours
    regular_hours: number;           // Regular shift hours
    overtime_hours: number;          // Overtime hours
    break_duration: number;          // Break duration in minutes
    
    // Data source tracking
    source: AttendanceSource;
    device_id?: string | null;       // RFID device ID
    device_location?: string | null; // Device location
    manual_entry_reason?: string | null;  // Reason for manual entry
    
    // Status and compliance
    status: AttendanceStatus;
    is_late: boolean;
    late_minutes?: number;
    is_undertime?: boolean;
    undertime_minutes?: number;
    
    // Correction tracking
    is_corrected: boolean;
    original_time_in?: string | null;
    original_time_out?: string | null;
    correction_reason?: string | null;
    corrected_by?: number | null;
    corrected_by_name?: string | null;
    corrected_at?: string | null;
    
    // Schedule reference
    department_id: number;
    department_name: string;
    schedule_id?: number;
    schedule_name?: string;
    scheduled_time_in?: string | null;
    scheduled_time_out?: string | null;
    
    // Metadata
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Attendance Correction History Entry
 * Tracks all corrections made to attendance records
 */
export interface AttendanceCorrection {
    id: number;
    attendance_record_id: number;
    field_corrected: string;         // e.g., 'time_in', 'time_out'
    original_value: string;
    corrected_value: string;
    correction_reason: string;
    justification: string;           // Detailed explanation
    corrected_by: number;
    corrected_by_name: string;
    corrected_at: string;
}

/**
 * Daily Attendance Summary
 * Aggregated statistics for a specific date
 */
export interface DailyAttendanceSummary {
    date: string;
    total_employees: number;
    present: number;
    late: number;
    absent: number;
    on_leave: number;
    present_rate: number;            // Percentage
    records: AttendanceRecord[];
}

/**
 * Overtime Request/Record
 * HR Manager creates overtime records for employees
 */
export interface OvertimeRecord {
    id: number;
    employee_id: number;
    employee_name: string;
    employee_number: string;
    
    // Schedule information
    overtime_date: string;           // YYYY-MM-DD
    start_time: string;              // HH:MM:SS
    end_time: string;                // HH:MM:SS
    
    // Hours tracking
    planned_hours: number;
    actual_hours?: number | null;    // Filled when completed
    
    // Details
    reason: string;
    status: OvertimeStatus;
    budget_code?: string | null;
    
    // Department context
    department_id: number;
    department_name: string;
    
    // Audit trail (HR Manager creates directly)
    created_by: number;
    created_by_name: string;
    created_at: string;
    updated_at: string;
    notes?: string | null;
}

/**
 * Overtime Status History
 * Tracks status changes for overtime records
 */
export interface OvertimeStatusHistory {
    id: number;
    overtime_record_id: number;
    status: OvertimeStatus;
    changed_by: number;
    changed_by_name: string;
    changed_at: string;
    notes?: string | null;
}

/**
 * Import Batch
 * Bulk import operations (CSV/Excel files)
 */
export interface ImportBatch {
    id: number;
    file_name: string;
    file_path: string;
    file_size: number;               // Bytes
    import_type: 'attendance' | 'overtime' | 'schedule';
    
    // Processing statistics
    total_records: number;
    processed_records: number;
    successful_records: number;
    failed_records: number;
    warnings: number;
    
    // Status and timing
    status: ImportStatus;
    started_at?: string | null;
    completed_at?: string | null;
    processing_time?: string | null; // e.g., "2.3 seconds"
    
    // Error handling
    error_log?: string | null;
    
    // Audit trail
    imported_by: number;
    imported_by_name: string;
    created_at: string;
    updated_at: string;
}

/**
 * Import Error
 * Individual validation errors from import batches
 */
export interface ImportError {
    id: number;
    import_batch_id: number;
    row_number: number;
    employee_identifier?: string | null;
    error_type: 'invalid_employee' | 'invalid_time' | 'duplicate_entry' | 'validation_error';
    error_message: string;
    raw_data: Record<string, unknown>;  // Original row data
    suggested_fix?: string | null;
    created_at: string;
}

/**
 * Work Schedule (reference from Workforce module)
 * Used for attendance compliance checking
 */
export interface WorkSchedule {
    id: number;
    name: string;
    description?: string | null;
    
    // Daily shift times
    monday_start?: string | null;
    monday_end?: string | null;
    tuesday_start?: string | null;
    tuesday_end?: string | null;
    wednesday_start?: string | null;
    wednesday_end?: string | null;
    thursday_start?: string | null;
    thursday_end?: string | null;
    friday_start?: string | null;
    friday_end?: string | null;
    saturday_start?: string | null;
    saturday_end?: string | null;
    sunday_start?: string | null;
    sunday_end?: string | null;
    
    // Break durations
    lunch_break_duration?: number | null;
    morning_break_duration?: number | null;
    afternoon_break_duration?: number | null;
}

// ============================================================================
// FILTER INTERFACES
// ============================================================================

/**
 * Attendance filtering options
 */
export interface AttendanceFilters extends CommonFilters {
    date_from?: string;
    date_to?: string;
    department_id?: number;
    status?: AttendanceStatus;
    source?: AttendanceSource;
    is_late?: boolean;
    is_corrected?: boolean;
}

/**
 * Overtime filtering options
 */
export interface OvertimeFilters extends CommonFilters {
    date_from?: string;
    date_to?: string;
    department_id?: number;
    status?: OvertimeStatus;
    employee_id?: number;
}

/**
 * Import batch filtering options
 */
export interface ImportFilters extends CommonFilters {
    status?: ImportStatus;
    import_type?: 'attendance' | 'overtime' | 'schedule';
    date_from?: string;
    date_to?: string;
}

// ============================================================================
// ANALYTICS & REPORTING INTERFACES
// ============================================================================

/**
 * Attendance Analytics Overview
 */
export interface AttendanceAnalytics {
    // Summary metrics
    summary: {
        total_employees: number;
        average_attendance_rate: number;
        average_late_rate: number;
        average_absent_rate: number;
        average_hours_per_employee: number;
        total_overtime_hours: number;
        compliance_score: number;
    };
    
    // Trend data for charts
    attendance_trends: Array<{
        date: string;
        label: string;
        present: number;
        late: number;
        absent: number;
        attendance_rate: number;
    }>;
    
    late_trends: Array<{
        date: string;
        label: string;
        late_count: number;
        average_late_minutes: number;
    }>;
    
    // Department comparison
    department_comparison: Array<{
        department_id: number;
        department_name: string;
        attendance_rate: number;
        late_rate: number;
        average_hours: number;
        overtime_hours: number;
    }>;
    
    // Overtime analysis
    overtime_analysis: {
        total_overtime_hours: number;
        average_per_employee: number;
        top_overtime_employees: Array<{
            employee_name: string;
            hours: number;
        }>;
        by_department: Array<{
            department_name: string;
            hours: number;
        }>;
        trend: 'increasing' | 'decreasing' | 'stable';
        budget_utilization: number;
    };
    
    // Status distribution
    status_distribution: Array<{
        status: AttendanceStatus;
        count: number;
        percentage: number;
    }>;
    
    // Top issues
    top_issues: Array<{
        issue: string;
        count: number;
        trend: 'up' | 'down' | 'stable';
    }>;
    
    // Compliance metrics
    compliance_metrics: {
        excellent: { count: number; percentage: number };  // >= 95%
        good: { count: number; percentage: number };       // 85-94%
        fair: { count: number; percentage: number };       // 75-84%
        poor: { count: number; percentage: number };       // < 75%
    };
}

/**
 * Department-specific analytics
 */
export interface DepartmentAttendanceAnalytics {
    department_id: number;
    department_name: string;
    total_employees: number;
    attendance_rate: number;
    late_rate: number;
    absent_rate: number;
    average_hours: number;
    overtime_hours: number;
    compliance_score: number;
    
    // Daily breakdown (last 7 days)
    daily_breakdown: Array<{
        date: string;
        day: string;
        present: number;
        late: number;
        absent: number;
        on_leave: number;
    }>;
    
    // Employee performance
    top_performers: Array<{
        employee_id: number;
        employee_name: string;
        attendance_rate: number;
        on_time_rate: number;
    }>;
    
    attention_needed: Array<{
        employee_id: number;
        employee_name: string;
        attendance_rate: number;
        late_count: number;
        issue: string;
    }>;
    
    // Shift distribution
    shift_distribution: Array<{
        shift: string;
        count: number;
    }>;
}

/**
 * Employee-specific analytics
 */
export interface EmployeeAttendanceAnalytics {
    employee_id: number;
    employee_name: string;
    employee_number: string;
    department_name: string;
    
    // Summary (last 30 days)
    summary: {
        total_days: number;
        present_days: number;
        late_days: number;
        absent_days: number;
        attendance_rate: number;
        on_time_rate: number;
        average_hours: number;
        total_overtime_hours: number;
    };
    
    // Monthly attendance (last 6 months)
    monthly_attendance: Array<{
        month: string;
        attendance_rate: number;
        late_count: number;
    }>;
    
    // Late arrival patterns
    late_patterns: {
        most_common_day: string;
        average_late_minutes: number;
        late_trend: 'increasing' | 'decreasing' | 'stable';
    };
    
    // Compliance score breakdown
    compliance_breakdown: {
        punctuality: number;
        attendance: number;
        overtime_completion: number;
        schedule_adherence: number;
        overall: number;
    };
    
    // Recent activity (last 10 days)
    recent_activity: Array<{
        date: string;
        day: string;
        status: AttendanceStatus;
        time_in?: string | null;
        time_out?: string | null;
        total_hours: number;
    }>;
}

/**
 * Overtime Summary Statistics
 */
export interface OvertimeSummary {
    total_records: number;
    planned: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    total_ot_hours: number;
}

/**
 * Compliance Metrics
 */
export interface ComplianceMetrics {
    overall_score: number;
    attendance_compliance: number;
    punctuality_compliance: number;
    schedule_adherence: number;
    overtime_accuracy: number;
}

/**
 * Overtime Budget Information
 */
export interface OvertimeBudget {
    department_id: number;
    allocated_hours: number;
    used_hours: number;
    available_hours: number;
    utilization_percentage: number;
    is_over_budget: boolean;
    near_limit: boolean;              // > 90% utilization
}

// ============================================================================
// PAGE PROPS INTERFACES
// ============================================================================

/**
 * Attendance Overview Page Props
 * Dashboard showing today's attendance summary
 */
export interface AttendanceOverviewProps {
    daily_summary: DailyAttendanceSummary;
    recent_arrivals: AttendanceRecord[];
    late_arrivals: AttendanceRecord[];
    edge_devices: EdgeMachineDevice[];
    departments: Array<{
        id: number;
        name: string;
        present_count: number;
        total_employees: number;
    }>;
    quick_stats: {
        present_rate: number;
        late_rate: number;
        absent_count: number;
        on_leave_count: number;
    };
}

/**
 * Attendance Records Index Page Props
 * Full attendance records list with filtering
 */
export interface AttendanceRecordsIndexProps {
    attendance: AttendanceRecord[];
    summary: {
        total_records: number;
        edge_machine_records: number;
        manual_records: number;
        imported_records: number;
        present_count: number;
        late_count: number;
        absent_count: number;
        on_leave_count: number;
        present_rate: number;
        avg_hours: number;
    };
    filters: AttendanceFilters;
    employees: EmployeeBasic[];
    departments: Array<{ id: number; name: string }>;
    edge_devices: EdgeMachineDevice[];
}

/**
 * Attendance Record Show Page Props
 * Detailed view of a single attendance record
 */
export interface AttendanceRecordShowProps {
    attendance: AttendanceRecord;
    correction_history: AttendanceCorrection[];
    employee: EmployeeBasic;
    schedule?: WorkSchedule | null;
}

/**
 * Attendance Create/Edit Page Props
 */
export interface AttendanceFormProps {
    attendance?: AttendanceRecord | null;
    employees: EmployeeBasic[];
    edge_devices: EdgeMachineDevice[];
    schedules: WorkSchedule[];
}

/**
 * Overtime Requests Index Page Props
 */
export interface OvertimeRequestsIndexProps {
    overtime: OvertimeRecord[];
    summary: OvertimeSummary;
    filters: OvertimeFilters;
    employees: EmployeeBasic[];
    departments: Array<{ id: number; name: string }>;
}

/**
 * Overtime Record Show Page Props
 */
export interface OvertimeRecordShowProps {
    overtime: OvertimeRecord;
    status_history: OvertimeStatusHistory[];
    employee: EmployeeBasic;
    budget?: OvertimeBudget | null;
}

/**
 * Overtime Create/Edit Page Props
 */
export interface OvertimeFormProps {
    overtime?: OvertimeRecord | null;
    employees: EmployeeBasic[];
    departments: Array<{ id: number; name: string }>;
}

/**
 * Import Management Page Props
 */
export interface ImportManagementProps {
    batches: ImportBatch[];
    summary: {
        total_imports: number;
        successful: number;
        failed: number;
        pending: number;
        records_imported: number;
    };
    filters: ImportFilters;
}

/**
 * Import Batch Detail Page Props
 */
export interface ImportBatchDetailProps {
    batch: ImportBatch;
    errors: ImportError[];
}

/**
 * Analytics Overview Page Props
 */
export interface AnalyticsOverviewProps {
    analytics: AttendanceAnalytics;
    period: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

/**
 * Department Analytics Page Props
 */
export interface DepartmentAnalyticsProps {
    analytics: DepartmentAttendanceAnalytics;
}

/**
 * Employee Analytics Page Props
 */
export interface EmployeeAnalyticsProps {
    analytics: EmployeeAttendanceAnalytics;
}

// ============================================================================
// FORM DATA INTERFACES
// ============================================================================

/**
 * Attendance Record Form Data
 */
export interface AttendanceFormData {
    employee_id: number;
    date: string;
    time_in: string;
    time_out?: string | null;
    break_start?: string | null;
    break_end?: string | null;
    source: AttendanceSource;
    device_id?: string | null;
    manual_entry_reason?: string | null;
    notes?: string | null;
}

/**
 * Attendance Correction Form Data
 */
export interface AttendanceCorrectionFormData {
    corrected_time_in?: string | null;
    corrected_time_out?: string | null;
    corrected_break_start?: string | null;
    corrected_break_end?: string | null;
    correction_reason: string;
    justification: string;
}

/**
 * Overtime Record Form Data
 */
export interface OvertimeFormData {
    employee_id: number;
    overtime_date: string;
    start_time: string;
    end_time: string;
    planned_hours: number;
    actual_hours?: number | null;
    reason: string;
    status: OvertimeStatus;
    budget_code?: string | null;
    notes?: string | null;
}

/**
 * Bulk Attendance Entry Form Data
 */
export interface BulkAttendanceFormData {
    employees: Array<{ employee_id: number }>;
    date: string;
    time_in: string;
    source: AttendanceSource;
    manual_entry_reason?: string | null;
    notes?: string | null;
}

/**
 * Import Upload Form Data
 */
export interface ImportUploadFormData {
    file: File;
    import_type: 'attendance' | 'overtime' | 'schedule';
}
