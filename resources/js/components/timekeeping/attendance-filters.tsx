import React, { useState } from 'react';
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
import { Filter, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export interface AttendanceFiltersState {
    department_id?: string;
    employee_id?: string;
    date_from?: string;
    date_to?: string;
    status?: string;
    source?: string;
    search?: string;
}

interface AttendanceFiltersProps {
    departments?: Array<{ id: number; name: string }>;
    employees?: Array<{ id: number; name: string; employee_number: string }>;
    filters: AttendanceFiltersState;
    onFiltersChange: (filters: AttendanceFiltersState) => void;
}

const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'late', label: 'Late' },
    { value: 'absent', label: 'Absent' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'undertime', label: 'Undertime' },
    { value: 'overtime', label: 'Overtime' },
];

const sourceOptions = [
    { value: 'edge_machine', label: 'Edge Machine' },
    { value: 'manual', label: 'Manual Entry' },
    { value: 'imported', label: 'Imported' },
];

export function AttendanceFilters({
    _departments = [],
    _employees = [],
    filters,
    onFiltersChange,
}: AttendanceFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (key: string, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value || undefined,
        });
    };

    const handleReset = () => {
        onFiltersChange({});
    };

    const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length;

    return (
        <>
            <Button
                variant={activeFiltersCount > 0 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsOpen(true)}
                className="gap-2"
            >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-xs text-blue-600">
                        {activeFiltersCount}
                    </span>
                )}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Filter Attendance Records</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                placeholder="Employee name or ID..."
                                value={filters.search || ''}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Statuses</SelectItem>
                                    {statusOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Source Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="source">Source</Label>
                            <Select value={filters.source || ''} onValueChange={(value) => handleFilterChange('source', value)}>
                                <SelectTrigger id="source">
                                    <SelectValue placeholder="Select source..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Sources</SelectItem>
                                    {sourceOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="date-from">Date From</Label>
                                <Input
                                    id="date-from"
                                    type="date"
                                    value={filters.date_from || ''}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date-to">Date To</Label>
                                <Input
                                    id="date-to"
                                    type="date"
                                    value={filters.date_to || ''}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={handleReset} size="sm">
                            Reset
                        </Button>
                        <Button onClick={() => setIsOpen(false)} size="sm">
                            Apply Filters
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {activeFiltersCount > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="gap-1 ml-2"
                >
                    <X className="h-4 w-4" />
                    Clear
                </Button>
            )}
        </>
    );
}
