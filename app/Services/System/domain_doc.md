# System Domain Services

This folder contains application-level domain services that handle business logic related to **system onboarding**, configuration initialization, and organization setup. These services coordinate workflows across repositories and infrastructure boundaries instead of leaking logic into controllers.

## System Onboarding Domain

### Business Goal
Enable controlled setup of system and company configuration in on-prem deployments where the **Superadmin** oversees the server and platform but **Office Admin** or designated HR roles initialize operational settings for the organization.

### Role Workflow

| Role          | Capabilities | Responsibility in Onboarding |
|---------------|--------------|-----------------------------|
| Superadmin    | Full system access, server ownership | Starts onboarding. May **delegate** organization setup to Office Admin when the company lacks IT staff. |
| Office Admin  | Administrative access to organization-wide configuration | Completes company configuration since they understand internal processes better. |
| HR Manager / HR Staff | Scoped role based on internal structure | May be assigned to complete portions of onboarding (ex: department data, employment structures). |

### Service Responsibilities

#### `SystemOnboardingService`

Centralized logic for tracking onboarding lifecycle and seeding minimal organization metadata.

Key functions:

| Method | Responsibility |
|--------|----------------|
| `start(payload, userId)` | Begins onboarding workflow. Persists start state and optional minimal company metadata into a `settings` table when available. |
| `complete(id)` | Marks onboarding as fully configured and ready for operational use. |
| `skip(userId, reason)` | Explicitly records onboarding as skipped. Logs accountability in `onboarding_skips`. |

### Domain Events and Data Recorded

| Event | Stored Data | Reasoning |
|-------|-------------|-----------|
| Onboarding Started | Status, start timestamp, checklist JSON | Progress tracking and displaying user-specific onboarding state. |
| Company Defaults Seeded | Key-value settings | Ensure system becomes operational even with partial input. |
| Onboarding Completed | Completion timestamp | Enable system features requiring finalized configuration. |
| Onboarding Skipped | Who skipped, why | Audit compliance and operational traceability. |

---

## Design Principles

* **Domain logic stays out of controllers**  
  Controllers delegate intent; services enforce business rules.

* **Roles dictate workflow ownership**  
  Superadmin should not micromanage daily organizational structure. Delegation supports real-world responsibility.

* **Auditability**  
  Every change in onboarding state reflects who performed it and when.

* **Minimal assumptions**  
  If a settings table exists, defaults are inserted. If not, the system still proceeds.

---

## Future Improvements (Planned)

* Discrete onboarding phases (Organization Identity, Access Control, Modules, Integrations)
* Workflow reassignment (where an admin can handoff onboarding to HR roles explicitly)
* Validation of onboarding task completion
* Replace generic JSON checklist with strongly typed domain objects

---

If you add new onboarding-related domain actions, **keep them in this folder** and ensure they follow the delegation and audit rules shown above.
