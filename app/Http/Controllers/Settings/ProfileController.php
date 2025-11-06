<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // Persist profile-related fields into the profiles table. Only save the
        // attributes that the request validated to avoid overwriting with nulls.
        try {
            $profileData = array_filter($request->only([
                'first_name',
                'last_name',
                'middle_name',
                'contact_number',
                'address',
                'emergency_contact',
            ]), function ($v) {
                return $v !== null;
            });

            if (! empty($profileData)) {
                $request->user()->profile()->updateOrCreate(
                    ['user_id' => $request->user()->id],
                    $profileData
                );
            }
        } catch (\Throwable $e) {
            // best-effort: don't prevent profile save on profile persistence errors
        }
        // After saving basic profile info, regenerate the user's onboarding
        // checklist so the onboarding UI reflects authoritative profile data.
        try {
            $service = app(\App\Services\UserOnboardingService::class);
            $checklist = $service->generateChecklistForUser($request->user());
            // Persist the regenerated checklist (service will JSON-encode as needed)
            $service->start($request->user()->id, ['checklist_json' => $checklist]);
        } catch (\Throwable $e) {
            // best-effort: don't prevent profile save on onboarding errors
        }

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
