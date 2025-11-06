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

        if ($user->hasRole('Vendor')) {
            // Delegate to the Vendor dashboard controller to keep behavior consistent
            $vendorController = '\App\Http\Controllers\System\Vendor\DashboardController';
            if (class_exists($vendorController)) {
                return app($vendorController)->index($request);
            }
            // Fallback if the controller isn't available.
            abort(404, 'Vendor dashboard controller not found.');
        }

        if ($user->hasRole('Superadmin')) {
            // Delegate to the Superadmin dashboard controller to keep behavior consistent
            $systemController = '\App\Http\Controllers\System\DashboardController';
            if (class_exists($systemController)) {
                return app($systemController)->index($request);
            }
            // Fallback if the controller isn't available.
            abort(404, 'System dashboard controller not found.');
        }

        if ($user->hasAnyRole(['HR','HR Manager','HR Staff'])) {
            // Delegate to the HR dashboard controller. That controller should render the Inertia
            // component "HR/Dashboard".
            $hrController = '\App\Http\Controllers\HR\DashboardController';
            if (class_exists($hrController)) {
                return app($hrController)->index($request);
            }
            // Fallback if the controller isn't available.
            abort(404, 'HR dashboard controller not found.');
        }

        // Default fallback: redirect to a generic home/dashboard route
        // Render the generic dashboard Inertia page instead of redirecting to the same route
        // (which caused a recursive redirect and a 404 inside the client modal).
        return Inertia::render('dashboard');
    }
}
