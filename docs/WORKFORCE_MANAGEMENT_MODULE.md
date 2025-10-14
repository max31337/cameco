# Workforce Management Module

## Overview
The Workforce Management Module handles shift scheduling, rotation planning, daily assignments, and workforce analytics. It integrates closely with Timekeeping for attendance data and the Appraisal module for productivity metrics.

## Core Tables
- `workforce_schedules` (id, name, description, effective_date, expires_at)
- `shift_assignments` (id, employee_id, schedule_id, date, shift_start, shift_end, created_by)
- `employee_rotations` (id, name, pattern_json, created_by)

## Roles
- HR Manager: full control
- HR Staff: input and adjustments

## Integration
- Emits assignments to `attendance_events` and `daily_attendance_summary` for Timekeeping.
- Consumed by Payroll for rotation premiums and overtime calculations.

## Notes
- Implement repository and service layers following MVCSR. Move core reassign/rotation rules to Domain layer in Phase 2.
