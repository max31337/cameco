SyncingSteel System — README

Internal Information Management System for Cathay Metal Corporation
(HR → Timekeeping → Payroll — Laravel Jetstream + React (Inertia) — Service & Repository architecture)

Proposal Title (short)
SyncingSteel System — Internal Information Management System for Cathay Metal Corporation

Rationale & Objectives — (trimmed, keep full proposal in /docs/proposal.md)
Replace manual time cards and paper HR operations with a secure web system. Provide: digital timekeeping (biometric-ready), centralized HR data, leave/workflow, automated payroll integrated with attendance, employee self-service portal, and role-based access controls.

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

2 — Tech stack (recommended)

Backend: PHP 8.1+ (or 8.2), Laravel 10+

Auth/UI: Laravel Jetstream with Inertia + React stack

Frontend: React (functional components + hooks), Inertia.js, Tailwind CSS (or your modular CSS system)

DB: MySQL / MariaDB (or PostgreSQL)

Queues: Redis (or database) + Laravel Queue + Horizon (optional)

Scheduler: Laravel Scheduler (cron) for payroll runs / remittances / nightly reconciliation

Extras: spatie/laravel-permission, maatwebsite/excel (export), barryvdh/laravel-cors (if needed), Docker for local dev

Testing: PHPUnit and Pest (optional)

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

Assumes Docker is optional; commands for local machine with PHP + Composer + Node installed.

# 1. Clone
git clone git@yourrepo:cameco.git
cd cameco

# 2. Install backend composer deps
composer install
cp .env.example .env
php artisan key:generate

# 3. DB & migrations
# configure DB in .env
php artisan migrate --seed

# 4. Install Jetstream + Inertia + React
composer require laravel/jetstream
php artisan jetstream:install inertia --teams   # or without --teams
npm install
npm run dev

# 5. Bind interfaces
php artisan vendor:publish --tag=repository-bindings # if you have a package else create service provider

# 6. Serve
php artisan serve

5 — Jetstream + React (Inertia): keep Laravel as primary backend

Use Jetstream with the Inertia + React option. Inertia allows server-side routing and page rendering with Laravel controllers returning Inertia pages (Inertia::render('Pages/Dashboard', $props)), so Laravel remains the orchestrator (not a headless API).

Authentication, session, CSRF, and server-side rendering (initial HTML) are handled by Laravel. React components are delivered by Inertia as pages/components. This satisfies "Laravel is not an API-only backend" while using React as componentized view layer.

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

7 — React + Inertia component conventions

Store page components under resources/js/Pages/...

Reusable UI components under resources/js/Components/...

Use Inertia props for server-provided data and client fetching for progressive enhancement.

Keep components small and single-responsibility: EmployeeTable, EmployeeForm, AttendanceClock.

Example Inertia page (resources/js/Pages/Hr/Employees/Index.jsx):

import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import Pagination from '@/Components/Pagination';
import EmployeeTable from '@/Components/EmployeeTable';

export default function Index({ employees }) {
  return (
    <div>
      <h1>Employees</h1>
      <EmployeeTable data={employees.data} />
      <Pagination meta={employees.meta} />
    </div>
  );
}

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

Device-agnostic: accept clock-ins from biometric device, web kiosk, or mobile.

Store raw punches (device timestamp) and computed attendance (daily summary).

Allow reconciliation and overrides with audit trail.

Tables

attendance_punches — id, employee_id, device_id, punch_type (in/out/break), recorded_at, source, meta, created_by

attendances — id, employee_id, date, time_in, time_out, worked_hours, overtime_hours, status (approved/pending), created_at

Flow

Device/web sends punch to endpoint: POST /attendance/punch (accepts biometric id / employee id)

Save raw punch with source and signature.

Nightly job (scheduler) groups punches to compute attendances record: calculate worked hours, detect anomalies (missing in/out), compute overtime using company policy.

HR reviews anomalies and approves.

Example punch endpoint

Route::post('/attendance/punch', [AttendanceController::class, 'store']);

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

For biometric integration: define a simple webhook contract — devices POST to /attendance/punch with HMAC signature; validate signature and save. Keep device drivers pluggable.

For payroll rollback: mark payroll runs with status and reversible actions (void payroll, issue correction run).

16 — Suggested DB migrations (summary)

employees, positions, departments

attendance_punches, attendances

payroll_runs, payroll_items, payroll_deductions

tax_rate_versions, statutory_configurations — keep history of rates used

17 — Example developer checklist (for HR → payroll go-live)

 Employee master data migrated & verified

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

19 — Next steps & roadmap (short)

Implement HR Core (employee CRUD, RBAC) — MVP within 2-3 weeks (dev estimate).

Implement Timekeeping (punch ingestion + nightly reconciliation).

Implement Payroll calculation engine (statutory modules pluggable).

Add remittance exports & BIR reports.

Add audit, approvals, payslip distribution, and backups.

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