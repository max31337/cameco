import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Download } from 'lucide-react';

interface Contribution {
    id: string | number;
    employee_name: string;
    employee_number: string;
    philhealth_number: string;
    monthly_basic: number;
    employee_premium: number;
    employer_premium: number;
    total_premium: number;
    is_processed: boolean;
    is_remitted: boolean;
    is_indigent: boolean;
}

interface PhilHealthContributionsTableProps {
    contributions: Contribution[];
    period?: string;
    onDownload?: () => void;
}

/**
 * PhilHealth Contributions Table Component
 * Displays employee PhilHealth contributions with detailed breakdown
 * PhilHealth Rate: 5% of monthly basic (2.5% EE + 2.5% ER, max 5,000)
 */
export function PhilHealthContributionsTable({
    contributions,
    period,
    onDownload,
}: PhilHealthContributionsTableProps) {
    const totalBasic = contributions.reduce((sum, c) => sum + c.monthly_basic, 0);
    const totalEE = contributions.reduce((sum, c) => sum + c.employee_premium, 0);
    const totalER = contributions.reduce((sum, c) => sum + c.employer_premium, 0);
    const totalPremium = totalEE + totalER;
    const indigentCount = contributions.filter((c) => c.is_indigent).length;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Total Employees</p>
                            <p className="text-2xl font-bold">{contributions.length}</p>
                            <p className="text-xs text-muted-foreground">
                                {indigentCount > 0 && `${indigentCount} indigent`}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Monthly Basic</p>
                            <p className="text-2xl font-bold">₱{(totalBasic / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-muted-foreground">
                                Total base salary
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">EE Premium (2.5%)</p>
                            <p className="text-2xl font-bold text-blue-600">₱{(totalEE / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-muted-foreground">
                                Employee deduction
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">ER Premium (2.5%)</p>
                            <p className="text-2xl font-bold text-green-600">₱{(totalER / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-muted-foreground">
                                Company cost
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Contributions Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle>PhilHealth Contributions</CardTitle>
                        {period && (
                            <p className="text-sm text-muted-foreground">
                                {period}
                            </p>
                        )}
                    </div>
                    {onDownload && (
                        <Button
                            onClick={onDownload}
                            variant="outline"
                            size="sm"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download CSV
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>PhilHealth #</TableHead>
                                    <TableHead className="text-right">Monthly Basic</TableHead>
                                    <TableHead className="text-right">EE Premium (2.5%)</TableHead>
                                    <TableHead className="text-right">ER Premium (2.5%)</TableHead>
                                    <TableHead className="text-right">Total (5%)</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contributions.map((contrib) => (
                                    <TableRow key={contrib.id}>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="font-medium">{contrib.employee_name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {contrib.employee_number}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {contrib.philhealth_number}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ₱{contrib.monthly_basic.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ₱{contrib.employee_premium.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ₱{contrib.employer_premium.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ₱{contrib.total_premium.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {contrib.is_indigent && (
                                                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                                        Indigent
                                                    </Badge>
                                                )}
                                                {contrib.is_processed && (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                        Processed
                                                    </Badge>
                                                )}
                                                {contrib.is_remitted && (
                                                    <Badge className="bg-green-600">
                                                        Remitted
                                                    </Badge>
                                                )}
                                                {!contrib.is_remitted && (
                                                    <Badge variant="outline" className="text-orange-600">
                                                        Pending
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Summary Footer */}
                    <div className="mt-6 border-t pt-4">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Employees</p>
                                <p className="text-lg font-semibold">{contributions.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Monthly Basic</p>
                                <p className="text-lg font-semibold">
                                    ₱{totalBasic.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total EE Premium</p>
                                <p className="text-lg font-semibold text-blue-600">
                                    ₱{totalEE.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Premium (5%)</p>
                                <p className="text-lg font-semibold text-purple-600">
                                    ₱{totalPremium.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
