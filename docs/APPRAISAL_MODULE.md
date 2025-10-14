# Appraisal Module

## Overview
Handles performance review cycles, scoring, feedback collection, and rehire recommendation logic based on attendance, violations, and appraisal results.

## Core Tables
- `appraisals` (id, employee_id, cycle_id, status, overall_score, created_by)
- `appraisal_scores` (id, appraisal_id, criterion, score, notes)
- `rehire_recommendations` (id, employee_id, appraisal_id, recommendation, notes)

## Roles
- HR Manager / HR Staff: create and manage appraisal cycles
- Office Staff: view own appraisals

## Integration
- Consumes attendance quality metrics from Timekeeping and workforce history from Workforce Management.
- Writes `rehire_recommendations` used by HR and Payroll for separation handling.

## Notes
- Initial scoring logic lives in Services; move to Domain layer when stable for exhaustive business-rule testing.
