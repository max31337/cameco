<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

//Controllers
use \App\Http\Controllers\System\User\UserOnboardingController;
use \App\Http\Controllers\DashboardController;

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
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// this wpuld be migrated too once we set up the correct system onboarding workflow
use App\Http\Controllers\System\Onboarding\SystemOnboardingController;

Route::middleware(['auth'])->group(function () {
    Route::post('/system/onboarding/start', [SystemOnboardingController::class, 'start']);
    Route::post('/system/onboarding/skip', [SystemOnboardingController::class, 'skip']);
    Route::post('/system/onboarding/complete', [SystemOnboardingController::class, 'complete'])->name('system.onboarding.complete');
    Route::post('/system/onboarding/initialize-company', [SystemOnboardingController::class, 'initializeCompany'])->name('system.onboarding.initialize-company');

/*
    // this is still not working as for now, or at least not polished enough
    // Per-user onboarding endpoints
    Route::get('/user/onboarding', [UserOnboardingController::class, 'show'])->name('user.onboarding.show');
    Route::patch('/user/onboarding', [UserOnboardingController::class, 'update'])->name('user.onboarding.update');
    Route::post('/user/onboarding/skip', [UserOnboardingController::class, 'skip'])->name('user.onboarding.skip');

    // Onboarding UX endpoints
    Route::get('/onboarding', [UserOnboardingController::class, 'page'])->name('onboarding.page');
    Route::post('/onboarding/step', [UserOnboardingController::class, 'completeStep'])->name('onboarding.step');
    Route::post('/onboarding/complete', [UserOnboardingController::class, 'complete'])->name('onboarding.complete');
*/
    });


