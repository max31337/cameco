import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, TrendingDown, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { PayrollAdjustment } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface AdjustmentsHistoryTableProps {
    adjustments: PayrollAdjustment[];
}

// ============================================================================
// Status Badge Configuration
// ============================================================================

interface StatusConfig {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon?: React.ReactNode;
}

const statusConfigMap: Record<PayrollAdjustment['status'], StatusConfig> = {
    pending: {
        label: 'Pending',
        variant: 'secondary',
        icon: <Clock className="h-3 w-3" />,
    },
    approved: {
        label: 'Approved',
        variant: 'default',
        icon: <CheckCircle className="h-3 w-3" />,
    },
    rejected: {
        label: 'Rejected',
        variant: 'destructive',
        icon: <XCircle className="h-3 w-3" />,
    },
    applied: {
        label: 'Applied',
        variant: 'default',
        icon: <CheckCircle className="h-3 w-3" />,
    },
    cancelled: {
        label: 'Cancelled',
        variant: 'secondary',
        icon: <XCircle className="h-3 w-3" />,
    },
};

// ============================================================================
// Adjustment Type Configuration
// ============================================================================

interface TypeConfig {
    label: string;
    icon: React.ReactNode;
    color: string;
}

const typeConfigMap: Record<PayrollAdjustment['adjustment_type'], TypeConfig> = {
    earning: {
        label: 'Earning',
        icon: <TrendingUp className="h-3 w-3" />,
        color: 'text-green-600',
    },
    deduction: {
        label: 'Deduction',
        icon: <TrendingDown className="h-3 w-3" />,
        color: 'text-red-600',
    },
    correction: {
        label: 'Correction',
        icon: <AlertCircle className="h-3 w-3" />,
        color: 'text-blue-600',
    },
    backpay: {
        label: 'Back Pay',
        icon: <TrendingUp className="h-3 w-3" />,
        color: 'text-purple-600',
    },
    refund: {
        label: 'Refund',
        icon: <TrendingDown className="h-3 w-3" />,
        color: 'text-orange-600',
    },
};

// ============================================================================
// Helper Functions
// ============================================================================

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(amount);
}

function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch {
        return dateString;
    }
}

function formatTime(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch {
        return '';
    }
}

// ============================================================================
// Component
// ============================================================================

export function AdjustmentsHistoryTable({
    adjustments,
}: AdjustmentsHistoryTableProps) {
    if (adjustments.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground mb-2">No adjustments found</p>
                        <p className="text-sm text-gray-500">
                            There are no adjustments for this employee yet
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Adjustment History
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Requested</TableHead>
                                <TableHead>Reviewed By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {adjustments.map((adjustment) => {
                                const statusConfig = statusConfigMap[adjustment.status];
                                const typeConfig = typeConfigMap[adjustment.adjustment_type];
                                const requestedDate = formatDate(adjustment.requested_at);
                                const requestedTime = formatTime(adjustment.requested_at);

                                return (
                                    <TableRow key={adjustment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <TableCell>
                                            <span className="text-sm font-medium">
                                                {adjustment.payroll_period.name}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`flex items-center gap-1 ${typeConfig.color}`}>
                                                {typeConfig.icon}
                                                <span className="text-sm font-medium">{typeConfig.label}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{adjustment.adjustment_category}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-semibold">
                                                {formatCurrency(adjustment.amount)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusConfig.variant} className="flex items-center gap-1 w-fit">
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    {requestedDate}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {requestedTime}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {adjustment.reviewed_by ? (
                                                    <>
                                                        <div className="text-gray-600 dark:text-gray-400">
                                                            {adjustment.reviewed_by}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {adjustment.reviewed_at && formatDate(adjustment.reviewed_at)}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500 text-xs">Pending review</span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
