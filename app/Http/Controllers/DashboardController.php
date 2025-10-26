<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the appropriate dashboard based on the authenticated user's role.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Prefer Spatie role checks. If you add more dashboards create their Inertia pages
        // and return them here.
        if ($user->hasRole('Superadmin')) {
            // Delegate to the Superadmin dashboard controller to keep behavior consistent
            return app(\App\Http\Controllers\Superadmin\DashboardController::class)->index($request);
        }

        // Admin/HR/other roles: render the default app dashboard for now.
        // You can add role-specific pages like 'Admin/Dashboard' and return them here.
        return Inertia::render('dashboard');
    }
}
