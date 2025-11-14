import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filter, X } from 'lucide-react';

interface FilterState {
    department_id: number;
    status: string;
    search: string;
    date_range: string;
}

interface ScheduleFiltersProps {
    departments: Array<{ id: number; name: string }>;
    filters?: FilterState;
    onFiltersChange?: (filters: FilterState) => void;
}

export default function ScheduleFilters({
    departments,
    filters: externalFilters,
    onFiltersChange,
}: ScheduleFiltersProps) {
    const [localFilters, setLocalFilters] = useState<FilterState>({
        department_id: 0,
        status: 'all',
        search: '',
        date_range: 'all',
    });

    const [isOpen, setIsOpen] = useState(false);

    const filters = externalFilters || localFilters;

    const handleFilterChange = (key: string, value: string | number) => {
        const newFilters = {
            ...filters,
            [key]: value,
        };
        if (onFiltersChange) {
            onFiltersChange(newFilters);
        } else {
            setLocalFilters(newFilters);
        }
    };
    };

    const handleReset = () => {
        setFilters({
            department_id: 0,
            status: 'all',
            search: '',
            date_range: 'all',
        });
    };

    const isFiltered = Object.values(filters).some(
        (value) => value !== 0 && value !== 'all' && value !== ''
    );

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={isFiltered ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="gap-2"
            >
                <Filter className="h-4 w-4" />
                Filters
                {isFiltered && (
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-xs text-blue-600">
                        {Object.values(filters).filter((v) => v !== 0 && v !== 'all' && v !== '').length}
                    </span>
                )}
            </Button>

            {isOpen && (
                <div className="absolute mt-2 p-4 bg-white border rounded-lg shadow-lg z-50 w-72">
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search</label>
                            <Input
                                placeholder="Search schedules..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        {/* Department Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Department</label>
                            <Select
                                value={filters.department_id.toString()}
                                onValueChange={(value) =>
                                    handleFilterChange('department_id', parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">All Departments</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id.toString()}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date Range</label>
                            <Select
                                value={filters.date_range}
                                onValueChange={(value) => handleFilterChange('date_range', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Dates</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="future">Future Schedules</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                className="flex-1"
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="flex-1"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isFiltered && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="gap-1"
                >
                    <X className="h-4 w-4" />
                    Clear
                </Button>
            )}
        </div>
    );
}
