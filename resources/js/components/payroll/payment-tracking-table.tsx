import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreVertical, Download, Eye, RotateCw } from 'lucide-react';
import type { PaymentTracking } from '@/types/payroll-pages';

interface PaymentTrackingTableProps {
    payments: PaymentTracking[];
    onMarkPaid: (paymentId: number) => void;
    onRetry: (paymentId: number) => void;
    onConfirm: (paymentId: number) => void;
    onView: (payment: PaymentTracking) => void;
}

const getPaymentMethodIcon = (method: string) => {
    switch (method) {
        case 'bank_transfer':
            return '🏦';
        case 'cash':
            return '💵';
        case 'check':
            return '📝';
        default:
            return '💳';
    }
};

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'failed':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function PaymentTrackingTable({
    payments,
    onMarkPaid,
    onRetry,
    onConfirm,
    onView,
}: PaymentTrackingTableProps) {
    if (payments.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-2">No payments found</p>
                        <p className="text-gray-400 text-xs">Adjust filters or create new payment records</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Payment Records</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="text-xs font-semibold">Employee</TableHead>
                                <TableHead className="text-xs font-semibold">Period</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Net Pay</TableHead>
                                <TableHead className="text-xs font-semibold">Method</TableHead>
                                <TableHead className="text-xs font-semibold">Status</TableHead>
                                <TableHead className="text-xs font-semibold">Payment Date</TableHead>
                                <TableHead className="text-xs font-semibold">Reference</TableHead>
                                <TableHead className="text-xs font-semibold text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id} className="border-b hover:bg-gray-50">
                                    {/* Employee Info */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-gray-900">
                                                {payment.employee_name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {payment.employee_number}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Period */}
                                    <TableCell>
                                        <span className="text-sm text-gray-700">{payment.period_name}</span>
                                    </TableCell>

                                    {/* Net Pay */}
                                    <TableCell className="text-right">
                                        <span className="font-semibold text-sm text-gray-900">
                                            {payment.formatted_net_pay}
                                        </span>
                                    </TableCell>

                                    {/* Payment Method */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getPaymentMethodIcon(payment.payment_method)}</span>
                                            <span className="text-sm text-gray-700">{payment.payment_method_label}</span>
                                        </div>
                                        {payment.account_number && (
                                            <span className="text-xs text-gray-500 block mt-1">
                                                {payment.account_number}
                                            </span>
                                        )}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Badge className={`${getStatusBadgeColor(payment.payment_status)} text-xs`}>
                                            {payment.payment_status_label}
                                        </Badge>
                                    </TableCell>

                                    {/* Payment Date */}
                                    <TableCell>
                                        <span className="text-sm text-gray-700">
                                            {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('en-PH') : '-'}
                                        </span>
                                    </TableCell>

                                    {/* Reference Number */}
                                    <TableCell>
                                        <span className="text-sm font-mono text-gray-600">
                                            {payment.payment_reference || '-'}
                                        </span>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2">
                                            {/* View Button */}
                                            <button
                                                onClick={() => onView(payment)}
                                                className="p-1 hover:bg-gray-200 rounded transition"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4 text-gray-600" />
                                            </button>

                                            {/* Mark Paid Button */}
                                            {payment.can_mark_paid && (
                                                <button
                                                    onClick={() => onMarkPaid(payment.id)}
                                                    className="p-1 hover:bg-green-100 rounded transition"
                                                    title="Mark as Paid"
                                                >
                                                    <Download className="h-4 w-4 text-green-600" />
                                                </button>
                                            )}

                                            {/* Retry Button */}
                                            {payment.can_retry && (
                                                <button
                                                    onClick={() => onRetry(payment.id)}
                                                    className="p-1 hover:bg-blue-100 rounded transition"
                                                    title="Retry Payment"
                                                >
                                                    <RotateCw className="h-4 w-4 text-blue-600" />
                                                </button>
                                            )}

                                            {/* Confirm Button */}
                                            {payment.can_confirm && (
                                                <button
                                                    onClick={() => onConfirm(payment.id)}
                                                    className="p-1 hover:bg-purple-100 rounded transition"
                                                    title="Confirm Payment"
                                                >
                                                    <Badge className="bg-purple-100 text-purple-800 text-xs cursor-pointer hover:bg-purple-200">
                                                        Confirm
                                                    </Badge>
                                                </button>
                                            )}

                                            {/* Dropdown menu placeholder for future expansion */}
                                            {!payment.can_mark_paid && !payment.can_retry && !payment.can_confirm && (
                                                <button
                                                    disabled
                                                    className="p-1 text-gray-300 cursor-not-allowed"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
