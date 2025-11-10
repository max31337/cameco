<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| System Administration Routes
|--------------------------------------------------------------------------
|
| These routes are protected by the 'superadmin' middleware and are only
| accessible to users with the Superadmin role. All routes here require
| authentication and superadmin privileges.
|
*/

Route::middleware(['auth', 'superadmin'])->group(function () {

    // System Dashboard
    Route::get('/system/dashboard', [\App\Http\Controllers\System\DashboardController::class, 'index'])->name('system.dashboard');

    // System Health Monitoring Detail Pages
    Route::get('/system/health', [\App\Http\Controllers\System\SystemAdministration\HealthController::class, 'index'])->name('system.health');
    Route::post('/system/health/refresh', [\App\Http\Controllers\System\SystemAdministration\HealthController::class, 'refresh'])->name('system.health.refresh');

    // Backup Management
    Route::prefix('system/backups')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'index'])->name('system.backups');
        Route::get('/{backup}', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'show'])->name('system.backups.show');
        Route::post('/trigger', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'trigger'])->name('system.backups.trigger');
        Route::post('/schedule', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'updateSchedule'])->name('system.backups.schedule');
        Route::post('/retention', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'updateRetention'])->name('system.backups.retention');
        Route::post('/{backup}/restore', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'restore'])->name('system.backups.restore');
        Route::post('/cleanup', [\App\Http\Controllers\System\SystemAdministration\BackupController::class, 'cleanup'])->name('system.backups.cleanup');
    });

    // Patch Management
    Route::prefix('system/patches')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'index'])->name('system.patches');
        Route::get('/{patch}', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'show'])->name('system.patches.show');
        Route::post('/{patch}/approve', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'approve'])->name('system.patches.approve');
        Route::post('/{patch}/reject', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'reject'])->name('system.patches.reject');
        Route::post('/{patch}/deploy', [\App\Http\Controllers\System\SystemAdministration\PatchController::class, 'markDeployed'])->name('system.patches.deploy');
    });

    // Security Audit Logs
    Route::prefix('system/security/audit')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\SystemAdministration\SecurityAuditController::class, 'index'])->name('system.security.audit');
        Route::get('/{log}', [\App\Http\Controllers\System\SystemAdministration\SecurityAuditController::class, 'show'])->name('system.security.audit.show');
        Route::get('/export', [\App\Http\Controllers\System\SystemAdministration\SecurityAuditController::class, 'export'])->name('system.security.audit.export');
    });

    // Error Logs
    Route::prefix('system/logs/errors')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'index'])->name('system.logs.errors');
        Route::get('/{errorLog}', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'show'])->name('system.logs.errors.show');
        Route::post('/{errorLog}/resolve', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'resolve'])->name('system.logs.errors.resolve');
        Route::post('/{errorLog}/bulk-resolve', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'bulkResolve'])->name('system.logs.errors.bulk-resolve');
        Route::post('/cleanup', [\App\Http\Controllers\System\Logs\ErrorLogController::class, 'cleanup'])->name('system.logs.errors.cleanup');
    });

    // Storage Management
    Route::prefix('system/storage')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\SystemAdministration\StorageController::class, 'index'])->name('system.storage');
        Route::post('/cleanup', [\App\Http\Controllers\System\SystemAdministration\StorageController::class, 'cleanup'])->name('system.storage.cleanup');
    });

    // Security & Access - Roles and Permissions
    Route::prefix('system/security/roles')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\Security\RoleController::class, 'index'])->name('system.security.roles');
        Route::get('/create', [\App\Http\Controllers\System\Security\RoleController::class, 'create'])->name('system.security.roles.create');
        Route::post('/', [\App\Http\Controllers\System\Security\RoleController::class, 'store'])->name('system.security.roles.store');
        Route::get('/{role}/edit', [\App\Http\Controllers\System\Security\RoleController::class, 'edit'])->name('system.security.roles.edit');
        Route::put('/{role}', [\App\Http\Controllers\System\Security\RoleController::class, 'update'])->name('system.security.roles.update');
        Route::post('/{role}', [\App\Http\Controllers\System\Security\RoleController::class, 'update'])->name('system.security.roles.update.post');
        Route::delete('/{role}', [\App\Http\Controllers\System\Security\RoleController::class, 'destroy'])->name('system.security.roles.destroy');
        Route::get('/{role}/permissions', [\App\Http\Controllers\System\Security\RoleController::class, 'getPermissionMatrix'])->name('system.security.roles.permissions');
    });

    // Security & Access - User Lifecycle
    Route::prefix('system/users')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'index'])->name('system.users');
        Route::get('/{user}', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'show'])->name('system.users.show');
        Route::put('/{user}', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'update'])->name('system.users.update');
        Route::post('/{user}/password-reset', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'sendPasswordReset'])->name('system.users.password-reset');
        Route::post('/{user}/deactivate', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'deactivate'])->name('system.users.deactivate');
        Route::post('/{user}/activate', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'activate'])->name('system.users.activate');
        Route::get('/{user}/audit-trail', [\App\Http\Controllers\System\Security\UserLifecycleController::class, 'auditTrail'])->name('system.users.audit-trail');
    });

    // Security & Access - Security Policies
    Route::prefix('system/security/policies')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\Security\PolicyController::class, 'index'])->name('system.security.policies');
        Route::post('/', [\App\Http\Controllers\System\Security\PolicyController::class, 'update'])->name('system.security.policies.update');
        Route::get('/{key}', [\App\Http\Controllers\System\Security\PolicyController::class, 'show'])->name('system.security.policies.show');
        Route::post('/{key}/reset', [\App\Http\Controllers\System\Security\PolicyController::class, 'reset'])->name('system.security.policies.reset');
    });

    // Security & Access - IP Rules
    Route::prefix('system/security/ip-rules')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\Security\IPRuleController::class, 'index'])->name('system.security.ip-rules');
        Route::post('/', [\App\Http\Controllers\System\Security\IPRuleController::class, 'store'])->name('system.security.ip-rules.store');
        Route::put('/{rule}', [\App\Http\Controllers\System\Security\IPRuleController::class, 'update'])->name('system.security.ip-rules.update');
        Route::delete('/{rule}', [\App\Http\Controllers\System\Security\IPRuleController::class, 'destroy'])->name('system.security.ip-rules.destroy');
        Route::post('/{rule}/toggle', [\App\Http\Controllers\System\Security\IPRuleController::class, 'toggle'])->name('system.security.ip-rules.toggle');
    });

    // Organization Control - Overview, Departments & Positions
    Route::prefix('system/organization')->group(function () {
        Route::get('/overview', [\App\Http\Controllers\System\Organization\OverviewController::class, 'index'])->name('system.organization.overview');
        
        // Departments
        Route::prefix('departments')->group(function () {
            Route::get('/', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'index'])->name('system.organization.departments');
            Route::post('/', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'store'])->name('system.organization.departments.store');
            Route::post('/seed', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'seedDefaults'])->name('system.organization.departments.seed');
            Route::get('/{department}', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'show'])->name('system.organization.departments.show');
            Route::put('/{department}', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'update'])->name('system.organization.departments.update');
            Route::delete('/{department}', [\App\Http\Controllers\System\Organization\DepartmentController::class, 'destroy'])->name('system.organization.departments.destroy');
        });

        // Positions
        Route::prefix('positions')->group(function () {
            Route::get('/', [\App\Http\Controllers\System\Organization\PositionController::class, 'index'])->name('system.organization.positions');
            Route::post('/', [\App\Http\Controllers\System\Organization\PositionController::class, 'store'])->name('system.organization.positions.store');
            Route::post('/seed', [\App\Http\Controllers\System\Organization\PositionController::class, 'seedDefaults'])->name('system.organization.positions.seed');
            Route::get('/{position}', [\App\Http\Controllers\System\Organization\PositionController::class, 'show'])->name('system.organization.positions.show');
            Route::put('/{position}', [\App\Http\Controllers\System\Organization\PositionController::class, 'update'])->name('system.organization.positions.update');
            Route::delete('/{position}', [\App\Http\Controllers\System\Organization\PositionController::class, 'destroy'])->name('system.organization.positions.destroy');
        });
    });

    // Monitoring & Reporting - Usage Analytics & Security Reports
    Route::prefix('system/reports')->group(function () {
        Route::get('/usage', [\App\Http\Controllers\System\Reports\UsageController::class, 'index'])->name('system.reports.usage');
        Route::get('/security', [\App\Http\Controllers\System\Reports\SecurityController::class, 'index'])->name('system.reports.security');
        Route::get('/payroll', [\App\Http\Controllers\System\Reports\PayrollController::class, 'index'])->name('system.reports.payroll');
        Route::get('/compliance', [\App\Http\Controllers\System\Reports\ComplianceController::class, 'index'])->name('system.reports.compliance');
    });

    // Update Management
    Route::prefix('system/updates')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\UpdateController::class, 'index'])->name('system.updates');
        Route::post('/check', [\App\Http\Controllers\System\UpdateController::class, 'check'])->name('system.updates.check');
        Route::post('/download', [\App\Http\Controllers\System\UpdateController::class, 'download'])->name('system.updates.download');
        Route::post('/deploy', [\App\Http\Controllers\System\UpdateController::class, 'deploy'])->name('system.updates.deploy');
        Route::get('/progress/{deploymentId}', [\App\Http\Controllers\System\UpdateController::class, 'progress'])->name('system.updates.progress');
        Route::post('/rollback', [\App\Http\Controllers\System\UpdateController::class, 'rollback'])->name('system.updates.rollback');
    });

    // Cron Job Management
    Route::prefix('system/cron')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'index'])->name('system.cron');
        Route::post('/', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'store'])->name('system.cron.store');
        Route::post('/sync', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'sync'])->name('system.cron.sync');
        Route::post('/{id}/toggle', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'toggle'])->name('system.cron.toggle');
        Route::post('/{id}/run', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'run'])->name('system.cron.run');
        Route::get('/{id}/history', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'history'])->name('system.cron.history');
        Route::put('/{id}', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'update'])->name('system.cron.update');
        Route::delete('/{id}', [\App\Http\Controllers\System\SystemAdministration\CronController::class, 'destroy'])->name('system.cron.destroy');
    });

    // SLA Monitoring & Metrics
    Route::prefix('system/sla')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\SLAController::class, 'index'])->name('system.sla');
        Route::get('/uptime', [\App\Http\Controllers\System\SLAController::class, 'uptime'])->name('system.sla.uptime');
        Route::get('/incidents', [\App\Http\Controllers\System\SLAController::class, 'incidents'])->name('system.sla.incidents');
        Route::get('/patches', [\App\Http\Controllers\System\SLAController::class, 'patches'])->name('system.sla.patches');
        Route::post('/cache/clear', [\App\Http\Controllers\System\SLAController::class, 'clearCache'])->name('system.sla.cache.clear');
    });

    // Vendor Contract Management
    Route::prefix('system/vendor-contract')->group(function () {
        Route::get('/', [\App\Http\Controllers\System\SystemAdministration\VendorContractController::class, 'index'])->name('system.vendor-contract');
        Route::get('/show', [\App\Http\Controllers\System\SystemAdministration\VendorContractController::class, 'show'])->name('system.vendor-contract.show');
        Route::post('/cache/clear', [\App\Http\Controllers\System\SystemAdministration\VendorContractController::class, 'clearCache'])->name('system.vendor-contract.cache.clear');
    });
});
