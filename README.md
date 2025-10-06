CAMECO System — README

Internal Information Management System for Cathay Metal Corporation
(HR → Timekeeping → Payroll — Laravel Jetstream + React (Inertia) — Service & Repository architecture)

Proposal Title (short)
Internal Information Management System for Cathay Metal Corporation

Rationale & Objectives — (trimmed, keep full proposal in /docs/proposal.md)
Replace manual time cards and paper HR operations with a secure web system. Provide: digital timekeeping (RFID-based ID cards), centralized HR data, leave/workflow, automated payroll integrated with attendance, employee self-service portal, and role-based access controls.

Table of contents

Overview & Goals

Tech stack & rationale

Architecture & project layout

Setup & local dev (quick commands)

Jetstream + React (Inertia) — how to wire without making Laravel a pure API

Service & Repository pattern — example code and DI binding

React component conventions & Inertia pages (example)

HR Core module: models, migrations, endpoints, UI flow

Timekeeping module: architecture (biometric / device-agnostic), reconciliation, sample schema

Payroll module: calculation flow, statutory contributions (PH), where to store rules, tests, and exports

Compliance notes (BIR, SSS, PhilHealth, Pag-IBIG) — authoritative sources & how to keep rates up to date

Testing, CI/CD, deployment checklist

TODOs & extension points

1 — Overview & goals

Build an internal HRIS focusing first on HR Core, Timekeeping, then Payroll that is BIR & Philippine statutory-compliant.

Use Laravel as the application server with Jetstream + Inertia + React so Laravel remains the main backend (not a pure REST API). React is used for componentized views and client interactions.

Apply Service and Repository layers in backend to keep controllers thin and business logic testable and reusable.

Use role-based access control (RBAC) — recommend spatie/laravel-permission.

2 — Tech stack (current implementation)

✅ **Backend**: PHP 8.3, Laravel 11.x (latest)

✅ **Auth/UI**: Laravel Jetstream with Inertia + React stack (teams enabled)

✅ **Frontend**: React 18 (functional components + hooks), Inertia.js, Tailwind CSS, Vite 7.x

✅ **Build**: Vite with React plugin, SSR support, legacy peer deps for compatibility

🔄 **DB**: SQLite (default) → PostgreSQL (to be configured)

🔄 **Queues**: Database (default) → Redis + Laravel Queue + Horizon (planned)

🔄 **Scheduler**: Laravel Scheduler for payroll runs / remittances / nightly reconciliation (planned)

**Additional packages installed:**
- @inertiajs/react, react, react-dom
- @vitejs/plugin-react
- @headlessui/react (for UI components)
- ziggy-js (for client-side routing)

**To be installed:**
- spatie/laravel-permission (RBAC)
- maatwebsite/excel (exports)
- barryvdh/laravel-cors (if needed)

**Testing**: PHPUnit (included), Pest (optional)

3 — Architecture & project layout (example)
/project-root
├─ app/
│  ├─ Models/
│  │  ├─ Employee.php
│  │  ├─ Attendance.php
│  │  └─ PayrollRecord.php
│  ├─ Repositories/
│  │  ├─ Contracts/
│  │  │  └─ EmployeeRepositoryInterface.php
│  │  └─ Eloquent/
│  │     └─ EmployeeRepository.php
│  ├─ Services/
│  │  ├─ EmployeeService.php
│  │  └─ PayrollService.php
│  ├─ Http/
│  │  ├─ Controllers/
│  │  │  └─ Hr/
│  │  │     ├─ EmployeeController.php
│  │  │     └─ PayrollController.php
│  └─ Providers/
│     └─ RepositoryServiceProvider.php
├─ resources/
│  ├─ js/
│  │  ├─ Pages/             # Inertia pages
│  │  └─ Components/        # Reusable React components
│  └─ css/
├─ database/
│  ├─ migrations/
│  └─ seeders/
├─ routes/
│  └─ web.php
├─ config/
│  └─ payroll.php           # store default rates & toggles
└─ docs/
   └─ proposal.md

4 — Quick setup (local)

✅ **COMPLETED** - Project initialized with Laravel 11 + Jetstream + Inertia + React

Assumes Docker is optional; commands for local machine with PHP + Composer + Node installed.

# 1. Clone (DONE)
# Project initialized directly in cameco folder
cd cameco

# 2. Install backend composer deps (DONE)
composer install
cp .env.example .env
php artisan key:generate

# 3. Install Jetstream + Inertia + React (DONE)
composer require laravel/jetstream
php artisan jetstream:install inertia --teams
# Fixed Vue → React conversion:
# - Removed Vue dependencies
# - Installed @inertiajs/react, react, react-dom, @vitejs/plugin-react
# - Updated vite.config.js for React
# - Converted app.js → app.jsx
# - Created React components (Dashboard.jsx, AuthenticatedLayout.jsx, etc.)
npm install --legacy-peer-deps
npm run build  # ✅ Build successful

# 4. DB & migrations (NEXT)
# configure DB in .env
php artisan migrate --seed

# 5. Additional packages (NEXT)
# spatie/laravel-permission, maatwebsite/excel, etc.

# 6. Service & Repository patterns (NEXT)
# Create interfaces, implementations, and service provider bindings

# 7. Serve (RUNNING)
php artisan serve     # ✅ http://127.0.0.1:8000
npm run dev          # ✅ http://localhost:5174 (Vite hot reload)

5 — Jetstream + React (Inertia): keep Laravel as primary backend ✅ IMPLEMENTED

✅ **WORKING** - Laravel + Jetstream + Inertia + React setup complete!

**What's implemented:**
- Laravel serves React components (NOT SPA)
- Server-side routing with `Inertia::render('PageName', $props)`
- React components hydrated client-side
- Authentication, sessions, CSRF handled by Laravel
- SSR (Server-Side Rendering) configured
- Teams functionality enabled

**Current structure:**
```
resources/js/
├── app.jsx                    # Main React entry point
├── ssr.jsx                    # Server-side rendering
├── Components/
│   ├── ApplicationLogo.jsx
│   ├── Dropdown.jsx
│   ├── NavLink.jsx
│   └── ResponsiveNavLink.jsx
├── Layouts/
│   └── AuthenticatedLayout.jsx
└── Pages/
    └── Dashboard.jsx          # React dashboard component
```

Example controller action:

use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(EmployeeService $service)
    {
        $employees = $service->listPaginated();
        return Inertia::render('Hr/Employees/Index', [
            'employees' => $employees
        ]);
    }
}

6 — Service & Repository pattern (examples)

Interface (repository contract)
app/Repositories/Contracts/EmployeeRepositoryInterface.php

<?php
namespace App\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Employee;

interface EmployeeRepositoryInterface
{
    public function find(int $id): ?Employee;
    public function create(array $data): Employee;
    public function update(int $id, array $data): Employee;
    public function delete(int $id): bool;
    public function paginate(int $perPage = 15): LengthAwarePaginator;
}


Eloquent implementation
app/Repositories/Eloquent/EmployeeRepository.php

<?php
namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\EmployeeRepositoryInterface;
use App\Models\Employee;

class EmployeeRepository implements EmployeeRepositoryInterface
{
    public function find(int $id): ?Employee { return Employee::find($id); }
    public function create(array $data): Employee { return Employee::create($data); }
    public function update(int $id, array $data): Employee {
        $e = Employee::findOrFail($id);
        $e->fill($data)->save();
        return $e;
    }
    public function delete(int $id): bool {
        return Employee::destroy($id) > 0;
    }
    public function paginate(int $perPage = 15) {
        return Employee::query()->paginate($perPage);
    }
}


Service layer
app/Services/EmployeeService.php

<?php
namespace App\Services;

use App\Repositories\Contracts\EmployeeRepositoryInterface;

class EmployeeService
{
    protected $repo;
    public function __construct(EmployeeRepositoryInterface $repo) { $this->repo = $repo; }

    public function listPaginated($perPage = 15) {
        return $this->repo->paginate($perPage);
    }

    public function createEmployee(array $data) {
        // business rules, validation beyond request validation, default assignment, event dispatch
        $data['employee_code'] = $this->generateEmployeeCode();
        return $this->repo->create($data);
    }

    protected function generateEmployeeCode() {
        return 'EMP-'.now()->format('Ymd').'-'.rand(100,999);
    }
}


Service provider binding
app/Providers/RepositoryServiceProvider.php

public function register()
{
    $this->app->bind(
        \App\Repositories\Contracts\EmployeeRepositoryInterface::class,
        \App\Repositories\Eloquent\EmployeeRepository::class
    );
}


Add this provider to config/app.php or auto-register via composer.json autoload discovery.

7 — React + Inertia component conventions ✅ IMPLEMENTED

✅ **Current structure implemented:**
- Page components: `resources/js/Pages/` (Dashboard.jsx working)
- Reusable UI: `resources/js/Components/` (ApplicationLogo, Dropdown, NavLink, etc.)
- Layouts: `resources/js/Layouts/` (AuthenticatedLayout.jsx)

**Working example - Dashboard.jsx:**
```jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout
            header={<h2>Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-12">
                {/* SyncingSteel System dashboard content */}
            </div>
        </AuthenticatedLayout>
    );
}
```

**Conventions to follow:**
- Use Inertia props for server-provided data
- Keep components small: EmployeeTable, EmployeeForm, AttendanceClock
- Use `@/` alias for imports from resources/js/

**Next: HR/Employees/Index.jsx example:**
```jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EmployeeTable from '@/Components/EmployeeTable';
import Pagination from '@/Components/Pagination';

export default function Index({ employees }) {
  return (
    <AuthenticatedLayout>
      <Head title="Employees" />
      <div>
        <h1>Employees</h1>
        <EmployeeTable data={employees.data} />
        <Pagination meta={employees.meta} />
      </div>
    </AuthenticatedLayout>
  );
}
```

8 — HR Core module (data model & flows)

Core models

Employee — personal info, employment details, tax status (e.g., SSS/PhilHealth/Pag-IBIG numbers), rate, pay type, bank_account

Position, Department

LeaveRequest — type, days, approvals, workflow

EmploymentHistory — hire date, end date, status

Sample Employee migration (simplified)

Schema::create('employees', function (Blueprint $table) {
    $table->id();
    $table->string('employee_code')->unique();
    $table->string('first_name');
    $table->string('last_name');
    $table->string('email')->nullable();
    $table->string('sss_number')->nullable();
    $table->string('philhealth_number')->nullable();
    $table->string('pagibig_number')->nullable();
    $table->decimal('basic_rate', 12, 2)->default(0);
    $table->enum('pay_type', ['monthly','daily','hourly'])->default('monthly');
    $table->timestamps();
});


Admin UI

Employee listing, filters, create/edit, upload bulk via CSV.

HR dashboards with headcount, active vs inactive, leaves.

9 — Timekeeping module (design)

Goals

RFID-based attendance: employees use ID cards with RFID chips to clock in/out at designated stations.

Device-agnostic: accept clock-ins from RFID readers, web kiosk, or mobile app.

Store raw punches (device timestamp) and computed attendance (daily summary).

Allow reconciliation and overrides with audit trail.

Tables

employee_rfid_cards — id, employee_id, rfid_number (unique), issued_date, status (active/inactive/lost), created_at

attendance_punches — id, employee_id, rfid_number, device_id, punch_type (in/out/break), recorded_at, source, meta, created_by

attendances — id, employee_id, date, time_in, time_out, worked_hours, overtime_hours, status (approved/pending), created_at

Flow

Employee taps RFID card at station.

RFID reader sends punch to endpoint: POST /attendance/punch (includes rfid_number, device_id, timestamp).

System validates RFID, maps to employee_id, and saves raw punch with source and signature.

Nightly job (scheduler) groups punches to compute attendances record: calculate worked hours, detect anomalies (missing in/out), compute overtime using company policy.

HR reviews anomalies and approves.

Example punch endpoint

Route::post('/attendance/punch', [AttendanceController::class, 'store']);

// Expected payload:
{
    "rfid_number": "A123456789",
    "device_id": "STATION-01",
    "punch_type": "in",
    "timestamp": "2025-10-06 08:00:00",
    "signature": "hmac_hash_for_security"
}

10 — Payroll module — calculation flow & PH statutory hooks
Payroll computation steps (recommended)

Input: For payroll period (monthly/bi-weekly), fetch all approved attendances and leaves, employee base pay, allowances, deductions.

Gross Pay: compute base + allowances + overtime.

Statutory Deductions: SSS, PhilHealth, Pag-IBIG, withholding tax (BIR).

Other Deductions: Absences, loans, advances.

Net Pay: Gross - (statutory + others).

Remittance files: generate CSVs/Excel for each statutory agency and internal ledger entries.

Payslip: generate PDF and mark payroll record as completed.

Where to store rules & rates

config/payroll.php for defaults and toggles.

Admin UI: settings/payroll/rates — stored in DB for easy updates and audit (recommended).

Each payroll run should record the version of the rates used.

PHP example service entrypoint

PayrollService::runPayrollForPeriod($companyId, $startDate, $endDate)

Statutory rates (authoritative sources)

Keep rates in config/DB and update yearly. Below are authoritative resources (snapshot as of this README preparation):

BIR — withholding tax tables & guidance: Bureau of Internal Revenue. 
Bureau of Internal Revenue
+1

SSS — contribution schedule and circulars effective Jan 2025 (SSS updated table). 
Social Security System
+1

PhilHealth — premium schedule / advisory for 2025 (premium rates, MBS floor & ceiling). 
PhilHealth
+1

Pag-IBIG — contribution table (employee/employer shares, caps). Use Pag-IBIG circulars and guides. 
Triple i Consulting
+1

Important: statutory rates and caps change. Do not hardcode values permanently — version and store them in DB with effective_from dates and a clear admin UI to update them.

11 — Example payroll calculation snippet (simplified)
class PayrollService {
    public function computeForEmployee(Employee $e, Period $p): PayrollRecord {
        $gross = $this->computeGross($e, $p);
        $sss = $this->computeSSS($gross, $e);
        $phil = $this->computePhilHealth($gross, $e);
        $pagibig = $this->computePagIbig($gross, $e);
        $taxable = $gross - ($sss['employee'] + $phil['employee'] + $pagibig['employee']);
        $withholding = $this->computeWithholdingTax($taxable, $e);
        $net = $gross - ($sss['employee'] + $phil['employee'] + $pagibig['employee'] + $withholding);
        // create record and return
    }
}


Note: computeWithholdingTax() must follow BIR rules (annualize, personal exemptions if any, and progressive tax rates). Use official BIR tables and test cases for multiple scenarios. BIR provides calculators and guides. 
Bureau of Internal Revenue
+1

12 — Compliance & reports

BIR: support reports for withholding tax on compensation, and annual certificate generation (e.g., BIR Form 2316 for employees). Use BIR site for up-to-date requirements. 
Bureau of Internal Revenue
+1

SSS / PhilHealth / Pag-IBIG: generate remittance reports and contribution summaries compatible with agency upload formats (CSV/excel), and maintain copies for reconciliation. 
Social Security System
+2
PhilHealth
+2

Audit trail: every override, payroll run, and corrected payslip must be auditable (who changed what, when).

Data retention & security: PII must be encrypted at rest (where appropriate) and access controlled via RBAC.

13 — Testing & automation

Unit tests for PayrollService with multiple scenarios: monthly salary, hourly, overtime, leaves, tax exemption edge cases.

Integration tests for the scheduled payroll process (use test DB and mock external services).

CI (GitHub Actions): run phpunit, npm test, php-cs-fixer/ECS, static analysis (psalm or phpstan), and run npm run build for preview artifact.

14 — Deployment & cron

Deploy via Docker (recommended) or traditional host. Ensure APP_KEY, database, queue (redis), scheduler are available.

Schedule php artisan schedule:run via cron every minute on host (or use Laravel Forge / scheduler container).

Backups: daily DB snapshot and file storage backup.

15 — Helpful implementation tips & patterns

Keep controllers thin — only validate and call service. Tests focus on services and repositories.

Use FormRequest for validation.

Keep tax and contribution logic in dedicated classes (e.g., Statutory\SSSCalculator) so they are independently testable. Version these implementations.

For RFID integration: define a simple webhook contract — RFID readers POST to /attendance/punch with HMAC signature; validate signature, verify RFID is active, and save. Keep device drivers pluggable and support multiple RFID reader manufacturers.

RFID card management: implement card issuance workflow, track lost/stolen cards, support card replacement, and maintain audit log of all card-related actions.

For payroll rollback: mark payroll runs with status and reversible actions (void payroll, issue correction run).

16 — Suggested DB migrations (summary)

employees, positions, departments

employee_rfid_cards — track RFID card issuance and status

attendance_punches, attendances

payroll_runs, payroll_items, payroll_deductions

tax_rate_versions, statutory_configurations — keep history of rates used

17 — Example developer checklist (for HR → payroll go-live)

 Employee master data migrated & verified

 RFID cards issued to all employees and mapped in system

 RFID readers installed and tested at all clock-in stations

 Attendance device integration & reconciliation tested for 2 weeks

 Payroll config (pay period, cutoff, overtime rules) set and approved

 Statutory rates entered and verified with latest agency circulars (store source docs) — see BIR/SSS/PhilHealth/Pag-IBIG links. 
Triple i Consulting
+3
Bureau of Internal Revenue
+3
Social Security System
+3

 Payslip format approved and payslip PDF generation tested

 Remittance file format tested and sample uploads validated

 Backups & rollback tested

18 — References (authoritative sources for Philippines payroll)

BIR (Withholding tax guidance & calculator). 
Bureau of Internal Revenue
+1

SSS — Contribution table and circulars (effective Jan 2025). 
Social Security System
+1

PhilHealth — premium advisory (2025). 
PhilHealth
+1

Pag-IBIG — contribution rules (employee/employer shares, caps). 
Triple i Consulting
+1

Regulatory note: statutory contribution rates, ceilings, and tax tables change — design the system to store the rate versions and include an admin workflow for approving rate changes. Always validate with the official agency circulars and consult your accountant before going live.

19 — Next steps & roadmap (current status)

✅ **COMPLETED**: Laravel 11 + Jetstream + Inertia + React foundation
- Authentication system working
- React components serving from Laravel
- Teams functionality enabled
- Development environment running

🔄 **IN PROGRESS**: Database & environment setup
- Configure PostgreSQL connection
- Run migrations for Jetstream tables
- Set up environment variables

📋 **NEXT UP** (immediate priorities):
1. **Database setup** - Configure Postgres, run migrations
2. **Additional packages** - spatie/laravel-permission, maatwebsite/excel
3. **Service & Repository patterns** - Create interfaces and implementations
4. **HR Core module** - Employee CRUD, RBAC (MVP - 2-3 weeks)

📅 **ROADMAP** (following phases):
- Implement Timekeeping (punch ingestion + nightly reconciliation)
- Implement Payroll calculation engine (statutory modules pluggable)
- Add remittance exports & BIR reports
- Add audit, approvals, payslip distribution, and backups

**Current servers running:**
- Laravel: http://127.0.0.1:8000 ✅
- Vite: http://localhost:5174 ✅

20 — Useful code & config snippets to copy

config/payroll.php (example)

return [
    'pay_period' => 'monthly',
    'statutory' => [
        'sss' => env('SSS_RATE', 0.15),
        'philhealth' => env('PHILHEALTH_RATE', 0.05),
        'pagibig' => env('PAGIBIG_RATE', 0.02),
    ],
];


artisan command skeleton to run payroll:

php artisan make:command RunPayroll
// within handle(): dispatch job to compute payroll per company and period

21 — Final notes (in the user’s requested tone: technical & complete)

Use Inertia + React so Laravel remains the authoritative server (no separate API-only backend). Jetstream's Inertia stack gives session/CSRF/auth flows out-of-the-box.

Apply Service + Repository to keep business logic testable and controllers minimal. Register contracts in a provider for DI.

For payroll, prioritize correctness and traceability: keep rate versions in DB, create calculators as small classes, and create extensive unit tests for edge-cases (overtime, mid-month hires, contractual daily/hourly employees).

Integrate statutory calculators as independent modules that read official agency rate versions stored in DB. Link to BIR/SSS/PhilHealth/Pag-IBIG pages and keep those references in /docs/compliance_sources.md. 
Triple i Consulting
+3
Bureau of Internal Revenue
+3
Social Security System
+3