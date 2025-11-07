<?php

namespace Database\Seeders;

use App\Models\SecurityPolicy;
use Illuminate\Database\Seeder;

class SecurityPolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            // Password policies
            [
                'policy_key' => 'password_min_length',
                'policy_value' => '8',
                'policy_type' => 'integer',
                'category' => 'password',
                'description' => 'Minimum password length',
                'is_enabled' => true,
            ],
            [
                'policy_key' => 'password_require_uppercase',
                'policy_value' => '1',
                'policy_type' => 'boolean',
                'category' => 'password',
                'description' => 'Require at least one uppercase letter',
                'is_enabled' => true,
            ],
            [
                'policy_key' => 'password_require_lowercase',
                'policy_value' => '1',
                'policy_type' => 'boolean',
                'category' => 'password',
                'description' => 'Require at least one lowercase letter',
                'is_enabled' => true,
            ],
            [
                'policy_key' => 'password_require_numbers',
                'policy_value' => '1',
                'policy_type' => 'boolean',
                'category' => 'password',
                'description' => 'Require at least one number',
                'is_enabled' => true,
            ],
            [
                'policy_key' => 'password_require_special',
                'policy_value' => '1',
                'policy_type' => 'boolean',
                'category' => 'password',
                'description' => 'Require at least one special character',
                'is_enabled' => true,
            ],
            [
                'policy_key' => 'password_expiry_days',
                'policy_value' => '90',
                'policy_type' => 'integer',
                'category' => 'password',
                'description' => 'Password expiry in days (0 = never)',
                'is_enabled' => true,
            ],

            // 2FA policies
            [
                'policy_key' => 'two_factor_enforced',
                'policy_value' => '0',
                'policy_type' => 'boolean',
                'category' => '2fa',
                'description' => 'Enforce 2FA for all users',
                'is_enabled' => true,
            ],
            [
                'policy_key' => 'two_factor_grace_period',
                'policy_value' => '7',
                'policy_type' => 'integer',
                'category' => '2fa',
                'description' => 'Grace period for enabling 2FA in days',
                'is_enabled' => true,
            ],

            // Session policies
            [
                'policy_key' => 'session_timeout_minutes',
                'policy_value' => '30',
                'policy_type' => 'integer',
                'category' => 'session',
                'description' => 'Session timeout in minutes',
                'is_enabled' => true,
            ],
            [
                'policy_key' => 'session_concurrent_limit',
                'policy_value' => '3',
                'policy_type' => 'integer',
                'category' => 'session',
                'description' => 'Maximum concurrent sessions per user',
                'is_enabled' => true,
            ],

            // Login policies
            [
                'policy_key' => 'login_attempt_limit',
                'policy_value' => '5',
                'policy_type' => 'integer',
                'category' => 'login',
                'description' => 'Maximum failed login attempts before lockout',
                'is_enabled' => true,
            ],
            [
                'policy_key' => 'login_lockout_duration_minutes',
                'policy_value' => '15',
                'policy_type' => 'integer',
                'category' => 'login',
                'description' => 'Account lockout duration in minutes',
                'is_enabled' => true,
            ],
        ];

        foreach ($defaults as $policy) {
            SecurityPolicy::firstOrCreate(
                ['policy_key' => $policy['policy_key']],
                $policy
            );
        }
    }
}
