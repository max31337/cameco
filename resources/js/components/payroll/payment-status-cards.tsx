import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';
import type { PaymentStatusSummary } from '@/types/payroll-pages';

interface PaymentStatusCardsProps {
    summary: PaymentStatusSummary;
}

export default function PaymentStatusCards({ summary }: PaymentStatusCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Employees Card */}
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">Total Employees</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{summary.total_employees}</div>
                            <p className="text-xs text-gray-500 mt-1">Total for payroll</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500 opacity-60" />
                    </div>
                </CardContent>
            </Card>

            {/* Paid Count Card */}
            <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">Paid</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-green-600">{summary.paid_count}</div>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500"
                                        style={{ width: `${summary.paid_percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500">{summary.paid_percentage}%</span>
                            </div>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500 opacity-60" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{summary.formatted_paid}</p>
                </CardContent>
            </Card>

            {/* Pending Count Card */}
            <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-yellow-600">{summary.pending_count}</div>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500"
                                        style={{ width: `${summary.pending_percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500">{summary.pending_percentage}%</span>
                            </div>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-500 opacity-60" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{summary.formatted_pending}</p>
                </CardContent>
            </Card>

            {/* Failed Count Card */}
            <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-red-600">{summary.failed_count}</div>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500"
                                        style={{ width: `${summary.failed_percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500">{summary.failed_percentage}%</span>
                            </div>
                        </div>
                        <AlertCircle className="h-8 w-8 text-red-500 opacity-60" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{summary.formatted_failed}</p>
                </CardContent>
            </Card>

            {/* Total Amount Card (Spans full width on smaller screens, 2 cols on medium) */}
            <Card className="md:col-span-2 lg:col-span-4 border-t-4 border-t-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">Total Amount Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Total to Disburse</p>
                            <p className="text-lg font-bold text-gray-900">{summary.formatted_total}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Already Paid</p>
                            <p className="text-lg font-bold text-green-600">{summary.formatted_paid}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Pending Disbursement</p>
                            <p className="text-lg font-bold text-yellow-600">{summary.formatted_pending}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Failed Attempts</p>
                            <p className="text-lg font-bold text-red-600">{summary.formatted_failed}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
