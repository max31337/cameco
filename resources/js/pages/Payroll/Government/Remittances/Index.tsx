import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { RemittancesCalendar } from '@/components/payroll/government/Remittances/remittances-calendar';
import { RemittancesSummaryCards } from '@/components/payroll/government/Remittances/remittances-summary-cards';
import { RemittancesList } from '@/components/payroll/government/Remittances/remittances-list';
import AppLayout from '@/layouts/app-layout';

interface GovernmentRemittancesPageProps {
  remittances: Array<{
    id: number;
    agency: 'BIR' | 'SSS' | 'PhilHealth' | 'Pag-IBIG';
    month: string;
    remittance_amount: number;
    report_type: string;
    due_date: string;
    payment_date: string | null;
    payment_reference: string | null;
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'late';
    days_until_due: number;
    has_penalty: boolean;
    penalty_amount: number;
    remittance_method: string;
    notes: string;
    employees_covered: number;
  }>;
  periods: Array<{
    id: number;
    name: string;
    month: string;
    start_date: string;
    end_date: string;
    status: string;
  }>;
  summary: {
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
  };
  calendarEvents: Array<{
    id: number;
    remittance_id: number;
    date: string;
    agency: 'BIR' | 'SSS' | 'PhilHealth' | 'Pag-IBIG';
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'late';
    amount: number;
    report_type: string;
  }>;
}

export default function GovernmentRemittancesIndex({
  remittances,
  summary,
  calendarEvents,
}: GovernmentRemittancesPageProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  const breadcrumb = [
    { title: 'Payroll', href: '/payroll' },
    { title: 'Government Remittances', href: '/payroll/government/remittances' },
  ];

  const handleMarkPaid = (id: number) => {
    console.log('Mark remittance as paid:', id);
    // TODO: Implement API call
  };

  const handleView = (id: number) => {
    console.log('View remittance details:', id);
    // TODO: Implement modal/details view
  };

  const handleDownload = (id: number) => {
    const remittance = remittances.find((r) => r.id === id);
    if (remittance) {
      console.log(`Download ${remittance.report_type} report for ${remittance.agency}`);
      // TODO: Implement download functionality
    }
  };

  const hasOverdue = summary.overdue_count > 0;

  return (
    <AppLayout breadcrumbs={breadcrumb}>
        <div className="space-y-6 p-6">
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Government Remittances</h1>
            <p className="mt-2 text-gray-600">
            Consolidated tracking and payment coordination for all government statutory contribution remittances
            </p>
        </div>

        {/* Alerts */}
        {hasOverdue && (
            <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
                <strong>Warning:</strong> You have {summary.overdue_count} overdue remittance(s) totaling{' '}
                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(summary.overdue_amount)}.
                Please complete these payments immediately to avoid additional penalties.
            </AlertDescription>
            </Alert>
        )}

        {summary.pending_count > 0 && !hasOverdue && (
            <Alert className="border-yellow-200 bg-yellow-50">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
                You have {summary.pending_count} pending remittance(s) due on{' '}
                {new Date(summary.next_due_date).toLocaleDateString('en-PH', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                })}
                .
            </AlertDescription>
            </Alert>
        )}

        {/* Reference Cards */}
        <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment Methods by Agency</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                <p className="font-semibold text-blue-900">BIR</p>
                <p className="text-xs text-blue-700">Method: eFPS (Online)</p>
                <p className="text-xs text-blue-700">Form: 1601C</p>
                </div>
                <div>
                <p className="font-semibold text-blue-900">SSS</p>
                <p className="text-xs text-blue-700">Method: eR3 (Online)</p>
                <p className="text-xs text-blue-700">Form: R3</p>
                </div>
                <div>
                <p className="font-semibold text-blue-900">PhilHealth</p>
                <p className="text-xs text-blue-700">Method: EPRS (Online)</p>
                <p className="text-xs text-blue-700">Form: RF1</p>
                </div>
                <div>
                <p className="font-semibold text-blue-900">Pag-IBIG</p>
                <p className="text-xs text-blue-700">Method: eSRS (Online)</p>
                <p className="text-xs text-blue-700">Form: MCRF</p>
                </div>
            </div>
            </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            {/* Tab 1: Summary */}
            <TabsContent value="summary" className="mt-6 space-y-6">
            <div>
                <h2 className="mb-4 text-xl font-semibold">Remittance Overview</h2>
                <RemittancesSummaryCards summary={summary} />
            </div>
            </TabsContent>

            {/* Tab 2: Calendar */}
            <TabsContent value="calendar" className="mt-6 space-y-6">
            <div>
                <h2 className="mb-4 text-xl font-semibold">Payment Calendar</h2>
                <RemittancesCalendar
                events={calendarEvents}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                />
            </div>
            </TabsContent>

            {/* Tab 3: List */}
            <TabsContent value="list" className="mt-6 space-y-6">
            <div>
                <h2 className="mb-4 text-xl font-semibold">All Remittances</h2>
                <RemittancesList
                remittances={remittances}
                onMarkPaid={handleMarkPaid}
                onView={handleView}
                onDownload={handleDownload}
                />
            </div>
            </TabsContent>
        </Tabs>

        {/* Important Notes */}
        <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
            <CardTitle className="text-base">Important Remittance Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-orange-900">
            <p>
                <strong>Due Date:</strong> All government remittances are typically due on the 10th of the following month.
            </p>
            <p>
                <strong>Late Payment Penalties:</strong> 5% per month for BIR, SSS, and PhilHealth; 3% per month for Pag-IBIG.
            </p>
            <p>
                <strong>Remittance Methods:</strong> All agencies now support online payment methods (eFPS, eR3, EPRS, eSRS) in
                addition to traditional bank deposits.
            </p>
            <p>
                <strong>Employees Covered:</strong> Ensure all employees are properly registered with each agency before
                remittance dates.
            </p>
            </CardContent>
        </Card>
        </div>
    </AppLayout>
    );
}