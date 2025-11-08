import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { useState } from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

export interface EmployeeFilters {
    search: string;
    department_id: string;
    status: string;
    employment_type: string;
}

interface EmployeeFiltersProps {
    filters: EmployeeFilters;
    onFilterChange: (filters: EmployeeFilters) => void;
    departments?: Array<{ id: number; name: string }>;
}

// ============================================================================
// Component
// ============================================================================

export function EmployeeFiltersComponent({ 
    filters, 
    onFilterChange,
    departments = []
}: EmployeeFiltersProps) {
    const [localFilters, setLocalFilters] = useState<EmployeeFilters>(filters);

    const handleSearchChange = (value: string) => {
        const newFilters = { ...localFilters, search: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters: EmployeeFilters = {
            search: '',
            department_id: 'all',
            status: 'all',
            employment_type: 'all',
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const hasActiveFilters = 
        localFilters.search || 
        (localFilters.department_id && localFilters.department_id !== 'all') || 
        (localFilters.status && localFilters.status !== 'all') || 
        (localFilters.employment_type && localFilters.employment_type !== 'all');

    return (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-8 text-xs"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Reset
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="space-y-2">
                    <Label htmlFor="search" className="text-xs">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            placeholder="Name, employee #, email..."
                            value={localFilters.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Department Filter */}
                <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs">Department</Label>
                    <Select
                        value={localFilters.department_id || 'all'}
                        onValueChange={(value) => handleFilterChange('department_id', value)}
                    >
                        <SelectTrigger id="department">
                            <SelectValue placeholder="All Departments" />
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

                {/* Status Filter */}
                <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs">Status</Label>
                    <Select
                        value={localFilters.status || 'all'}
                        onValueChange={(value) => handleFilterChange('status', value)}
                    >
                        <SelectTrigger id="status">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="on_leave">On Leave</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Employment Type Filter */}
                <div className="space-y-2">
                    <Label htmlFor="employment_type" className="text-xs">Employment Type</Label>
                    <Select
                        value={localFilters.employment_type || 'all'}
                        onValueChange={(value) => handleFilterChange('employment_type', value)}
                    >
                        <SelectTrigger id="employment_type">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="probationary">Probationary</SelectItem>
                            <SelectItem value="contractual">Contractual</SelectItem>
                            <SelectItem value="project-based">Project-Based</SelectItem>
                            <SelectItem value="part-time">Part-Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
