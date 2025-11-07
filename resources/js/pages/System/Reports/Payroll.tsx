import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';

interface PayrollRun {
  id: number;
  run_date: string;
  started_at: string;
  completed_at: string | null;
  status: 'pending' | 'completed' | 'failed';
  duration_seconds: number;
  employees_processed: number;
  details: Record<string, unknown>;
}

interface ErrorLog {
  id: number;
  error_type: string;
  message: string;
  timestamp: string;
  run_details: {
    started_at: string;
    payroll_period: string;
  };
}

interface PaymentBatch {
  id: number;
  batch_number: string;
  payroll_period: string;
  total_employees: number;
  total_amount: number;
  currency: string;
  status: string;
  created_date: string;
  processed_date: string;
  payment_method: string;
  file_generated: boolean;
  file_name: string | null;
}

interface Props {
  payroll_run_history: {
    total_runs: number;
    successful_runs: number;
    failed_runs: number;
    runs: PayrollRun[];
  };
  error_logs: {
    total_errors: number;
    by_type: Record<string, number>;
    recent_errors: ErrorLog[];
  };
  payment_batches: {
    total_batches: number;
    batches: PaymentBatch[];
  };
  payroll_summary: {
    total_runs: number;
    successful_runs: number;
    failed_runs: number;
    success_rate: number;
    total_employees_processed: number;
    total_amount_processed: number;
    average_run_time: string;
  };
  from_date: string;
  to_date: string;
  breadcrumbs: BreadcrumbItem[];
}

export default function PayrollPage({
  payroll_run_history,
  error_logs,
  payment_batches,
  payroll_summary,
  breadcrumbs,
}: Props) {
  // Remove unused state for date filters; use props directly when needed
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Payroll Generation Logs" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">Payroll Generation Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Monitor payroll runs, errors, and payment batches</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payroll_summary.total_runs}</div>
              <p className="text-xs text-gray-500 mt-1">
                {payroll_summary.successful_runs} successful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payroll_summary.success_rate}%</div>
              <p className="text-xs text-gray-500 mt-1">
                {payroll_summary.failed_runs} failed runs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees Processed</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payroll_summary.total_employees_processed}</div>
              <p className="text-xs text-gray-500 mt-1">Total in period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Run Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payroll_summary.average_run_time}</div>
              <p className="text-xs text-gray-500 mt-1">Per execution</p>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Run History */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Run History</CardTitle>
            <CardDescription>
              Recent payroll generation runs ({payroll_run_history.total_runs} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Run Date</th>
                    <th className="text-left py-2 px-3">Started</th>
                    <th className="text-left py-2 px-3">Completed</th>
                    <th className="text-left py-2 px-3">Duration</th>
                    <th className="text-left py-2 px-3">Employees</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll_run_history.runs.length > 0 ? (
                    payroll_run_history.runs.map((run) => (
                      <tr key={run.id} className="border-b hover:bg-gray-200 dark:hover:bg-neutral-800">
                        <td className="py-3 px-3">{run.run_date}</td>
                        <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{run.started_at}</td>
                        <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">
                          {run.completed_at || 'In Progress'}
                        </td>
                        <td className="py-3 px-3">{formatDuration(run.duration_seconds)}</td>
                        <td className="py-3 px-3">{run.employees_processed}</td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              run.status === 'completed'
                                ? 'default'
                                : run.status === 'failed'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {run.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 px-3 text-center text-gray-500">
                        No payroll runs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Error Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Payroll Error Logs
            </CardTitle>
            <CardDescription>
              Recent errors from payroll generation ({error_logs.total_errors} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error_logs.total_errors > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(error_logs.by_type).map(([type, count]) => (
                    <div key={type} className="bg-red-200 p-4 rounded-lg">
                      <p className="text-sm text-neutral-900 capitalize">{type.replace(/_/g, ' ')}</p>
                      <p className="text-2xl font-bold text-red-600">{count}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Recent Errors</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {error_logs.recent_errors.map((error) => (
                      <div key={error.id} className="bg-red-100 dark:bg-neutral-900 p-3 rounded border-l-4 border-red-500 dark:border-red-700">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="destructive" className="capitalize">
                            {error.error_type.replace(/_/g, ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{error.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{error.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Period: {error.run_details.payroll_period}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No errors found</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Batches */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Batches</CardTitle>
            <CardDescription>
              Payment batch tracking and status ({payment_batches.total_batches} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Batch Number</th>
                    <th className="text-left py-2 px-3">Period</th>
                    <th className="text-left py-2 px-3">Employees</th>
                    <th className="text-left py-2 px-3">Amount</th>
                    <th className="text-left py-2 px-3">Method</th>
                    <th className="text-left py-2 px-3">Date</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payment_batches.batches.length > 0 ? (
                    payment_batches.batches.map((batch) => (
                      <tr key={batch.id} className="border-b hover:bg-gray-200 dark:hover:bg-neutral-800">
                        <td className="py-3 px-3 font-mono text-xs">{batch.batch_number}</td>
                        <td className="py-3 px-3">{batch.payroll_period}</td>
                        <td className="py-3 px-3">{batch.total_employees}</td>
                        <td className="py-3 px-3">
                          {formatCurrency(batch.total_amount, batch.currency)}
                        </td>
                        <td className="py-3 px-3 text-xs">{batch.payment_method}</td>
                        <td className="py-3 px-3 text-xs">{batch.processed_date}</td>
                        <td className="py-3 px-3">
                          <Badge variant="default">{batch.status}</Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 px-3 text-center text-gray-500">
                        No payment batches found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
