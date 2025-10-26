# Timekeeping Module - Architecture & Implementation Plan

## Module Overview
The Timekeeping Module manages employee attendance, time tracking, and work schedule management for Cathay Metal Corporation. This module integrates with HR employee data and provides attendance information to the Payroll module for accurate salary calculations.

## Module Dependencies
- **HR Module**: Employee records, department structure
- **Foundation**: User management, roles, permissions
- 🔄 **Provides data to**: Payroll Module (attendance for salary calculations)
 - **Foundation**: User management, roles, permissions (we recommend `spatie/laravel-permission`)
 - 🔄 **Provides data to**: Payroll Module (attendance for salary calculations)

## Module Goals
1. **Manual Time Entry**: Staff-assisted time recording system
2. **Import Management**: CSV/Excel timesheet processing
3. **Attendance Tracking**: Real-time attendance monitoring
4. **Schedule Management**: Shift schedules and overtime tracking
5. **Reporting**: Comprehensive attendance analytics
6. **Integration**: Seamless data flow to HR and Payroll modules
7. **Workforce Integration**: Consume `workforce_schedules` and reflect rotation assignments
8. **Appraisal Inputs**: Provide attendance quality metrics used by the Appraisal module for scoring and rehire recommendations

---

## Database Schema (Timekeeping Module)

### Attendance & Schedule Tables

## Timekeeping Module Tables

### work_schedules
```sql
CREATE TABLE work_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    
    -- Schedule Definition
    monday_start TIME NULL,
    monday_end TIME NULL,
    tuesday_start TIME NULL,
    tuesday_end TIME NULL,
    wednesday_start TIME NULL,
    wednesday_end TIME NULL,
    thursday_start TIME NULL,
    thursday_end TIME NULL,
    friday_start TIME NULL,
    friday_end TIME NULL,
    saturday_start TIME NULL,
    saturday_end TIME NULL,
    sunday_start TIME NULL,
    sunday_end TIME NULL,
    
    -- Break Times
    lunch_break_duration INT UNSIGNED DEFAULT 60, -- minutes
    morning_break_duration INT UNSIGNED NULL, -- minutes
    afternoon_break_duration INT UNSIGNED NULL, -- minutes
    
    -- Overtime Rules
    overtime_threshold INT UNSIGNED DEFAULT 480, -- minutes (8 hours)
    overtime_rate_multiplier DECIMAL(3,2) DEFAULT 1.25,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_work_schedules_is_active (is_active),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### attendance_events
```sql
CREATE TABLE attendance_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    event_date DATE NOT NULL,
    event_time TIMESTAMP NOT NULL,
    event_type ENUM('time_in', 'time_out', 'break_start', 'break_end', 'overtime_start', 'overtime_end') NOT NULL,
    
    -- Data Source
    source ENUM('manual', 'imported', 'system') DEFAULT 'manual',
    imported_batch_id BIGINT UNSIGNED NULL,
    
    -- Validation & Correction
    is_corrected BOOLEAN DEFAULT FALSE,
    original_time TIMESTAMP NULL,
    correction_reason TEXT NULL,
    corrected_by BIGINT UNSIGNED NULL,
    corrected_at TIMESTAMP NULL,
    
    -- Location & Device Info
    location VARCHAR(255) NULL,
    notes TEXT NULL,
    
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_attendance_events_employee_date (employee_id, event_date),
    INDEX idx_attendance_events_event_time (event_time),
    INDEX idx_attendance_events_batch_id (imported_batch_id),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (corrected_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### daily_attendance_summary
```sql
CREATE TABLE daily_attendance_summary (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    attendance_date DATE NOT NULL,
    work_schedule_id BIGINT UNSIGNED NOT NULL,
    
    -- Time Tracking
    time_in TIMESTAMP NULL,
    time_out TIMESTAMP NULL,
    break_start TIMESTAMP NULL,
    break_end TIMESTAMP NULL,
    
    -- Calculated Fields
    total_hours_worked DECIMAL(4,2) NULL,
    regular_hours DECIMAL(4,2) NULL,
    overtime_hours DECIMAL(4,2) NULL,
    break_duration INT UNSIGNED NULL, -- minutes
    
    -- Status Flags
    is_present BOOLEAN DEFAULT FALSE,
    is_late BOOLEAN DEFAULT FALSE,
    is_undertime BOOLEAN DEFAULT FALSE,
    is_overtime BOOLEAN DEFAULT FALSE,
    late_minutes INT UNSIGNED NULL,
    undertime_minutes INT UNSIGNED NULL,
    
    -- Leave Integration
    leave_request_id BIGINT UNSIGNED NULL,
    is_on_leave BOOLEAN DEFAULT FALSE,
    
    calculated_at TIMESTAMP NULL,
    is_finalized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY daily_attendance_employee_date (employee_id, attendance_date),
    INDEX idx_daily_attendance_date (attendance_date),
    INDEX idx_daily_attendance_schedule_id (work_schedule_id),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (work_schedule_id) REFERENCES work_schedules(id),
    FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id) ON DELETE SET NULL
);
```

### import_batches
```sql
CREATE TABLE import_batches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT UNSIGNED NOT NULL,
    
    -- Import Details
    import_type ENUM('attendance', 'schedule', 'correction') NOT NULL,
    total_records INT UNSIGNED NOT NULL,
    processed_records INT UNSIGNED DEFAULT 0,
    successful_records INT UNSIGNED DEFAULT 0,
    failed_records INT UNSIGNED DEFAULT 0,
    
    -- Processing Status
    status ENUM('uploaded', 'processing', 'completed', 'failed') DEFAULT 'uploaded',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    error_log TEXT NULL,
    
    imported_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_import_batches_status (status),
    INDEX idx_import_batches_imported_by (imported_by),
    
    FOREIGN KEY (imported_by) REFERENCES users(id)
);
```

### import_errors
```sql
CREATE TABLE import_errors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    import_batch_id BIGINT UNSIGNED NOT NULL,
    row_number INT UNSIGNED NOT NULL,
    employee_identifier VARCHAR(255) NOT NULL,
    error_type ENUM('invalid_employee', 'invalid_time', 'duplicate_entry', 'validation_error') NOT NULL,
    error_message TEXT NOT NULL,
    raw_data JSON NOT NULL,
    created_at TIMESTAMP NULL,
    
    INDEX idx_import_errors_batch_id (import_batch_id),
    FOREIGN KEY (import_batch_id) REFERENCES import_batches(id) ON DELETE CASCADE
);
```

### overtime_requests
```sql
CREATE TABLE overtime_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    request_date DATE NOT NULL,
    planned_start_time TIMESTAMP NOT NULL,
    planned_end_time TIMESTAMP NOT NULL,
    planned_hours DECIMAL(4,2) NOT NULL,
    reason TEXT NOT NULL,
    
    -- Approval Workflow
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    
    -- Actual Time Tracking
    actual_start_time TIMESTAMP NULL,
    actual_end_time TIMESTAMP NULL,
    actual_hours DECIMAL(4,2) NULL,
    
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_overtime_requests_employee_id (employee_id),
    INDEX idx_overtime_requests_status (status),
    INDEX idx_overtime_requests_request_date (request_date),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

```sql
CREATE TABLE employee_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    work_schedule_id BIGINT UNSIGNED NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_employee_schedules_employee_id (employee_id),
    INDEX idx_employee_schedules_schedule_id (work_schedule_id),
    INDEX idx_employee_schedules_effective_date (effective_date),
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (work_schedule_id) REFERENCES work_schedules(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```


## Implementation Phases

### Phase 1: Foundation Models & Migrations (Week 1)
- [ ] Create Timekeeping Eloquent models with relationships
- [ ] Create database migrations for all timekeeping tables
- [ ] Set up model factories for testing data
- [ ] Create seeders for work schedules and sample attendance
- [ ] Add database indexes for performance

RBAC notes for Timekeeping:

- Use Spatie permission names for fine-grained access, for example: `timekeeping.attendance.create`, `timekeeping.attendance.update`, `timekeeping.reports.view`.
- Ensure the `User` model uses `HasRoles` and check `can()` / `hasRole()` in controllers and form requests.
- If onboarding creates role templates, map them to the module permissions (see `SYSTEM_ONBOARDING_WORKFLOW.md`).

### Phase 2: Repository Layer (Week 1-2)
- [ ] Create repository interfaces (Attendance, Schedule, Import)
- [ ] Implement Eloquent repositories with complex queries
- [ ] Add repository methods for time calculations
- [ ] Implement caching for frequently accessed schedules
- [ ] Write repository unit tests

### Phase 3: Service Layer (Week 2-3)
- [ ] Create AttendanceService for time tracking logic
- [ ] Create ScheduleService for work schedule management
- [ ] Create ImportService for CSV/Excel processing
- [ ] Create ReportingService for attendance analytics
- [ ] Implement time calculation algorithms

### Phase 4: Import System (Week 3)
- [ ] Build CSV/Excel file parser
- [ ] Implement data validation and error handling
- [ ] Create batch processing for large imports
- [ ] Add import preview and confirmation
- [ ] Build error reporting and correction interface

### Phase 5: Controller & Routes (Week 3-4)
- [ ] Create Timekeeping controllers with proper DI
- [ ] Implement form request classes for validation
- [ ] Set up routes with role-based access control
- [ ] Add API endpoints for attendance data
- [ ] Create import/export endpoints

### Phase 6: Frontend Components (Week 4-5)
- [ ] Create attendance entry interface (manual time recording)
- [ ] Build employee attendance dashboard
- [ ] Implement schedule management interface
- [ ] Create import/export file management
- [ ] Add attendance reporting and analytics

### Phase 7: Integration & Testing (Week 5-6)
- [ ] Integrate with HR module employee data
- [ ] Create data export for Payroll module
- [ ] Write feature tests for all workflows
- [ ] Add performance optimization
- [ ] Create comprehensive documentation

---

## Key Features & Workflows

### Manual Time Entry Workflow
1. **HR/Admin opens attendance entry** (daily attendance interface)
2. **Select employee and date** (search by name/employee number)
3. **Record time events** (time in, out, breaks, overtime)
4. **Validate against schedule** (flag late/undertime/overtime)
5. **Save attendance record** (create daily summary)
6. **Generate notifications** (alert for attendance issues)

### CSV/Excel Import Workflow
1. **Upload timesheet file** (validate format and size)
2. **Parse and preview data** (show import summary)
3. **Validate employee data** (match against HR records)
4. **Process import batch** (create attendance events)
5. **Handle errors and corrections** (flag invalid entries)
6. **Generate import report** (success/failure summary)
7. **Update daily summaries** (recalculate affected records)

### Daily Summary Calculation
1. **Retrieve attendance events** (for specific employee/date)
2. **Load work schedule** (get expected hours and breaks)
3. **Calculate time worked** (total hours minus breaks)
4. **Determine overtime** (hours over schedule threshold)
5. **Flag attendance issues** (late, undertime, missing records)
6. **Update summary record** (store calculated values)
7. **Trigger payroll notification** (if attendance affects pay)

### Overtime Request Workflow
1. **Employee/Supervisor submits request** (planned overtime)
2. **System validates schedule** (check conflicts and limits)
3. **Route for approval** (department manager approval)
4. **Track actual overtime** (compare planned vs actual)
5. **Update attendance summary** (include overtime hours)
6. **Generate overtime report** (for payroll processing)

---

## User Interface Design

### Timekeeping Dashboard
- **Daily Attendance Overview**: Present/absent employees, late arrivals
- **Quick Entry**: Fast attendance recording for multiple employees
- **Recent Imports**: Status of recent file imports
- **Alerts**: Missing records, schedule conflicts, overtime approvals

### Attendance Entry Interface
- **Employee Search**: Quick lookup by name/number/department (HR, Accounting, IT, RM1-RM5, Security)
- **Time Entry Grid**: Multiple employees, multiple time events
- **Schedule Reference**: Show expected vs actual times
- **Bulk Actions**: Apply same time to multiple employees
- **Department Filter**: Filter by Office, Production, or Security departments

### Import Management
- **File Upload**: Drag-and-drop with format validation
- **Import Preview**: Show parsed data before processing
- **Error Resolution**: Interface to fix import errors
- **Batch History**: Track all import operations

### Reporting & Analytics
- **Attendance Reports**: Daily, weekly, monthly summaries by department
- **Department Analytics**: Office vs Production vs Security attendance patterns
- **Rolling Mill Reports**: RM1-RM5 production shift attendance
- **Overtime Analysis**: Overtime trends and costs by department
- **Schedule Compliance**: On-time performance metrics per department
- **Employee Attendance**: Individual attendance history with department context

---

## Import File Formats

### CSV Format for Attendance Import
```csv
Employee_Number,Date,Time_In,Time_Out,Break_Start,Break_End,Notes
EMP-2025-0001,2025-10-06,08:00,17:00,12:00,13:00,"Regular day"
EMP-2025-0002,2025-10-06,08:15,17:30,12:00,13:00,"Late arrival"
```

### Excel Template Structure
- **Sheet 1**: Attendance Data (same as CSV format)
- **Sheet 2**: Instructions and field definitions
- **Sheet 3**: Employee reference list (number, name, department)

### Data Validation Rules
- **Employee Number**: Must exist in HR module
- **Date**: Valid date format, not future date
- **Time Format**: HH:MM or HH:MM:SS format
- **Logical Validation**: Time out > Time in, Break end > Break start

---

## Integration Points

### HR Module Integration
- **Employee Data**: Read employee records, schedules, departments
- **Leave Requests**: Check for approved leaves to exclude from attendance
- **Department Structure**: Use for reporting and access control
- **User Permissions**: Respect HR-defined access levels

### Payroll Module Integration  
- **Attendance Export**: Provide calculated hours for payroll
- **Overtime Data**: Export overtime hours with rates
- **Leave Integration**: Coordinate paid/unpaid leave hours
- **Schedule Data**: Provide work schedule information

### Notification System
- **Missing Attendance**: Alert HR when employees miss time recording
- **Overtime Approvals**: Notify managers of pending overtime requests
- **Import Results**: Email import success/failure reports
- **Schedule Changes**: Notify affected employees of schedule updates

---

## Performance Considerations

### Database Optimization
- **Partitioning**: Partition attendance tables by month/year
- **Indexing**: Employee ID + Date for fast daily lookups
- **Archiving**: Move old attendance data to archive tables
- **Query Optimization**: Use summary tables for reporting

### Caching Strategy
- **Work Schedules**: Cache schedule data (updated rarely)
- **Daily Summaries**: Cache calculated attendance summaries
- **Employee Lists**: Cache active employee lists
- **Report Data**: Cache frequently accessed reports

### File Processing
- **Chunked Processing**: Process large imports in batches
- **Background Jobs**: Use Laravel queues for file processing
- **Memory Management**: Stream large files to avoid memory issues
- **Error Handling**: Graceful handling of corrupted files

---

## Security & Compliance

### Data Access Control
- **Role-Based Access**: HR can view all, managers see department only
- **Audit Logging**: Track all attendance modifications
- **Time Correction Approval**: Require approval for time corrections
- **Data Retention**: Archive old attendance data per policy

### Import Security
- **File Validation**: Scan uploaded files for security threats
- **Size Limits**: Restrict file size to prevent DoS attacks
- **Format Verification**: Ensure only valid file formats accepted
- **Access Logging**: Log all import operations with user tracking

---

## Testing Strategy

### Unit Tests
- Time calculation algorithms
- Schedule matching logic
- Import parsing functions
- Validation rules

### Feature Tests
- Manual attendance entry
- Import file processing
- Daily summary calculation
- Reporting functionality

### Integration Tests
- HR module data integration
- Payroll data export
- Notification system
- Permission enforcement

---

## Reporting Capabilities

### Standard Reports
- **Daily Attendance Report**: All employees for specific date
- **Employee Attendance History**: Individual employee over date range
- **Late/Absent Report**: Employees with attendance issues
- **Overtime Summary**: Overtime hours by employee/department
- **Schedule Compliance**: On-time performance metrics

### Export Formats
- **PDF**: Formatted reports for printing/filing
- **Excel**: Data export for further analysis
- **CSV**: Raw data for integration with other systems
- **Email**: Automated report distribution

---

## Future Enhancements

### Advanced Features
- **Mobile Time Entry**: Mobile app for remote time recording
- **Geolocation**: GPS validation for remote work attendance
- **Photo Verification**: Photo capture during time entry
 - **RFID Integration**: Future integration with RFID card readers (ID badges)

### Analytics Enhancements
- **Predictive Analytics**: Predict attendance patterns
- **Anomaly Detection**: Automatically flag unusual patterns
- **Workforce Planning**: Analyze staffing needs based on attendance
- **Cost Analysis**: Calculate attendance-related costs

---

**Module Completion Criteria:**
- [ ] Manual time entry system operational
- [ ] CSV/Excel import processing functional
- [ ] Daily attendance calculation accurate
- [ ] Integration with HR module complete
- [ ] Reporting system comprehensive
- [ ] Data export to Payroll ready

**Estimated Timeline:** 6 weeks  
**Resources Required:** 1 Full-stack developer  
**Dependencies:** HR Module (employee data), Foundation (roles, permissions)