<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

//Controllers
use \App\Http\Controllers\System\User\UserOnboardingController;
use \App\Http\Controllers\System\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

use App\Http\Middleware\EnsureProfileComplete;

// Keep dashboard accessible so users can complete onboarding; do not apply the
// EnsureProfileComplete middleware to the dashboard route itself (it redirects
// to the dashboard when users are not complete which would cause a loop).
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';

use App\Http\Controllers\System\Onboarding\SystemOnboardingController;

// System onboarding endpoints (use existing auth)
Route::middleware(['auth'])->group(function () {
    Route::post('/system/onboarding/start', [SystemOnboardingController::class, 'start']);
    Route::post('/system/onboarding/skip', [SystemOnboardingController::class, 'skip']);
    Route::post('/system/onboarding/complete', [SystemOnboardingController::class, 'complete'])->name('system.onboarding.complete');

    // Per-user onboarding endpoints
    Route::get('/user/onboarding', [UserOnboardingController::class, 'show'])->name('user.onboarding.show');
    Route::patch('/user/onboarding', [UserOnboardingController::class, 'update'])->name('user.onboarding.update');
    Route::post('/user/onboarding/skip', [UserOnboardingController::class, 'skip'])->name('user.onboarding.skip');

    // Onboarding UX endpoints
    Route::get('/onboarding', [UserOnboardingController::class, 'page'])->name('onboarding.page');
    Route::post('/onboarding/step', [UserOnboardingController::class, 'completeStep'])->name('onboarding.step');
    Route::post('/onboarding/complete', [UserOnboardingController::class, 'complete'])->name('onboarding.complete');

    // System/Vendor dashboards
    Route::get('/system/dashboard', [DashboardController::class, 'index'])->name('system.dashboard');
    Route::get('/system/vendor/dashboard', [\App\Http\Controllers\System\Vendor\DashboardController::class, 'index'])->name('system.vendor.dashboard');

    // System Health Monitoring Detail Pages
    Route::get('/system/health', action: [\App\Http\Controllers\System\SystemAdministration\HealthController::class, 'index'])->name('system.health');
    Route::post('/system/health/refresh', [\App\Http\Controllers\System\SystemAdministration\HealthController::class, 'refresh'])->name('system.health.refresh');

    // Backup Management
    Route::get('/system/backups', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'index'])->name('system.backups');
    Route::get('/system/backups/{backup}', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'show'])->name('system.backups.show');
    Route::post('/system/backups/trigger', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'trigger'])->name('system.backups.trigger');
    Route::post('/system/backups/schedule', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'updateSchedule'])->name('system.backups.schedule');
    Route::post('/system/backups/retention', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'updateRetention'])->name('system.backups.retention');
    Route::post('/system/backups/{backup}/restore', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'restore'])->name('system.backups.restore');
    Route::post('/system/backups/cleanup', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'cleanup'])->name('system.backups.cleanup');

    // Patch Management
    Route::get('/system/patches', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'index'])->name('system.patches');
    Route::get('/system/patches/{patch}', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'show'])->name('system.patches.show');
    Route::post('/system/patches/{patch}/approve', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'approve'])->name('system.patches.approve');
    Route::post('/system/patches/{patch}/reject', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'reject'])->name('system.patches.reject');
    Route::post('/system/patches/{patch}/deploy', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'markDeployed'])->name('system.patches.deploy');

    // Security Audit Logs
    Route::get('/system/security/audit', [\App\Http\Controllers\System\SystemAdministration\SecurityAuditController::class, 'index'])->name('system.security.audit');
    Route::get('/system/security/audit/{log}', [\App\Http\Controllers\System\SystemAdministration\SecurityAuditController::class, 'show'])->name('system.security.audit.show');
    Route::get('/system/security/audit/export', [\App\Http\Controllers\System\SystemAdministration\SecurityAuditController::class, 'export'])->name('system.security.audit.export');

    // Error Logs
    Route::get('/system/logs/errors', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'index'])->name('system.logs.errors');
    Route::get('/system/logs/errors/{errorLog}', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'show'])->name('system.logs.errors.show');
    Route::post('/system/logs/errors/{errorLog}/resolve', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'resolve'])->name('system.logs.errors.resolve');
    Route::post('/system/logs/errors/{errorLog}/bulk-resolve', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'bulkResolve'])->name('system.logs.errors.bulk-resolve');
    Route::post('/system/logs/errors/cleanup', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'cleanup'])->name('system.logs.errors.cleanup');

    // Storage Management
    Route::get('/system/storage', [\App\Http\Controllers\System\SystemAdministration\StorageController::class, 'index'])->name('system.storage');
    Route::post('/system/storage/cleanup', [\App\Http\Controllers\System\SystemAdministration\StorageController::class, 'cleanup'])->name('system.storage.cleanup');

    // Security & Access - Roles and Permissions (Superadmin only)
    Route::middleware(['superadmin'])->prefix('system/security')->group(function () {
        Route::get('/roles', [\App\Http\Controllers\System\Security\RoleController::class, 'index'])->name('system.security.roles');
        Route::get('/roles/create', [\App\Http\Controllers\System\Security\RoleController::class, 'create'])->name('system.security.roles.create');
        Route::post('/roles', [\App\Http\Controllers\System\Security\RoleController::class, 'store'])->name('system.security.roles.store');
        Route::get('/roles/{role}/edit', [\App\Http\Controllers\System\Security\RoleController::class, 'edit'])->name('system.security.roles.edit');
        Route::put('/roles/{role}', [\App\Http\Controllers\System\Security\RoleController::class, 'update'])->name('system.security.roles.update');
        Route::delete('/roles/{role}', [\App\Http\Controllers\System\Security\RoleController::class, 'destroy'])->name('system.security.roles.destroy');
        Route::get('/roles/{role}/permissions', [\App\Http\Controllers\System\Security\RoleController::class, 'getPermissionMatrix'])->name('system.security.roles.permissions');
    });

    // Security & Access - User Lifecycle (Superadmin only)
    Route::middleware(['superadmin'])->prefix('system/users')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'index'])->name('system.users');
        Route::get('/{user}', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'show'])->name('system.users.show');
        Route::put('/{user}', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'update'])->name('system.users.update');
        Route::post('/{user}/password-reset', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'sendPasswordReset'])->name('system.users.password-reset');
        Route::post('/{user}/deactivate', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'deactivate'])->name('system.users.deactivate');
        Route::post('/{user}/activate', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'activate'])->name('system.users.activate');
        Route::get('/{user}/audit-trail', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'auditTrail'])->name('system.users.audit-trail');
    });

    // Security & Access - Security Policies (Superadmin only)
    Route::middleware(['superadmin'])->prefix('system/security')->group(function () {
        Route::get('/policies', [\App\Http\Controllers\System\Security\PolicyController::class, 'index'])->name('system.security.policies');
        Route::post('/policies', [\App\Http\Controllers\System\Security\PolicyController::class, 'update'])->name('system.security.policies.update');
        Route::get('/policies/{key}', [\App\Http\Controllers\System\Security\PolicyController::class, 'show'])->name('system.security.policies.show');
        Route::post('/policies/{key}/reset', [\App\Http\Controllers\System\Security\PolicyController::class, 'reset'])->name('system.security.policies.reset');
    });

    // Security & Access - IP Rules (Superadmin only)
    Route::middleware(['superadmin'])->prefix('system/security/ip-rules')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\Security\IPRuleController::class, 'index'])->name('system.security.ip-rules');
        Route::post('/', [\App\Http\Controllers\System\Security\IPRuleController::class, 'store'])->name('system.security.ip-rules.store');
        Route::put('/{rule}', [\App\Http\Controllers\System\Security\IPRuleController::class, 'update'])->name('system.security.ip-rules.update');
        Route::delete('/{rule}', [\App\Http\Controllers\System\Security\IPRuleController::class, 'destroy'])->name('system.security.ip-rules.destroy');
        Route::post('/{rule}/toggle', [\App\Http\Controllers\System\Security\IPRuleController::class, 'toggle'])->name('system.security.ip-rules.toggle');
    });

    // Organization Control - Overview, Departments & Positions (Superadmin only)
    Route::middleware(['superadmin'])->prefix('system/organization')->group(function () {
        Route::get('/overview', [\App\Http\Controllers\System\Organization\OverviewController::class, 'index'])->name('system.organization.overview');
        
        Route::get('/departments', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'index'])->name('system.organization.departments');
        Route::post('/departments', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'store'])->name('system.organization.departments.store');
        Route::get('/departments/{department}', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'show'])->name('system.organization.departments.show');
        Route::put('/departments/{department}', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'update'])->name('system.organization.departments.update');
        Route::delete('/departments/{department}', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'destroy'])->name('system.organization.departments.destroy');

        Route::get('/positions', [\App\Http\Controllers\System\Organization\PositionController::class, 'index'])->name('system.organization.positions');
        Route::post('/positions', [\App\Http\Controllers\System\Organization\PositionController::class, 'store'])->name('system.organization.positions.store');
        Route::get('/positions/{position}', [\App\Http\Controllers\System\Organization\PositionController::class, 'show'])->name('system.organization.positions.show');
        Route::put('/positions/{position}', [\App\Http\Controllers\System\Organization\PositionController::class, 'update'])->name('system.organization.positions.update');
        Route::delete('/positions/{position}', [\App\Http\Controllers\System\Organization\PositionController::class, 'destroy'])->name('system.organization.positions.destroy');
    });

    // Monitoring & Reporting - Usage Analytics & Security Reports (Superadmin only)
    Route::middleware(['auth', 'superadmin'])->prefix('system/reports')->group(function () {
        Route::get('/usage', [\App\Http\Controllers\System\Reports\UsageController::class, 'index'])->name('system.reports.usage');
        Route::get('/security', [\App\Http\Controllers\System\Reports\SecurityController::class, 'index'])->name('system.reports.security');
        Route::get('/payroll', [\App\Http\Controllers\System\Reports\PayrollController::class, 'index'])->name('system.reports.payroll');
        Route::get('/compliance', [\App\Http\Controllers\System\Reports\ComplianceController::class, 'index'])->name('system.reports.compliance');
    });
});

// Cron Job Management (Superadmin only)
Route::middleware(['auth', 'superadmin'])->prefix('system/cron')->group(function () {
    Route::get('/', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'index'])->name('system.cron');
    Route::post('/', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'store'])->name('system.cron.store');
    Route::post('/sync', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'sync'])->name('system.cron.sync');
    Route::post('/{id}/toggle', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'toggle'])->name('system.cron.toggle');
    Route::post('/{id}/run', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'run'])->name('system.cron.run');
    Route::get('/{id}/history', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'history'])->name('system.cron.history');
    Route::put('/{id}', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'update'])->name('system.cron.update');
    Route::delete('/{id}', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'destroy'])->name('system.cron.destroy');
});