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

Route::middleware(['auth'])->group(function () {
    Route::post('/system/onboarding/start', [SystemOnboardingController::class, 'start']);
    Route::post('/system/onboarding/skip', [SystemOnboardingController::class, 'skip']);
    Route::post('/system/onboarding/complete', [SystemOnboardingController::class, 'complete'])->name('system.onboarding.complete');
    Route::post('/system/onboarding/initialize-company', [SystemOnboardingController::class, 'initializeCompany'])->name('system.onboarding.initialize-company');

    // Per-user onboarding endpoints
    Route::get('/user/onboarding', [UserOnboardingController::class, 'show'])->name('user.onboarding.show');
    Route::patch('/user/onboarding', [UserOnboardingController::class, 'update'])->name('user.onboarding.update');
    Route::post('/user/onboarding/skip', [UserOnboardingController::class, 'skip'])->name('user.onboarding.skip');

    // Onboarding UX endpoints
    Route::get('/onboarding', [UserOnboardingController::class, 'page'])->name('onboarding.page');
    Route::post('/onboarding/step', [UserOnboardingController::class, 'completeStep'])->name('onboarding.step');
    Route::post('/onboarding/complete', [UserOnboardingController::class, 'complete'])->name('onboarding.complete');
});

// HR Manager Routes
// HR Manager Routes
use App\Http\Controllers\HR\DashboardController as HRDashboardController;
use App\Http\Controllers\HR\Reports\AnalyticsController;
use App\Http\Controllers\HR\Employee\EmployeeController;
use App\Http\Controllers\HR\Employee\DepartmentController;
use App\Http\Controllers\HR\Employee\PositionController;
use App\Http\Controllers\HR\Leave\LeaveBalanceController;
use App\Http\Controllers\HR\Leave\LeavePolicyController;
use App\Http\Controllers\HR\Reports\ReportController;
use App\Http\Controllers\HR\ATS\JobPostingController;
use App\Http\Controllers\HR\ATS\CandidateController;
use App\Http\Controllers\HR\ATS\ApplicationController;
use App\Http\Controllers\HR\ATS\InterviewController;
use App\Http\Controllers\HR\ATS\HiringPipelineController;
use App\Http\Controllers\HR\Workforce\ScheduleController;
use App\Http\Controllers\HR\Workforce\RotationController;
use App\Http\Controllers\HR\Workforce\AssignmentController;
use App\Http\Controllers\HR\Timekeeping\AttendanceController;
use App\Http\Controllers\HR\Timekeeping\OvertimeController;
use App\Http\Controllers\HR\Timekeeping\ImportController;
use App\Http\Controllers\HR\Timekeeping\AnalyticsController as TimekeepingAnalyticsController;
use App\Http\Middleware\EnsureHRManager;


Route::middleware(['auth', 'verified', EnsureHRManager::class])->prefix('hr')->name('hr.')->group(function () {
    // HR Dashboard
    Route::get('/dashboard', [HRDashboardController::class, 'index'])->name('dashboard');

    // HR Reports & Analytics
    Route::get('/reports/analytics', [AnalyticsController::class, 'index'])->name('reports.analytics');

    // Employee Management
    Route::resource('employees', EmployeeController::class);
    Route::post('/employees/{id}/restore', [EmployeeController::class, 'restore'])->name('employees.restore');

    // Department Management
    Route::resource('departments', DepartmentController::class)->only(['index','store','update','destroy']);

    // Position Managementcontroller: 
    Route::resource('positions', PositionController::class)->only(['index','store','update','destroy']);

    // Leave Management (ISSUE-5)
    Route::prefix('leave')->name('leave.')->group(function () {
        Route::get('/requests', [EmployeeController::class, 'leaveRequests'])->name('requests');
        Route::get('/balances', [LeaveBalanceController::class, 'index'])->name('balances');
        Route::get('/policies', [LeavePolicyController::class, 'index'])->name('policies');
    });

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/employees', [ReportController::class, 'employees'])->name('employees');
        Route::get('/leave', [ReportController::class, 'leave'])->name('leave');
    });

    // Document Management (ISSUE-6)
    Route::prefix('documents')->name('documents.')->group(function () {
        Route::get('/templates', [EmployeeController::class, 'documentTemplates'])->name('templates.index');
        Route::get('/templates/create', [EmployeeController::class, 'createDocumentTemplate'])->name('templates.create');
        Route::post('/templates', [EmployeeController::class, 'storeDocumentTemplate'])->name('templates.store');
        Route::get('/generate/{template}', [EmployeeController::class, 'generateDocument'])->name('generate.create');
        Route::post('/generate/{template}', [EmployeeController::class, 'storeDocument'])->name('generate.store');
        Route::get('/list', [EmployeeController::class, 'listDocuments'])->name('list');
        Route::get('/{document}/download', [EmployeeController::class, 'downloadDocument'])->name('download');
    });

    // ATS (Applicant Tracking System) Module
    Route::prefix('ats')->name('ats.')->group(function () {
        // Job Postings
        Route::get('/job-postings', [JobPostingController::class, 'index'])
            ->middleware('permission:recruitment.job_postings.view')
            ->name('job-postings.index');
        Route::get('/job-postings/create', [JobPostingController::class, 'create'])
            ->middleware('permission:recruitment.job_postings.create')
            ->name('job-postings.create');
        Route::post('/job-postings', [JobPostingController::class, 'store'])
            ->middleware('permission:recruitment.job_postings.create')
            ->name('job-postings.store');
        Route::get('/job-postings/{id}/edit', [JobPostingController::class, 'edit'])
            ->middleware('permission:recruitment.job_postings.update')
            ->name('job-postings.edit');
        Route::put('/job-postings/{id}', [JobPostingController::class, 'update'])
            ->middleware('permission:recruitment.job_postings.update')
            ->name('job-postings.update');
        Route::delete('/job-postings/{id}', [JobPostingController::class, 'destroy'])
            ->middleware('permission:recruitment.job_postings.delete')
            ->name('job-postings.destroy');
        Route::post('/job-postings/{id}/publish', [JobPostingController::class, 'publish'])
            ->middleware('permission:recruitment.job_postings.update')
            ->name('job-postings.publish');
        Route::post('/job-postings/{id}/close', [JobPostingController::class, 'close'])
            ->middleware('permission:recruitment.job_postings.update')
            ->name('job-postings.close');

        // Candidates
        Route::get('/candidates', [CandidateController::class, 'index'])
            ->middleware('permission:recruitment.candidates.view')
            ->name('candidates.index');
        Route::get('/candidates/{id}', [CandidateController::class, 'show'])
            ->middleware('permission:recruitment.candidates.view')
            ->name('candidates.show');
        Route::post('/candidates', [CandidateController::class, 'store'])
            ->middleware('permission:recruitment.candidates.create')
            ->name('candidates.store');
        Route::put('/candidates/{id}', [CandidateController::class, 'update'])
            ->middleware('permission:recruitment.candidates.update')
            ->name('candidates.update');
        Route::post('/candidates/{id}/notes', [CandidateController::class, 'addNote'])
            ->middleware('permission:recruitment.candidates.update')
            ->name('candidates.notes.store');

        // Applications
        Route::get('/applications', [ApplicationController::class, 'index'])
            ->middleware('permission:recruitment.applications.view')
            ->name('applications.index');
        Route::get('/applications/{id}', [ApplicationController::class, 'show'])
            ->middleware('permission:recruitment.applications.view')
            ->name('applications.show');
        Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus'])
            ->middleware('permission:recruitment.applications.update')
            ->name('applications.update-status');
        Route::post('/applications/{id}/shortlist', [ApplicationController::class, 'shortlist'])
            ->middleware('permission:recruitment.applications.update')
            ->name('applications.shortlist');
        Route::post('/applications/{id}/reject', [ApplicationController::class, 'reject'])
            ->middleware('permission:recruitment.applications.update')
            ->name('applications.reject');

        // Interviews
        Route::get('/interviews', [InterviewController::class, 'index'])
            ->middleware('permission:recruitment.interviews.view')
            ->name('interviews.index');
        Route::get('/interviews/{id}', [InterviewController::class, 'show'])
            ->middleware('permission:recruitment.interviews.view')
            ->name('interviews.show');
        Route::post('/interviews', [InterviewController::class, 'store'])
            ->middleware('permission:recruitment.interviews.create')
            ->name('interviews.store');
        Route::put('/interviews/{id}', [InterviewController::class, 'update'])
            ->middleware('permission:recruitment.interviews.update')
            ->name('interviews.update');
        Route::post('/interviews/{id}/feedback', [InterviewController::class, 'addFeedback'])
            ->middleware('permission:recruitment.interviews.update')
            ->name('interviews.feedback');
        Route::post('/interviews/{id}/cancel', [InterviewController::class, 'cancel'])
            ->middleware('permission:recruitment.interviews.update')
            ->name('interviews.cancel');
        Route::post('/interviews/{id}/complete', [InterviewController::class, 'markCompleted'])
            ->middleware('permission:recruitment.interviews.update')
            ->name('interviews.complete');

        // Hiring Pipeline
        Route::get('/hiring-pipeline', [HiringPipelineController::class, 'index'])
            ->middleware('permission:recruitment.hiring_pipeline.view')
            ->name('hiring-pipeline.index');
        Route::put('/hiring-pipeline/applications/{id}/move', [HiringPipelineController::class, 'moveApplication'])
            ->middleware('permission:recruitment.hiring_pipeline.update')
            ->name('hiring-pipeline.move');
    });

    // Workforce Management Module
    Route::prefix('workforce')->name('workforce.')->group(function () {
        // Work Schedules
        Route::get('/schedules', [ScheduleController::class, 'index'])
            ->middleware('permission:workforce.schedules.view')
            ->name('schedules.index');
        Route::get('/schedules/create', [ScheduleController::class, 'create'])
            ->middleware('permission:workforce.schedules.create')
            ->name('schedules.create');
        Route::post('/schedules', [ScheduleController::class, 'store'])
            ->middleware('permission:workforce.schedules.create')
            ->name('schedules.store');
        Route::get('/schedules/{id}', [ScheduleController::class, 'show'])
            ->middleware('permission:workforce.schedules.view')
            ->name('schedules.show');
        Route::get('/schedules/{id}/edit', [ScheduleController::class, 'edit'])
            ->middleware('permission:workforce.schedules.update')
            ->name('schedules.edit');
        Route::put('/schedules/{id}', [ScheduleController::class, 'update'])
            ->middleware('permission:workforce.schedules.update')
            ->name('schedules.update');
        Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy'])
            ->middleware('permission:workforce.schedules.delete')
            ->name('schedules.destroy');

        // Employee Rotations
        Route::get('/rotations', [RotationController::class, 'index'])
            ->middleware('permission:workforce.rotations.view')
            ->name('rotations.index');
        Route::get('/rotations/create', [RotationController::class, 'create'])
            ->middleware('permission:workforce.rotations.create')
            ->name('rotations.create');
        Route::post('/rotations', [RotationController::class, 'store'])
            ->middleware('permission:workforce.rotations.create')
            ->name('rotations.store');
        Route::get('/rotations/{id}', [RotationController::class, 'show'])
            ->middleware('permission:workforce.rotations.view')
            ->name('rotations.show');
        Route::get('/rotations/{id}/edit', [RotationController::class, 'edit'])
            ->middleware('permission:workforce.rotations.update')
            ->name('rotations.edit');
        Route::put('/rotations/{id}', [RotationController::class, 'update'])
            ->middleware('permission:workforce.rotations.update')
            ->name('rotations.update');
        Route::delete('/rotations/{id}', [RotationController::class, 'destroy'])
            ->middleware('permission:workforce.rotations.delete')
            ->name('rotations.destroy');

        // Shift Assignments
        Route::get('/assignments', [AssignmentController::class, 'index'])
            ->middleware('permission:workforce.assignments.view')
            ->name('assignments.index');
        Route::get('/assignments/create', [AssignmentController::class, 'create'])
            ->middleware('permission:workforce.assignments.create')
            ->name('assignments.create');
        Route::post('/assignments', [AssignmentController::class, 'store'])
            ->middleware('permission:workforce.assignments.create')
            ->name('assignments.store');
        Route::post('/assignments/bulk', [AssignmentController::class, 'bulkAssign'])
            ->middleware('permission:workforce.assignments.create')
            ->name('assignments.bulk');
        Route::get('/assignments/coverage', [AssignmentController::class, 'coverage'])
            ->middleware('permission:workforce.assignments.view')
            ->name('assignments.coverage');
        Route::get('/assignments/{id}', [AssignmentController::class, 'show'])
            ->middleware('permission:workforce.assignments.view')
            ->name('assignments.show');
        Route::get('/assignments/{id}/edit', [AssignmentController::class, 'edit'])
            ->middleware('permission:workforce.assignments.update')
            ->name('assignments.edit');
        Route::put('/assignments/{id}', [AssignmentController::class, 'update'])
            ->middleware('permission:workforce.assignments.update')
            ->name('assignments.update');
        Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy'])
            ->middleware('permission:workforce.assignments.delete')
            ->name('assignments.destroy');
    });

    // Timekeeping Module
    Route::prefix('timekeeping')->name('timekeeping.')->group(function () {
        // Attendance Management
        Route::get('/attendance', [AttendanceController::class, 'index'])
            ->middleware('permission:timekeeping.attendance.view')
            ->name('attendance.index');
        Route::get('/attendance/create', [AttendanceController::class, 'create'])
            ->middleware('permission:timekeeping.attendance.create')
            ->name('attendance.create');
        Route::post('/attendance', [AttendanceController::class, 'store'])
            ->middleware('permission:timekeeping.attendance.create')
            ->name('attendance.store');
        Route::post('/attendance/bulk', [AttendanceController::class, 'bulkEntry'])
            ->middleware('permission:timekeeping.attendance.create')
            ->name('attendance.bulk');
        Route::get('/attendance/daily/{date}', [AttendanceController::class, 'daily'])
            ->middleware('permission:timekeeping.attendance.view')
            ->name('attendance.daily');
        Route::get('/attendance/{id}', [AttendanceController::class, 'show'])
            ->middleware('permission:timekeeping.attendance.view')
            ->name('attendance.show');
        Route::get('/attendance/{id}/edit', [AttendanceController::class, 'edit'])
            ->middleware('permission:timekeeping.attendance.update')
            ->name('attendance.edit');
        Route::put('/attendance/{id}', [AttendanceController::class, 'update'])
            ->middleware('permission:timekeeping.attendance.update')
            ->name('attendance.update');
        Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy'])
            ->middleware('permission:timekeeping.attendance.delete')
            ->name('attendance.destroy');
        Route::post('/attendance/{id}/correct', [AttendanceController::class, 'correctAttendance'])
            ->middleware('permission:timekeeping.attendance.correct')
            ->name('attendance.correct');
        Route::get('/attendance/{id}/history', [AttendanceController::class, 'correctionHistory'])
            ->middleware('permission:timekeeping.attendance.view')
            ->name('attendance.history');

        // Overtime Management
        Route::get('/overtime', [OvertimeController::class, 'index'])
            ->middleware('permission:timekeeping.overtime.view')
            ->name('overtime.index');
        Route::get('/overtime/create', [OvertimeController::class, 'create'])
            ->middleware('permission:timekeeping.overtime.create')
            ->name('overtime.create');
        Route::post('/overtime', [OvertimeController::class, 'store'])
            ->middleware('permission:timekeeping.overtime.create')
            ->name('overtime.store');
        Route::get('/overtime/{id}', [OvertimeController::class, 'show'])
            ->middleware('permission:timekeeping.overtime.view')
            ->name('overtime.show');
        Route::get('/overtime/{id}/edit', [OvertimeController::class, 'edit'])
            ->middleware('permission:timekeeping.overtime.update')
            ->name('overtime.edit');
        Route::put('/overtime/{id}', [OvertimeController::class, 'update'])
            ->middleware('permission:timekeeping.overtime.update')
            ->name('overtime.update');
        Route::delete('/overtime/{id}', [OvertimeController::class, 'destroy'])
            ->middleware('permission:timekeeping.overtime.delete')
            ->name('overtime.destroy');
        Route::post('/overtime/{id}/process', [OvertimeController::class, 'processOvertime'])
            ->middleware('permission:timekeeping.overtime.update')
            ->name('overtime.process');
        Route::get('/overtime/budget/{departmentId}', [OvertimeController::class, 'getBudget'])
            ->middleware('permission:timekeeping.overtime.view')
            ->name('overtime.budget');

        // Import Management
        Route::get('/import', [ImportController::class, 'index'])
            ->middleware('permission:timekeeping.import.view')
            ->name('import.index');
        Route::post('/import/upload', [ImportController::class, 'upload'])
            ->middleware('permission:timekeeping.import.create')
            ->name('import.upload');
        Route::post('/import/{id}/process', [ImportController::class, 'process'])
            ->middleware('permission:timekeeping.import.create')
            ->name('import.process');
        Route::get('/import/history', [ImportController::class, 'history'])
            ->middleware('permission:timekeeping.import.view')
            ->name('import.history');
        Route::get('/import/{id}/errors', [ImportController::class, 'errors'])
            ->middleware('permission:timekeeping.import.view')
            ->name('import.errors');

        // Analytics & Reports
        Route::get('/overview', [TimekeepingAnalyticsController::class, 'overview'])
            ->middleware('permission:timekeeping.analytics.view')
            ->name('overview');
        Route::get('/analytics', [TimekeepingAnalyticsController::class, 'overview'])
            ->middleware('permission:timekeeping.analytics.view')
            ->name('analytics.overview');
        Route::get('/analytics/department/{id}', [TimekeepingAnalyticsController::class, 'department'])
            ->middleware('permission:timekeeping.analytics.view')
            ->name('analytics.department');
        Route::get('/analytics/employee/{id}', [TimekeepingAnalyticsController::class, 'employee'])
            ->middleware('permission:timekeeping.analytics.view')
            ->name('analytics.employee');
    });
});
