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
use App\Http\Controllers\HR\AnalyticsController;
use App\Http\Controllers\HR\EmployeeController;
use App\Http\Controllers\HR\DepartmentController;
use App\Http\Controllers\HR\PositionController;
use App\Http\Controllers\HR\LeaveBalanceController;
use App\Http\Controllers\HR\LeavePolicyController;
use App\Http\Controllers\HR\ReportController;
use App\Http\Controllers\HR\ATS\JobPostingController;
use App\Http\Controllers\HR\ATS\CandidateController;
use App\Http\Controllers\HR\ATS\ApplicationController;
use App\Http\Controllers\HR\ATS\InterviewController;
use App\Http\Controllers\HR\ATS\HiringPipelineController;
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
        Route::post('/hiring-pipeline/move/{id}', [HiringPipelineController::class, 'moveApplication'])
            ->middleware('permission:recruitment.hiring_pipeline.update')
            ->name('hiring-pipeline.move');
    });
});
