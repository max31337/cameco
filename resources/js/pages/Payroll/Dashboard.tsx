import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import type { PayrollDashboardProps } from '@/types/payroll-pages';
import { DashboardSummaryCards } from '@/components/payroll/dashboard-summary-cards';
import { PendingPeriodsTable } from '@/components/payroll/pending-periods-table';
import { RecentActivitiesFeed } from '@/components/payroll/recent-activities-feed';
import { CriticalAlertsPanel } from '@/components/payroll/critical-alerts-panel';
import { GovernmentComplianceTracker } from '@/components/payroll/government-compliance-tracker';
import { QuickActionsPanel } from '@/components/payroll/quick-actions-panel';
import { Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll Dashboard',
        href: '/payroll/dashboard',
    },
];

export default function PayrollDashboard({
    summary,
    pendingPeriods,
    recentActivities,
    criticalAlerts,
    complianceStatus,
    quickActions,
}: PayrollDashboardProps) {
    const currentTime = new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Payroll Dashboard</h1>
                        <p className="text-muted-foreground">
                            Manage payroll operations, compliance, and reporting for Cathay Metal Corporation
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last updated: {currentTime}</span>
                    </div>
                </div>

                {/* Widget 1: Summary Cards (4 metrics) */}
                <DashboardSummaryCards summary={summary} />

                {/* Widget 2: Pending Payroll Periods Table */}
                <PendingPeriodsTable periods={pendingPeriods} />

                {/* Row: Recent Activities (left) + Critical Alerts (right) */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Widget 3: Recent Activities Feed (60% width on desktop) */}
                    <div className="md:col-span-2">
                        <RecentActivitiesFeed activities={recentActivities} />
                    </div>

                    {/* Widget 4: Critical Alerts Panel (40% width on desktop) */}
                    <div className="md:col-span-1">
                        <CriticalAlertsPanel alerts={criticalAlerts} />
                    </div>
                </div>

                {/* Widget 5: Government Compliance Tracker (4 agency cards) */}
                <GovernmentComplianceTracker data={complianceStatus} />

                {/* Widget 6: Quick Actions Panel */}
                <QuickActionsPanel actions={quickActions} />
            </div>
        </AppLayout>
    );
}
