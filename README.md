# SyncingSteel System

**Internal Information Management System for Cathay Metal Corporation**

A comprehensive HRIS system providing HR management, timekeeping, and payroll capabilities with Philippine tax compliance.

## 🏗️ Architecture

**Technology Stack:**
- **Backend:** Laravel 11 + Jetstream (Service & Repository Pattern)
- **Frontend:** React + Inertia.js (No API Mode)
- **Database:** PostgreSQL/SQLite
- **Authentication:** Role-based access control with admin approval workflow

**📋 Complete Documentation:**
- **[System Architecture](docs/SYNCINGSTEEL_ARCHITECTURE_PLAN.md)** - Complete system overview and implementation strategy
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - 45 tables across all modules with relationships
- **[HR Module Architecture](docs/HR_MODULE_ARCHITECTURE.md)** - Employee management (Priority module)
- **[Timekeeping Module Architecture](docs/TIMEKEEPING_MODULE_ARCHITECTURE.md)** - Attendance tracking
- **[Payroll Module Architecture](docs/PAYROLL_MODULE_ARCHITECTURE.md)** - Philippine tax compliance

**🏢 Department Structure** (11 departments across 3 types):
- **Office**: HR, Accounting, Administration, IT Department, Front Desk
- **Production**: Rolling Mill 1-5 (metal workers)
- **Security**: Security/Guards

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

### 🚀 System Startup Workflow

**Empty System Setup (First Time):**
1. **Admin registers/seeds** (no employee record needed)
2. **Admin accesses HR module** (creates employee master data)
3. **Employees self-register** (initially unlinked to employee records)
4. **Admin approves users** and optionally links to employee records
5. **Linked employees access self-service features**

**This design allows:**
- ✅ System admins who aren't employees (contractors, IT staff)
- ✅ Employee records without system access (most common)
- ✅ Gradual employee onboarding to self-service portal
- ✅ Flexible user-employee relationships

## 🧪 Testing

**📖 Complete Testing Guide:** [`tests/TESTING.md`](tests/TESTING.md)

Includes:
- User approval workflow testing
- Pre-configured test users (approved, rejected, pending)
- Registration and authentication flows
- Database seeding instructions

## 🛠️ Development

### User-Employee Relationship Design

**✅ Flexible Architecture:** The system supports users with or without employee records:

- **System Users** (`users` table) - Authentication and system access
- **Employee Records** (`employees` table) - HR master data
- **Optional Linking** - `users.employee_id` and `employees.user_id` are **nullable**

**Supported Scenarios:**
- 👤 **System Admin**: User account only (employee_id = null)
- 🏢 **HR Employee**: Linked user account + employee record  
- 📝 **Employee Record**: HR data only (user_id = null, no system access)
- 🔗 **Self-Service Employee**: Employee record + linked user account

### Current Implementation Status
✅ **Foundation Complete:**
- Laravel 11 + Jetstream + Inertia.js + React setup
- User authentication with admin approval workflow
- Role-based access control foundation
- Landing page, login, registration pages
- Service & Repository pattern structure

🔄 **Next Phase:** HR Module Implementation (see [HR Module Architecture](docs/HR_MODULE_ARCHITECTURE.md))

### Project Structure
```
app/
├── Models/              # Eloquent models
├── Repositories/        # Data access layer
│   ├── Interfaces/      # Repository contracts
│   └── Eloquent/        # Eloquent implementations
├── Services/            # Business logic layer
├── Http/Controllers/    # Request handling
└── Providers/          # Service bindings

resources/js/
├── Pages/              # Inertia.js pages
├── Components/         # Reusable React components
└── Layouts/           # Page layouts

docs/
├── SYNCINGSTEEL_ARCHITECTURE_PLAN.md  # System overview
├── DATABASE_SCHEMA.md                  # Complete schema (45 tables)
├── HR_MODULE_ARCHITECTURE.md           # HR implementation plan
├── TIMEKEEPING_MODULE_ARCHITECTURE.md  # Timekeeping plan
└── PAYROLL_MODULE_ARCHITECTURE.md      # Payroll plan
```

## 🗺️ Implementation Phases

### Phase 1: HR Module (Current Priority)
**Timeline:** 4-6 weeks  
**Status:** Ready for development

- Employee lifecycle management
- Leave request workflow  
- Document generation (contracts, slips)
- Employee self-service portal

### Phase 2: Timekeeping Module
**Timeline:** 3-4 weeks after HR  
**Status:** Architecture complete

- Manual time entry interface
- CSV/Excel timesheet imports
- Attendance tracking and reporting
- Overtime calculations

### Phase 3: Payroll Module  
**Timeline:** 6-8 weeks after Timekeeping  
**Status:** Architecture complete

- Salary calculations and deductions
- Philippine tax compliance (BIR, SSS, PhilHealth, Pag-IBIG)
- Payslip generation and distribution
- Statutory reporting capabilities

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
**📅 Last Updated:** October 6, 2025

