<?php

// Payroll Officer Routes
use Illuminate\Support\Facades\Route;
// use App\Http\Middleware\EnsureProfileComplete; for future useronboarding workflow
use App\Http\Middleware\EnsurePayrollOfficer;
use App\Http\Controllers\Payroll\DashboardController as PayrollDashboardController;

Route::middleware(['auth', 'verified', EnsurePayrollOfficer::class])->group(function () {
    Route::name('payroll.')->group(function () {
        // Dashboard - Single Page (returns all widget data in one response)
        Route::get('/dashboard', [PayrollDashboardController::class, 'index'])
            ->middleware('permission:payroll.dashboard.view')
            ->name('dashboard');
    });
});