import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { PagIbigContribution } from "@/types/payroll-pages";

interface PagIbigContributionsTableProps {
    contributions: PagIbigContribution[];
    period: {
        id: string | number;
        name: string;
        month: string;
        status: string;
    };
    onDownloadContributions: () => void;
}

export default function PagIbigContributionsTable({
    contributions,
    period,
    onDownloadContributions,
}: PagIbigContributionsTableProps) {
    const totalEmployees = contributions.length;
    const totalCompensation = contributions.reduce((sum, c) => sum + c.monthly_compensation, 0);
    const totalEmployeeContribution = contributions.reduce((sum, c) => sum + c.employee_contribution, 0);
    const totalEmployerContribution = contributions.reduce((sum, c) => sum + c.employer_contribution, 0);
    const totalContribution = totalEmployeeContribution + totalEmployerContribution;
    const employeesWithLoans = contributions.filter((c) => c.has_active_loan).length;

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEmployees}</div>
                        <p className="text-xs text-muted-foreground mt-1">For {period.name}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Compensation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₱{(totalCompensation / 1000).toFixed(1)}K</div>
                        <p className="text-xs text-muted-foreground mt-1">Monthly aggregate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Contribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₱{totalContribution.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">EE + ER share</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">With Active Loans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{employeesWithLoans}</div>
                        <p className="text-xs text-muted-foreground mt-1">Employees with deductions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Contributions Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Contributions Breakdown</CardTitle>
                            <CardDescription>Period: {period.name}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={onDownloadContributions}>
                            <Download className="w-4 h-4 mr-2" />
                            Download CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Pag-IBIG #</TableHead>
                                    <TableHead className="text-right">Monthly Comp</TableHead>
                                    <TableHead className="text-center">EE Rate</TableHead>
                                    <TableHead className="text-right">EE Contrib</TableHead>
                                    <TableHead className="text-right">ER Contrib (2%)</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contributions.map((contrib) => (
                                    <TableRow key={contrib.id}>
                                        <TableCell>
                                            <div className="font-medium">{contrib.employee_name}</div>
                                            <div className="text-xs text-muted-foreground">{contrib.employee_number}</div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{contrib.pagibig_number}</TableCell>
                                        <TableCell className="text-right">₱{contrib.monthly_compensation.toFixed(2)}</TableCell>
                                        <TableCell className="text-center font-semibold text-blue-600">
                                            {contrib.employee_rate}%
                                        </TableCell>
                                        <TableCell className="text-right">₱{contrib.employee_contribution.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">₱{contrib.employer_contribution.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-semibold">
                                            ₱{contrib.total_contribution.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 justify-center flex-wrap">
                                                {contrib.is_processed && <Badge variant="secondary">Processed</Badge>}
                                                {contrib.has_active_loan && <Badge variant="outline" className="bg-blue-50">Has Loan</Badge>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer Totals */}
                    <div className="mt-6 pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Total Employee Contribution (sum of EE rates):</span>
                            <span className="font-semibold">₱{totalEmployeeContribution.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Total Employer Contribution (2% fixed):</span>
                            <span className="font-semibold">₱{totalEmployerContribution.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold bg-blue-50 p-2 rounded">
                            <span>TOTAL CONTRIBUTION:</span>
                            <span className="text-blue-600">₱{totalContribution.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reference Card */}
            <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                    <CardTitle className="text-sm">Pag-IBIG Contribution Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Employee Share (EE):</p>
                            <p className="text-muted-foreground">1% or 2% of monthly compensation</p>
                            <p className="text-muted-foreground">Maximum: ₱100/month</p>
                        </div>
                        <div>
                            <p className="font-medium">Employer Share (ER):</p>
                            <p className="text-muted-foreground">2% of monthly compensation</p>
                            <p className="text-muted-foreground">Maximum: ₱100/month</p>
                        </div>
                        <div>
                            <p className="font-medium">Total Rate:</p>
                            <p className="text-muted-foreground">3-4% depending on employee rate</p>
                        </div>
                        <div>
                            <p className="font-medium">Due Date:</p>
                            <p className="text-muted-foreground">10th of following month</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
