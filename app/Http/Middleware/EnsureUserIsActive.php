<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $status = $request->user()->status;

            if ($status === 'pending') {
                auth()->guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                return redirect()->route('login')->withErrors([
                    'email' => 'Your account is pending approval. Please wait for an administrator to approve your registration.',
                ]);
            }

            if ($status === 'rejected') {
                $reason = $request->user()->rejection_reason ?? 'No reason provided';
                
                auth()->guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                return redirect()->route('login')->withErrors([
                    'email' => "Your account registration was rejected. Reason: {$reason}",
                ]);
            }

            if ($status === 'suspended') {
                auth()->guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                return redirect()->route('login')->withErrors([
                    'email' => 'Your account has been suspended. Please contact an administrator.',
                ]);
            }
        }

        return $next($request);
    }
}
