# Applicant Tracking System (ATS) Module

## Overview
The ATS module manages job postings, candidate applications, interview scheduling, and candidate evaluation. Successful hires are handed off to HR Core and the Onboarding module.

## Core Tables
- `candidates` (id, profile_id, source, status, applied_at)
- `applications` (id, candidate_id, job_id, status, score, resume_path)
- `interviews` (id, application_id, scheduled_at, interviewer_id, feedback)

## Roles
- HR Manager / HR Staff: manage postings and interviews

## Integration
- On hire, create `employees` record (or create `onboarding` task). Connect candidate profile to `profiles` and `government_ids` as needed.

## Notes
- ATS workflows should remain in service layer; domain rules (e.g., candidate eligibility thresholds) migrate to Domain later.
