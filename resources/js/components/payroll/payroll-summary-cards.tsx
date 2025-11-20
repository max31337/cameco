import React from 'react';
import { Card } from '@/components/ui/card';
import type { PayrollReviewSummary } from '@/types/payroll-review-types';
import { TrendingUp, TrendingDown, DollarSign, Users, ArrowDown } from 'lucide-react';

interface PayrollSummaryCardsProps {
    summary: PayrollReviewSummary;
}

export function PayrollSummaryCards({ summary }: PayrollSummaryCardsProps) {
    const varianceColor = summary.variance_from_previous >= 0 ? 'text-green-600' : 'text-red-600';
    const varianceIcon = summary.variance_from_previous >= 0 ? <TrendingUp /> : <TrendingDown />;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Employees Processed */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Employees Processed</p>
                        <p className="mt-2 text-3xl font-bold">{summary.total_employees_processed}</p>
                        <p className="mt-1 text-xs text-muted-foreground">employees in this payroll</p>
                    </div>
                    <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
            </Card>

            {/* Gross Pay */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Gross Pay</p>
                        <p className="mt-2 text-2xl font-bold">{summary.formatted_gross_pay}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {summary.total_gross_pay > 0 ? '₱' + (summary.total_gross_pay / summary.total_employees_processed).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '₱0.00'}{' '}
                            per employee
                        </p>
                    </div>
                    <div className="rounded-lg bg-green-100 p-3 text-green-600">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
            </Card>

            {/* Total Deductions */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Deductions</p>
                        <p className="mt-2 text-2xl font-bold">{summary.formatted_deductions}</p>
                        <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                            <p>Statutory: ₱{summary.total_statutory_deductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                            <p>Other: ₱{summary.total_other_deductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-red-100 p-3 text-red-600">
                        <ArrowDown className="h-5 w-5" />
                    </div>
                </div>
            </Card>

            {/* Net Pay */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Net Pay</p>
                        <p className="mt-2 text-2xl font-bold">{summary.formatted_net_pay}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            ₱
                            {summary.total_net_pay > 0
                                ? (summary.total_net_pay / summary.total_employees_processed).toLocaleString('en-PH', {
                                      minimumFractionDigits: 2,
                                  })
                                : '0.00'}{' '}
                            per employee
                        </p>
                    </div>
                    <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
            </Card>

            {/* Employer Cost */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Employer Cost</p>
                        <p className="mt-2 text-2xl font-bold">{summary.formatted_employer_cost}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Includes employer contributions
                        </p>
                    </div>
                    <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
            </Card>

            {/* Variance from Previous */}
            <Card className={`p-6 ${summary.variance_from_previous >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Variance from Previous</p>
                        <p className={`mt-2 text-2xl font-bold ${varianceColor}`}>{summary.formatted_variance}</p>
                        <p className={`mt-1 text-xs ${varianceColor}`}>
                            {summary.variance_percentage} ({summary.previous_period_net_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}{' '}
                            previous)
                        </p>
                    </div>
                    <div className={`rounded-lg p-3 ${summary.variance_from_previous >= 0 ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'}`}>
                        {varianceIcon}
                    </div>
                </div>
            </Card>
        </div>
    );
}
