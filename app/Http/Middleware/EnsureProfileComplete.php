<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\UserOnboardingService;
use Illuminate\Support\Facades\Log;

class EnsureProfileComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        // Exempt superadmins
        try {
            if (method_exists($user, 'isSuperadmin') && $user->isSuperadmin()) {
                return $next($request);
            }
        } catch (\Throwable $e) {
            Log::warning('Error checking superadmin in EnsureProfileComplete', ['exception' => $e]);
        }

        $service = app(UserOnboardingService::class);
        $row = null;
        try {
            $row = $service->getForUser($user->id);
        } catch (\Throwable $e) {
            // ignore
        }

        // If explicit completed status is present, allow
        if ($row && isset($row->status) && $row->status === 'completed') {
            return $next($request);
        }

        // Decide by generating or decoding checklist and computing percent
        $checklist = null;
        try {
            if ($row && ! empty($row->checklist_json)) {
                $raw = $row->checklist_json;
                if (is_string($raw)) {
                    $decoded = json_decode($raw, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $checklist = $decoded;
                    }
                } elseif (is_array($raw)) {
                    $checklist = $raw;
                }
            }

            if ($checklist === null) {
                $checklist = $service->generateChecklistForUser($user);
            }

            if (is_array($checklist) && count($checklist) > 0) {
                $total = count($checklist);
                $completed = 0;
                foreach ($checklist as $it) {
                    if (is_array($it)) {
                        $done = $it['done'] ?? $it['completed'] ?? $it['checked'] ?? false;
                        if ($done) {
                            $completed++;
                        }
                    }
                }

                $percent = (int) round(($completed / $total) * 100);
                if ($percent >= 100) {
                    // allow
                    return $next($request);
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Error computing onboarding completion in middleware', ['exception' => $e]);
        }

        // Not complete — redirect to dashboard so user can finish onboarding
        return redirect()->route('dashboard')->with('message', 'Please complete your profile before accessing this area.');
    }
}
