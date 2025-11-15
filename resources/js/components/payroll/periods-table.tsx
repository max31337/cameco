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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Calendar, 
    Users, 
    DollarSign, 
    MoreHorizontal, 
    Eye, 
    Edit2, 
    Trash2,
    Zap,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { PayrollPeriod } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface PeriodsTableProps {
    periods: PayrollPeriod[];
    onView?: (period: PayrollPeriod) => void;
    onEdit?: (period: PayrollPeriod) => void;
    onDelete?: (period: PayrollPeriod) => void;
    onCalculate?: (period: PayrollPeriod) => void;
    onApprove?: (period: PayrollPeriod) => void;
    isLoading?: boolean;
}

// ============================================================================
// Status Badge Configuration
// ============================================================================

interface StatusConfig {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon?: React.ReactNode;
}

const statusConfigMap: Record<PayrollPeriod['status'], StatusConfig> = {
    draft: {
        label: 'Draft',
        variant: 'secondary',
        icon: <AlertCircle className="h-3 w-3" />,
    },
    importing: {
        label: 'Importing',
        variant: 'outline',
        icon: <Zap className="h-3 w-3" />,
    },
    calculating: {
        label: 'Calculating',
        variant: 'outline',
        icon: <Zap className="h-3 w-3" />,
    },
    calculated: {
        label: 'Calculated',
        variant: 'secondary',
        icon: <CheckCircle className="h-3 w-3" />,
    },
    reviewing: {
        label: 'Under Review',
        variant: 'outline',
    },
    approved: {
        label: 'Approved',
        variant: 'default',
        icon: <CheckCircle className="h-3 w-3" />,
    },
    bank_file_generated: {
        label: 'Bank File Ready',
        variant: 'default',
        icon: <CheckCircle className="h-3 w-3" />,
    },
    paid: {
        label: 'Paid',
        variant: 'default',
        icon: <CheckCircle className="h-3 w-3" />,
    },
    closed: {
        label: 'Closed',
        variant: 'secondary',
    },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date for display
 */
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

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Get period type label
 */
function getPeriodTypeLabel(type: PayrollPeriod['period_type']): string {
    const labels: Record<PayrollPeriod['period_type'], string> = {
        weekly: 'Weekly',
        bi_weekly: 'Bi-weekly',
        semi_monthly: 'Semi-monthly',
        monthly: 'Monthly',
    };
    return labels[type] || type;
}

/**
 * Determine which actions should be available based on status
 */
function getAvailableActions(status: PayrollPeriod['status']): string[] {
    const actions: string[] = ['view', 'edit'];

    // Can only calculate draft periods
    if (status === 'draft') {
        actions.push('calculate');
    }

    // Can approve calculated periods
    if (status === 'calculated' || status === 'reviewing') {
        actions.push('approve');
    }

    // Can't delete periods that are being processed or paid
    if (status === 'draft' || status === 'calculated') {
        actions.push('delete');
    }

    return actions;
}

// ============================================================================
// Component
// ============================================================================

export function PeriodsTable({
    periods,
    onView,
    onEdit,
    onDelete,
    onCalculate,
    onApprove,
    isLoading = false,
}: PeriodsTableProps) {
    if (periods.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground mb-2">No payroll periods found</p>
                        <p className="text-sm text-gray-500">
                            Create a new payroll period to get started
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
                    <Calendar className="h-5 w-5" />
                    Payroll Periods
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Period Dates</TableHead>
                                <TableHead>Pay Date</TableHead>
                                <TableHead>Employees</TableHead>
                                <TableHead>Net Pay</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {periods.map((period) => {
                                const statusConfig = statusConfigMap[period.status];
                                const availableActions = getAvailableActions(period.status);
                                const periodStartDate = formatDate(period.start_date);
                                const periodEndDate = formatDate(period.end_date);
                                const payDate = formatDate(period.pay_date);

                                return (
                                    <TableRow key={period.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <TableCell className="font-medium">
                                            {period.name}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {getPeriodTypeLabel(period.period_type)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {periodStartDate} - {periodEndDate}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {payDate}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">{period.total_employees}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(period.total_net_pay)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusConfig.variant} className="flex items-center gap-1 w-fit">
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={isLoading}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    {availableActions.includes('view') && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => onView?.(period)}
                                                                disabled={isLoading}
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                    {availableActions.includes('edit') && (
                                                        <DropdownMenuItem
                                                            onClick={() => onEdit?.(period)}
                                                            disabled={isLoading || period.status !== 'draft'}
                                                        >
                                                            <Edit2 className="h-4 w-4 mr-2" />
                                                            Edit Period
                                                        </DropdownMenuItem>
                                                    )}

                                                    {availableActions.includes('calculate') && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => onCalculate?.(period)}
                                                                disabled={isLoading}
                                                                className="text-blue-600 dark:text-blue-400"
                                                            >
                                                                <Zap className="h-4 w-4 mr-2" />
                                                                Calculate Payroll
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                    {availableActions.includes('approve') && (
                                                        <DropdownMenuItem
                                                            onClick={() => onApprove?.(period)}
                                                            disabled={isLoading}
                                                            className="text-green-600 dark:text-green-400"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Approve Period
                                                        </DropdownMenuItem>
                                                    )}

                                                    {availableActions.includes('delete') && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => onDelete?.(period)}
                                                                disabled={isLoading}
                                                                className="text-red-600 dark:text-red-400"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete Period
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
