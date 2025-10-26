<?php

namespace App\Actions\Fortify;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CustomLoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request)
    {
        $user = $request->user();

        // Default redirect
        $redirect = route('dashboard');

        if ($user) {
            // Prefer Spatie's hasRole helper for role checks.
            if ($user->hasRole('Superadmin')) {
                // append a query flag so the dashboard can open the welcome/setup modal after login
                $redirect = route('superadmin.dashboard', ['welcome' => 1]);
            }
            // Other roles may share the same default dashboard for now.
            // You could add more mappings here: Admin -> admin.dashboard, HR Manager -> hr.dashboard, etc.
        }

        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false, 'redirect' => $redirect]);
        }

        return Redirect::intended($redirect);
    }
}
