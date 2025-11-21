import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Download } from 'lucide-react';
import type { SSSContribution } from '@/types/payroll-pages';

interface SSSContributionsTableProps {
    contributions: SSSContribution[];
    period?: string;
    onDownload?: () => void;
}

export function SSSContributionsTable({ contributions, period, onDownload }: SSSContributionsTableProps) {
    const totalCompensation = contributions.reduce((sum, c) => sum + c.monthly_compensation, 0);
    const totalEE = contributions.reduce((sum, c) => sum + c.employee_contribution, 0);
    const totalER = contributions.reduce((sum, c) => sum + c.employer_contribution, 0);
    const totalEC = contributions.reduce((sum, c) => sum + c.ec_contribution, 0);
    const grandTotal = totalEE + totalER + totalEC;

    const getStatusColor = (bracket: string) => {
        const bracketIndex = bracket.charCodeAt(0) - 65; // A=0, B=1, etc.
        if (bracketIndex < 3) return 'bg-blue-100 text-blue-800';
        if (bracketIndex < 6) return 'bg-green-100 text-green-800';
        if (bracketIndex < 10) return 'bg-yellow-100 text-yellow-800';
        return 'bg-orange-100 text-orange-800';
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>SSS Contributions</CardTitle>
                        <CardDescription>
                            {period && `Period: ${period} • `}
                            Total Employees: {contributions.length}
                        </CardDescription>
                    </div>
                    {onDownload && (
                        <Button onClick={onDownload} variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download CSV
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="rounded-lg border p-3">
                            <p className="text-sm text-muted-foreground">Monthly Compensation</p>
                            <p className="text-lg font-semibold">₱{(totalCompensation / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="text-sm text-muted-foreground">Employee Share</p>
                            <p className="text-lg font-semibold">₱{(totalEE / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="text-sm text-muted-foreground">Employer Share</p>
                            <p className="text-lg font-semibold">₱{(totalER / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="rounded-lg border p-3 bg-blue-50">
                            <p className="text-sm text-muted-foreground">Total Contribution</p>
                            <p className="text-lg font-semibold text-blue-600">₱{(grandTotal / 1000).toFixed(1)}k</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Employee</TableHead>
                                    <TableHead>SSS Number</TableHead>
                                    <TableHead className="text-right">Monthly Comp</TableHead>
                                    <TableHead className="text-center">Bracket</TableHead>
                                    <TableHead className="text-right">EE Share</TableHead>
                                    <TableHead className="text-right">ER Share</TableHead>
                                    <TableHead className="text-right">EC Share</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contributions.map((contrib) => (
                                    <TableRow key={contrib.id}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <p className="font-semibold">{contrib.employee_name}</p>
                                                <p className="text-xs text-muted-foreground">{contrib.employee_number}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{contrib.sss_number}</TableCell>
                                        <TableCell className="text-right">
                                            ₱{contrib.monthly_compensation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={getStatusColor(contrib.sss_bracket)}>
                                                {contrib.sss_bracket}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ₱{contrib.employee_contribution.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ₱{contrib.employer_contribution.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ₱{contrib.ec_contribution.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            ₱{contrib.total_contribution.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {contrib.is_exempted ? (
                                                <Badge variant="outline">Exempted</Badge>
                                            ) : contrib.is_remitted ? (
                                                <Badge className="bg-green-100 text-green-800">Remitted</Badge>
                                            ) : contrib.is_processed ? (
                                                <Badge className="bg-blue-100 text-blue-800">Processed</Badge>
                                            ) : (
                                                <Badge variant="outline">Pending</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer Summary */}
                    <div className="border-t pt-4">
                        <div className="grid grid-cols-5 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Total Employees</p>
                                <p className="text-lg font-semibold">{contributions.length}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total Compensation</p>
                                <p className="text-lg font-semibold">₱{(totalCompensation).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total EE Share</p>
                                <p className="text-lg font-semibold">₱{totalEE.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total ER Share</p>
                                <p className="text-lg font-semibold">₱{totalER.toFixed(2)}</p>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-3">
                                <p className="text-muted-foreground">Grand Total</p>
                                <p className="text-lg font-semibold text-blue-600">₱{grandTotal.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
