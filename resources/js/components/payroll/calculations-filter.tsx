import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { X, Filter } from 'lucide-react';
import type { PayrollPeriod } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

export interface CalculationFilters {
    period_id?: number;
    status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    calculation_type?: 'regular' | 'adjustment' | 'final' | 're-calculation';
}

interface CalculationsFilterProps {
    onFilterChange: (filters: CalculationFilters) => void;
    initialFilters: CalculationFilters;
    availablePeriods: PayrollPeriod[];
    isLoading?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function CalculationsFilter({
    onFilterChange,
    initialFilters,
    availablePeriods,
    isLoading = false,
}: CalculationsFilterProps) {
    const activeFilterCount = Object.values(initialFilters).filter(Boolean).length;
    const hasActiveFilters = activeFilterCount > 0;

    const handlePeriodChange = (value: string) => {
        onFilterChange({
            ...initialFilters,
            period_id: value === 'all' ? undefined : parseInt(value),
        });
    };

    const handleStatusChange = (value: string) => {
        onFilterChange({
            ...initialFilters,
            status: value === 'all' ? undefined : value as CalculationFilters['status'],
        });
    };

    const handleTypeChange = (value: string) => {
        onFilterChange({
            ...initialFilters,
            calculation_type: value === 'all' ? undefined : value as CalculationFilters['calculation_type'],
        });
    };

    const handleReset = () => {
        onFilterChange({});
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Period Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium mb-2 block">
                            Payroll Period
                        </label>
                        <Select
                            value={initialFilters.period_id?.toString() || 'all'}
                            onValueChange={handlePeriodChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Periods" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Periods</SelectItem>
                                {availablePeriods.map((period) => (
                                    <SelectItem key={period.id} value={period.id.toString()}>
                                        {period.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium mb-2 block">
                            Status
                        </label>
                        <Select
                            value={initialFilters.status || 'all'}
                            onValueChange={handleStatusChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Type Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium mb-2 block">
                            Calculation Type
                        </label>
                        <Select
                            value={initialFilters.calculation_type || 'all'}
                            onValueChange={handleTypeChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="regular">Regular</SelectItem>
                                <SelectItem value="adjustment">Adjustment</SelectItem>
                                <SelectItem value="final">Final</SelectItem>
                                <SelectItem value="re-calculation">Re-calculation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                disabled={isLoading}
                                className="w-full lg:w-auto"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Reset ({activeFilterCount})
                            </Button>
                        </div>
                    )}

                    {/* Filter Icon (when no active filters) */}
                    {!hasActiveFilters && (
                        <div className="flex items-end">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Filter className="h-4 w-4" />
                                <span>No filters applied</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
