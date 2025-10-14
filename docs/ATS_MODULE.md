
# Applicant Tracking System (ATS) Module - Architecture & Implementation Plan

## Module Overview
The ATS module manages the full recruitment lifecycle: job posting, candidate application, interview scheduling, evaluation, and handoff to HR Core and Onboarding. It ensures a structured, auditable, and efficient hiring process for Cathay Metal Corporation.


## Module Goals
1. **Job Posting Management:** Create and manage job openings with requirements and descriptions. 
	- **Current Approach:** Since the HRIS is internal-only, job postings are distributed externally via social media (e.g., Facebook) and other third-party channels. HR staff manually post job details and collect applications through these platforms.
	- **Automated Option:** Integrate the HR dashboard with Facebook using the Meta Graph API to automate posting job openings directly to the company's Facebook Page. Job details entered in the HRIS can be published with a single click.
	- **Future Option:** Recommend building a separate public-facing website for marketing, sales, and job posting. This site can serve both as a company showcase for potential clients and as a recruitment portal.
2. **Candidate Application Tracking:** Accept, store, and manage candidate applications and resumes.
	- **Automated Option:** Use a Facebook Messenger bot or a custom web form (linked from the Facebook post) to collect candidate details. The bot or form can send application data directly to the ATS via a webhook or API, creating candidate/application records automatically.
3. **Interview Scheduling:** Schedule interviews, assign interviewers, and collect feedback.
4. **Candidate Evaluation:** Score and rank candidates based on interviews and assessments.
5. **Handoff to HR Core/Onboarding:** Seamlessly transition successful candidates to employee onboarding.

---

## Database Schema (ATS Module)

### candidates
```sql
- id (primary key)
- profile_id (foreign key to profiles, nullable)
- source (enum: referral, job_board, walk_in, agency, internal, other)
- status (enum: new, in_process, interviewed, offered, hired, rejected, withdrawn)
- applied_at (timestamp)
- notes (text, nullable)
- created_at, updated_at
```

### job_postings
```sql
- id (primary key)
- title (string, required)
- department_id (foreign key to departments)
- description (text)
- requirements (text)
- status (enum: open, closed, draft)
- posted_at (timestamp)
- closed_at (timestamp, nullable)
- created_by (foreign key to users)
- created_at, updated_at
```

### applications
```sql
- id (primary key)
- candidate_id (foreign key to candidates)
- job_id (foreign key to job_postings)
- status (enum: submitted, shortlisted, interviewed, offered, hired, rejected, withdrawn)
- score (decimal(5,2), nullable)
- resume_path (string, nullable)
- cover_letter (text, nullable)
- applied_at (timestamp)
- created_at, updated_at
```

### interviews
```sql
- id (primary key)
- application_id (foreign key to applications)
- scheduled_at (timestamp)
- interviewer_id (foreign key to users)
- feedback (text, nullable)
- score (decimal(5,2), nullable)
- status (enum: scheduled, completed, cancelled, no_show)
- created_at, updated_at
```

### candidate_notes
```sql
- id (primary key)
- candidate_id (foreign key to candidates)
- note (text)
- created_by (foreign key to users)
- created_at, updated_at
```

---

## Key Workflows



### 1. Job Posting & Application (with Facebook Automation)
- HR Manager/Staff creates job postings in the HRIS.
- With Facebook integration enabled, job details can be posted directly to the company's Facebook Page via the Meta Graph API.
- Facebook post includes a link to a Messenger bot or web form for applications.
- Candidates apply via Messenger or the form; the bot collects details and sends them to the ATS via webhook/API.
- Applications from referrals or walk-ins can still be entered manually by HR.
- In the future, a public-facing website could allow direct online applications, automatically syncing with the ATS.
---

## Facebook Integration & Automation Strategy

### Automated Job Posting
- Use the Meta Graph API to allow the HRIS to publish job posts directly to the company's Facebook Page.
- Job posts can include job title, description, requirements, and a call-to-action (e.g., "Apply via Messenger").
- HR staff can trigger posting from the HR dashboard; posts are tracked in the ATS.

### Automated Candidate Intake
- Deploy a Facebook Messenger bot (using Meta's Messenger Platform) or a custom web form linked from the Facebook post.
- The bot/form collects candidate details (name, contact, resume, etc.).
- When a candidate submits, the bot/form sends the data to the ATS via a secure webhook or REST API endpoint.
- The ATS creates candidate and application records automatically, reducing manual data entry.

### Technical Considerations
- Requires a Facebook Page and developer access to Meta Graph API and Messenger Platform.
- Messenger bots can be built using Node.js, Python, or third-party platforms (e.g., ManyChat, Chatfuel) with webhook support.
- ATS must expose a secure API endpoint to receive candidate data.
- All automated actions should be logged for audit and error handling.

### Benefits
- Reduces manual HR work and speeds up candidate intake.
- Ensures all applications are tracked in the ATS, regardless of source.
- Provides a foundation for future integration with other platforms (e.g., public website, job boards).

---
---

## Integration Strategy: Social Media & Future Public Site

### Current State: Social Media Sourcing
- Job postings are created in the internal HRIS for tracking, but are distributed externally via Facebook and other platforms.
- HR staff copy job details to social media and manually enter candidate data into the ATS as applications are received.
- All candidate tracking, interview scheduling, and evaluation remain internal.

### Future State: Public-Facing Website
- Develop a separate public website for company marketing, sales, and recruitment.
- Integrate the public site with the ATS via a secure API or data sync:
	- Job postings marked as "public" in the HRIS are published to the public site.
	- Candidates can apply directly online; applications are automatically created in the ATS.
	- Marketing and sales content can be managed independently from HRIS.
- This approach allows seamless transition from manual to automated recruitment as the company grows.

---

### 2. Screening & Shortlisting
- HR reviews applications, shortlists candidates based on requirements.
- Shortlisted candidates are scheduled for interviews.

### 3. Interview Scheduling & Feedback
- HR schedules interviews, assigns interviewers.
- Interviewers provide feedback and scores after each interview.
- Multiple interview rounds supported.

### 4. Candidate Evaluation & Offer
- HR reviews interview feedback and scores.
- Candidates are ranked and offers are extended to top choices.
- Offer status is tracked; rejected/withdrawn candidates are archived.

### 5. Handoff to HR Core & Onboarding
- On hire, create `employees` record and trigger onboarding tasks.
- Candidate profile is linked to `profiles` and `government_ids` as needed.

---

## Integration Points
- **HR Core:**
	- On successful hire, create employee record and link candidate profile.
- **Onboarding:**
	- Trigger onboarding checklist and account provisioning.
- **Reporting:**
	- Provide analytics on hiring pipeline, time-to-hire, and source effectiveness.

---

## Roles & Permissions
- **HR Manager:** Full access to create, edit, and close job postings, manage candidates, and approve hires.
- **HR Staff:** Can manage applications, schedule interviews, and record feedback.

---

## Implementation Phases

### Phase 1: Foundation Models & Migrations
- [ ] Create Eloquent models for candidates, job_postings, applications, interviews
- [ ] Create migrations for all tables
- [ ] Seeders for sample job postings and candidates

### Phase 2: Repository & Service Layer
- [ ] Define repository interfaces for candidate, job, and interview management
- [ ] Implement Eloquent repositories
- [ ] Create services for application workflow, interview scheduling, and evaluation

### Phase 3: UI & Workflow Integration
- [ ] Build React/Inertia.js pages for job posting, application review, and interview management
- [ ] Integrate with HR Core and Onboarding modules
- [ ] Add reporting and analytics dashboards

---

## Future Refactor: Domain Layer
When the system is refactored to MVCSR + Domain, move the following to the Domain layer:
- Candidate eligibility and scoring rules
- Interview scheduling constraints
- Offer/acceptance invariants

---

**Dependencies:** HR Core (profiles), Onboarding Module, Departments, Users
