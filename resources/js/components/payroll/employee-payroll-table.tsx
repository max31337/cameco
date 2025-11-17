import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users,
    MoreHorizontal,
    Eye,
    Edit2,
    Trash2,
} from 'lucide-react';
import type { EmployeePayrollInfo } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface EmployeePayrollTableProps {
    employees: EmployeePayrollInfo[];
    onView?: (employee: EmployeePayrollInfo) => void;
    onEdit?: (employee: EmployeePayrollInfo) => void;
    onDelete?: (employee: EmployeePayrollInfo) => void;
    isLoading?: boolean;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format currency for display
 */
function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(value);
}

/**
 * Get status badge color
 */
function getStatusColor(isActive: boolean): 'default' | 'secondary' | 'destructive' | 'outline' {
    return isActive ? 'default' : 'secondary';
}

// ============================================================================
// Component
// ============================================================================

export function EmployeePayrollTable({
    employees,
    onView,
    onEdit,
    onDelete,
    isLoading = false,
}: EmployeePayrollTableProps) {
    if (employees.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">No employee payroll information found</p>
                        <p className="text-sm text-gray-500">
                            Create the first employee payroll record to get started
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employee Payroll Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee Name</TableHead>
                                <TableHead>Employee #</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Salary Type</TableHead>
                                <TableHead>Basic Salary</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Tax Status</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow
                                    key={employee.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-900"
                                >
                                    <TableCell className="font-medium">
                                        {employee.employee_name}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {employee.employee_number}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {employee.department}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <Badge variant="outline">
                                            {employee.salary_type_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">
                                        {employee.salary_type === 'monthly' &&
                                            formatCurrency(employee.basic_salary)}
                                        {employee.salary_type === 'daily' &&
                                            `₱${employee.daily_rate?.toLocaleString('en-PH', {
                                                minimumFractionDigits: 2,
                                            })} /day`}
                                        {employee.salary_type === 'hourly' &&
                                            `₱${employee.hourly_rate?.toLocaleString('en-PH', {
                                                minimumFractionDigits: 2,
                                            })} /hr`}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {employee.payment_method_label}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {employee.tax_status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(employee.is_active)}>
                                            {employee.status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={isLoading}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                {onView && (
                                                    <DropdownMenuItem
                                                        onClick={() => onView(employee)}
                                                        disabled={isLoading}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                )}

                                                {onEdit && (
                                                    <DropdownMenuItem
                                                        onClick={() => onEdit(employee)}
                                                        disabled={isLoading}
                                                    >
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit Info
                                                    </DropdownMenuItem>
                                                )}

                                                {onDelete && (
                                                    <>
                                                        <DropdownMenuItem
                                                            onClick={() => onDelete(employee)}
                                                            disabled={isLoading}
                                                            className="text-red-600 dark:text-red-400"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
