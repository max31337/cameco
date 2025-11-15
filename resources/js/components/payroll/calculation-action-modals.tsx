import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
    RefreshCw, 
    CheckCircle, 
    XCircle, 
    AlertTriangle,
    Users,
    DollarSign
} from 'lucide-react';
import { PayrollCalculation } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface BaseActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

interface RecalculateModalProps extends BaseActionModalProps {
    calculation: PayrollCalculation;
}

interface ApproveModalProps extends BaseActionModalProps {
    calculation: PayrollCalculation;
}

interface CancelModalProps extends BaseActionModalProps {
    calculation: PayrollCalculation;
}

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

// ============================================================================
// Recalculate Confirmation Modal
// ============================================================================

export function RecalculateConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    calculation,
    isLoading = false,
}: RecalculateModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 text-blue-600" />
                        Recalculate Payroll?
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4 pt-2">
                            <p className="text-sm">
                                You are about to recalculate payroll for:
                            </p>
                            
                            {/* Period Info */}
                            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-blue-900 dark:text-blue-100">
                                        {calculation.payroll_period.name}
                                    </span>
                                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                                        {calculation.calculation_type}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            Employees
                                        </div>
                                        <div className="font-medium text-blue-900 dark:text-blue-100">
                                            {calculation.total_employees}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            Total Net Pay
                                        </div>
                                        <div className="font-medium text-blue-900 dark:text-blue-100">
                                            {formatCurrency(calculation.total_net_pay)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3 border border-amber-200 dark:border-amber-800">
                                <div className="flex gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-900 dark:text-amber-100">
                                        <strong>Important:</strong> This will override all existing calculations 
                                        for this period. Any manual adjustments will need to be re-entered.
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                The system will recalculate salaries, deductions, and benefits for all 
                                employees in this period. This process may take several minutes.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Recalculating...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Yes, Recalculate
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ============================================================================
// Approve Confirmation Modal
// ============================================================================

export function ApproveConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    calculation,
    isLoading = false,
}: ApproveModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Approve Payroll Calculation?
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4 pt-2">
                            <p className="text-sm">
                                You are about to approve and finalize payroll for:
                            </p>
                            
                            {/* Period Info */}
                            <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-green-900 dark:text-green-100">
                                        {calculation.payroll_period.name}
                                    </span>
                                    <Badge variant="outline" className="text-green-700 border-green-300">
                                        {calculation.processed_employees}/{calculation.total_employees} processed
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <div className="text-green-600 dark:text-green-400">Gross Pay</div>
                                        <div className="font-medium text-green-900 dark:text-green-100">
                                            {formatCurrency(calculation.total_gross_pay)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-green-600 dark:text-green-400">Deductions</div>
                                        <div className="font-medium text-green-900 dark:text-green-100">
                                            {formatCurrency(calculation.total_deductions)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-green-600 dark:text-green-400">Net Pay</div>
                                        <div className="font-medium text-green-900 dark:text-green-100">
                                            {formatCurrency(calculation.total_net_pay)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Warning for failed employees */}
                            {calculation.failed_employees > 0 && (
                                <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3 border border-amber-200 dark:border-amber-800">
                                    <div className="flex gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-amber-900 dark:text-amber-100">
                                            <strong>Warning:</strong> {calculation.failed_employees} employee(s) 
                                            failed to process. Review these issues before approving.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lock Warning */}
                            <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3 border border-red-200 dark:border-red-800">
                                <div className="flex gap-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-red-900 dark:text-red-100">
                                        <strong>This action will lock the payroll period.</strong> Once approved, 
                                        you will not be able to make changes without creating a new adjustment 
                                        calculation.
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Approving this calculation will prepare payment records and government 
                                remittance files. Ensure all data is accurate before proceeding.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isLoading ? (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2 animate-spin" />
                                Approving...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Yes, Approve Payroll
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ============================================================================
// Cancel Confirmation Modal
// ============================================================================

export function CancelConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    calculation,
    isLoading = false,
}: CancelModalProps) {
    const isProcessing = calculation.status === 'processing';
    const progressPercentage = calculation.progress_percentage;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        Cancel Calculation?
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4 pt-2">
                            <p className="text-sm">
                                You are about to cancel the calculation for:
                            </p>
                            
                            {/* Period Info */}
                            <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-red-900 dark:text-red-100">
                                        {calculation.payroll_period.name}
                                    </span>
                                    <Badge variant="outline" className="text-red-700 border-red-300">
                                        {calculation.status}
                                    </Badge>
                                </div>
                                {isProcessing && (
                                    <div className="text-sm space-y-1">
                                        <div className="flex items-center justify-between text-red-600 dark:text-red-400">
                                            <span>Progress</span>
                                            <span className="font-medium">{progressPercentage}%</span>
                                        </div>
                                        <div className="text-red-700 dark:text-red-300">
                                            {calculation.processed_employees} of {calculation.total_employees} employees processed
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Warning */}
                            <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3 border border-amber-200 dark:border-amber-800">
                                <div className="flex gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-900 dark:text-amber-100">
                                        {isProcessing ? (
                                            <>
                                                <strong>Warning:</strong> This calculation is currently in progress. 
                                                Cancelling will stop all processing and discard partial results.
                                            </>
                                        ) : (
                                            <>
                                                <strong>Warning:</strong> This will permanently delete the 
                                                calculation and all associated data.
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {isProcessing 
                                    ? 'Any employees already processed will not have their calculations saved. You will need to start a new calculation to process this period.'
                                    : 'This action cannot be undone. You will need to start a new calculation if you want to process this period.'
                                }
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Keep Calculation</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoading ? (
                            <>
                                <XCircle className="h-4 w-4 mr-2 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Yes, Cancel Calculation
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
