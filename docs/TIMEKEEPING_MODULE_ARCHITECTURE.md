# Timekeeping Module - Architecture & Implementation Plan

## Module Overview
The Timekeeping Module manages employee attendance, time tracking, and work schedule management for Cathay Metal Corporation. This module integrates with HR employee data and provides attendance information to the Payroll module for accurate salary calculations.

## Module Dependencies
- **HR Module**: Employee records, department structure
- **Foundation**: User management, roles, permissions
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

#### work_schedules
```sql
- id (primary key)
- name (string, required) # "Standard Office Hours", "Shift A", etc.
- description (text, nullable)
- 
# Schedule Definition
- monday_start (time, nullable)
- monday_end (time, nullable)
- tuesday_start (time, nullable)
- tuesday_end (time, nullable)
- wednesday_start (time, nullable)
- wednesday_end (time, nullable)
- thursday_start (time, nullable)
- thursday_end (time, nullable)
- friday_start (time, nullable)
- friday_end (time, nullable)
- saturday_start (time, nullable)
- saturday_end (time, nullable)
- sunday_start (time, nullable)
- sunday_end (time, nullable)
- 
# Break Times
- lunch_break_duration (integer) # minutes
- morning_break_duration (integer, nullable) # minutes
- afternoon_break_duration (integer, nullable) # minutes
- 
# Overtime Rules
- overtime_threshold (integer) # minutes over regular hours
- overtime_rate_multiplier (decimal(3,2), default 1.25)
- 
# System Fields
- is_active (boolean, default true)
- created_by (foreign key to users)
- created_at, updated_at
```

#### employee_schedules
```sql
- id (primary key)
- employee_id (foreign key to employees)
- work_schedule_id (foreign key to work_schedules)
- effective_date (date)
- end_date (date, nullable)
- is_active (boolean, default true)
- created_by (foreign key to users)
- created_at, updated_at
```

#### attendance_events
```sql
- id (primary key)
- employee_id (foreign key to employees)
- event_date (date)
- event_time (timestamp)
- event_type (enum: time_in, time_out, break_start, break_end, overtime_start, overtime_end)
- 
# Data Source
- source (enum: manual, imported, system)
- imported_batch_id (foreign key to import_batches, nullable)
- 
# Validation & Correction
- is_corrected (boolean, default false)
- original_time (timestamp, nullable) # Before correction
- correction_reason (text, nullable)
- corrected_by (foreign key to users, nullable)
- corrected_at (timestamp, nullable)
- 
# Location & Device Info
- location (string, nullable) # "Main Office", "Site A", etc.
- notes (text, nullable)
- 
# System Fields  
- created_by (foreign key to users, nullable)
- created_at, updated_at
```

#### daily_attendance_summary
```sql
- id (primary key)
- employee_id (foreign key to employees)
- attendance_date (date)
- work_schedule_id (foreign key to work_schedules)
- 
# Time Tracking
- time_in (timestamp, nullable)
- time_out (timestamp, nullable)
- break_start (timestamp, nullable)
- break_end (timestamp, nullable)
- 
# Calculated Fields
- total_hours_worked (decimal(4,2), nullable)
- regular_hours (decimal(4,2), nullable)
- overtime_hours (decimal(4,2), nullable)
- break_duration (integer, nullable) # minutes
- 
# Status Flags
- is_present (boolean, default false)
- is_late (boolean, default false)
- is_undertime (boolean, default false)
- is_overtime (boolean, default false)
- late_minutes (integer, nullable)
- undertime_minutes (integer, nullable)
- 
# Leave Integration
- leave_request_id (foreign key to leave_requests, nullable)
- is_on_leave (boolean, default false)
- 
# System Fields
- calculated_at (timestamp, nullable)
- is_finalized (boolean, default false)
- created_at, updated_at
```

#### import_batches
```sql
- id (primary key)
- file_name (string, required)
- file_path (string, required)
- file_size (integer)
- 
# Import Details
- import_type (enum: attendance, schedule, correction)
- total_records (integer)
- processed_records (integer)
- successful_records (integer)  
- failed_records (integer)
- 
# Processing Status
- status (enum: uploaded, processing, completed, failed)
- started_at (timestamp, nullable)
- completed_at (timestamp, nullable)
- error_log (text, nullable)
- 
# System Fields
- imported_by (foreign key to users)
- created_at, updated_at
```

#### import_errors
```sql
- id (primary key)
- import_batch_id (foreign key to import_batches)
- row_number (integer)
- employee_identifier (string) # Employee number or name from import
- error_type (enum: invalid_employee, invalid_time, duplicate_entry, validation_error)
- error_message (text)
- raw_data (json) # Original row data
- created_at
```

#### overtime_requests
```sql
- id (primary key)
- employee_id (foreign key to employees)
- request_date (date)
- planned_start_time (timestamp)
- planned_end_time (timestamp)
- planned_hours (decimal(4,2))
- reason (text)
- 
# Approval Workflow  
- status (enum: pending, approved, rejected, completed)
- approved_by (foreign key to users, nullable)
- approved_at (timestamp, nullable)
- rejection_reason (text, nullable)
- 
# Actual Time Tracking
- actual_start_time (timestamp, nullable)
- actual_end_time (timestamp, nullable)
- actual_hours (decimal(4,2), nullable)
- 
# System Fields
- created_by (foreign key to users)
- created_at, updated_at
```

---

## Implementation Phases

### Phase 1: Foundation Models & Migrations (Week 1)
- [ ] Create Timekeeping Eloquent models with relationships
- [ ] Create database migrations for all timekeeping tables
- [ ] Set up model factories for testing data
- [ ] Create seeders for work schedules and sample attendance
- [ ] Add database indexes for performance

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