import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { LeaveBalance } from '@/types/hr-pages';

interface LeaveBalancesPageProps {
    balances: LeaveBalance[] | { data: LeaveBalance[] };
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HR', href: '/hr/dashboard' },
    { title: 'Leave Management', href: '#' },
    { title: 'Balances', href: '/hr/leave/balances' },
];

function getLeaveTypeColor(type: string): string {
    const colorMap: Record<string, string> = {
        'Vacation Leave': 'bg-blue-100 text-blue-800',
        'Sick Leave': 'bg-red-100 text-red-800',
        'Emergency Leave': 'bg-yellow-100 text-yellow-800',
        'Maternity Leave': 'bg-pink-100 text-pink-800',
        'Paternity Leave': 'bg-pink-100 text-pink-800',
        'Privilege Leave': 'bg-green-100 text-green-800',
        'Bereavement Leave': 'bg-purple-100 text-purple-800',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
}
export default function LeaveBalances({ balances }: LeaveBalancesPageProps) {
    const balancesData = Array.isArray(balances) ? balances : balances?.data || [];

    const totalEarned = balancesData.reduce((sum, b) => sum + (b.earned || 0), 0);
    const totalUsed = balancesData.reduce((sum, b) => sum + (b.used || 0), 0);
    const totalRemaining = balancesData.reduce((sum, b) => sum + (b.remaining || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave Balances" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Leave Balances</h1>
                        <Link href="/hr/leave/balances" className="hidden">
                            <Button variant="outline">Refresh</Button>
                        </Link>
                    </div>
                    <p className="text-muted-foreground">
                        View employee leave balance across all leave types
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Total Earned</span>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalEarned.toFixed(1)} days</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all leave types</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Total Used</span>
                                <TrendingDown className="h-4 w-4 text-blue-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUsed.toFixed(1)} days</div>
                            <p className="text-xs text-muted-foreground mt-1">Already consumed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Total Remaining</span>
                                <Calendar className="h-4 w-4 text-amber-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{totalRemaining.toFixed(1)} days</div>
                            <p className="text-xs text-muted-foreground mt-1">Available to use</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Leave Balances Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Balance Details</CardTitle>
                        <CardDescription>
                            Detailed breakdown of leave balances by type and employee
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {balancesData && balancesData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-semibold">Employee</th>
                                            <th className="text-left py-3 px-4 font-semibold">Leave Type</th>
                                            <th className="text-right py-3 px-4 font-semibold">Earned</th>
                                            <th className="text-right py-3 px-4 font-semibold">Used</th>
                                            <th className="text-right py-3 px-4 font-semibold">Remaining</th>
                                            <th className="text-right py-3 px-4 font-semibold">Carried Forward</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {balancesData.map((balance, index) => (
                                            <tr key={balance.employee_id && balance.leave_type ? `${balance.employee_id}-${balance.leave_type}` : `balance-${index}`} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">{typeof balance.employee === 'string' ? balance.employee : balance.employee?.first_name || 'N/A'}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={getLeaveTypeColor(balance.leave_type || '')}>
                                                        {balance.leave_type || 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td className="text-right py-3 px-4">{balance.earned || 0}</td>
                                                <td className="text-right py-3 px-4 text-red-600">{balance.used || 0}</td>
                                                <td className="text-right py-3 px-4 font-semibold text-green-600">{balance.remaining || 0}</td>
                                                <td className="text-right py-3 px-4">{balance.carried_forward || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No leave balance data found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Leave balances will appear here once they are configured
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
