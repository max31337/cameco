<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Vendor Routes
|--------------------------------------------------------------------------
|
| These routes are protected by the 'vendor' middleware and are only
| accessible to users with the Vendor role (excluding Superadmin).
| All routes here require authentication and vendor privileges.
|
*/

Route::middleware(['auth', 'vendor'])->group(function () {
    
    // Vendor Dashboard
    Route::get('/vendor/dashboard', [\App\Http\Controllers\System\Vendor\DashboardController::class, 'index'])->name('vendor.dashboard');
});
