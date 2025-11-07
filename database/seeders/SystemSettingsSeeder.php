<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Backup Settings
            [
                'key' => 'backup_schedule',
                'value' => json_encode([
                    'enabled' => true,
                    'frequency' => 'daily',
                    'time' => '02:00',
                    'backup_types' => ['database', 'files'],
                ]),
                'type' => 'json',
                'description' => 'Automated backup schedule configuration',
                'category' => 'backup',
            ],
            [
                'key' => 'backup_retention_days',
                'value' => '30',
                'type' => 'integer',
                'description' => 'Number of days to retain backup files',
                'category' => 'backup',
            ],
            [
                'key' => 'backup_storage_path',
                'value' => 'backups',
                'type' => 'string',
                'description' => 'Storage path for backup files',
                'category' => 'backup',
            ],

            // Security Settings
            [
                'key' => 'password_expiry_days',
                'value' => '90',
                'type' => 'integer',
                'description' => 'Number of days before password expires',
                'category' => 'security',
            ],
            [
                'key' => 'max_login_attempts',
                'value' => '5',
                'type' => 'integer',
                'description' => 'Maximum failed login attempts before lockout',
                'category' => 'security',
            ],
            [
                'key' => 'lockout_duration_minutes',
                'value' => '15',
                'type' => 'integer',
                'description' => 'Duration of account lockout after failed attempts',
                'category' => 'security',
            ],
            [
                'key' => 'require_two_factor',
                'value' => 'false',
                'type' => 'boolean',
                'description' => 'Require all users to enable two-factor authentication',
                'category' => 'security',
            ],
            [
                'key' => 'session_timeout_minutes',
                'value' => '120',
                'type' => 'integer',
                'description' => 'Session timeout in minutes',
                'category' => 'security',
            ],

            // System Settings
            [
                'key' => 'system_name',
                'value' => 'Cameco HRIS',
                'type' => 'string',
                'description' => 'System name displayed in UI',
                'category' => 'general',
            ],
            [
                'key' => 'system_timezone',
                'value' => 'UTC',
                'type' => 'string',
                'description' => 'System default timezone',
                'category' => 'general',
            ],
            [
                'key' => 'maintenance_mode',
                'value' => 'false',
                'type' => 'boolean',
                'description' => 'Enable maintenance mode',
                'category' => 'general',
            ],

            // Email Settings
            [
                'key' => 'email_notifications_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable email notifications',
                'category' => 'email',
            ],
            [
                'key' => 'admin_email',
                'value' => 'admin@cameco.com',
                'type' => 'string',
                'description' => 'System administrator email',
                'category' => 'email',
            ],

            // Monitoring Settings
            [
                'key' => 'health_check_interval',
                'value' => '5',
                'type' => 'integer',
                'description' => 'Health check interval in minutes',
                'category' => 'monitoring',
            ],
            [
                'key' => 'alert_thresholds',
                'value' => json_encode([
                    'cpu_percent' => 80,
                    'memory_percent' => 85,
                    'disk_percent' => 90,
                ]),
                'type' => 'json',
                'description' => 'System alert thresholds',
                'category' => 'monitoring',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        $this->command->info('System settings seeded successfully.');
    }
}
