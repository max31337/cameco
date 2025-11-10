import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, UserCheck, Archive } from 'lucide-react';
import { EmployeeReportsPageProps } from '@/types/hr-pages';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HR', href: '/hr/dashboard' },
    { title: 'Reports', href: '#' },
    { title: 'Employee Reports', href: '/hr/reports/employees' },
];

export default function EmployeeReports({ summary, by_department, recent_hires }: EmployeeReportsPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        
            <Head title="Employee Reports" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Employee Reports</h1>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                    <p className="text-muted-foreground">
                        Comprehensive employee statistics and analysis
                    </p>
                </div>

                {/* Summary Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary?.total_employees || 0}</div>
                            <p className="text-xs text-muted-foreground">All employees in system</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{summary?.active_employees || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {summary?.total_employees && summary?.active_employees
                                    ? ((summary.active_employees / summary.total_employees) * 100).toFixed(1)
                                    : '0'}
                                % of total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                            <Archive className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{summary?.inactive_employees || 0}</div>
                            <p className="text-xs text-muted-foreground">Inactive employees</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{summary?.on_leave_employees || 0}</div>
                            <p className="text-xs text-muted-foreground">Currently on leave</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistics by Department */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employees by Department</CardTitle>
                        <CardDescription>
                            Headcount distribution across departments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {by_department && by_department.length > 0 ? (
                                by_department.map((dept) => (
                                    <div key={dept.department_id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{dept.department_name}</p>
                                                <p className="text-xs text-muted-foreground">{dept.employee_count} employees</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${dept.percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <Badge variant="outline">
                                                {dept.percentage.toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No department data available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Hires */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Hires</CardTitle>
                        <CardDescription>
                            Recently added employees to the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recent_hires && recent_hires.length > 0 ? (
                                recent_hires.map((hire) => (
                                    <div key={hire.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {hire.profile?.first_name} {hire.profile?.last_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {hire.position?.title} • {hire.department?.name}
                                            </p>
                                        </div>
                                        <Badge variant="secondary">
                                            {hire.status}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No recent hires</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Employment Duration Statistics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employment Duration Analysis</CardTitle>
                        <CardDescription>
                            Average tenure and experience distribution
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Average Tenure</p>
                                <p className="text-2xl font-bold">{(summary?.average_tenure_years || 0).toFixed(1)} years</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {((summary?.average_tenure_years || 0) * 12).toFixed(0)} months average
                                </p>
                            </div>

                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Terminated Employees</p>
                                <p className="text-2xl font-bold text-red-600">{summary?.terminated_employees || 0}</p>
                                <p className="text-xs text-muted-foreground mt-1">Total separations</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Status Distribution</CardTitle>
                        <CardDescription>
                            Overview of employee status categories
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Total</p>
                                <p className="text-2xl font-bold">{summary?.total_employees || 0}</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Active</p>
                                <p className="text-2xl font-bold text-green-600">{summary?.active_employees || 0}</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Inactive</p>
                                <p className="text-2xl font-bold text-orange-600">{summary?.inactive_employees || 0}</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Terminated</p>
                                <p className="text-2xl font-bold text-red-600">{summary?.terminated_employees || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
