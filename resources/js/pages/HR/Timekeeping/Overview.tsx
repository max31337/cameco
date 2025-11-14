import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryCard } from '@/components/timekeeping/summary-card';

interface StatusDistribution {
    status: string;
    count: number;
    percentage: number;
}

interface TopIssue {
    issue: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
}

interface Analytics {
    summary: {
        total_employees: number;
        average_attendance_rate: number;
        average_late_rate: number;
        average_absent_rate: number;
        compliance_score: number;
    };
    status_distribution: StatusDistribution[];
    top_issues: TopIssue[];
}

export default function TimekeepingOverview() {
    const page = usePage();
    const analytics = (page.props as { analytics?: Analytics }).analytics || {
        summary: { total_employees: 0, average_attendance_rate: 0, average_late_rate: 0, average_absent_rate: 0, compliance_score: 0 },
        status_distribution: [],
        top_issues: [],
    };

    const breadcrumbs = [
        { title: 'HR', href: '/hr' },
        { title: 'Timekeeping', href: '/hr/timekeeping' },
        { title: 'Overview', href: '/hr/timekeeping/overview' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">Attendance Overview</h1>
                    <p className="text-gray-600">Monitor attendance metrics and trends </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title="Attendance Rate"
                        value={`${analytics.summary.average_attendance_rate}%`}
                        description={`of ${analytics.summary.total_employees} employees`}
                    />
                    <SummaryCard
                        title="Late Rate"
                        value={`${analytics.summary.average_late_rate}%`}
                        description="late arrivals"
                    />
                    <SummaryCard
                        title="Absent Rate"
                        value={`${analytics.summary.average_absent_rate}%`}
                        description="absent employees"
                    />
                    <SummaryCard
                        title="Compliance Score"
                        value={analytics.summary.compliance_score}
                        description="overall compliance"
                    />
                </div>

                {/* Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status Distribution</CardTitle>
                        <CardDescription>Attendance status breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.status_distribution.map((status: StatusDistribution) => (
                                <div key={status.status} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="capitalize text-sm font-medium">{status.status}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm font-semibold">{status.count}</div>
                                            <div className="text-xs text-muted-foreground">{status.percentage}%</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Issues */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Issues</CardTitle>
                        <CardDescription>Most common attendance issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.top_issues.map((issue: TopIssue) => (
                                <div key={issue.issue} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-medium">{issue.issue}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm font-semibold">{issue.count}</div>
                                        <div className={`text-xs px-2 py-1 rounded ${
                                            issue.trend === 'up' ? 'bg-red-100 text-red-700' :
                                            issue.trend === 'down' ? 'bg-green-100 text-green-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {issue.trend}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
