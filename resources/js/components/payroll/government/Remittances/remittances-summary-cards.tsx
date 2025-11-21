import React from 'react';
import { TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RemittanceSummary {
  total_to_remit: number;
  pending_amount: number;
  paid_amount: number;
  overdue_amount: number;
  bir_amount: number;
  sss_amount: number;
  philhealth_amount: number;
  pagibig_amount: number;
  total_remittances: number;
  pending_count: number;
  paid_count: number;
  overdue_count: number;
  next_due_date: string;
  last_paid_date: string;
}

interface RemittancesSummaryCardsProps {
  summary: RemittanceSummary;
}

export function RemittancesSummaryCards({ summary }: RemittancesSummaryCardsProps) {
  const formatPeso = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const daysUntilDue = Math.floor((new Date(summary.next_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="grid gap-4">
      {/* Card 1: Total to Remit */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total to Remit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-gray-900">{formatPeso(summary.total_to_remit)}</div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-600">Due: {formatDate(summary.next_due_date)}</p>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
              <span className="text-sm font-medium text-blue-900">Current Period</span>
              <Badge variant="secondary">November 2025</Badge>
            </div>
            {daysUntilDue > 0 && (
              <p className="text-xs text-gray-600">
                <TrendingUp className="mr-1 inline h-3 w-3" />
                {daysUntilDue} days remaining
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Agency Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Breakdown by Agency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* BIR */}
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
              <div>
                <p className="font-medium text-red-900">BIR</p>
                <p className="text-xs text-red-700">Withholding Tax</p>
              </div>
              <p className="font-semibold text-red-900">{formatPeso(summary.bir_amount)}</p>
            </div>

            {/* SSS */}
            <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div>
                <p className="font-medium text-blue-900">SSS</p>
                <p className="text-xs text-blue-700">Social Security</p>
              </div>
              <p className="font-semibold text-blue-900">{formatPeso(summary.sss_amount)}</p>
            </div>

            {/* PhilHealth */}
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
              <div>
                <p className="font-medium text-green-900">PhilHealth</p>
                <p className="text-xs text-green-700">Health Insurance</p>
              </div>
              <p className="font-semibold text-green-900">{formatPeso(summary.philhealth_amount)}</p>
            </div>

            {/* Pag-IBIG */}
            <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-3">
              <div>
                <p className="font-medium text-orange-900">Pag-IBIG</p>
                <p className="text-xs text-orange-700">Home Fund</p>
              </div>
              <p className="font-semibold text-orange-900">{formatPeso(summary.pagibig_amount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Payment Status Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {/* Paid */}
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-xs font-medium text-green-700">PAID</p>
              <p className="mt-1 text-xl font-bold text-green-900">{summary.paid_count}</p>
              <p className="text-xs text-green-700">{formatPeso(summary.paid_amount)}</p>
            </div>

            {/* Pending */}
            <div className="rounded-lg bg-yellow-50 p-3">
              <p className="text-xs font-medium text-yellow-700">PENDING</p>
              <p className="mt-1 text-xl font-bold text-yellow-900">{summary.pending_count}</p>
              <p className="text-xs text-yellow-700">{formatPeso(summary.pending_amount)}</p>
            </div>

            {/* Overdue */}
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-xs font-medium text-red-700">OVERDUE</p>
              <p className="mt-1 text-xl font-bold text-red-900">{summary.overdue_count}</p>
              <p className="text-xs text-red-700">{formatPeso(summary.overdue_amount)}</p>
            </div>
          </div>

          {summary.overdue_count > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-red-800">{summary.overdue_count} remittance(s) are overdue</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card 4: Quick Reference */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Total Remittances (All time)</p>
            <p className="font-semibold text-gray-900">{summary.total_remittances}</p>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Next Due Date</p>
            <p className="font-semibold text-gray-900">{formatDate(summary.next_due_date)}</p>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Last Payment</p>
            <p className="font-semibold text-gray-900">{formatDate(summary.last_paid_date)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
