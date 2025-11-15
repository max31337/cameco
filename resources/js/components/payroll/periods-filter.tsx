import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useState, useCallback } from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

export interface PeriodFilters {
    search?: string;
    status?: string;
    period_type?: string;
}

interface PeriodsFilterProps {
    onFilterChange: (filters: PeriodFilters) => void;
    initialFilters?: PeriodFilters;
    isLoading?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function PeriodsFilter({
    onFilterChange,
    initialFilters = {},
    isLoading = false,
}: PeriodsFilterProps) {
    const [filters, setFilters] = useState<PeriodFilters>(initialFilters);

    const handleSearchChange = useCallback((value: string) => {
        const newFilters = { ...filters, search: value || undefined };
        setFilters(newFilters);
        onFilterChange(newFilters);
    }, [filters, onFilterChange]);

    const handleStatusChange = (value: string) => {
        const newFilters = { ...filters, status: value === 'all' ? undefined : value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePeriodTypeChange = (value: string) => {
        const newFilters = { ...filters, period_type: value === 'all' ? undefined : value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const emptyFilters: PeriodFilters = {};
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const hasActiveFilters = !!(
        filters.search ||
        filters.status ||
        filters.period_type
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search period name..."
                        value={filters.search || ''}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                    />
                </div>

                {/* Status Filter */}
                <Select
                    value={filters.status || 'all'}
                    onValueChange={handleStatusChange}
                    disabled={isLoading}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="calculating">Calculating</SelectItem>
                        <SelectItem value="calculated">Calculated</SelectItem>
                        <SelectItem value="reviewing">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="bank_file_generated">Bank File Ready</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>

                {/* Period Type Filter */}
                <Select
                    value={filters.period_type || 'all'}
                    onValueChange={handlePeriodTypeChange}
                    disabled={isLoading}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
                        <SelectItem value="semi_monthly">Semi-monthly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>

                {/* Reset Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
