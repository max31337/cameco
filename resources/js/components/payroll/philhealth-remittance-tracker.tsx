import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Remittance {
    id: string | number;
    month: string;
    remittance_amount: number;
    due_date: string;
    payment_date: string | null;
    payment_reference: string | null;
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue';
    has_penalty: boolean;
    penalty_amount: number;
    penalty_reason?: string;
    contributions: {
        employee_share: number;
        employer_share: number;
    };
}

interface PhilHealthRemittanceTrackerProps {
    remittances: Remittance[];
}

/**
 * PhilHealth Remittance Tracker Component
 * Tracks monthly premium payments to PhilHealth
 * PhilHealth premium is 5% of monthly basic (2.5% EE + 2.5% ER)
 * Due date: 10th of following month
 */
export function PhilHealthRemittanceTracker({
    remittances,
}: PhilHealthRemittanceTrackerProps) {
    const totalRemittances = remittances.reduce((sum, r) => sum + r.remittance_amount, 0);
    const totalPenalties = remittances.reduce((sum, r) => sum + (r.has_penalty ? r.penalty_amount : 0), 0);
    const paidRemittances = remittances.filter((r) => r.status === 'paid').length;
    const pendingRemittances = remittances.filter((r) => r.status === 'pending').length;
    const overdueRemittances = remittances.filter((r) => r.status === 'overdue').length;

    const today = new Date();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'overdue':
                return <AlertCircle className="h-4 w-4 text-red-600" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-amber-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-amber-100 text-amber-800';
            case 'partially_paid':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDaysUntilDue = (dueDate: string) => {
        const due = new Date(dueDate);
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <div className="space-y-6">
            {/* Alerts */}
            {overdueRemittances > 0 && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                        {overdueRemittances} remittance{overdueRemittances !== 1 ? 's are' : ' is'} overdue. Please submit
                        payment immediately to avoid penalties.
                    </AlertDescription>
                </Alert>
            )}

            {totalPenalties > 0 && (
                <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700">
                        Total penalties accumulated: ₱
                        {totalPenalties.toLocaleString('en-US', { minimumFractionDigits: 2 })}. These are charges for late
                        payments.
                    </AlertDescription>
                </Alert>
            )}

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Total Remittances</p>
                            <p className="text-2xl font-bold">
                                ₱{(totalRemittances / 1000).toFixed(1)}k
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {remittances.length} months
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Paid</p>
                            <p className="text-2xl font-bold text-green-600">{paidRemittances}</p>
                            <p className="text-xs text-muted-foreground">
                                On time
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Pending</p>
                            <p className="text-2xl font-bold text-amber-600">{pendingRemittances}</p>
                            <p className="text-xs text-muted-foreground">
                                Awaiting payment
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Penalties</p>
                            <p className="text-2xl font-bold text-red-600">
                                ₱{(totalPenalties / 1000).toFixed(1)}k
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Late payment charges
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Remittances Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Remittance History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Month</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Penalty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {remittances.map((remittance) => {
                                    const daysUntilDue = getDaysUntilDue(remittance.due_date);
                                    const isOverdue = daysUntilDue < 0;

                                    return (
                                        <TableRow key={remittance.id} className={isOverdue ? 'bg-red-50' : ''}>
                                            <TableCell>
                                                <p className="font-medium">
                                                    {new Date(remittance.month).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                    })}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ₱
                                                {remittance.remittance_amount.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p>{new Date(remittance.due_date).toLocaleDateString()}</p>
                                                    {remittance.status === 'pending' && (
                                                        <p className="text-xs text-amber-600">
                                                            {daysUntilDue > 0 ? `Due in ${daysUntilDue} days` : 'Overdue'}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {remittance.payment_date ? (
                                                    <div className="space-y-1">
                                                        <p>{new Date(remittance.payment_date).toLocaleDateString()}</p>
                                                        {remittance.status === 'overdue' && (
                                                            <p className="text-xs text-red-600">
                                                                {Math.ceil(
                                                                    (new Date(remittance.payment_date).getTime() -
                                                                        new Date(remittance.due_date).getTime()) /
                                                                        (1000 * 60 * 60 * 24)
                                                                )}{' '}
                                                                days late
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-muted-foreground">—</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {remittance.payment_reference ? (
                                                    <p className="font-mono text-sm">{remittance.payment_reference}</p>
                                                ) : (
                                                    <p className="text-muted-foreground">—</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(remittance.status)}
                                                    <Badge className={getStatusColor(remittance.status)}>
                                                        {remittance.status}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {remittance.has_penalty ? (
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-red-600">
                                                            ₱{remittance.penalty_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </p>
                                                        {remittance.penalty_reason && (
                                                            <p className="text-xs text-red-600">
                                                                {remittance.penalty_reason}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-muted-foreground">—</p>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Summary Footer */}
                    <div className="mt-6 border-t pt-4">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Remittances</p>
                                <p className="text-lg font-semibold">
                                    ₱{totalRemittances.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Paid Count</p>
                                <p className="text-lg font-semibold text-green-600">{paidRemittances}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Count</p>
                                <p className="text-lg font-semibold text-amber-600">{pendingRemittances}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Penalties</p>
                                <p className="text-lg font-semibold text-red-600">
                                    ₱{totalPenalties.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>PhilHealth Contribution Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-blue-50 p-4">
                            <p className="font-medium text-blue-900">Premium Calculation</p>
                            <ul className="mt-2 space-y-1 text-sm text-blue-800">
                                <li>• Employee Premium (EE): 2.5% of monthly basic</li>
                                <li>• Employer Premium (ER): 2.5% of monthly basic</li>
                                <li>• Total Premium: 5% of monthly basic</li>
                                <li>• Maximum Premium: ₱5,000 per month</li>
                            </ul>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4">
                            <p className="font-medium text-green-900">Remittance Schedule</p>
                            <ul className="mt-2 space-y-1 text-sm text-green-800">
                                <li>• Frequency: Monthly</li>
                                <li>• Due Date: 10th of following month</li>
                                <li>• Portal: PhilHealth EPRS</li>
                                <li>• Format: RF1 (CSV) report</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
