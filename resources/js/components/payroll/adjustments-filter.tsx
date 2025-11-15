import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { X, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { PayrollPeriod, PayrollAdjustment } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

export interface AdjustmentFilters {
    period_id?: number;
    employee_id?: number;
    status?: PayrollAdjustment['status'];
    adjustment_type?: PayrollAdjustment['adjustment_type'];
}

interface AdjustmentsFilterProps {
    onFilterChange: (filters: AdjustmentFilters) => void;
    initialFilters: AdjustmentFilters;
    availablePeriods: PayrollPeriod[];
    availableEmployees: Array<{
        id: number;
        name: string;
        employee_number: string;
        department: string;
    }>;
    isLoading?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function AdjustmentsFilter({
    onFilterChange,
    initialFilters,
    availablePeriods = [],
    availableEmployees = [],
    isLoading = false,
}: AdjustmentsFilterProps) {
    const [employeeSearch, setEmployeeSearch] = useState('');
    
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

    const activeFilterCount = Object.values(initialFilters).filter(Boolean).length;
    const hasActiveFilters = activeFilterCount > 0;

    const handlePeriodChange = (value: string) => {
        onFilterChange({
            ...initialFilters,
            period_id: value === 'all' ? undefined : parseInt(value),
        });
    };

    const handleEmployeeChange = (value: string) => {
        onFilterChange({
            ...initialFilters,
            employee_id: value === 'all' ? undefined : parseInt(value),
        });
    };

    const handleStatusChange = (value: string) => {
        onFilterChange({
            ...initialFilters,
            status: value === 'all' ? undefined : value as AdjustmentFilters['status'],
        });
    };

    const handleTypeChange = (value: string) => {
        onFilterChange({
            ...initialFilters,
            adjustment_type: value === 'all' ? undefined : value as AdjustmentFilters['adjustment_type'],
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

                    {/* Employee Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium mb-2 block">
                            Employee
                        </label>
                        <Select
                            value={initialFilters.employee_id?.toString() || 'all'}
                            onValueChange={handleEmployeeChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Employees" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="sticky top-0 bg-white p-2 border-b">
                                    <Input
                                        placeholder="Search by name or ID..."
                                        value={employeeSearch}
                                        onChange={(e) => setEmployeeSearch(e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <SelectItem value="all">All Employees</SelectItem>
                                {filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((employee) => (
                                        <SelectItem key={employee.id} value={employee.id.toString()}>
                                            <div className="flex flex-col">
                                                <span>{employee.name}</span>
                                                <span className="text-xs text-gray-500">{employee.employee_number} • {employee.department}</span>
                                            </div>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-center text-sm text-gray-500">
                                        No employees found
                                    </div>
                                )}
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
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Type Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium mb-2 block">
                            Adjustment Type
                        </label>
                        <Select
                            value={initialFilters.adjustment_type || 'all'}
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
