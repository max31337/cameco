<?php

// Payroll Officer Routes
use Illuminate\Support\Facades\Route;
// use App\Http\Middleware\EnsureProfileComplete; for future useronboarding workflow
use App\Http\Middleware\EnsurePayrollOfficer;
use App\Http\Controllers\Payroll\DashboardController as PayrollDashboardController;
use App\Http\Controllers\Payroll\PayrollProcessing\PayrollPeriodController;
use App\Http\Controllers\Payroll\PayrollProcessing\PayrollCalculationController;
use App\Http\Controllers\Payroll\PayrollProcessing\PayrollAdjustmentController;
use App\Http\Controllers\Payroll\EmployeePayroll\EmployeePayrollInfoController;
use App\Http\Controllers\Payroll\EmployeePayroll\SalaryComponentController;
use App\Http\Controllers\Payroll\EmployeePayroll\AllowancesDeductionsController;

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

        // Payroll Adjustments - Phase 1.4
        Route::get('/adjustments', [PayrollAdjustmentController::class, 'index'])->name('adjustments.index');
        Route::post('/adjustments', [PayrollAdjustmentController::class, 'store'])->name('adjustments.store');
        Route::get('/adjustments/{id}', [PayrollAdjustmentController::class, 'show'])->name('adjustments.show');
        Route::put('/adjustments/{id}', [PayrollAdjustmentController::class, 'update'])->name('adjustments.update');
        Route::delete('/adjustments/{id}', [PayrollAdjustmentController::class, 'destroy'])->name('adjustments.destroy');
        Route::post('/adjustments/{id}/approve', [PayrollAdjustmentController::class, 'approve'])->name('adjustments.approve');
        Route::post('/adjustments/{id}/reject', [PayrollAdjustmentController::class, 'reject'])->name('adjustments.reject');
        Route::get('/adjustments/history/{employeeId}', [PayrollAdjustmentController::class, 'history'])->name('adjustments.history');

        // Employee Payroll Info - Phase 2.1
        Route::get('/employee-payroll-info', [EmployeePayrollInfoController::class, 'index'])->name('employee-payroll-info.index');
        Route::post('/employee-payroll-info', [EmployeePayrollInfoController::class, 'store'])->name('employee-payroll-info.store');
        Route::get('/employee-payroll-info/create', [EmployeePayrollInfoController::class, 'create'])->name('employee-payroll-info.create');
        Route::get('/employee-payroll-info/{id}', [EmployeePayrollInfoController::class, 'show'])->name('employee-payroll-info.show');
        Route::get('/employee-payroll-info/{id}/edit', [EmployeePayrollInfoController::class, 'edit'])->name('employee-payroll-info.edit');
        Route::put('/employee-payroll-info/{id}', [EmployeePayrollInfoController::class, 'update'])->name('employee-payroll-info.update');
        Route::delete('/employee-payroll-info/{id}', [EmployeePayrollInfoController::class, 'destroy'])->name('employee-payroll-info.destroy');

        // Salary Components - Phase 2.2
        Route::get('/salary-components', [SalaryComponentController::class, 'index'])->name('salary-components.index');
        Route::post('/salary-components', [SalaryComponentController::class, 'store'])->name('salary-components.store');
        Route::get('/salary-components/create', [SalaryComponentController::class, 'create'])->name('salary-components.create');
        Route::get('/salary-components/{id}', [SalaryComponentController::class, 'show'])->name('salary-components.show');
        Route::get('/salary-components/{id}/edit', [SalaryComponentController::class, 'edit'])->name('salary-components.edit');
        Route::put('/salary-components/{id}', [SalaryComponentController::class, 'update'])->name('salary-components.update');
        Route::delete('/salary-components/{id}', [SalaryComponentController::class, 'destroy'])->name('salary-components.destroy');

        // Allowances & Deductions - Phase 2.3
        Route::get('/allowances-deductions', [AllowancesDeductionsController::class, 'index'])->name('allowances-deductions.index');
        Route::post('/allowances-deductions', [AllowancesDeductionsController::class, 'store'])->name('allowances-deductions.store');
        Route::post('/allowances-deductions/bulk-assign', [AllowancesDeductionsController::class, 'bulkAssign'])->name('allowances-deductions.bulk-assign');
        Route::get('/allowances-deductions/{id}', [AllowancesDeductionsController::class, 'show'])->name('allowances-deductions.show');
        Route::put('/allowances-deductions/{id}', [AllowancesDeductionsController::class, 'update'])->name('allowances-deductions.update');
        Route::delete('/allowances-deductions/{id}', [AllowancesDeductionsController::class, 'destroy'])->name('allowances-deductions.destroy');
        Route::get('/allowances-deductions/{employeeId}/history', [AllowancesDeductionsController::class, 'history'])->name('allowances-deductions.history');
    });
});