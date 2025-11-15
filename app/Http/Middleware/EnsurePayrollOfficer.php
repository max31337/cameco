<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePayrollOfficer
{
    /**
     * Handle an incoming request.
     *
     * Ensures the authenticated user has either Payroll Officer or Superadmin role.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            \Log::warning('EnsurePayrollOfficer: No authenticated user', [
                'path' => $request->path(),
                'method' => $request->method(),
            ]);
            return redirect()->route('login')->with('error', 'You must be logged in to access this page.');
        }

        // Log the user and their roles
        $user = $request->user();
        $roles = $user->getRoleNames()->toArray();
        \Log::debug('EnsurePayrollOfficer checking user', [
            'user_id' => $user->id,
            'email' => $user->email,
            'roles' => $roles,
            'path' => $request->path(),
            'method' => $request->method(),
        ]);

        // Check if user has Payroll Officer or Superadmin role
        $hasRole = $user->hasRole(['Payroll Officer', 'Superadmin']);
        if (!$hasRole) {
            \Log::error('EnsurePayrollOfficer: User lacks required role', [
                'user_id' => $user->id,
                'email' => $user->email,
                'roles' => $roles,
                'path' => $request->path(),
            ]);
            abort(403, 'Access denied. You do not have permission to access payroll features.');
        }

        return $next($request);
    }
}
