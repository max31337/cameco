<?php

namespace App\Http\Middleware;

use App\Services\AdminOnboardingService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminHasEmployee
{
    private AdminOnboardingService $onboardingService;

    public function __construct(AdminOnboardingService $onboardingService)
    {
        $this->onboardingService = $onboardingService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip if user is not authenticated
        if (!$request->user()) {
            return $next($request);
        }

        $user = $request->user();
        
        // Skip if this is already the profile completion route
        if ($request->routeIs('admin.profile.complete') || $request->routeIs('admin.profile.store') || $request->routeIs('admin.profile.skip') || $request->routeIs('admin.profile.save-progress')) {
            return $next($request);
        }

        // Skip for non-API routes that don't require employee records (like logout, etc.)
        $excludedRoutes = [
            'logout',
            'password.*',
            'verification.*',
            'user-profile-information.*',
            'user-password.*',
            'two-factor.*',
            'profile.*',
        ];

        foreach ($excludedRoutes as $pattern) {
            if ($request->routeIs($pattern)) {
                return $next($request);
            }
        }

        // Check if admin user needs onboarding
        if ($this->onboardingService->requiresOnboarding($user)) {
            // Redirect to profile completion with a helpful message
            return redirect()->route('admin.profile.complete')
                ->with('info', 'Please complete your employee profile to access the system.');
        }

        return $next($request);
    }
}
