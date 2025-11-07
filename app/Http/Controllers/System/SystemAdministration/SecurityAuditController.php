<?php

namespace App\Http\Controllers\System\SystemAdministration;

use App\Http\Controllers\Controller;
use App\Models\SecurityAuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecurityAuditController extends Controller
{
    /**
     * Display security audit logs viewer
     */
    public function index(Request $request): Response
    {
        $logs = SecurityAuditLog::query()
            ->with('user')
            ->when($request->input('severity'), function ($query, $severity) {
                return $query->where('severity', $severity);
            })
            ->when($request->input('event_type'), function ($query, $eventType) {
                return $query->where('event_type', $eventType);
            })
            ->when($request->input('user_id'), function ($query, $userId) {
                return $query->where('user_id', $userId);
            })
            ->when($request->input('days'), function ($query, $days) {
                return $query->where('created_at', '>=', now()->subDays($days));
            }, function ($query) {
                return $query->recent(); // Default to last 24 hours
            })
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        $stats = [
            'critical' => SecurityAuditLog::critical()->recent()->count(),
            'warning' => SecurityAuditLog::warning()->recent()->count(),
            'info' => SecurityAuditLog::info()->recent()->count(),
            'failed_logins' => SecurityAuditLog::failedLogins()->recent()->count(),
            'total_24h' => SecurityAuditLog::recent()->count(),
        ];

        $eventTypes = SecurityAuditLog::select('event_type')
            ->distinct()
            ->pluck('event_type')
            ->toArray();

        return Inertia::render('System/SecurityAudit', [
            'logs' => $logs,
            'stats' => $stats,
            'eventTypes' => $eventTypes,
            'filters' => [
                'severity' => $request->input('severity'),
                'event_type' => $request->input('event_type'),
                'user_id' => $request->input('user_id'),
                'days' => $request->input('days', 1),
            ],
        ]);
    }

    /**
     * Show detailed security audit log entry
     */
    public function show(SecurityAuditLog $log): Response
    {
        $log->load('user');

        return Inertia::render('System/SecurityAuditDetail', [
            'log' => $log,
        ]);
    }

    /**
     * Export security audit logs (CSV)
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'severity' => 'nullable|in:critical,warning,info',
        ]);

        $logs = SecurityAuditLog::query()
            ->with('user')
            ->whereBetween('created_at', [$validated['start_date'], $validated['end_date']])
            ->when($validated['severity'] ?? null, function ($query, $severity) {
                return $query->where('severity', $severity);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'security-audit-' . now()->format('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($logs) {
            $handle = fopen('php://output', 'w');
            
            // CSV Headers
            fputcsv($handle, [
                'Timestamp',
                'Severity',
                'Event Type',
                'User',
                'IP Address',
                'Description',
                'Metadata',
            ]);

            // CSV Data
            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->created_at->format('Y-m-d H:i:s'),
                    $log->severity,
                    $log->event_type,
                    $log->user?->name ?? 'N/A',
                    $log->ip_address,
                    $log->description,
                    json_encode($log->metadata ?? []),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
