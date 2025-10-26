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

    // Superadmin-specific dashboard
    Route::get('superadmin/dashboard', [\App\Http\Controllers\Superadmin\DashboardController::class, 'index'])
        ->name('superadmin.dashboard')
        ->middleware(\App\Http\Middleware\EnsureSuperadmin::class);
});

require __DIR__.'/settings.php';

use App\Http\Controllers\SystemOnboarding\SuperadminOnboarding;

// Superadmin onboarding endpoints (use existing auth)
Route::middleware(['auth'])->group(function () {
    Route::post('/superadmin/onboarding/start', [SuperadminOnboarding::class, 'start']);
    Route::post('/superadmin/onboarding/skip', [SuperadminOnboarding::class, 'skip']);
});
