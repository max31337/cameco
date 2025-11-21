import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, DollarSign } from "lucide-react";
import type { PagIbigLoanDeduction } from "@/types/payroll-pages";

interface PagIbigLoanDeductionsProps {
    loans: PagIbigLoanDeduction[];
}

export default function PagIbigLoanDeductions({ loans }: PagIbigLoanDeductionsProps) {
    const activeLoanCount = loans.filter((l) => l.is_active).length;
    const totalLoanAmount = loans.reduce((sum, l) => sum + l.loan_amount, 0);
    const totalDeductedToDate = loans.reduce((sum, l) => sum + l.total_deducted_to_date, 0);
    const totalMonthlyDeduction = loans.reduce((sum, l) => sum + l.monthly_deduction, 0);

    const getLoanTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "housing":
                return "🏠";
            case "calamity":
                return "⚠️";
            case "educational":
                return "📚";
            case "other":
                return "💼";
            default:
                return "📋";
        }
    };

    const calculateProgress = (deducted: number, total: number) => {
        return total > 0 ? Math.round((deducted / total) * 100) : 0;
    };

    const calculateRemainingAmount = (deducted: number, total: number) => {
        return Math.max(0, total - deducted);
    };

    const groupedByType = Object.groupBy(loans, (loan) => loan.loan_type) || {};

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Loans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeLoanCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Currently being deducted</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Loan Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₱{(totalLoanAmount / 1000).toFixed(0)}K</div>
                        <p className="text-xs text-muted-foreground mt-1">Principal balance</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">₱{totalMonthlyDeduction.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total across all loans</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Deducted to Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₱{totalDeductedToDate.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Cumulative payments</p>
                    </CardContent>
                </Card>
            </div>

            {/* Loans by Type Sections */}
            {Object.entries(groupedByType).map(([loanType, loansOfType]) => (
                <div key={loanType} className="space-y-3">
                    {/* Type Header */}
                    <div className="flex items-center gap-2 px-2">
                        <span className="text-2xl">{getLoanTypeIcon(loanType)}</span>
                        <h3 className="font-semibold text-base capitalize">
                            {loanType.replace(/_/g, " ")} Loans
                        </h3>
                        <Badge variant="outline" className="ml-auto">
                            {loansOfType.length} active
                        </Badge>
                    </div>

                    {/* Type Loans Table */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Loan Number</TableHead>
                                            <TableHead className="text-right">Loan Amount</TableHead>
                                            <TableHead className="text-right">Monthly Ded</TableHead>
                                            <TableHead className="text-center">Months Remaining</TableHead>
                                            <TableHead className="text-right">Deducted</TableHead>
                                            <TableHead className="text-center">Progress</TableHead>
                                            <TableHead className="text-center">Maturity</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loansOfType.map((loan) => {
                                            const progress = calculateProgress(loan.total_deducted_to_date, loan.loan_amount);
                                            const remaining = calculateRemainingAmount(loan.total_deducted_to_date, loan.loan_amount);

                                            return (
                                                <TableRow key={loan.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{loan.employee_name}</div>
                                                        <div className="text-xs text-muted-foreground">{loan.employee_number}</div>
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">{loan.loan_number}</TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        ₱{loan.loan_amount.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        ₱{loan.monthly_deduction.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="secondary">{loan.months_remaining}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="font-medium">₱{loan.total_deducted_to_date.toFixed(2)}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Remaining: ₱{remaining.toFixed(2)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24">
                                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                                    <div
                                                                        className="bg-blue-600 h-2 rounded-full"
                                                                        style={{ width: `${progress}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-semibold w-8 text-right">
                                                                {progress}%
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-sm">
                                                        {new Date(loan.maturity_date).toLocaleDateString("en-PH", {
                                                            year: "numeric",
                                                            month: "short",
                                                        })}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}

            {/* Empty State */}
            {loans.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                        <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No active loans</p>
                        <p className="text-xs text-muted-foreground">Employees with no loan deductions</p>
                    </CardContent>
                </Card>
            )}

            {/* Loan Information */}
            {loans.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-sm">Pag-IBIG Loan Program</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium flex items-center gap-2">
                                    <span>🏠</span>
                                    Housing Loan
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    For home construction, repair, or improvement
                                </p>
                            </div>

                            <div>
                                <p className="font-medium flex items-center gap-2">
                                    <span>⚠️</span>
                                    Calamity Loan
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Emergency assistance during natural disasters
                                </p>
                            </div>

                            <div>
                                <p className="font-medium flex items-center gap-2">
                                    <span>📚</span>
                                    Educational Loan
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    For education and skill development
                                </p>
                            </div>

                            <div>
                                <p className="font-medium flex items-center gap-2">
                                    <span>💼</span>
                                    Other Loans
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Other approved loan purposes
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-3 space-y-2">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs">
                                    <p className="font-medium">Monthly Deduction Process:</p>
                                    <p className="text-muted-foreground">
                                        Loan deductions are automatically deducted from employees' Pag-IBIG contributions
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
