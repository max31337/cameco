<?php

namespace App\Http\Controllers\System\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Response;

class ComplianceController extends Controller
{
    /**
     * Display workforce compliance reports
     */
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

        $overtimeViolations = $this->getOvertimeViolations($from, $to);
        $attendanceAnomalies = $this->getAttendanceAnomalies($from, $to);
        $leaveBalanceDiscrepancies = $this->getLeaveBalanceDiscrepancies($from, $to);
        $complianceChecks = $this->getRegulatoryComplianceChecks($from, $to);
        $complianceSummary = $this->getComplianceSummary($from, $to);

        $breadcrumbs = [
            ['title' => 'Dashboard', 'href' => '/system/dashboard'],
            ['title' => 'Reports', 'href' => '#'],
            ['title' => 'Compliance', 'href' => '#'],
        ];

        return inertia('System/Reports/Compliance', [
            'overtime_violations' => $overtimeViolations,
            'attendance_anomalies' => $attendanceAnomalies,
            'leave_balance_discrepancies' => $leaveBalanceDiscrepancies,
            'compliance_checks' => $complianceChecks,
            'compliance_summary' => $complianceSummary,
            'from_date' => $from->format('Y-m-d'),
            'to_date' => $to->format('Y-m-d'),
            'breadcrumbs' => $breadcrumbs,
        ]);
    }

    /**
     * Get overtime violations
     */
    private function getOvertimeViolations(Carbon $from, Carbon $to): array
    {
        // Query timekeeping records for overtime violations
        // Assuming timekeeping_records or similar table exists
        $violations = DB::table('security_audit_logs')
            ->where('event_type', 'like', '%overtime%')
            ->where('severity', 'warning')
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        // If no overtime audit logs, return simulated data structure
        if ($violations->isEmpty()) {
            return [
                'total_violations' => 0,
                'violations_by_severity' => [
                    'critical' => 0,
                    'warning' => 0,
                ],
                'violations' => [],
            ];
        }

        $bySeverity = [];
        $violationData = [];

        foreach ($violations as $violation) {
            $severity = $violation->severity ?? 'warning';
            $bySeverity[$severity] = ($bySeverity[$severity] ?? 0) + 1;

            if (count($violationData) < 50) {
                $metadata = $violation->metadata ? json_decode($violation->metadata, true) : [];

                $violationData[] = [
                    'id' => $violation->id,
                    'employee_id' => $violation->user_id,
                    'employee_name' => $violation->description ? explode(' - ', $violation->description)[0] : 'Unknown',
                    'violation_type' => 'Excessive Overtime',
                    'hours_worked' => $metadata['hours_worked'] ?? 0,
                    'max_allowed' => $metadata['max_allowed'] ?? 40,
                    'excess_hours' => ($metadata['hours_worked'] ?? 0) - ($metadata['max_allowed'] ?? 40),
                    'period' => $metadata['period'] ?? 'Weekly',
                    'timestamp' => Carbon::parse($violation->created_at)->toDateString(),
                    'severity' => $severity,
                ];
            }
        }

        return [
            'total_violations' => $violations->count(),
            'violations_by_severity' => $bySeverity,
            'violations' => $violationData,
        ];
    }

    /**
     * Get attendance anomalies
     */
    private function getAttendanceAnomalies(Carbon $from, Carbon $to): array
    {
        // Query attendance-related security audit logs
        $anomalies = DB::table('security_audit_logs')
            ->where('event_type', 'like', '%attendance%')
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        if ($anomalies->isEmpty()) {
            return [
                'total_anomalies' => 0,
                'anomalies_by_type' => [
                    'late_arrival' => 0,
                    'early_departure' => 0,
                    'absent_without_leave' => 0,
                    'excessive_absence' => 0,
                ],
                'anomalies' => [],
            ];
        }

        $byType = [];
        $anomalyData = [];

        foreach ($anomalies as $anomaly) {
            $metadata = $anomaly->metadata ? json_decode($anomaly->metadata, true) : [];
            $type = $metadata['anomaly_type'] ?? 'other';

            $byType[$type] = ($byType[$type] ?? 0) + 1;

            if (count($anomalyData) < 50) {
                $anomalyData[] = [
                    'id' => $anomaly->id,
                    'employee_id' => $anomaly->user_id,
                    'employee_name' => $anomaly->description ? explode(' - ', $anomaly->description)[0] : 'Unknown',
                    'anomaly_type' => $type,
                    'description' => $metadata['description'] ?? $anomaly->description,
                    'date' => Carbon::parse($anomaly->created_at)->toDateString(),
                    'time' => Carbon::parse($anomaly->created_at)->format('H:i'),
                    'impact_hours' => $metadata['impact_hours'] ?? 0,
                ];
            }
        }

        return [
            'total_anomalies' => $anomalies->count(),
            'anomalies_by_type' => $byType,
            'anomalies' => $anomalyData,
        ];
    }

    /**
     * Get leave balance discrepancies
     */
    private function getLeaveBalanceDiscrepancies(Carbon $from, Carbon $to): array
    {
        // Query leave-related security audit logs
        $discrepancies = DB::table('security_audit_logs')
            ->where('event_type', 'like', '%leave%')
            ->where('severity', 'in', ['critical', 'warning'])
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        if ($discrepancies->isEmpty()) {
            return [
                'total_discrepancies' => 0,
                'discrepancies_by_type' => [
                    'negative_balance' => 0,
                    'overspend' => 0,
                    'adjustment_mismatch' => 0,
                ],
                'discrepancies' => [],
            ];
        }

        $byType = [];
        $discrepancyData = [];

        foreach ($discrepancies as $discrepancy) {
            $metadata = $discrepancy->metadata ? json_decode($discrepancy->metadata, true) : [];
            $type = $metadata['discrepancy_type'] ?? 'adjustment_mismatch';

            $byType[$type] = ($byType[$type] ?? 0) + 1;

            if (count($discrepancyData) < 50) {
                $discrepancyData[] = [
                    'id' => $discrepancy->id,
                    'employee_id' => $discrepancy->user_id,
                    'employee_name' => $discrepancy->description ? explode(' - ', $discrepancy->description)[0] : 'Unknown',
                    'leave_type' => $metadata['leave_type'] ?? 'Annual',
                    'discrepancy_type' => $type,
                    'expected_balance' => $metadata['expected_balance'] ?? 0,
                    'actual_balance' => $metadata['actual_balance'] ?? 0,
                    'difference' => ($metadata['actual_balance'] ?? 0) - ($metadata['expected_balance'] ?? 0),
                    'severity' => $discrepancy->severity,
                    'detected_date' => Carbon::parse($discrepancy->created_at)->toDateString(),
                ];
            }
        }

        return [
            'total_discrepancies' => $discrepancies->count(),
            'discrepancies_by_type' => $byType,
            'discrepancies' => $discrepancyData,
        ];
    }

    /**
     * Get regulatory compliance checks
     */
    private function getRegulatoryComplianceChecks(Carbon $from, Carbon $to): array
    {
        // Query compliance-related security audit logs
        $checks = DB::table('security_audit_logs')
            ->where('event_type', 'like', '%compliance%')
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        if ($checks->isEmpty()) {
            return [
                'total_checks' => 0,
                'checks_by_status' => [
                    'passed' => 0,
                    'warning' => 0,
                    'failed' => 0,
                ],
                'checks' => [],
            ];
        }

        $byStatus = [];
        $checkData = [];

        foreach ($checks as $check) {
            $metadata = $check->metadata ? json_decode($check->metadata, true) : [];
            $status = $check->severity === 'critical' ? 'failed' : ($check->severity === 'warning' ? 'warning' : 'passed');

            $byStatus[$status] = ($byStatus[$status] ?? 0) + 1;

            if (count($checkData) < 50) {
                $checkData[] = [
                    'id' => $check->id,
                    'check_type' => $metadata['check_type'] ?? 'Regulatory Compliance',
                    'description' => $check->description,
                    'status' => $status,
                    'jurisdiction' => $metadata['jurisdiction'] ?? 'General',
                    'requirement' => $metadata['requirement'] ?? 'N/A',
                    'severity' => $check->severity,
                    'checked_date' => Carbon::parse($check->created_at)->toDateString(),
                    'remediation_due' => $metadata['remediation_due'] ? Carbon::parse($metadata['remediation_due'])->toDateString() : null,
                ];
            }
        }

        return [
            'total_checks' => $checks->count(),
            'checks_by_status' => $byStatus,
            'checks' => $checkData,
        ];
    }

    /**
     * Get compliance summary
     */
    private function getComplianceSummary(Carbon $from, Carbon $to): array
    {
        $violations = DB::table('security_audit_logs')
            ->where('event_type', 'like', '%overtime%')
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $anomalies = DB::table('security_audit_logs')
            ->where('event_type', 'like', '%attendance%')
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $discrepancies = DB::table('security_audit_logs')
            ->where('event_type', 'like', '%leave%')
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $complianceChecks = DB::table('security_audit_logs')
            ->where('event_type', 'like', '%compliance%')
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $totalIssues = $violations + $anomalies + $discrepancies + $complianceChecks;

        return [
            'total_issues' => $totalIssues,
            'overtime_violations' => $violations,
            'attendance_anomalies' => $anomalies,
            'leave_discrepancies' => $discrepancies,
            'failed_compliance_checks' => $complianceChecks,
            'compliance_score' => $totalIssues === 0 ? 100 : max(0, 100 - ($totalIssues * 5)),
            'period_start' => $from->format('Y-m-d'),
            'period_end' => $to->format('Y-m-d'),
        ];
    }
}
