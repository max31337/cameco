import React from 'react';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Department, EmployeeReference } from '@/types/workforce-pages';

export interface AssignmentFiltersState {
    department_id: string;
    employee_id: string;
    shift_type: string;
    status: string;
    date_from: string;
    date_to: string;
    is_overtime?: string;
}

interface AssignmentFiltersProps {
    filters: AssignmentFiltersState;
    onFilterChange: (filters: AssignmentFiltersState) => void;
    departments: Department[];
    employees: EmployeeReference[];
}

export function AssignmentFilters({
    filters,
    onFilterChange,
    departments = [],
    employees = [],
}: AssignmentFiltersProps) {
    const handleChange = (key: keyof AssignmentFiltersState, value: string) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    return (
        <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {/* Department Filter */}
                <Select
                    value={filters.department_id}
                    onValueChange={(value) => handleChange('department_id', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Department" />
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

                {/* Employee Filter */}
                <Select
                    value={filters.employee_id}
                    onValueChange={(value) => handleChange('employee_id', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Employee" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {employees.slice(0, 15).map((emp) => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                {emp.full_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Shift Type Filter */}
                <Select
                    value={filters.shift_type}
                    onValueChange={(value) => handleChange('shift_type', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Shift Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Shifts</SelectItem>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="night">Night</SelectItem>
                        <SelectItem value="graveyard">Graveyard</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select
                    value={filters.status}
                    onValueChange={(value) => handleChange('status', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                {/* Date From Filter */}
                <Input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => handleChange('date_from', e.target.value)}
                    placeholder="From Date"
                />

                {/* Date To Filter */}
                <Input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => handleChange('date_to', e.target.value)}
                    placeholder="To Date"
                />

                {/* Overtime Filter */}
                <Select
                    value={filters.is_overtime || 'all'}
                    onValueChange={(value) => handleChange('is_overtime' as keyof AssignmentFiltersState, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Overtime" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Assignments</SelectItem>
                        <SelectItem value="true">Overtime Only</SelectItem>
                        <SelectItem value="false">Regular Hours</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </Card>
    );
}

export default AssignmentFilters;
