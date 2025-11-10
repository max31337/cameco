import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { LeaveRequestsPageProps } from '@/types/hr-pages';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HR', href: '/hr/dashboard' },
    { title: 'Leave Management', href: '#' },
    { title: 'Requests', href: '/hr/leave/requests' },
];

function getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        Approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        Rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
        Cancelled: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
}

function getStatusIcon(status: string) {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
        case 'approved':
            return <CheckCircle2 className="h-4 w-4" />;
        case 'rejected':
            return <XCircle className="h-4 w-4" />;
        case 'pending':
            return <Clock className="h-4 w-4" />;
        default:
            return <Calendar className="h-4 w-4" />;
    }
}

export default function LeaveRequests({ requests }: LeaveRequestsPageProps) {
    const requestsData = Array.isArray(requests) ? requests : requests?.data || [];
    
    const pendingCount = requestsData.filter((r) => r.status?.toLowerCase() === 'pending').length;
    const approvedCount = requestsData.filter((r) => r.status?.toLowerCase() === 'approved').length;
    const rejectedCount = requestsData.filter((r) => r.status?.toLowerCase() === 'rejected').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave Requests" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">

                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
                        <Link href="/hr/leave/requests" className="hidden">
                            <Button variant="outline">Refresh</Button>
                        </Link>
                    </div>
                    <p className="text-muted-foreground">
                        Manage and track employee leave requests across the organization
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Pending</span>
                                <Clock className="h-4 w-4 text-yellow-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Approved</span>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{approvedCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Approved requests</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Rejected</span>
                                <XCircle className="h-4 w-4 text-red-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{rejectedCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Rejected requests</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Leave Requests Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Requests</CardTitle>
                        <CardDescription>
                            View and manage all employee leave requests
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requestsData && requestsData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-semibold">Employee</th>
                                            <th className="text-left py-3 px-4 font-semibold">Leave Type</th>
                                            <th className="text-left py-3 px-4 font-semibold">From Date</th>
                                            <th className="text-left py-3 px-4 font-semibold">To Date</th>
                                            <th className="text-left py-3 px-4 font-semibold">Days</th>
                                            <th className="text-left py-3 px-4 font-semibold">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestsData.map((request) => (
                                            <tr key={request.id} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">{request.employee_name || 'N/A'}</td>
                                                <td className="py-3 px-4">{request.leave_type || 'N/A'}</td>
                                                <td className="py-3 px-4">{request.start_date || 'N/A'}</td>
                                                <td className="py-3 px-4">{request.end_date || 'N/A'}</td>
                                                <td className="py-3 px-4">{request.days || 0}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={getStatusColor(request.status || 'Pending')}>
                                                        <span className="flex items-center gap-1">
                                                            {getStatusIcon(request.status || 'Pending')}
                                                            {request.status || 'Pending'}
                                                        </span>
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        {request.status?.toLowerCase() === 'pending' && (
                                                            <>
                                                                <Button size="sm" variant="outline" className="text-xs">
                                                                    Approve
                                                                </Button>
                                                                <Button size="sm" variant="outline" className="text-xs text-red-600">
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button size="sm" variant="ghost" className="text-xs">
                                                            View
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No leave requests found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Leave requests will appear here once employees submit them
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
