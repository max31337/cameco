<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\System\CronController;

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
    Route::get('/user/onboarding', [\App\Http\Controllers\System\User\UserOnboardingController::class, 'show'])->name('user.onboarding.show');
    Route::patch('/user/onboarding', [\App\Http\Controllers\System\User\UserOnboardingController::class, 'update'])->name('user.onboarding.update');
    Route::post('/user/onboarding/skip', [\App\Http\Controllers\System\User\UserOnboardingController::class, 'skip'])->name('user.onboarding.skip');

    // Onboarding UX endpoints
    Route::get('/onboarding', [\App\Http\Controllers\System\User\UserOnboardingController::class, 'page'])->name('onboarding.page');
    Route::post('/onboarding/step', [\App\Http\Controllers\System\User\UserOnboardingController::class, 'completeStep'])->name('onboarding.step');
    Route::post('/onboarding/complete', [\App\Http\Controllers\System\User\UserOnboardingController::class, 'complete'])->name('onboarding.complete');

    // System/Vendor dashboards
    Route::get('/system/dashboard', [\App\Http\Controllers\System\DashboardController::class, 'index'])->name('system.dashboard');
    Route::get('/system/vendor/dashboard', [\App\Http\Controllers\System\Vendor\DashboardController::class, 'index'])->name('system.vendor.dashboard');

    // System Health Monitoring Detail Pages
    Route::get('/system/health', action: [\App\Http\Controllers\System\HealthController::class, 'index'])->name('system.health');
    Route::post('/system/health/refresh', [\App\Http\Controllers\System\HealthController::class, 'refresh'])->name('system.health.refresh');

    // Backup Management
    Route::get('/system/backups', [\App\Http\Controllers\System\BackupController::class, 'index'])->name('system.backups');
    Route::get('/system/backups/{backup}', [\App\Http\Controllers\System\BackupController::class, 'show'])->name('system.backups.show');

    // Patch Management
    Route::get('/system/patches', [\App\Http\Controllers\System\PatchController::class, 'index'])->name('system.patches');
    Route::get('/system/patches/{patch}', [\App\Http\Controllers\System\PatchController::class, 'show'])->name('system.patches.show');
    Route::post('/system/patches/{patch}/approve', [\App\Http\Controllers\System\PatchController::class, 'approve'])->name('system.patches.approve');
    Route::post('/system/patches/{patch}/reject', [\App\Http\Controllers\System\PatchController::class, 'reject'])->name('system.patches.reject');
    Route::post('/system/patches/{patch}/deploy', [\App\Http\Controllers\System\PatchController::class, 'markDeployed'])->name('system.patches.deploy');

    // Security Audit Logs
    Route::get('/system/security/audit', [\App\Http\Controllers\System\SecurityAuditController::class, 'index'])->name('system.security.audit');
    Route::get('/system/security/audit/{log}', [\App\Http\Controllers\System\SecurityAuditController::class, 'show'])->name('system.security.audit.show');
    Route::get('/system/security/audit/export', [\App\Http\Controllers\System\SecurityAuditController::class, 'export'])->name('system.security.audit.export');

    // Storage Management
    Route::get('/system/storage', [\App\Http\Controllers\System\StorageController::class, 'index'])->name('system.storage');
    Route::post('/system/storage/cleanup', [\App\Http\Controllers\System\StorageController::class, 'cleanup'])->name('system.storage.cleanup');

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
});

// Cron Job Management (Superadmin only)
Route::middleware(['auth', 'superadmin'])->prefix('system/cron')->group(function () {
    Route::get('/', [CronController::class, 'index'])->name('system.cron');
    Route::post('/', [CronController::class, 'store'])->name('system.cron.store');
    Route::post('/sync', [CronController::class, 'sync'])->name('system.cron.sync');
    Route::post('/{id}/toggle', [CronController::class, 'toggle'])->name('system.cron.toggle');
    Route::post('/{id}/run', [CronController::class, 'run'])->name('system.cron.run');
    Route::get('/{id}/history', [CronController::class, 'history'])->name('system.cron.history');
    Route::put('/{id}', [CronController::class, 'update'])->name('system.cron.update');
    Route::delete('/{id}', [CronController::class, 'destroy'])->name('system.cron.destroy');
});