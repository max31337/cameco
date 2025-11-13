import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Department } from '@/types/workforce-pages';
import { X } from 'lucide-react';

interface RotationFiltersProps {
    filters: {
        pattern_type: string;
        department_id: string;
        status: string;
    };
    onFiltersChange: (filters: Record<string, string>) => void;
    departments: Department[];
}

export function RotationFilters({
    filters,
    onFiltersChange,
    departments,
}: RotationFiltersProps) {
    const handleFilterChange = (key: string, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        });
    };

    const handleReset = () => {
        onFiltersChange({
            pattern_type: 'all',
            department_id: 'all',
            status: 'all',
        });
    };

    const hasActiveFilters = Object.values(filters).some((value) => value !== 'all');

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm">Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Pattern Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pattern Type</label>
                        <Select value={filters.pattern_type} onValueChange={(v) => handleFilterChange('pattern_type', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Patterns</SelectItem>
                                <SelectItem value="4x2">4x2 (4 work / 2 rest)</SelectItem>
                                <SelectItem value="5x2">5x2 (5 work / 2 rest)</SelectItem>
                                <SelectItem value="6x1">6x1 (6 work / 1 rest)</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Select value={filters.department_id} onValueChange={(v) => handleFilterChange('department_id', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Reset Button */}
                {hasActiveFilters && (
                    <div className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear Filters
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
