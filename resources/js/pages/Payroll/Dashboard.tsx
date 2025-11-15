import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import type { PayrollDashboardProps } from '@/types/payroll-pages';
import { DashboardSummaryCards } from '@/components/payroll/dashboard-summary-cards';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
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
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Payroll Periods</CardTitle>
                        <CardDescription>
                            Payroll periods requiring action or review
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            {pendingPeriods.length === 0 ? (
                                <p>No pending payroll periods at this time.</p>
                            ) : (
                                <p>{pendingPeriods.length} period(s) requiring attention.</p>
                            )}
                        </div>
                        {/* TODO: Implement PendingPeriodsTable component */}
                    </CardContent>
                </Card>

                {/* Row: Recent Activities (left) + Critical Alerts (right) */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Widget 3: Recent Activities Feed (60% width on desktop) */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activities</CardTitle>
                                <CardDescription>
                                    Timeline of recent payroll actions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    {recentActivities.length === 0 ? (
                                        <p>No recent activities.</p>
                                    ) : (
                                        <p>{recentActivities.length} recent action(s).</p>
                                    )}
                                </div>
                                {/* TODO: Implement RecentActivitiesFeed component */}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Widget 4: Critical Alerts Panel (40% width on desktop) */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Critical Alerts</CardTitle>
                                <CardDescription>
                                    Issues requiring immediate attention
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    {criticalAlerts.length === 0 ? (
                                        <p>No critical alerts.</p>
                                    ) : (
                                        <p className="font-medium text-destructive">
                                            {criticalAlerts.length} alert(s) need attention!
                                        </p>
                                    )}
                                </div>
                                {/* TODO: Implement CriticalAlertsPanel component */}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Widget 5: Government Compliance Tracker (4 agency cards) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Government Compliance</CardTitle>
                        <CardDescription>
                            Track remittances and compliance status for SSS, PhilHealth, Pag-IBIG, and BIR
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            <p>Compliance status for 4 government agencies.</p>
                        </div>
                        {/* TODO: Implement GovernmentComplianceTracker component */}
                    </CardContent>
                </Card>

                {/* Widget 6: Quick Actions Panel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            One-click access to common payroll operations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            {quickActions.length === 0 ? (
                                <p>No quick actions available.</p>
                            ) : (
                                <p>{quickActions.length} quick action(s) available.</p>
                            )}
                        </div>
                        {/* TODO: Implement QuickActionsPanel component */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
