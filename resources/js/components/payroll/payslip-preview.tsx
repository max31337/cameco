import React from 'react';
import { FileText, X, Download, Calendar, Building2, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PayslipPreviewData } from '@/types/payroll-pages';

interface PayslipPreviewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: PayslipPreviewData | null;
    onDownload?: () => void;
}

export function PayslipPreview({ open, onOpenChange, data, onDownload }: PayslipPreviewProps) {
    if (!data) return null;

    const formatPeso = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Payslip Preview
                        </div>
                        <div className="flex items-center gap-2">
                            {onDownload && (
                                <Button variant="outline" size="sm" onClick={onDownload}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Payslip Content */}
                <div className="space-y-6 py-4">
                    {/* Company Header */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Cathay Metal Corporation</h2>
                        <p className="text-sm text-gray-600">Employee Payslip</p>
                    </div>

                    <Separator />

                    {/* Employee & Period Information */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Employee Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4" />
                                    Employee Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Employee Name:</span>
                                    <span className="font-semibold">{data.employee_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Employee Number:</span>
                                    <span className="font-mono">{data.employee_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Position:</span>
                                    <span>{data.position}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Department:</span>
                                    <span className="flex items-center gap-1">
                                        <Building2 className="h-3 w-3" />
                                        {data.department}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Period Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    Pay Period Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Period:</span>
                                    <span className="font-semibold">{data.period_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Period Start:</span>
                                    <span>{formatDate(data.period_start)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Period End:</span>
                                    <span>{formatDate(data.period_end)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pay Date:</span>
                                    <span className="font-semibold text-green-700">{formatDate(data.pay_date)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Earnings Section */}
                    <Card>
                        <CardHeader className="bg-green-50">
                            <CardTitle className="text-base text-green-800">Earnings</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-2">
                                {data.earnings.map((earning, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span className="text-gray-700">{earning.name}</span>
                                        <span className="font-medium">{formatPeso(earning.amount)}</span>
                                    </div>
                                ))}
                                <Separator className="my-3" />
                                <div className="flex justify-between text-base font-semibold">
                                    <span>Gross Pay</span>
                                    <span className="text-green-700">{formatPeso(data.gross_pay)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Deductions Section */}
                    <Card>
                        <CardHeader className="bg-red-50">
                            <CardTitle className="text-base text-red-800">Deductions</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-2">
                                {data.deductions.map((deduction, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span className="text-gray-700">{deduction.name}</span>
                                        <span className="font-medium text-red-600">
                                            ({formatPeso(deduction.amount)})
                                        </span>
                                    </div>
                                ))}
                                <Separator className="my-3" />
                                <div className="flex justify-between text-base font-semibold">
                                    <span>Total Deductions</span>
                                    <span className="text-red-700">({formatPeso(data.total_deductions)})</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Net Pay Section */}
                    <Card className="border-2 border-green-600 bg-green-50">
                        <CardContent className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">NET PAY</p>
                                    <p className="text-xs text-gray-600">Amount to be received</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-green-700">{formatPeso(data.net_pay)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Year-to-Date Summary */}
                    <Card>
                        <CardHeader className="bg-blue-50">
                            <CardTitle className="text-base text-blue-800">Year-to-Date (YTD) Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-600">YTD Gross</p>
                                    <p className="text-lg font-semibold">{formatPeso(data.ytd_gross)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-600">YTD Deductions</p>
                                    <p className="text-lg font-semibold text-red-600">
                                        ({formatPeso(data.ytd_deductions)})
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-600">YTD Net</p>
                                    <p className="text-lg font-semibold text-green-700">{formatPeso(data.ytd_net)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Notes */}
                    <div className="rounded-lg border bg-gray-50 p-4 text-xs text-gray-600">
                        <p className="font-semibold text-gray-800">Important Notes:</p>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                            <li>This payslip is computer-generated and complies with DOLE regulations</li>
                            <li>All deductions are made in accordance with Philippine labor law</li>
                            <li>Government contributions (SSS, PhilHealth, Pag-IBIG) are as per current rates</li>
                            <li>
                                For questions or concerns, please contact the Payroll Department at
                                payroll@cathay-metal.com
                            </li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
