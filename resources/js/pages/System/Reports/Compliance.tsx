import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface OvertimeViolation {
  id: number;
  employee_id: number;
  employee_name: string;
  violation_type: string;
  hours_worked: number;
  max_allowed: number;
  excess_hours: number;
  period: string;
  timestamp: string;
  severity: string;
}

interface AttendanceAnomaly {
  id: number;
  employee_id: number;
  employee_name: string;
  anomaly_type: string;
  description: string;
  date: string;
  time: string;
  impact_hours: number;
}

interface LeaveDiscrepancy {
  id: number;
  employee_id: number;
  employee_name: string;
  leave_type: string;
  discrepancy_type: string;
  expected_balance: number;
  actual_balance: number;
  difference: number;
  severity: string;
  detected_date: string;
}

interface ComplianceCheck {
  id: number;
  check_type: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
  jurisdiction: string;
  requirement: string;
  severity: string;
  checked_date: string;
  remediation_due: string | null;
}

interface Props {
  overtime_violations: {
    total_violations: number;
    violations_by_severity: Record<string, number>;
    violations: OvertimeViolation[];
  };
  attendance_anomalies: {
    total_anomalies: number;
    anomalies_by_type: Record<string, number>;
    anomalies: AttendanceAnomaly[];
  };
  leave_balance_discrepancies: {
    total_discrepancies: number;
    discrepancies_by_type: Record<string, number>;
    discrepancies: LeaveDiscrepancy[];
  };
  compliance_checks: {
    total_checks: number;
    checks_by_status: Record<string, number>;
    checks: ComplianceCheck[];
  };
  compliance_summary: {
    total_issues: number;
    overtime_violations: number;
    attendance_anomalies: number;
    leave_discrepancies: number;
    failed_compliance_checks: number;
    compliance_score: number;
    period_start: string;
    period_end: string;
  };
  from_date: string;
  to_date: string;
  breadcrumbs: BreadcrumbItem[];
}

export default function CompliancePage({
  overtime_violations,
  attendance_anomalies,
  leave_balance_discrepancies,
  compliance_checks,
  compliance_summary,
  breadcrumbs,
}: Props) {
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'passed':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Workforce Compliance Reports" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workforce Compliance Reports</h1>
          <p className="text-gray-500 mt-2">
            Track compliance issues, violations, and regulatory requirements
          </p>
        </div>

        {/* Compliance Score */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Overall Compliance Score</span>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div>
                <p className={`text-5xl font-bold ${getScoreColor(compliance_summary.compliance_score)}`}>
                  {compliance_summary.compliance_score}
                </p>
                <p className="text-sm text-gray-600 mt-1">out of 100</p>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Issues</span>
                  <span className="font-semibold">{compliance_summary.total_issues}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Period</span>
                  <span className="text-gray-600">
                    {compliance_summary.period_start} to {compliance_summary.period_end}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overtime Violations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{compliance_summary.overtime_violations}</div>
              <p className="text-xs text-gray-500 mt-1">Employees exceeded limits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Anomalies</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{compliance_summary.attendance_anomalies}</div>
              <p className="text-xs text-gray-500 mt-1">Irregular patterns detected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Discrepancies</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{compliance_summary.leave_discrepancies}</div>
              <p className="text-xs text-gray-500 mt-1">Balance mismatches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Checks</CardTitle>
              <CheckCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{compliance_summary.failed_compliance_checks}</div>
              <p className="text-xs text-gray-500 mt-1">Regulatory violations</p>
            </CardContent>
          </Card>
        </div>

        {/* Overtime Violations */}
        <Card>
          <CardHeader>
            <CardTitle>Overtime Violations</CardTitle>
            <CardDescription>
              Employees who exceeded maximum working hours ({overtime_violations.total_violations} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Employee</th>
                    <th className="text-left py-2 px-3">Hours Worked</th>
                    <th className="text-left py-2 px-3">Max Allowed</th>
                    <th className="text-left py-2 px-3">Excess Hours</th>
                    <th className="text-left py-2 px-3">Period</th>
                    <th className="text-left py-2 px-3">Date</th>
                    <th className="text-left py-2 px-3">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {overtime_violations.violations.length > 0 ? (
                    overtime_violations.violations.map((violation) => (
                      <tr key={violation.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3">{violation.employee_name}</td>
                        <td className="py-3 px-3">{violation.hours_worked}h</td>
                        <td className="py-3 px-3">{violation.max_allowed}h</td>
                        <td className="py-3 px-3 font-semibold text-orange-600">
                          +{violation.excess_hours}h
                        </td>
                        <td className="py-3 px-3">{violation.period}</td>
                        <td className="py-3 px-3 text-xs text-gray-500">{violation.timestamp}</td>
                        <td className="py-3 px-3">
                          <Badge variant={getSeverityColor(violation.severity)}>
                            {violation.severity}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 px-3 text-center text-gray-500">
                        No overtime violations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Anomalies */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Anomalies</CardTitle>
            <CardDescription>
              Irregular attendance patterns detected ({attendance_anomalies.total_anomalies} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendance_anomalies.total_anomalies > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-4">
                  {Object.entries(attendance_anomalies.anomalies_by_type).map(([type, count]) => (
                    <div key={type} className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-gray-600 capitalize">{type.replace(/_/g, ' ')}</p>
                      <p className="text-2xl font-bold text-blue-600">{count}</p>
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Employee</th>
                        <th className="text-left py-2 px-3">Anomaly Type</th>
                        <th className="text-left py-2 px-3">Date</th>
                        <th className="text-left py-2 px-3">Time</th>
                        <th className="text-left py-2 px-3">Impact (hrs)</th>
                        <th className="text-left py-2 px-3">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance_anomalies.anomalies.map((anomaly) => (
                        <tr key={anomaly.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-3">{anomaly.employee_name}</td>
                          <td className="py-3 px-3 capitalize">{anomaly.anomaly_type.replace(/_/g, ' ')}</td>
                          <td className="py-3 px-3 text-sm">{anomaly.date}</td>
                          <td className="py-3 px-3 text-sm">{anomaly.time}</td>
                          <td className="py-3 px-3">{anomaly.impact_hours}h</td>
                          <td className="py-3 px-3 text-xs text-gray-600 max-w-xs truncate">
                            {anomaly.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No attendance anomalies found</p>
            )}
          </CardContent>
        </Card>

        {/* Leave Balance Discrepancies */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Balance Discrepancies</CardTitle>
            <CardDescription>
              Detected issues with leave balances ({leave_balance_discrepancies.total_discrepancies} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Employee</th>
                    <th className="text-left py-2 px-3">Leave Type</th>
                    <th className="text-left py-2 px-3">Expected</th>
                    <th className="text-left py-2 px-3">Actual</th>
                    <th className="text-left py-2 px-3">Difference</th>
                    <th className="text-left py-2 px-3">Severity</th>
                    <th className="text-left py-2 px-3">Detected</th>
                  </tr>
                </thead>
                <tbody>
                  {leave_balance_discrepancies.discrepancies.length > 0 ? (
                    leave_balance_discrepancies.discrepancies.map((discrepancy) => (
                      <tr key={discrepancy.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3">{discrepancy.employee_name}</td>
                        <td className="py-3 px-3">{discrepancy.leave_type}</td>
                        <td className="py-3 px-3">{discrepancy.expected_balance}</td>
                        <td className="py-3 px-3">{discrepancy.actual_balance}</td>
                        <td className="py-3 px-3">
                          <span
                            className={
                              discrepancy.difference > 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            {discrepancy.difference > 0 ? '+' : ''}
                            {discrepancy.difference}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={getSeverityColor(discrepancy.severity)}>
                            {discrepancy.severity}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-500">{discrepancy.detected_date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 px-3 text-center text-gray-500">
                        No leave discrepancies found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Compliance Checks */}
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Compliance Checks</CardTitle>
            <CardDescription>
              Compliance status by jurisdiction ({compliance_checks.total_checks} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {compliance_checks.total_checks > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(compliance_checks.checks_by_status).map(([status, count]) => (
                    <div
                      key={status}
                      className={`p-3 rounded ${
                        status === 'passed'
                          ? 'bg-green-50'
                          : status === 'warning'
                            ? 'bg-yellow-50'
                            : 'bg-red-50'
                      }`}
                    >
                      <p className="text-xs text-gray-600 capitalize">{status}</p>
                      <p
                        className={`text-2xl font-bold ${
                          status === 'passed'
                            ? 'text-green-600'
                            : status === 'warning'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {count}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Check Type</th>
                        <th className="text-left py-2 px-3">Jurisdiction</th>
                        <th className="text-left py-2 px-3">Requirement</th>
                        <th className="text-left py-2 px-3">Status</th>
                        <th className="text-left py-2 px-3">Checked</th>
                        <th className="text-left py-2 px-3">Remediation Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compliance_checks.checks.map((check) => (
                        <tr key={check.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-3">{check.check_type}</td>
                          <td className="py-3 px-3">{check.jurisdiction}</td>
                          <td className="py-3 px-3 text-xs max-w-xs truncate">{check.requirement}</td>
                          <td className="py-3 px-3">
                            <Badge variant={getStatusColor(check.status)}>{check.status}</Badge>
                          </td>
                          <td className="py-3 px-3 text-xs text-gray-500">{check.checked_date}</td>
                          <td className="py-3 px-3 text-xs text-gray-500">
                            {check.remediation_due || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No compliance checks found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
