<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVendor
{
    /**
     * Handle an incoming request.
     *
     * Ensures the authenticated user has the Vendor role (and NOT Superadmin).
     * Vendors should only access vendor-specific features.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return redirect()->route('login')->with('error', 'You must be logged in to access this page.');
        }

        // Check if user has Vendor role
        if (!$request->user()->hasRole('Vendor')) {
            abort(403, 'Access denied. This area is restricted to vendor accounts only.');
        }

        // Ensure Superadmin cannot access vendor routes
        if ($request->user()->hasRole('Superadmin')) {
            abort(403, 'Superadmin accounts cannot access vendor-specific features.');
        }

        return $next($request);
    }
}
