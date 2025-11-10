import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    TotalEmployeesCard, 
    ActiveEmployeesCard, 
    DepartmentBreakdownCard, 
    RecentHiresCard, 
    PendingActionsCard 
} from '@/components/hr-metrics-widgets';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface HRMetrics {
    totalEmployees: {
        count: number;
        trend: number; // percentage change from last month
        label: string;
    };
    activeEmployees: {
        count: number;
        percentage: number; // percentage of total
        label: string;
    };
    departmentBreakdown: {
        data: Array<{
            name: string;
            count: number;
            percentage: number;
        }>;
        label: string;
    };
    recentHires: {
        data: Array<{
            id: number;
            name: string;
            position: string;
            department: string;
            hire_date: string;
            formatted_hire_date: string;
        }>;
        count: number;
        label: string;
    };
    pendingActions: {
        count: number;
        label: string;
        items: Array<{
            id: number;
            type: string;
            description: string;
            priority: 'low' | 'medium' | 'high';
            created_at: string;
        }>;
    };
}

interface HRDashboardProps {
    metrics: HRMetrics;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ metrics }: HRDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="HR Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">HR Manager Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage employees, departments, and HR operations for Cathay Metal Corporation
                    </p>
                </div>

                
                  {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <p>
                            Welcome to the HR Manager Dashboard. This is your central hub for all HR operations.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Use <strong>Employees</strong> to manage employee records and view employee details</li>
                            <li>Configure your company structure with <strong>Departments</strong> and <strong>Positions</strong></li>
                            <li>View comprehensive HR metrics and analytics in the <strong>Analytics</strong> section</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Key Metrics - Top Row */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Overview</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <TotalEmployeesCard data={metrics.totalEmployees} />
                        <ActiveEmployeesCard data={metrics.activeEmployees} />
                        <PendingActionsCard data={metrics.pendingActions} />
                    </div>
                </div>

                {/* Department Breakdown & Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2">
                    <DepartmentBreakdownCard data={metrics.departmentBreakdown} />
                    <RecentHiresCard data={metrics.recentHires} />
                </div>

                {/* Quick Access Info */}
                <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                    <p>
                        <strong>Quick Access:</strong> Use the sidebar navigation to manage employees, 
                        departments, and positions. Click on any metric card for detailed information.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
