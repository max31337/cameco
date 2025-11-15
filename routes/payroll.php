<?php

// Payroll Officer Routes
use Illuminate\Support\Facades\Route;
// use App\Http\Middleware\EnsureProfileComplete; for future useronboarding workflow
use App\Http\Middleware\EnsurePayrollOfficer;
use App\Http\Controllers\Payroll\DashboardController as PayrollDashboardController;
use App\Http\Controllers\Payroll\PayrollProcessing\PayrollPeriodController;
use App\Http\Controllers\Payroll\PayrollProcessing\PayrollCalculationController;

Route::prefix('payroll')->middleware(['auth', 'verified', EnsurePayrollOfficer::class])->group(function () {
    Route::name('payroll.')->group(function () {
        // Dashboard - Single Page (returns all widget data in one response)
        Route::get('/dashboard', [PayrollDashboardController::class, 'index'])
            ->middleware('permission:payroll.dashboard.view')
            ->name('dashboard');

        // Payroll Periods - Phase 1.1 & 1.2
        Route::get('/periods', [PayrollPeriodController::class, 'index'])->name('periods.index');
        Route::post('/periods', [PayrollPeriodController::class, 'store'])->name('periods.store');
        Route::get('/periods/{id}', [PayrollPeriodController::class, 'show'])->name('periods.show');
        Route::get('/periods/{id}/edit', [PayrollPeriodController::class, 'edit'])->name('periods.edit');
        Route::put('/periods/{id}', [PayrollPeriodController::class, 'update'])->name('periods.update');
        Route::delete('/periods/{id}', [PayrollPeriodController::class, 'destroy'])->name('periods.destroy');
        Route::post('/periods/{id}/calculate', [PayrollPeriodController::class, 'calculate'])->name('periods.calculate');
        Route::post('/periods/{id}/approve', [PayrollPeriodController::class, 'approve'])->name('periods.approve');

        // Payroll Calculations - Phase 1.3
        Route::get('/calculations', [PayrollCalculationController::class, 'index'])->name('calculations.index');
        Route::post('/calculations', [PayrollCalculationController::class, 'store'])->name('calculations.store');
        Route::get('/calculations/{id}', [PayrollCalculationController::class, 'show'])->name('calculations.show');
        Route::post('/calculations/{id}/recalculate', [PayrollCalculationController::class, 'recalculate'])->name('calculations.recalculate');
        Route::post('/calculations/{id}/approve', [PayrollCalculationController::class, 'approve'])->name('calculations.approve');
        Route::delete('/calculations/{id}', [PayrollCalculationController::class, 'destroy'])->name('calculations.destroy');
    });
});