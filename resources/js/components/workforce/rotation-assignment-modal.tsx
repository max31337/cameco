import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmployeeRotation, Department } from '@/types/workforce-pages';
import { RotationPatternPreview } from './rotation-pattern-preview';
import { Users, Filter, AlertCircle, Check } from 'lucide-react';

interface EmployeeOption {
    id: number;
    employee_number: string;
    full_name: string;
    department_id: number;
    department_name: string;
}

interface RotationAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    rotation: EmployeeRotation | null;
    employees: EmployeeOption[];
    departments: Department[];
    onConfirm: (data: { rotation_id: number; employee_ids: number[] }) => void;
}

export function RotationAssignmentModal({
    isOpen,
    onClose,
    rotation,
    employees = [],
    departments = [],
    onConfirm,
}: RotationAssignmentModalProps) {
    const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectAll, setSelectAll] = useState(false);

    // Filter employees based on search and department
    const filteredEmployees = useMemo(() => {
        return (employees || []).filter((emp) => {
            const matchesSearch =
                emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.employee_number.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDept = departmentFilter === 'all' || emp.department_id === parseInt(departmentFilter);

            return matchesSearch && matchesDept;
        });
    }, [employees, searchTerm, departmentFilter]);

    const handleSelectEmployee = (employeeId: number) => {
        const newSelected = new Set(selectedEmployees);
        if (newSelected.has(employeeId)) {
            newSelected.delete(employeeId);
        } else {
            newSelected.add(employeeId);
        }
        setSelectedEmployees(newSelected);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEmployees(new Set());
        } else {
            const allIds = new Set(filteredEmployees.map((emp) => emp.id));
            setSelectedEmployees(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleConfirm = () => {
        if (rotation && selectedEmployees.size > 0) {
            onConfirm({
                rotation_id: rotation.id,
                employee_ids: Array.from(selectedEmployees),
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setSelectedEmployees(new Set());
        setDepartmentFilter('all');
        setSearchTerm('');
        setSelectAll(false);
        onClose();
    };

    if (!rotation) {
        return null;
    }

    const isAllSelected = filteredEmployees.length > 0 && filteredEmployees.every((emp) => selectedEmployees.has(emp.id));
    const isSomeSelected = selectedEmployees.size > 0 && !isAllSelected;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Assign Employees to Rotation</DialogTitle>
                    <DialogDescription>
                        Select employees to assign to the <strong>{rotation.name}</strong> rotation pattern.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Rotation Info Summary */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm">{rotation.name}</p>
                                    {rotation.description && (
                                        <p className="text-xs text-gray-600">{rotation.description}</p>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                            {rotation.pattern_type}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                            {rotation.pattern_json.work_days}W / {rotation.pattern_json.rest_days}R
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {rotation.assigned_employees_count || 0}
                                    </div>
                                    <div className="text-xs text-gray-600">Currently Assigned</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pattern Preview */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Pattern Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-gray-50 p-3 rounded">
                            <RotationPatternPreview
                                pattern={rotation.pattern_json}
                                patternName={rotation.name}
                                startDate={new Date()}
                                cyclesShown={1}
                            />
                        </CardContent>
                    </Card>

                    {/* Filters and Search */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filter Employees
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Search */}
                            <Input
                                placeholder="Search by name or employee number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="text-sm"
                            />

                            {/* Department Filter */}
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="text-sm">
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
                        </CardContent>
                    </Card>

                    {/* Employee Selection */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Employees ({selectedEmployees.size} selected)
                                </CardTitle>
                                {filteredEmployees.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleSelectAll}
                                        className="text-xs"
                                    >
                                        {isAllSelected
                                            ? 'Deselect All'
                                            : isSomeSelected
                                            ? 'Select All'
                                            : 'Select All'}
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredEmployees.length === 0 ? (
                                <div className="flex items-center justify-center gap-2 py-6 text-gray-500">
                                    <AlertCircle className="h-4 w-4" />
                                    <p className="text-sm">No employees found matching your filters.</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredEmployees.map((employee) => (
                                        <div
                                            key={employee.id}
                                            className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors"
                                        >
                                            <Checkbox
                                                id={`employee-${employee.id}`}
                                                checked={selectedEmployees.has(employee.id)}
                                                onCheckedChange={() => handleSelectEmployee(employee.id)}
                                            />
                                            <label
                                                htmlFor={`employee-${employee.id}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                <div className="text-sm font-medium">{employee.full_name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {employee.employee_number} • {employee.department_name}
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Selection Summary */}
                    {selectedEmployees.size > 0 && (
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="p-3">
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-700">
                                        <strong>{selectedEmployees.size}</strong> employee{selectedEmployees.size !== 1 ? 's' : ''} selected for
                                        assignment
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={selectedEmployees.size === 0}>
                        Assign {selectedEmployees.size > 0 ? `(${selectedEmployees.size})` : ''}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
