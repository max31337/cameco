import { type PendingPeriod } from '@/types/payroll-pages';
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
import { MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PendingPeriodsTableProps {
    periods: PendingPeriod[];
}

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    calculating: 'bg-blue-100 text-blue-800',
    calculated: 'bg-blue-100 text-blue-800',
    reviewing: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
};

const actionLabels: Record<string, string> = {
    calculate: 'Calculate Payroll',
    review: 'Review Period',
    approve: 'Approve Period',
    adjust: 'Add Adjustments',
    recalculate: 'Recalculate',
    generate_slips: 'Generate Payslips',
    export_bank: 'Export Bank File',
};

export function PendingPeriodsTable({ periods }: PendingPeriodsTableProps) {
    if (periods.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pending Payroll Periods</CardTitle>
                    <CardDescription>Payroll periods requiring action or review</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        <p>No pending payroll periods at this time.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Payroll Periods</CardTitle>
                <CardDescription>Payroll periods requiring action or review</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date Range</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Employees</TableHead>
                                <TableHead className="text-right">Net Pay</TableHead>
                                <TableHead className="text-center">Progress</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {periods.map((period) => (
                                <TableRow key={period.id}>
                                    <TableCell>
                                        <div className="font-medium">{period.name}</div>
                                        {period.pay_date && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Pay: {new Date(period.pay_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <Badge variant="outline">{period.period_type_label}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {period.date_range}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusColors[period.status]}>
                                            {period.status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-sm">{period.employee_count}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        {period.formatted_net_pay}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full bg-blue-500 transition-all"
                                                    style={{ width: `${period.progress_percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-8">
                                                {period.progress_percentage}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {(period.available_actions ?? []).length > 0 ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {(period.available_actions ?? []).map((action) => (
                                                        <DropdownMenuItem key={action}>
                                                            {actionLabels[action] || action}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
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
