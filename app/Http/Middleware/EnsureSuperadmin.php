<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSuperadmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Use Spatie helper to check roles
        if (! $user->hasRole('Superadmin')) {
            abort(403, 'Forbidden');
        }

        return $next($request);
    }
}
