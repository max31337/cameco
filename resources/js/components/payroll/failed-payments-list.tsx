import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCw, Zap } from 'lucide-react';
import type { FailedPayment } from '@/types/payroll-pages';

interface FailedPaymentsListProps {
    failedPayments: FailedPayment[];
    onRetry: (paymentId: number) => void;
    onChangeMethod: (paymentId: number, newMethod: string) => void;
    isLoading?: boolean;
}

export default function FailedPaymentsList({
    failedPayments,
    onRetry,
    onChangeMethod,
    isLoading = false,
}: FailedPaymentsListProps) {
    if (failedPayments.length === 0) {
        return (
            <Card>
                <CardContent className="py-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-2">
                            <div className="p-3 bg-green-100 rounded-full">
                                <AlertCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <p className="font-medium text-gray-900">No Failed Payments</p>
                        <p className="text-sm text-gray-500 mt-1">All payments are processing successfully</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-base text-red-900">Failed Payments ({failedPayments.length})</CardTitle>
                    </div>
                    <Badge className="bg-red-200 text-red-800">{failedPayments.length}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {failedPayments.map((payment) => (
                        <div
                            key={payment.id}
                            className="border border-red-200 bg-white rounded-lg p-4"
                        >
                            {/* Header Row */}
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">
                                            {payment.employee_name}
                                        </span>
                                        <Badge className="bg-red-100 text-red-800 text-xs">
                                            Failed
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {payment.employee_number} • {payment.period_name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{payment.formatted_net_pay}</p>
                                    <p className="text-xs text-gray-500">{payment.payment_method_label}</p>
                                </div>
                            </div>

                            {/* Failure Reason */}
                            <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded">
                                <p className="text-xs font-medium text-red-900 mb-1">Failure Reason:</p>
                                <p className="text-sm text-red-800">{payment.failure_reason}</p>
                                {payment.failure_code && (
                                    <p className="text-xs text-red-700 mt-1">
                                        Error Code: {payment.failure_code}
                                    </p>
                                )}
                            </div>

                            {/* Retry Information */}
                            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800">
                                <p className="font-medium">
                                    Retry Attempts: {payment.retry_count}/{payment.max_retries}
                                </p>
                                {payment.next_retry_date && (
                                    <p className="mt-1">
                                        Next Retry: {new Date(payment.next_retry_date).toLocaleDateString('en-PH')}
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            {payment.notes && (
                                <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800">
                                    <p className="font-medium mb-1">Notes:</p>
                                    <p>{payment.notes}</p>
                                </div>
                            )}

                            {/* Alternative Payment Methods */}
                            {payment.alternative_methods && payment.alternative_methods.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-gray-700 mb-2">
                                        Alternative Payment Methods:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {payment.alternative_methods
                                            .filter((m) => m.available && m.method !== payment.current_payment_method)
                                            .map((method) => (
                                                <Button
                                                    key={method.method}
                                                    onClick={() => onChangeMethod(payment.id, method.method)}
                                                    disabled={isLoading}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs h-8"
                                                >
                                                    <Zap className="h-3 w-3 mr-1" />
                                                    Switch to {method.label}
                                                </Button>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {payment.retry_count < payment.max_retries && (
                                    <Button
                                        onClick={() => onRetry(payment.id)}
                                        disabled={isLoading}
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
                                    >
                                        <RotateCw className="h-3 w-3 mr-1" />
                                        Retry Payment
                                    </Button>
                                )}
                                {payment.retry_count >= payment.max_retries && (
                                    <div className="text-xs text-red-700 font-medium flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        Maximum retries reached
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
