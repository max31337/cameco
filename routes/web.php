<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
        
});

require __DIR__.'/settings.php';

use App\Http\Controllers\System\SystemOnboarding;

// System onboarding endpoints (use existing auth)
Route::middleware(['auth'])->group(function () {
    Route::post('/system/onboarding/start', [SystemOnboarding::class, 'start']);
    Route::post('/system/onboarding/skip', [SystemOnboarding::class, 'skip']);
    Route::post('/system/onboarding/complete', [SystemOnboarding::class, 'complete'])->name('system.onboarding.complete');

    // Per-user onboarding endpoints
    Route::get('/user/onboarding', [\App\Http\Controllers\UserOnboardingController::class, 'show'])->name('user.onboarding.show');
    Route::patch('/user/onboarding', [\App\Http\Controllers\UserOnboardingController::class, 'update'])->name('user.onboarding.update');
    Route::post('/user/onboarding/skip', [\App\Http\Controllers\UserOnboardingController::class, 'skip'])->name('user.onboarding.skip');
});
