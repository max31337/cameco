import { PayrollPeriod } from '@/types/payroll-pages';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// ============================================================================
// Type Definitions
// ============================================================================

interface PeriodDetailsModalProps {
    period: PayrollPeriod | null;
    onClose: () => void;
    onEdit?: (period: PayrollPeriod) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get color based on status
 */
function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-800',
        importing: 'bg-yellow-100 text-yellow-800',
        calculating: 'bg-blue-100 text-blue-800',
        calculated: 'bg-blue-100 text-blue-800',
        reviewing: 'bg-purple-100 text-purple-800',
        approved: 'bg-green-100 text-green-800',
        bank_file_generated: 'bg-green-100 text-green-800',
        paid: 'bg-green-100 text-green-800',
        closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

// ============================================================================
// Component
// ============================================================================

export function PeriodDetailsModal({
    period,
    onClose,
    onEdit,
}: PeriodDetailsModalProps) {
    if (!period) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-2xl mx-4">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {period.name}
                            </h2>
                            <Badge className={`mt-2 capitalize ${getStatusColor(period.status)}`}>
                                {period.status}
                            </Badge>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Period Type</label>
                            <p className="mt-1 text-gray-900 capitalize">
                                {period.period_type.replace(/_/g, ' ')}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Total Employees</label>
                            <p className="mt-1 text-gray-900">{period.total_employees}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Period Dates</label>
                            <p className="mt-1 text-gray-900">
                                {new Date(period.start_date).toLocaleDateString()} -{' '}
                                {new Date(period.end_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Cutoff Date</label>
                            <p className="mt-1 text-gray-900">
                                {new Date(period.cutoff_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Pay Date</label>
                            <p className="mt-1 text-gray-900">
                                {new Date(period.pay_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="border-t border-gray-200 pt-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Total Gross Pay</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ₱{Number(period.total_gross_pay).toLocaleString('en-PH', {
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Total Deductions</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ₱{Number(period.total_deductions).toLocaleString('en-PH', {
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Total Net Pay</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ₱{Number(period.total_net_pay).toLocaleString('en-PH', {
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Employer Cost</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ₱{Number(period.total_employer_cost).toLocaleString('en-PH', {
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Approval Info */}
                    {period.approved_at && (
                        <div className="border-t border-gray-200 pt-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Information</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-semibold text-gray-700">Approved By:</span>
                                    <span className="ml-2 text-gray-900">{period.approved_by}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Approved At:</span>
                                    <span className="ml-2 text-gray-900">
                                        {new Date(period.approved_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-6 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        {onEdit && (
                            <Button
                                onClick={() => {
                                    onEdit(period);
                                    onClose();
                                }}
                            >
                                Edit Period
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
