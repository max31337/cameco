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
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    filters,
    onFiltersChange,
}: AttendanceFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFilterChange = (key: string, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value || undefined,
        });
    };

    const handleReset = () => {
        onFiltersChange({});
        setIsExpanded(false);
    };

    const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length;

    return (
        <Card className="p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
                {/* Left Column - Search */}
                <div className="space-y-2">
                    <Label htmlFor="search" className="text-xs font-medium text-gray-700">Search</Label>
                    <Input
                        id="search"
                        placeholder="Search by employee name..."
                        value={filters.search || ''}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="h-9 text-sm"
                    />
                </div>

                {/* Right Column - Advanced Filters Toggle */}
                <div className="flex items-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-0 h-auto text-xs text-gray-600 hover:text-gray-900"
                    >
                        {isExpanded ? '▼' : '▶'} Advanced Filters
                        {activeFiltersCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-600 font-medium">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Advanced Filters - Full Width */}
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Status Filter */}
                        <div className="space-y-1.5">
                            <Label htmlFor="status" className="text-xs font-medium text-gray-700">Status</Label>
                            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
                                <SelectTrigger id="status" className="h-8 text-sm">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statusOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Source Filter */}
                        <div className="space-y-1.5">
                            <Label htmlFor="source" className="text-xs font-medium text-gray-700">Source</Label>
                            <Select value={filters.source || 'all'} onValueChange={(value) => handleFilterChange('source', value === 'all' ? '' : value)}>
                                <SelectTrigger id="source" className="h-8 text-sm">
                                    <SelectValue placeholder="All sources" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sources</SelectItem>
                                    {sourceOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date From */}
                        <div className="space-y-1.5">
                            <Label htmlFor="date-from" className="text-xs font-medium text-gray-700">Date From</Label>
                            <Input
                                id="date-from"
                                type="date"
                                value={filters.date_from || ''}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>

                        {/* Date To */}
                        <div className="space-y-1.5">
                            <Label htmlFor="date-to" className="text-xs font-medium text-gray-700">Date To</Label>
                            <Input
                                id="date-to"
                                type="date"
                                value={filters.date_to || ''}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>

                    {/* Clear Button */}
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="w-full h-8 text-xs mt-4"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
}
