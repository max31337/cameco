<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHRManager
{
    /**
     * Handle an incoming request.
     *
     * Ensures the authenticated user has either HR Manager or Superadmin role.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return redirect()->route('login')->with('error', 'You must be logged in to access this page.');
        }

        // Check if user has HR Manager or Superadmin role
        if (!$request->user()->hasRole(['HR Manager', 'Superadmin'])) {
            abort(403, 'Access denied. You do not have permission to access HR management features.');
        }

        return $next($request);
    }
}
