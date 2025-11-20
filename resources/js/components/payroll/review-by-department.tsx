import React from 'react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { DepartmentBreakdown } from '@/types/payroll-review-types';
import { TrendingUp } from 'lucide-react';

interface ReviewByDepartmentProps {
    departments: DepartmentBreakdown[];
}

export function ReviewByDepartment({ departments }: ReviewByDepartmentProps) {
    const totalGross = departments.reduce((sum, dept) => sum + dept.total_gross_pay, 0);

    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Department</TableHead>
                        <TableHead className="text-right font-semibold">Employees</TableHead>
                        <TableHead className="text-right font-semibold">Gross Pay</TableHead>
                        <TableHead className="text-right font-semibold">Deductions</TableHead>
                        <TableHead className="text-right font-semibold">Net Pay</TableHead>
                        <TableHead className="text-right font-semibold">Employer Cost</TableHead>
                        <TableHead className="text-right font-semibold">% of Total</TableHead>
                        <TableHead className="text-right font-semibold">Avg per Employee</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {departments.map((dept) => (
                        <TableRow key={dept.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{dept.name}</TableCell>
                            <TableCell className="text-right">{dept.employee_count}</TableCell>
                            <TableCell className="text-right font-mono text-sm">
                                {dept.formatted_gross_pay}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm text-red-600">
                                -{dept.total_deductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm font-semibold text-green-600">
                                {dept.formatted_net_pay}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm">
                                {dept.formatted_employer_cost}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <span className="font-medium">{dept.percentage_of_total.toFixed(1)}%</span>
                                    {dept.percentage_of_total > 15 && (
                                        <TrendingUp className="h-4 w-4 text-blue-600" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm">
                                ₱{dept.average_net_per_employee.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Summary Row */}
            <div className="border-t bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Total Employees</p>
                        <p className="mt-1 text-lg font-semibold">
                            {departments.reduce((sum, dept) => sum + dept.employee_count, 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Total Gross</p>
                        <p className="mt-1 text-lg font-semibold">
                            ₱{totalGross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Total Deductions</p>
                        <p className="mt-1 text-lg font-semibold text-red-600">
                            -₱{departments.reduce((sum, dept) => sum + dept.total_deductions, 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Total Net</p>
                        <p className="mt-1 text-lg font-semibold text-green-600">
                            ₱{departments.reduce((sum, dept) => sum + dept.total_net_pay, 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                        <p className="text-xs font-medium text-muted-foreground">Total Employer Cost</p>
                        <p className="mt-1 text-lg font-semibold">
                            ₱{departments.reduce((sum, dept) => sum + dept.total_employer_cost, 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
