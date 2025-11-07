<?php

namespace App\Http\Controllers\System\Reports;

use App\Http\Controllers\Controller;
use App\Models\SecurityAuditLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Response;

class SecurityController extends Controller
{
    public function index(Request $request): Response
    {
        $from = $request->input('from') 
            ? Carbon::parse($request->input('from')) 
            : now()->subMonths(1);
        $to = $request->input('to') 
            ? Carbon::parse($request->input('to')) 
            : now();

        // Swap if from > to
        if ($from > $to) {
            [$from, $to] = [$to, $from];
        }

        $failedLogins = $this->getFailedLogins($from, $to);
        $passwordResets = $this->getPasswordResets($from, $to);
        $roleChanges = $this->getRoleChanges($from, $to);
        $suspiciousActivity = $this->getSuspiciousActivity($from, $to);

        return inertia('System/Reports/Security', [
            'failed_logins' => $failedLogins,
            'password_resets' => $passwordResets,
            'role_changes' => $roleChanges,
            'suspicious_activity' => $suspiciousActivity,
            'from_date' => $from->format('Y-m-d'),
            'to_date' => $to->format('Y-m-d'),
        ]);
    }

    private function getFailedLogins(Carbon $from, Carbon $to): array
    {
        $logs = SecurityAuditLog::query()
            ->where('event_type', 'failed_login_attempt')
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get(['user_id', 'description', 'created_at', 'metadata']);

        $data = [];
        $userAttempts = [];

        foreach ($logs as $log) {
            $userId = $log->user_id ?? 0;
            $userAttempts[$userId] = ($userAttempts[$userId] ?? 0) + 1;

            if (count($data) < 50) {
                $data[] = [
                    'user_id' => $userId,
                    'user_name' => $log->description ? explode(' ', $log->description)[0] : 'Unknown',
                    'timestamp' => $log->created_at->toDateTimeString(),
                    'details' => $log->metadata,
                ];
            }
        }

        return [
            'total_attempts' => array_sum($userAttempts),
            'unique_users' => count($userAttempts),
            'attempts' => $data,
            'top_users' => collect($userAttempts)
                ->sortDesc()
                ->take(10)
                ->map(fn($count, $userId) => [
                    'user_id' => $userId,
                    'attempt_count' => $count,
                ])
                ->values()
                ->all(),
        ];
    }

    private function getPasswordResets(Carbon $from, Carbon $to): array
    {
        $logs = SecurityAuditLog::query()
            ->where('event_type', 'password_reset')
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get(['user_id', 'description', 'created_at', 'metadata']);

        return [
            'total_resets' => $logs->count(),
            'resets' => $logs->map(fn($log) => [
                'user_id' => $log->user_id,
                'description' => $log->description,
                'timestamp' => $log->created_at->toDateTimeString(),
                'details' => $log->metadata,
            ])->all(),
        ];
    }

    private function getRoleChanges(Carbon $from, Carbon $to): array
    {
        $logs = SecurityAuditLog::query()
            ->whereIn('event_type', ['role_assigned', 'role_removed', 'role_changed'])
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get(['user_id', 'event_type', 'description', 'created_at', 'metadata']);

        return [
            'total_changes' => $logs->count(),
            'changes' => $logs->map(fn($log) => [
                'user_id' => $log->user_id,
                'action' => $log->event_type,
                'description' => $log->description,
                'timestamp' => $log->created_at->toDateTimeString(),
                'details' => $log->metadata,
            ])->all(),
        ];
    }

    private function getSuspiciousActivity(Carbon $from, Carbon $to): array
    {
        $logs = SecurityAuditLog::query()
            ->whereIn('severity', ['critical', 'warning'])
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get(['user_id', 'severity', 'event_type', 'description', 'created_at', 'metadata']);

        $bySeverity = [
            'critical' => 0,
            'warning' => 0,
        ];

        foreach ($logs as $log) {
            if (isset($bySeverity[$log->severity])) {
                $bySeverity[$log->severity]++;
            }
        }

        return [
            'total_alerts' => $logs->count(),
            'by_severity' => $bySeverity,
            'alerts' => $logs->map(fn($log) => [
                'user_id' => $log->user_id,
                'severity' => $log->severity,
                'action' => $log->event_type,
                'description' => $log->description,
                'timestamp' => $log->created_at->toDateTimeString(),
                'details' => $log->metadata,
            ])->all(),
        ];
    }
}
