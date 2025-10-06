<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Admin profile completion routes (before middleware that requires employee records)
Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/admin/profile/complete', [AdminProfileController::class, 'show'])
        ->name('admin.profile.complete');
    Route::post('/admin/profile/complete', [AdminProfileController::class, 'store'])
        ->name('admin.profile.store');
    Route::post('/admin/profile/skip', [AdminProfileController::class, 'skip'])
        ->name('admin.profile.skip');
    Route::post('/admin/profile/save-progress', [AdminProfileController::class, 'saveProgress'])
        ->name('admin.profile.save-progress');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
    'user.active', // Ensure user account is active
    'admin.has.employee', // Redirect admins without employee records
])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Admin Pages
    Route::get('/admin/employees', function () {
        return Inertia::render('Admin/Employees');
    })->name('admin.employees');
    
    Route::get('/admin/payroll', function () {
        return Inertia::render('Admin/Payroll');
    })->name('admin.payroll');
    
    Route::get('/admin/reports', function () {
        return Inertia::render('Admin/Reports');
    })->name('admin.reports');
});
