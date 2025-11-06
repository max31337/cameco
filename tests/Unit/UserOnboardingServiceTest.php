<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\UserOnboardingService;
use App\Models\User;
use App\Models\Profile;

class UserOnboardingServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_generate_checklist_for_user_with_complete_profile_marks_all_done()
    {
        $user = User::factory()->create([
            'name' => 'Jane Doe',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $user->id,
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'contact_number' => '123',
            'address' => 'Street 1',
            'emergency_contact' => 'John Doe',
        ]);

        $service = app(UserOnboardingService::class);
        $items = $service->generateChecklistForUser($user);

        $this->assertIsArray($items);
        $this->assertCount(5, $items);

        // All checklist items should be marked done for a complete profile
        $byKey = [];
        foreach ($items as $it) {
            $byKey[$it['key'] ?? $it['label']] = $it;
        }

        $this->assertTrue((bool) ($byKey['name']['done'] ?? false), 'name not done');
        $this->assertTrue((bool) ($byKey['verify_email']['done'] ?? false), 'verify_email not done');
        $this->assertTrue((bool) ($byKey['phone']['done'] ?? false), 'phone not done');
        $this->assertTrue((bool) ($byKey['address']['done'] ?? false), 'address not done');
        $this->assertTrue((bool) ($byKey['emergency_contact']['done'] ?? false), 'emergency_contact not done');
    }

    public function test_generate_checklist_for_user_with_partial_profile_marks_correct_items()
    {
        $user = User::factory()->create([
            'name' => 'Partial Person',
            'email_verified_at' => null,
        ]);

        Profile::create([
            'user_id' => $user->id,
            'first_name' => 'Partial',
            'last_name' => 'Person',
            'contact_number' => null,
            'address' => null,
            'emergency_contact' => null,
        ]);

        $service = app(UserOnboardingService::class);
        $items = $service->generateChecklistForUser($user);

        $this->assertIsArray($items);
        $this->assertCount(5, $items);

        $byKey = [];
        foreach ($items as $it) {
            $byKey[$it['key'] ?? $it['label']] = $it;
        }

        $this->assertTrue((bool) ($byKey['name']['done'] ?? false));
        $this->assertFalse((bool) ($byKey['verify_email']['done'] ?? false));
        $this->assertFalse((bool) ($byKey['phone']['done'] ?? false));
    }

    public function test_generate_checklist_for_user_without_profile_uses_user_name_and_email()
    {
        $user = User::factory()->create([
            'name' => 'No Profile',
            'email_verified_at' => now(),
        ]);

        $service = app(UserOnboardingService::class);
        $items = $service->generateChecklistForUser($user);

        $this->assertIsArray($items);
        $this->assertCount(5, $items);

        $byKey = [];
        foreach ($items as $it) {
            $byKey[$it['key'] ?? $it['label']] = $it;
        }

        // Name present via users.name
        $this->assertTrue((bool) ($byKey['name']['done'] ?? false));
        // Email already verified
        $this->assertTrue((bool) ($byKey['verify_email']['done'] ?? false));
    }
}
