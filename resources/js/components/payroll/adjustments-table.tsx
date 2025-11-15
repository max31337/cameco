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
import { router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    FileText, 
    MoreHorizontal, 
    Edit, 
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    AlertCircle
} from 'lucide-react';
import { PayrollAdjustment } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface AdjustmentsTableProps {
    adjustments: PayrollAdjustment[];
    onEdit?: (adjustment: PayrollAdjustment) => void;
    onDelete?: (adjustment: PayrollAdjustment) => void;
    onApprove?: (adjustment: PayrollAdjustment) => void;
    onReject?: (adjustment: PayrollAdjustment) => void;
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

function getAvailableActions(status: PayrollAdjustment['status']): string[] {
    const actions: string[] = [];

    // Can edit pending adjustments
    if (status === 'pending') {
        actions.push('edit', 'approve', 'reject', 'delete');
    }

    // Can view all statuses
    actions.push('view');

    return actions;
}

// ============================================================================
// Component
// ============================================================================

export function AdjustmentsTable({
    adjustments,
    onEdit,
    onDelete,
    onApprove,
    onReject,
    isLoading = false,
}: AdjustmentsTableProps) {
    if (adjustments.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground mb-2">No adjustments found</p>
                        <p className="text-sm text-gray-500">
                            Create a new adjustment to get started
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
                    Payroll Adjustments
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Requested</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {adjustments.map((adjustment) => {
                                const statusConfig = statusConfigMap[adjustment.status];
                                const typeConfig = typeConfigMap[adjustment.adjustment_type];
                                const availableActions = getAvailableActions(adjustment.status);
                                const requestedDate = formatDate(adjustment.requested_at);

                                return (
                                    <TableRow key={adjustment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <TableCell>
                                            <div>
                                                <div 
                                                    className="font-medium text-blue-600 hover:underline cursor-pointer"
                                                    onClick={() => router.visit(`/payroll/adjustments/history/${adjustment.employee_id}`)}
                                                >
                                                    {adjustment.employee_name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {adjustment.employee_number} • {adjustment.department}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{adjustment.payroll_period.name}</span>
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
                                                <div className="text-gray-600 dark:text-gray-400">{requestedDate}</div>
                                                <div className="text-xs text-gray-500">{adjustment.requested_by}</div>
                                            </div>
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
                                                    {availableActions.includes('edit') && (
                                                        <DropdownMenuItem
                                                            onClick={() => onEdit?.(adjustment)}
                                                            disabled={isLoading}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    )}

                                                    {availableActions.includes('approve') && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => onApprove?.(adjustment)}
                                                                disabled={isLoading}
                                                                className="text-green-600 dark:text-green-400"
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                    {availableActions.includes('reject') && (
                                                        <DropdownMenuItem
                                                            onClick={() => onReject?.(adjustment)}
                                                            disabled={isLoading}
                                                            className="text-red-600 dark:text-red-400"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                    )}

                                                    {availableActions.includes('delete') && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => onDelete?.(adjustment)}
                                                                disabled={isLoading}
                                                                className="text-red-600 dark:text-red-400"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
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
