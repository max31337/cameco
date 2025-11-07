<?php

namespace Database\Seeders;

use App\Models\SecurityAuditLog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SecurityAuditLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a test user
        $user = User::first() ?? User::factory()->create(['email' => 'test@example.com']);

        $now = now();
        $thirtyDaysAgo = $now->copy()->subDays(30);

        $eventTypes = [
            'user_login',
            'user_logout',
            'failed_login_attempt',
            'password_reset',
            'password_reset_request',
            'user_created',
            'user_updated',
            'user_deleted',
            'role_assigned',
            'role_removed',
            'role_changed',
            'permission_granted',
            'permission_revoked',
            'security_policy_created',
            'security_policy_updated',
            'security_policy_deleted',
            'ip_rule_created',
            'ip_rule_updated',
            'ip_rule_deleted',
            'department_created',
            'department_updated',
            'department_deleted',
            'position_created',
            'position_updated',
            'position_deleted',
            'system_health_check',
            'backup_started',
            'backup_completed',
            'backup_failed',
            'patch_deployed',
            'patch_rejected',
            'cron_job_executed',
            'compliance_check_failed',
            'overtime_violation_detected',
            'attendance_anomaly_detected',
            'leave_balance_discrepancy_detected',
        ];

        $severities = ['info', 'warning', 'critical'];

        // Create audit log entries for the past 30 days
        for ($i = 0; $i < 150; $i++) {
            $randomDate = Carbon::instance(
                \Faker\Factory::create()->dateTimeBetween($thirtyDaysAgo, $now)
            );

            $eventType = $eventTypes[array_rand($eventTypes)];
            $severity = $this->getSeverityForEventType($eventType);

            $metadata = $this->generateMetadataForEventType($eventType);

            SecurityAuditLog::create([
                'event_type' => $eventType,
                'severity' => $severity,
                'user_id' => rand(1, 3) <= 2 ? $user->id : null,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'description' => $this->getDescriptionForEventType($eventType),
                'metadata' => json_encode($metadata),
                'created_at' => $randomDate,
                'updated_at' => $randomDate,
            ]);
        }

        // Create specific patterns for better testing
        // Failed login attempts (last 7 days)
        for ($i = 0; $i < 15; $i++) {
            SecurityAuditLog::create([
                'event_type' => 'failed_login_attempt',
                'severity' => 'warning',
                'user_id' => null,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'description' => 'Failed login attempt for user ' . fake()->email(),
                'metadata' => json_encode([
                    'email' => fake()->email(),
                    'reason' => fake()->randomElement(['Invalid password', 'Account locked', 'IP blocked']),
                    'attempt_number' => fake()->numberBetween(1, 5),
                ]),
                'created_at' => $now->copy()->subDays(rand(0, 7)),
                'updated_at' => $now->copy()->subDays(rand(0, 7)),
            ]);
        }

        // User logins (multiple per user in last 7 days)
        for ($i = 0; $i < 25; $i++) {
            SecurityAuditLog::create([
                'event_type' => 'user_login',
                'severity' => 'info',
                'user_id' => $user->id,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'description' => "User {$user->name} logged in",
                'metadata' => json_encode([
                    'browser' => fake()->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
                    'platform' => fake()->randomElement(['Windows', 'macOS', 'Linux']),
                    'login_type' => 'manual',
                ]),
                'created_at' => $now->copy()->subDays(rand(0, 7))->addHours(rand(0, 23)),
                'updated_at' => $now->copy()->subDays(rand(0, 7))->addHours(rand(0, 23)),
            ]);
        }

        // User logouts (pair with logins)
        for ($i = 0; $i < 20; $i++) {
            SecurityAuditLog::create([
                'event_type' => 'user_logout',
                'severity' => 'info',
                'user_id' => $user->id,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'description' => "User {$user->name} logged out",
                'metadata' => json_encode([
                    'session_duration_minutes' => fake()->numberBetween(5, 480),
                    'logout_type' => fake()->randomElement(['manual', 'timeout', 'idle']),
                ]),
                'created_at' => $now->copy()->subDays(rand(0, 7))->addHours(rand(0, 23)),
                'updated_at' => $now->copy()->subDays(rand(0, 7))->addHours(rand(0, 23)),
            ]);
        }

        // Role changes (security events)
        for ($i = 0; $i < 8; $i++) {
            $roleEvent = fake()->randomElement(['role_assigned', 'role_removed', 'role_changed']);
            SecurityAuditLog::create([
                'event_type' => $roleEvent,
                'severity' => fake()->randomElement(['warning', 'critical']),
                'user_id' => $user->id,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'description' => "Role {$roleEvent} for user",
                'metadata' => json_encode([
                    'target_user_id' => fake()->numberBetween(1, 5),
                    'target_user_email' => fake()->email(),
                    'role_name' => fake()->randomElement(['Admin', 'Editor', 'Viewer', 'Moderator']),
                    'changed_by' => $user->email,
                ]),
                'created_at' => $now->copy()->subDays(rand(0, 30)),
                'updated_at' => $now->copy()->subDays(rand(0, 30)),
            ]);
        }

        // Compliance events (overtime, attendance, leave)
        for ($i = 0; $i < 12; $i++) {
            $complianceType = fake()->randomElement([
                'overtime_violation_detected',
                'attendance_anomaly_detected',
                'leave_balance_discrepancy_detected',
            ]);

            $metadata = match ($complianceType) {
                'overtime_violation_detected' => [
                    'employee_id' => fake()->numberBetween(1, 20),
                    'employee_name' => fake()->name(),
                    'hours_worked' => fake()->numberBetween(41, 60),
                    'max_allowed' => 40,
                    'period' => 'Weekly',
                    'excess_hours' => fake()->numberBetween(1, 20),
                ],
                'attendance_anomaly_detected' => [
                    'employee_id' => fake()->numberBetween(1, 20),
                    'employee_name' => fake()->name(),
                    'anomaly_type' => fake()->randomElement(['late_arrival', 'early_departure', 'absent_without_leave']),
                    'description' => fake()->sentence(),
                    'impact_hours' => fake()->numberBetween(1, 8),
                ],
                'leave_balance_discrepancy_detected' => [
                    'employee_id' => fake()->numberBetween(1, 20),
                    'employee_name' => fake()->name(),
                    'leave_type' => fake()->randomElement(['Annual', 'Sick', 'Personal', 'Maternity']),
                    'expected_balance' => fake()->numberBetween(5, 20),
                    'actual_balance' => fake()->numberBetween(0, 20),
                    'discrepancy_type' => 'negative_balance',
                ],
                default => [],
            };

            SecurityAuditLog::create([
                'event_type' => $complianceType,
                'severity' => fake()->randomElement(['warning', 'critical']),
                'user_id' => null,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'System',
                'description' => str_replace('_', ' ', $complianceType),
                'metadata' => json_encode($metadata),
                'created_at' => $now->copy()->subDays(rand(0, 30)),
                'updated_at' => $now->copy()->subDays(rand(0, 30)),
            ]);
        }

        // Password reset events
        for ($i = 0; $i < 5; $i++) {
            SecurityAuditLog::create([
                'event_type' => 'password_reset',
                'severity' => 'warning',
                'user_id' => $user->id,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'description' => "Password reset for user {$user->email}",
                'metadata' => json_encode([
                    'reset_method' => fake()->randomElement(['email', 'admin', 'self-service']),
                    'ip_address' => fake()->ipv4(),
                    'timestamp' => now()->toIso8601String(),
                ]),
                'created_at' => $now->copy()->subDays(rand(0, 30)),
                'updated_at' => $now->copy()->subDays(rand(0, 30)),
            ]);
        }

        $this->command->info('SecurityAuditLog seeder completed. Created 200+ audit log entries.');
    }

    private function getSeverityForEventType(string $eventType): string
    {
        return match ($eventType) {
            'failed_login_attempt',
            'user_deleted',
            'role_removed',
            'permission_revoked',
            'security_policy_deleted',
            'ip_rule_deleted',
            'backup_failed',
            'patch_rejected',
            'compliance_check_failed',
            'overtime_violation_detected',
            'leave_balance_discrepancy_detected' => 'critical',
            
            'password_reset',
            'password_reset_request',
            'user_updated',
            'role_changed',
            'permission_granted',
            'security_policy_updated',
            'ip_rule_updated',
            'department_updated',
            'position_updated',
            'backup_started',
            'patch_deployed',
            'attendance_anomaly_detected' => 'warning',
            
            default => 'info',
        };
    }

    private function getDescriptionForEventType(string $eventType): string
    {
        return match ($eventType) {
            'user_login' => 'User logged in',
            'user_logout' => 'User logged out',
            'failed_login_attempt' => 'Failed login attempt',
            'password_reset' => 'Password reset',
            'user_created' => 'New user created',
            'user_updated' => 'User profile updated',
            'user_deleted' => 'User account deleted',
            'role_assigned' => 'Role assigned to user',
            'role_removed' => 'Role removed from user',
            'security_policy_created' => 'Security policy created',
            'backup_started' => 'System backup started',
            'backup_completed' => 'System backup completed',
            'backup_failed' => 'System backup failed',
            default => str_replace('_', ' ', $eventType),
        };
    }

    private function generateMetadataForEventType(string $eventType): array
    {
        return match ($eventType) {
            'user_login' => [
                'browser' => fake()->randomElement(['Chrome', 'Firefox', 'Safari']),
                'ip_address' => fake()->ipv4(),
                'location' => fake()->city(),
            ],
            'failed_login_attempt' => [
                'email' => fake()->email(),
                'reason' => fake()->randomElement(['Invalid password', 'Account locked', 'IP blocked']),
                'attempt_number' => fake()->numberBetween(1, 5),
            ],
            'password_reset' => [
                'reset_method' => fake()->randomElement(['email', 'admin']),
                'confirmed' => true,
            ],
            'role_assigned' => [
                'role_name' => fake()->randomElement(['Admin', 'Moderator', 'Editor']),
                'target_user' => fake()->email(),
            ],
            'backup_started' => [
                'backup_type' => 'full',
                'size_gb' => fake()->numberBetween(1, 50),
            ],
            default => [
                'timestamp' => now()->toIso8601String(),
                'event' => $eventType,
            ],
        };
    }
}
