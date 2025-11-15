import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryMetrics {
    total_adjustments: number;
    pending_adjustments: number;
    approved_adjustments: number;
    rejected_adjustments: number;
    total_pending_amount: number;
}

interface AdjustmentSummaryMetricsProps {
    summary: SummaryMetrics;
}

export function AdjustmentSummaryMetrics({ summary }: AdjustmentSummaryMetricsProps) {
    return (
        <div className="grid md:grid-cols-5 gap-4">
            {/* Total Adjustments */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Adjustments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.total_adjustments}</div>
                </CardContent>
            </Card>

            {/* Pending */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Pending
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                        {summary.pending_adjustments}
                    </div>
                </CardContent>
            </Card>

            {/* Approved */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Approved
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {summary.approved_adjustments}
                    </div>
                </CardContent>
            </Card>

            {/* Rejected */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Rejected
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                        {summary.rejected_adjustments}
                    </div>
                </CardContent>
            </Card>

            {/* Pending Amount */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Pending Amount
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                        ₱{summary.total_pending_amount.toLocaleString('en-PH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
