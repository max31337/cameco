# Onboarding Module

## Overview
Automates post-hire tasks: document collection, contract signing, account provisioning, and initial checklists.

## Core Tables
- `onboarding_checklists` (id, name, tasks_json, created_by)
- `onboarding_tasks` (id, employee_id, checklist_id, task, status, due_date, completed_at)

## Roles
- HR Staff / Admin Officer: trigger and monitor onboarding

## Integration
- Triggered by ATS or HR Core when a hire is approved. Onboarding completion can grant employee system access and seed initial `leave_balances`.

## Notes
- Keep orchestration in Services; validation and invariant checks will be moved to Domain.
