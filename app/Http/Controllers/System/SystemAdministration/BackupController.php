<?php

namespace App\Http\Controllers\System\SystemAdministration;

use App\Http\Controllers\Controller;
use App\Models\SystemBackupLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BackupController extends Controller
{
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

        return Inertia::render('System/Backups', [
            'backups' => $backups,
            'stats' => $stats,
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
}
