<?php

namespace App\Http\Controllers\System\SystemAdministration;

use App\Http\Controllers\Controller;
use App\Models\SystemBackupLog;
use App\Models\SystemSetting;
use App\Traits\LogsSecurityAudits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BackupController extends Controller
{
    use LogsSecurityAudits;

    /**
     * Display backup management interface
     */
    public function index(Request $request): Response
    {
        $days = $request->input('days', 30);
        
        $backups = SystemBackupLog::query()
            ->when($request->input('status'), function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->input('type'), function ($query, $type) {
                return $query->where('backup_type', $type);
            })
            ->where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'total' => SystemBackupLog::where('created_at', '>=', now()->subDays($days))->count(),
            'completed' => SystemBackupLog::completed()->where('created_at', '>=', now()->subDays($days))->count(),
            'failed' => SystemBackupLog::failed()->where('created_at', '>=', now()->subDays($days))->count(),
            'total_size' => SystemBackupLog::completed()
                ->where('created_at', '>=', now()->subDays($days))
                ->sum('size_bytes'),
            'latest' => SystemBackupLog::latest()->first(),
        ];

        // Get backup schedule settings
        $backupSchedule = SystemSetting::where('key', 'backup_schedule')->first();
        $backupRetention = SystemSetting::where('key', 'backup_retention_days')->first();

        return Inertia::render('System/Backups', [
            'backups' => $backups,
            'stats' => $stats,
            'schedule' => $backupSchedule ? json_decode($backupSchedule->value, true) : null,
            'retention_days' => $backupRetention ? (int)$backupRetention->value : 30,
            'filters' => [
                'status' => $request->input('status'),
                'type' => $request->input('type'),
                'days' => $days,
            ],
        ]);
    }

    /**
     * Show detailed backup information
     */
    public function show(SystemBackupLog $backup): Response
    {
        return Inertia::render('System/BackupDetail', [
            'backup' => $backup,
        ]);
    }

    /**
     * Trigger manual backup
     */
    public function trigger(Request $request)
    {
        $validated = $request->validate([
            'backup_type' => 'required|in:full,database,files,incremental',
        ]);

        $backupType = $validated['backup_type'];

        // Create backup log entry
        $backup = SystemBackupLog::create([
            'backup_type' => $backupType,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        try {
            // Execute backup command (this would be customized based on your backup strategy)
            // For now, we'll simulate the backup process
            
            // Log the action
            $this->auditLog(
                'backup_triggered',
                "Manual {$backupType} backup triggered",
                'info',
                'Backup Management',
                ['backup_id' => $backup->id, 'backup_type' => $backupType]
            );

            // In a real implementation, you would dispatch a job here
            // dispatch(new ProcessBackupJob($backup));

            return redirect()->back()->with('success', 'Backup process initiated');
        } catch (\Exception $e) {
            $backup->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            return redirect()->back()->with('error', 'Failed to trigger backup: ' . $e->getMessage());
        }
    }

    /**
     * Update backup schedule configuration
     */
    public function updateSchedule(Request $request)
    {
        $validated = $request->validate([
            'enabled' => 'required|boolean',
            'frequency' => 'required|in:daily,weekly,monthly',
            'time' => 'required|date_format:H:i',
            'backup_types' => 'required|array',
            'backup_types.*' => 'in:full,database,files,incremental',
        ]);

        SystemSetting::updateOrCreate(
            ['key' => 'backup_schedule'],
            ['value' => json_encode($validated)]
        );

        $this->auditLog(
            'backup_schedule_updated',
            'Backup schedule configuration updated',
            'medium',
            'Backup Management',
            ['schedule' => $validated]
        );

        return redirect()->back()->with('success', 'Backup schedule updated');
    }

    /**
     * Update retention policy
     */
    public function updateRetention(Request $request)
    {
        $validated = $request->validate([
            'retention_days' => 'required|integer|min:7|max:365',
        ]);

        SystemSetting::updateOrCreate(
            ['key' => 'backup_retention_days'],
            ['value' => $validated['retention_days']]
        );

        $this->auditLog(
            'backup_retention_updated',
            "Backup retention set to {$validated['retention_days']} days",
            'medium',
            'Backup Management',
            $validated
        );

        return redirect()->back()->with('success', 'Retention policy updated');
    }

    /**
     * Restore from backup
     */
    public function restore(Request $request, SystemBackupLog $backup)
    {
        $validated = $request->validate([
            'confirmation' => 'required|string|in:RESTORE',
        ]);

        if ($backup->status !== 'completed') {
            return redirect()->back()->with('error', 'Can only restore from completed backups');
        }

        try {
            // Log the critical restore action
            $this->auditLog(
                'backup_restore_initiated',
                "Backup restore initiated from backup #{$backup->id}",
                'critical',
                'Backup Management',
                [
                    'backup_id' => $backup->id,
                    'backup_type' => $backup->backup_type,
                    'backup_location' => $backup->location,
                ]
            );

            // In a real implementation, you would:
            // 1. Verify backup integrity
            // 2. Create a pre-restore backup
            // 3. Execute restore process
            // 4. Verify restore success
            // dispatch(new RestoreBackupJob($backup));

            return redirect()->back()->with('success', 'Restore process initiated. System will be temporarily unavailable.');
        } catch (\Exception $e) {
            $this->auditLog(
                'backup_restore_failed',
                "Backup restore failed: {$e->getMessage()}",
                'critical',
                'Backup Management',
                ['backup_id' => $backup->id, 'error' => $e->getMessage()]
            );

            return redirect()->back()->with('error', 'Restore failed: ' . $e->getMessage());
        }
    }

    /**
     * Delete old backups based on retention policy
     */
    public function cleanup(Request $request)
    {
        $retentionSetting = SystemSetting::where('key', 'backup_retention_days')->first();
        $retentionDays = $retentionSetting ? (int)$retentionSetting->value : 30;

        $deleted = SystemBackupLog::where('completed_at', '<=', now()->subDays($retentionDays))
            ->where('status', 'completed')
            ->delete();

        $this->auditLog(
            'backup_cleanup',
            "Deleted {$deleted} old backups (retention: {$retentionDays} days)",
            'info',
            'Backup Management',
            ['deleted_count' => $deleted, 'retention_days' => $retentionDays]
        );

        return redirect()->back()->with('success', "Deleted {$deleted} old backup records");
    }
}
