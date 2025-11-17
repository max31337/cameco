import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import type { EmployeePayrollInfoFilters } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface EmployeePayrollFilterProps {
    onFilterChange: (filters: EmployeePayrollInfoFilters) => void;
    initialFilters: EmployeePayrollInfoFilters;
    isLoading?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function EmployeePayrollFilter({
    onFilterChange,
    initialFilters,
    isLoading = false,
}: EmployeePayrollFilterProps) {
    const [filters, setFilters] = useState<EmployeePayrollInfoFilters>(initialFilters);

    // Sync filters with props when initial filters change
    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    // Debounced filter change handler
    const debouncedFilterChange = useDebouncedCallback(
        (newFilters: EmployeePayrollInfoFilters) => {
            onFilterChange(newFilters);
        },
        300
    );

    const handleSearchChange = (value: string) => {
        const newFilters = { ...filters, search: value };
        setFilters(newFilters);
        debouncedFilterChange(newFilters);
    };

    const handleSalaryTypeChange = (value: string) => {
        const newFilters = {
            ...filters,
            salary_type: value === 'all' ? undefined : value,
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePaymentMethodChange = (value: string) => {
        const newFilters = {
            ...filters,
            payment_method: value === 'all' ? undefined : value,
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleTaxStatusChange = (value: string) => {
        const newFilters = {
            ...filters,
            tax_status: value === 'all' ? undefined : value,
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleStatusChange = (value: string) => {
        const newFilters = {
            ...filters,
            status: value === 'all' ? undefined : (value as 'active' | 'inactive'),
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters: EmployeePayrollInfoFilters = {
            search: '',
            salary_type: undefined,
            payment_method: undefined,
            tax_status: undefined,
            status: 'all',
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const hasActiveFilters = !!(
        filters.search ||
        filters.salary_type ||
        filters.payment_method ||
        filters.tax_status ||
        (filters.status && filters.status !== 'all')
    );

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by employee name or number..."
                                value={filters.search || ''}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                disabled={isLoading}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Filter Selects */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {/* Salary Type Filter */}
                        <Select
                            value={filters.salary_type || 'all'}
                            onValueChange={handleSalaryTypeChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Salary Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="contractual">Contractual</SelectItem>
                                <SelectItem value="project_based">Project-Based</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Payment Method Filter */}
                        <Select
                            value={filters.payment_method || 'all'}
                            onValueChange={handlePaymentMethodChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Methods</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="check">Check</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Tax Status Filter */}
                        <Select
                            value={filters.tax_status || 'all'}
                            onValueChange={handleTaxStatusChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tax Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="Z">Zero/Exempt (Z)</SelectItem>
                                <SelectItem value="S">Single (S)</SelectItem>
                                <SelectItem value="ME">Married Employee (ME)</SelectItem>
                                <SelectItem value="S1">Single w/ 1 Dep (S1)</SelectItem>
                                <SelectItem value="ME1">Married w/ 1 Dep (ME1)</SelectItem>
                                <SelectItem value="S2">Single w/ 2 Deps (S2)</SelectItem>
                                <SelectItem value="ME2">Married w/ 2 Deps (ME2)</SelectItem>
                                <SelectItem value="S3">Single w/ 3 Deps (S3)</SelectItem>
                                <SelectItem value="ME3">Married w/ 3 Deps (ME3)</SelectItem>
                                <SelectItem value="S4">Single w/ 4+ Deps (S4)</SelectItem>
                                <SelectItem value="ME4">Married w/ 4+ Deps (ME4)</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={handleStatusChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                disabled={isLoading}
                                className="w-full"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="text-xs text-gray-500 pt-2 border-t">
                            Filters applied: {filters.search && `"${filters.search}"`}
                            {filters.salary_type && `, Salary Type: ${filters.salary_type}`}
                            {filters.payment_method && `, Payment: ${filters.payment_method}`}
                            {filters.tax_status && `, Tax: ${filters.tax_status}`}
                            {filters.status && filters.status !== 'all' && `, Status: ${filters.status}`}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
