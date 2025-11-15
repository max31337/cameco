import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Loader2, Calendar, AlertCircle } from 'lucide-react';
import { PayrollPeriod, PayrollPeriodFormData } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface PeriodFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PayrollPeriodFormData) => Promise<void>;
    period?: PayrollPeriod | null;
    mode?: 'create' | 'edit';
}

interface FormErrors {
    name?: string;
    period_type?: string;
    start_date?: string;
    end_date?: string;
    cutoff_date?: string;
    pay_date?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date for input type="date"
 */
function formatDateForInput(date: string | undefined): string {
    if (!date) return '';
    try {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    } catch {
        return '';
    }
}

/**
 * Validate date range
 */
function validateDateRange(
    startDate: string,
    endDate: string,
    cutoffDate: string,
    payDate: string
): FormErrors {
    const errors: FormErrors = {};

    if (!startDate) {
        errors.start_date = 'Start date is required';
    }

    if (!endDate) {
        errors.end_date = 'End date is required';
    }

    if (!cutoffDate) {
        errors.cutoff_date = 'Cutoff date is required';
    }

    if (!payDate) {
        errors.pay_date = 'Pay date is required';
    }

    // Check date logic only if all dates are provided
    if (startDate && endDate && cutoffDate && payDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const cutoff = new Date(cutoffDate);
        const pay = new Date(payDate);

        if (start >= end) {
            errors.end_date = 'End date must be after start date';
        }

        if (cutoff < start || cutoff > end) {
            errors.cutoff_date = 'Cutoff date must be within the payroll period';
        }

        if (pay <= end) {
            errors.pay_date = 'Pay date must be after the payroll end date';
        }
    }

    return errors;
}

/**
 * Generate period name suggestion based on dates and type
 */
function generatePeriodName(
    periodType: string,
    startDate: string,
    endDate: string
): string {
    if (!startDate || !endDate) return '';

    try {
        const start = new Date(startDate);

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const month = monthNames[start.getMonth()];
        const year = start.getFullYear();

        if (periodType === 'semi_monthly') {
            const startDay = start.getDate();
            const half = startDay <= 15 ? '1st Half' : '2nd Half';
            return `${month} ${year} - ${half}`;
        } else if (periodType === 'monthly') {
            return `Monthly - ${month} ${year}`;
        } else if (periodType === 'bi_weekly') {
            return `${month} ${year} - Bi-weekly (${startDate} to ${endDate})`;
        } else if (periodType === 'weekly') {
            return `Week of ${month} ${start.getDate()}, ${year}`;
        }
    } catch {
        return '';
    }

    return '';
}

// ============================================================================
// Component
// ============================================================================

export function PeriodFormModal({
    isOpen,
    onClose,
    onSubmit,
    period,
    mode = 'create',
}: PeriodFormModalProps) {
    const [formData, setFormData] = useState<PayrollPeriodFormData>({
        name: '',
        period_type: 'semi_monthly',
        start_date: '',
        end_date: '',
        cutoff_date: '',
        pay_date: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && period) {
                setFormData({
                    name: period.name,
                    period_type: period.period_type,
                    start_date: formatDateForInput(period.start_date),
                    end_date: formatDateForInput(period.end_date),
                    cutoff_date: formatDateForInput(period.cutoff_date),
                    pay_date: formatDateForInput(period.pay_date),
                });
            } else {
                setFormData({
                    name: '',
                    period_type: 'semi_monthly',
                    start_date: '',
                    end_date: '',
                    cutoff_date: '',
                    pay_date: '',
                });
            }
            setErrors({});
        }
    }, [isOpen, mode, period]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: value
            };

            // Auto-generate period name when dates change
            if (name === 'start_date' || name === 'end_date') {
                const suggestedName = generatePeriodName(
                    updated.period_type,
                    updated.start_date,
                    updated.end_date
                );
                if (suggestedName) {
                    updated.name = suggestedName;
                }
            }

            return updated;
        });

        // Clear error for this field
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handlePeriodTypeChange = (value: string) => {
        setFormData(prev => {
            const updated = {
                ...prev,
                period_type: value as PayrollPeriodFormData['period_type']
            };

            // Auto-generate period name when type changes
            if (updated.start_date && updated.end_date) {
                const suggestedName = generatePeriodName(
                    value,
                    updated.start_date,
                    updated.end_date
                );
                if (suggestedName) {
                    updated.name = suggestedName;
                }
            }

            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateDateRange(
            formData.start_date,
            formData.end_date,
            formData.cutoff_date,
            formData.pay_date
        );

        if (!formData.name.trim()) {
            validationErrors.name = 'Period name is required';
        }

        if (!formData.period_type) {
            validationErrors.period_type = 'Period type is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setIsLoading(true);
            await onSubmit({
                name: formData.name.trim(),
                period_type: formData.period_type,
                start_date: formData.start_date,
                end_date: formData.end_date,
                cutoff_date: formData.cutoff_date,
                pay_date: formData.pay_date,
            });
            onClose();
        } catch (err) {
            setErrors({
                name: err instanceof Error ? err.message : 'An error occurred'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const title = mode === 'edit' ? 'Edit Payroll Period' : 'Create Payroll Period';
    const description = mode === 'edit' 
        ? `Update details for ${period?.name}`
        : 'Create a new payroll period for salary calculations';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Period Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Period Name *
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="November 2025 - 1st Half"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Period Type */}
                    <div className="space-y-2">
                        <Label htmlFor="period-type">
                            Period Type *
                        </Label>
                        <Select
                            value={formData.period_type}
                            onValueChange={handlePeriodTypeChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger id="period-type">
                                <SelectValue placeholder="Select period type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
                                <SelectItem value="semi_monthly">Semi-monthly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.period_type && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.period_type}
                            </p>
                        )}
                    </div>

                    {/* Date Range Section */}
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Payroll Period Dates
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Start Date */}
                            <div className="space-y-2">
                                <Label htmlFor="start-date">
                                    Start Date *
                                </Label>
                                <Input
                                    id="start-date"
                                    name="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={handleDateChange}
                                    disabled={isLoading}
                                    className={errors.start_date ? 'border-red-500' : ''}
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.start_date}
                                    </p>
                                )}
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <Label htmlFor="end-date">
                                    End Date *
                                </Label>
                                <Input
                                    id="end-date"
                                    name="end_date"
                                    type="date"
                                    value={formData.end_date}
                                    onChange={handleDateChange}
                                    disabled={isLoading}
                                    className={errors.end_date ? 'border-red-500' : ''}
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.end_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* DTR Cutoff Date */}
                        <div className="space-y-2">
                            <Label htmlFor="cutoff-date">
                                DTR Cutoff Date * <span className="text-xs text-gray-500">(Last day for timesheet entries)</span>
                            </Label>
                            <Input
                                id="cutoff-date"
                                name="cutoff_date"
                                type="date"
                                value={formData.cutoff_date}
                                onChange={handleDateChange}
                                disabled={isLoading}
                                className={errors.cutoff_date ? 'border-red-500' : ''}
                            />
                            {errors.cutoff_date && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.cutoff_date}
                                </p>
                            )}
                        </div>

                        {/* Pay Date */}
                        <div className="space-y-2">
                            <Label htmlFor="pay-date">
                                Pay Date * <span className="text-xs text-gray-500">(When employees are paid)</span>
                            </Label>
                            <Input
                                id="pay-date"
                                name="pay_date"
                                type="date"
                                value={formData.pay_date}
                                onChange={handleDateChange}
                                disabled={isLoading}
                                className={errors.pay_date ? 'border-red-500' : ''}
                            />
                            {errors.pay_date && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.pay_date}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {mode === 'edit' ? 'Update Period' : 'Create Period'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
