import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    AlertTriangle,
    Eye,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SSSRemittance } from '@/types/payroll-pages';

interface SSSRemittanceTrackerProps {
    remittances: SSSRemittance[];
}

export function SSSRemittanceTracker({ remittances }: SSSRemittanceTrackerProps) {
    const totalPending = remittances
        .filter((r) => r.status === 'pending' || r.status === 'overdue')
        .reduce((sum, r) => sum + r.remittance_amount, 0);

    const totalOverdue = remittances
        .filter((r) => r.status === 'overdue')
        .reduce((sum, r) => sum + r.remittance_amount, 0);

    const totalPenalties = remittances
        .filter((r) => r.has_penalty)
        .reduce((sum, r) => sum + r.penalty_amount, 0);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'partially_paid':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-blue-100 text-blue-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'overdue':
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getDaysUntilDue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDaysOverdue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today.getTime() - due.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            {(totalOverdue > 0 || totalPending > 0) && (
                <div className="grid gap-4 md:grid-cols-3">
                    {totalOverdue > 0 && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-red-600">Overdue Amount</p>
                                        <p className="text-2xl font-bold text-red-700">₱{totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {totalPending > 0 && (
                        <Card className="border-blue-200 bg-blue-50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-600">Pending Remittance</p>
                                        <p className="text-2xl font-bold text-blue-700">₱{totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <Clock className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {totalPenalties > 0 && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-orange-600">Total Penalties</p>
                                        <p className="text-2xl font-bold text-orange-700">₱{totalPenalties.toFixed(2)}</p>
                                    </div>
                                    <AlertCircle className="h-8 w-8 text-orange-500" />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Alert for Late Payments */}
            {totalOverdue > 0 && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-900">Overdue Remittances</AlertTitle>
                    <AlertDescription className="text-red-800">
                        You have overdue SSS remittances. Late payment may incur penalties. Please process payment immediately.
                    </AlertDescription>
                </Alert>
            )}

            {/* Remittance Tracking Table */}
            <Card>
                <CardHeader>
                    <CardTitle>SSS Remittance Tracking</CardTitle>
                    <CardDescription>
                        Monitor SSS contribution remittance status and payment history
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {remittances.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                            <Calendar className="mb-3 h-8 w-8 text-muted-foreground" />
                            <p className="font-medium">No remittances yet</p>
                            <p className="text-sm text-muted-foreground">
                                Remittances will be tracked here once contributions are processed
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead>Month</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Payment Date</TableHead>
                                        <TableHead>Reference</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Penalty</TableHead>
                                        <TableHead className="text-center">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {remittances.map((remittance) => {
                                        const daysUntilDue = getDaysUntilDue(remittance.due_date);
                                        const daysOverdue = getDaysOverdue(remittance.due_date);
                                        const isUpcoming = daysUntilDue <= 5 && daysUntilDue > 0;

                                        return (
                                            <TableRow key={remittance.id}>
                                                <TableCell className="font-medium">{remittance.month}</TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    ₱{remittance.remittance_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {formatDate(remittance.due_date)}
                                                        {isUpcoming && (
                                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                                In {daysUntilDue} days
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {remittance.payment_date ? (
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                            {formatDate(remittance.payment_date)}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">Not paid</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {remittance.payment_reference ? (
                                                        <Badge variant="outline">{remittance.payment_reference}</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={getStatusColor(remittance.status)}>
                                                        {getStatusIcon(remittance.status)}
                                                        <span className="ml-1">{remittance.status.replace('_', ' ')}</span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {remittance.has_penalty ? (
                                                        <span className="font-semibold text-orange-600">
                                                            ₱{remittance.penalty_amount.toFixed(2)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Summary Footer */}
                    {remittances.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                            <div className="grid grid-cols-5 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Total Remittances</p>
                                    <p className="text-lg font-semibold">
                                        ₱{remittances.reduce((sum, r) => sum + r.remittance_amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Paid</p>
                                    <p className="text-lg font-semibold">
                                        {remittances.filter((r) => r.status === 'paid').length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Pending</p>
                                    <p className="text-lg font-semibold">
                                        {remittances.filter((r) => r.status === 'pending' || r.status === 'partially_paid').length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Overdue</p>
                                    <p className="text-lg font-semibold text-red-600">
                                        {remittances.filter((r) => r.status === 'overdue').length}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3">
                                    <p className="text-muted-foreground">Total Penalties</p>
                                    <p className="text-lg font-semibold">
                                        ₱{remittances.reduce((sum, r) => sum + r.penalty_amount, 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Contribution Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Remittance Components</CardTitle>
                    <CardDescription>
                        Breakdown of SSS contribution shares included in remittances
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <span className="font-medium">Employee Share (EE)</span>
                            <span className="text-muted-foreground">3% of monthly compensation</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <span className="font-medium">Employer Share (ER)</span>
                            <span className="text-muted-foreground">3% of monthly compensation</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <span className="font-medium">EC Share (Employees Compensation)</span>
                            <span className="text-muted-foreground">1% of monthly compensation</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <span className="font-semibold">Total Monthly Contribution</span>
                            <span className="font-semibold text-blue-600">7% of monthly compensation</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
