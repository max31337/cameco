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
import { useState, useEffect } from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

export interface HistoryFilters {
    period_id?: number;
    status?: string;
    type?: string;
}

interface AdjustmentsHistoryFilterProps {
    onFilterChange: (filters: HistoryFilters) => void;
    initialFilters: HistoryFilters;
    availablePeriods: Array<{
        id: number;
        name: string;
    }>;
    availableStatuses: Array<{
        value: string;
        label: string;
    }>;
    isLoading?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function AdjustmentsHistoryFilter({
    onFilterChange,
    initialFilters,
    availablePeriods = [],
    availableStatuses = [],
    isLoading = false,
}: AdjustmentsHistoryFilterProps) {
    const [filters, setFilters] = useState<HistoryFilters>(initialFilters);

    // Update local state when initialFilters prop changes
    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const activeFilterCount = Object.values(filters).filter(Boolean).length;
    const hasActiveFilters = activeFilterCount > 0;

    const handlePeriodChange = (value: string) => {
        const newFilters = {
            ...filters,
            period_id: value === 'all' ? undefined : parseInt(value),
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleStatusChange = (value: string) => {
        const newFilters = {
            ...filters,
            status: value === 'all' ? undefined : value,
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleTypeChange = (value: string) => {
        const newFilters = {
            ...filters,
            type: value === 'all' ? undefined : value,
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        setFilters({});
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
                            value={filters.period_id?.toString() || 'all'}
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
                            value={filters.status || 'all'}
                            onValueChange={handleStatusChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {availableStatuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Type Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium mb-2 block">
                            Adjustment Type
                        </label>
                        <Select
                            value={filters.type || 'all'}
                            onValueChange={handleTypeChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="earning">Earning</SelectItem>
                                <SelectItem value="deduction">Deduction</SelectItem>
                                <SelectItem value="correction">Correction</SelectItem>
                                <SelectItem value="backpay">Back Pay</SelectItem>
                                <SelectItem value="refund">Refund</SelectItem>
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
