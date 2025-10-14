
# SyncingSteel System

**Internal HRIS & Workforce Management for Cathay Metal Corporation**

This HRIS system is used internally by office staff to manage HR core processes, payroll, timekeeping, workforce management, recruitment (ATS), onboarding, and appraisals. It supports role-based access for HR-related roles and a superadmin for system-level management. Future expansion may allow manufacturing supervisors to input workforce data directly instead of submitting paper records.

---

## 🏗️ Architecture: MVCSR (Model–View–Controller–Service–Repository)

**Current Architecture:**
- **Controllers:** Coordinate incoming requests, call services, and return responses.
- **Requests:** Handle validation of user input.
- **Services:** Contain core business logic and orchestrate repository calls.
- **Repositories:** Handle all persistence and query operations.
- **Models:** Represent database tables and relationships using Eloquent ORM.
- **Views (Inertia.js + React):** Render the front-end interface for users.

This structure ensures clean separation of concerns while staying within Laravel conventions for rapid development.

**Planned Refactor:**
Once the system is stable, it will be refactored into **MVCSR + Domain**, adding a dedicated domain layer for business rules, constants, and invariants (e.g., employee state transitions, termination rules, attendance-based appraisals, rehire criteria).

---

## 🏗️ Architecture


**Technology Stack:**
- **Backend:** Laravel 11 + Jetstream (MVCSR Pattern)
- **Frontend:** React + Inertia.js (No API Mode)
- **Database:** PostgreSQL/SQLite
- **Authentication:** Role-based access control with admin approval workflow

**📋 Complete Documentation:**
- **[System Architecture](docs/SYNCINGSTEEL_ARCHITECTURE_PLAN.md)** - Complete system overview and implementation strategy
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - 45 tables across all modules with relationships
- **[HR Module Architecture](docs/HR_MODULE_ARCHITECTURE.md)** - Employee management (Priority module)
- **[Timekeeping Module Architecture](docs/TIMEKEEPING_MODULE_ARCHITECTURE.md)** - Attendance tracking
- **[Payroll Module Architecture](docs/PAYROLL_MODULE_ARCHITECTURE.md)** - Philippine tax compliance
- **[Workforce Management Module](docs/WORKFORCE_MANAGEMENT_MODULE.md)** - Shift scheduling, rotations, and daily assignments
- **[Applicant Tracking (ATS) Module](docs/ATS_MODULE.md)** - Candidate pipelines, interviews, and offers
- **[Onboarding Module](docs/ONBOARDING_MODULE.md)** - Post-hire checklists, document collection, and account provisioning
- **[Appraisal Module](docs/APPRAISAL_MODULE.md)** - Performance reviews, scoring, and rehire recommendations


---


## System Overview & Modules

### Core Modules
- **HR Core Module**: Central repository for employee master data and lifecycle.
- **Payroll Module**: Payroll calculation, payslips, statutory reports.
- **Timekeeping Module**: Attendance, imports, summaries and integrations with payroll.
- **Workforce Management Module**: Shift scheduling, rotations, and daily assignments.
- **Applicant Tracking System (ATS)**: Candidate pipelines, interviews, and offers.
- **Onboarding Module**: Post-hire checklists, document collection, and account provisioning.
- **Appraisal & Rehire Module**: Performance reviews, scoring, and rehire recommendations.
- **System Management Module**: System-level settings, logs, and metrics (Superadmin only).

---

### Module Docs
- **[HR Module Architecture](docs/HR_MODULE_ARCHITECTURE.md)**
- **[Timekeeping Module Architecture](docs/TIMEKEEPING_MODULE_ARCHITECTURE.md)**
- **[Payroll Module Architecture](docs/PAYROLL_MODULE_ARCHITECTURE.md)**
- **[Workforce Management Module](docs/WORKFORCE_MANAGEMENT_MODULE.md)**
- **[Applicant Tracking (ATS) Module](docs/ATS_MODULE.md)**
- **[Onboarding Module](docs/ONBOARDING_MODULE.md)**
- **[Appraisal Module](docs/APPRAISAL_MODULE.md)**

---

### Roles and Access Levels

| Role                         | HR Core | Payroll | Timekeeping | Workforce Mgmt | ATS | Appraisal | System Mgmt |
|-----------------------------:|:-------:|:-------:|:-----------:|:--------------:|:---:|:---------:|:-----------:|
| **Superadmin**               |   ✔️    |   ✔️    |     ✔️      |      ✔️        | ✔️  |    ✔️     |     ✔️      |
| **Admin Officer**            |   ✔️    |   ✔️    |     ✔️      |      ✔️        | ✔️  |    ✔️     |     ❌      |
| **HR Manager**               |   ✔️    |   ✔️    |     ✔️      |      ✔️        | ✔️  |    ✔️     |     ❌      |
| **HR Staff**                 |   ✔️    |   ✔️    |     ✔️      |  Input Only     | ✔️  |    ✔️     |     ❌      |
| **Payroll Officer/Accountant**|   ✔️    |   ✔️    |     ✔️      |      ❌        | ❌  |    ❌     |     ❌      |

---

## 🚀 Quick Start

### Prerequisites
- **PHP 8.3+**
- **Composer**
- **Node.js & npm**
- **SQLite** (default) or **PostgreSQL**

### Installation
```bash
# 1. Clone and install dependencies
git clone [repository-url] cameco
cd cameco
composer install
npm install --legacy-peer-deps

# 2. Environment setup
cp .env.example .env
php artisan key:generate

# 3. Database setup
php artisan migrate
php artisan db:seed

# 4. Build frontend assets
npm run build

# 5. Start development servers
php artisan serve     # Laravel: http://127.0.0.1:8000
npm run dev          # Vite: http://localhost:5174 (hot reload)
```


### Default Admin Access
- **Username:** `admin`
- **Email:** `admin@cameco.com`
- **Password:** `password`


### � System Startup & User-Employee Relationship

**Empty System Setup (First Time):**
1. **Admin registers/seeds** (no employee record needed)
2. **Admin accesses HR module** (creates employee master data)
3. **Employees self-register** (initially unlinked to employee records)
4. **Admin approves users** and optionally links to employee records
5. **Linked employees access self-service features**

**Supported Scenarios:**
- System admins who aren't employees (contractors, IT staff)
- Employee records without system access (most common)
- Gradual employee onboarding to self-service portal
- Flexible user-employee relationships

## 🧪 Testing

**📖 Complete Testing Guide:** [`tests/TESTING.md`](tests/TESTING.md)

Includes:
- User approval workflow testing
- Pre-configured test users (approved, rejected, pending)
- Registration and authentication flows
- Database seeding instructions

## 🛠️ Development


---

## Current Architecture: MVCSR

### Layers
- **Controllers:** Coordinate incoming requests, call services, and return responses.
- **Requests:** Handle validation of user input.
- **Services:** Contain core business logic and orchestrate repository calls.
- **Repositories:** Handle all persistence and query operations.
- **Models:** Represent database tables and relationships using Eloquent ORM.
- **Views (Inertia.js + React):** Render the front-end interface for users.

This structure ensures clean separation of concerns while staying within Laravel conventions for rapid development.

### Future Refactor: MVCSR + Domain
When the base system is fully functional and stable, introduce a **Domain layer** to encapsulate business rules, constants, and invariants. The domain layer will formalize logic such as employee state transitions, termination rules, attendance-based appraisals, and rehire criteria.


---

## Implementation Phases

### Phase 1: Build core features using MVCSR for clarity and speed
**Status:** Foundation Complete
- Laravel 11 + Jetstream + Inertia.js + React setup
- User authentication with admin approval workflow
- Role-based access control foundation
- Landing page, login, registration pages
- MVCSR pattern structure

### Phase 2: Once stable, refactor into MVCSR + Domain
- Extract domain logic (status transitions, appraisal rules, etc.) into domain layer
- Add unit tests around business rules

---


### Project Structure
```
app/
├── Models/              # Eloquent models
├── Repositories/        # Data access layer
│   ├── Interfaces/      # Repository contracts
│   └── Eloquent/        # Eloquent implementations
├── Services/            # Business logic layer
├── Http/Controllers/    # Request handling
├── Providers/           # Service bindings

resources/js/
├── Pages/               # Inertia.js pages
├── Components/          # Reusable React components
└── Layouts/             # Page layouts

docs/
├── SYNCINGSTEEL_ARCHITECTURE_PLAN.md  # System overview
├── DATABASE_SCHEMA.md                  # Complete schema (45 tables)
├── HR_MODULE_ARCHITECTURE.md           # HR implementation plan
├── TIMEKEEPING_MODULE_ARCHITECTURE.md  # Timekeeping plan
└── PAYROLL_MODULE_ARCHITECTURE.md      # Payroll plan
```


---


## 🔧 Configuration

### Database
Configure your database in `.env`:
```env
DB_CONNECTION=pgsql  # or sqlite
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=cameco
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Additional Packages (To Install)
```bash
# Role-based permissions
composer require spatie/laravel-permission

# PDF generation  
composer require barryvdh/laravel-dompdf

# Excel imports/exports
composer require maatwebsite/excel

# Activity logging
composer require spatie/laravel-activitylog
```

---

**🏢 Cathay Metal Corporation - Internal HRIS System**  
**📅 Last Updated:** October 14, 2025

