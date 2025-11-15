import { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import type { PayrollAdjustment, PayrollPeriod } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface AdjustmentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    adjustment?: PayrollAdjustment | null;
    availablePeriods: PayrollPeriod[];
    availableEmployees: Array<{
        id: number;
        name: string;
        employee_number: string;
        department: string;
    }>;
}

interface FormData {
    payroll_period_id: number | null;
    employee_id: number | null;
    adjustment_type: 'earning' | 'deduction' | 'correction' | 'backpay' | 'refund' | '';
    adjustment_category: string;
    amount: string;
    reason: string;
    reference_number: string;
}

// ============================================================================
// Component
// ============================================================================

export function AdjustmentFormModal({
    isOpen,
    onClose,
    adjustment,
    availablePeriods = [],
    availableEmployees = [],
}: AdjustmentFormModalProps) {
    const isEditMode = !!adjustment;
    const [localErrors, setLocalErrors] = useState<string[]>([]);
    const [employeeSearch, setEmployeeSearch] = useState('');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        payroll_period_id: null,
        employee_id: null,
        adjustment_type: '',
        adjustment_category: '',
        amount: '',
        reason: '',
        reference_number: '',
    });

    // Filter employees based on search
    const filteredEmployees = useMemo(() => {
        if (!employeeSearch.trim()) return availableEmployees;
        
        const searchLower = employeeSearch.toLowerCase();
        return availableEmployees.filter(emp => 
            emp.name.toLowerCase().includes(searchLower) ||
            emp.employee_number.toLowerCase().includes(searchLower) ||
            emp.department.toLowerCase().includes(searchLower)
        );
    }, [employeeSearch, availableEmployees]);

    // Get selected employee info for display
    const selectedEmployee = useMemo(() => {
        return availableEmployees.find(emp => emp.id === data.employee_id);
    }, [data.employee_id, availableEmployees]);

    // Populate form when editing
    useEffect(() => {
        if (isOpen && adjustment) {
            setData({
                payroll_period_id: adjustment.payroll_period_id,
                employee_id: adjustment.employee_id,
                adjustment_type: adjustment.adjustment_type,
                adjustment_category: adjustment.adjustment_category,
                amount: adjustment.amount.toString(),
                reason: adjustment.reason,
                reference_number: adjustment.reference_number || '',
            });
        } else if (isOpen) {
            reset();
        }
    }, [isOpen, adjustment, setData, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalErrors([]);

        // Client-side validation
        const validationErrors: string[] = [];

        if (!data.payroll_period_id) {
            validationErrors.push('Payroll period is required');
        }

        if (!data.employee_id) {
            validationErrors.push('Employee is required');
        }

        if (!data.adjustment_type) {
            validationErrors.push('Adjustment type is required');
        }

        if (!data.adjustment_category.trim()) {
            validationErrors.push('Adjustment category is required');
        }

        const amount = parseFloat(data.amount);
        if (!data.amount || isNaN(amount) || amount <= 0) {
            validationErrors.push('Amount must be greater than zero');
        }

        if (!data.reason.trim()) {
            validationErrors.push('Reason is required');
        }

        if (validationErrors.length > 0) {
            setLocalErrors(validationErrors);
            return;
        }

        // Submit form
        if (isEditMode && adjustment) {
            put(`/payroll/adjustments/${adjustment.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            post('/payroll/adjustments', {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const handleClose = () => {
        if (!processing) {
            clearErrors();
            setLocalErrors([]);
            onClose();
        }
    };

    const allErrors = [...localErrors, ...Object.values(errors)];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? 'Edit Payroll Adjustment' : 'Create Payroll Adjustment'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Update the adjustment details below'
                            : 'Fill in the details to create a new payroll adjustment'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Error Messages */}
                        {allErrors.length > 0 && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <ul className="list-disc list-inside space-y-1">
                                        {allErrors.map((error, idx) => (
                                            <li key={idx}>{error}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Employee Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="employee">
                                Employee <span className="text-red-500">*</span>
                            </label>
                            {data.employee_id && selectedEmployee ? (
                                // Selected employee display with ability to change
                                <div className="space-y-2">
                                    <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950">
                                        <div className="font-medium text-sm">{selectedEmployee.name}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {selectedEmployee.employee_number} • {selectedEmployee.department}
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setData('employee_id', null);
                                            setEmployeeSearch('');
                                        }}
                                        disabled={processing}
                                    >
                                        Change Employee
                                    </Button>
                                </div>
                            ) : (
                                // Employee search and selection
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="employee-search"
                                            placeholder="Search by name or employee ID..."
                                            value={employeeSearch}
                                            onChange={(e) => setEmployeeSearch(e.target.value)}
                                            disabled={processing}
                                            className="pl-10"
                                        />
                                    </div>

                                    {/* Employee Results */}
                                    {employeeSearch && (
                                        <div className="border rounded-lg max-h-48 overflow-y-auto">
                                            {filteredEmployees.length > 0 ? (
                                                <div className="divide-y">
                                                    {filteredEmployees.map((employee) => (
                                                        <button
                                                            key={employee.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setData('employee_id', employee.id);
                                                                setEmployeeSearch('');
                                                            }}
                                                            disabled={processing}
                                                            className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
                                                        >
                                                            <div className="font-medium text-sm">{employee.name}</div>
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                {employee.employee_number} • {employee.department}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-3 text-center text-sm text-gray-500">
                                                    No employees found matching "{employeeSearch}"
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* All employees dropdown if search is empty */}
                                    {!employeeSearch && availableEmployees.length > 0 && (
                                        <div className="border rounded-lg max-h-48 overflow-y-auto">
                                            <div className="divide-y">
                                                {availableEmployees.map((employee) => (
                                                    <button
                                                        key={employee.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setData('employee_id', employee.id);
                                                            setEmployeeSearch('');
                                                        }}
                                                        disabled={processing}
                                                        className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
                                                    >
                                                        <div className="font-medium text-sm">{employee.name}</div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            {employee.employee_number} • {employee.department}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Period Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="period">
                                Payroll Period <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={data.payroll_period_id?.toString() || ''}
                                onValueChange={(value) => setData('payroll_period_id', parseInt(value))}
                                disabled={processing}
                            >
                                <SelectTrigger id="period">
                                    <SelectValue placeholder="Select a period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePeriods.map((period) => (
                                        <SelectItem key={period.id} value={period.id.toString()}>
                                            {period.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Adjustment Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="type">
                                Adjustment Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={data.adjustment_type}
                                onValueChange={(value) => setData('adjustment_type', value as FormData['adjustment_type'])}
                                disabled={processing}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="earning">Earning (Addition)</SelectItem>
                                    <SelectItem value="deduction">Deduction (Subtraction)</SelectItem>
                                    <SelectItem value="correction">Correction (Fix Error)</SelectItem>
                                    <SelectItem value="backpay">Back Pay (Retroactive)</SelectItem>
                                    <SelectItem value="refund">Refund (Return Payment)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Adjustment Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="category">
                                Adjustment Category <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="category"
                                value={data.adjustment_category}
                                onChange={(e) => setData('adjustment_category', e.target.value)}
                                placeholder="e.g., Overtime Correction, Tax Refund, Bonus"
                                disabled={processing}
                            />
                            <p className="text-xs text-gray-500">
                                Specific category or description of the adjustment
                            </p>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="amount">
                                Amount (PHP) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="0.00"
                                disabled={processing}
                            />
                        </div>

                        {/* Reference Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="reference">
                                Reference Number
                            </label>
                            <Input
                                id="reference"
                                value={data.reference_number}
                                onChange={(e) => setData('reference_number', e.target.value)}
                                placeholder="Optional reference number"
                                disabled={processing}
                            />
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="reason">
                                Reason <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="reason"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Detailed explanation for this adjustment"
                                rows={4}
                                disabled={processing}
                            />
                            <p className="text-xs text-gray-500">
                                Provide a clear explanation for audit and approval purposes
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {isEditMode ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>{isEditMode ? 'Update Adjustment' : 'Create Adjustment'}</>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
