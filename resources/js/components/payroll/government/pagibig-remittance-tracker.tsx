import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import type { PagIbigRemittance } from "@/types/payroll-pages";

interface PagIbigRemittanceTrackerProps {
    remittances: PagIbigRemittance[];
}

export default function PagIbigRemittanceTracker({ remittances }: PagIbigRemittanceTrackerProps) {
    const totalRemittances = remittances.length;
    const paidRemittances = remittances.filter((r) => r.status === "paid").length;
    const pendingRemittances = remittances.filter((r) => r.status === "pending").length;
    const overdueRemittances = remittances.filter((r) => r.status === "overdue").length;
    const totalAmount = remittances.reduce((sum, r) => sum + r.remittance_amount, 0);
    const totalPaid = remittances
        .filter((r) => r.status === "paid")
        .reduce((sum, r) => sum + r.remittance_amount, 0);
    const totalPenalties = remittances.filter((r) => r.has_penalty).reduce((sum, r) => sum + r.penalty_amount, 0);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "paid":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "pending":
                return <Clock className="w-4 h-4 text-blue-600" />;
            case "overdue":
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case "partially_paid":
                return <AlertCircle className="w-4 h-4 text-amber-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-blue-100 text-blue-800";
            case "overdue":
                return "bg-red-100 text-red-800";
            case "partially_paid":
                return "bg-amber-100 text-amber-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const isOverdue = (dueDate: string, status: string) => {
        if (status === "paid" || status === "partially_paid") return false;
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Remittances</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRemittances}</div>
                        <p className="text-xs text-muted-foreground mt-1">All periods</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{paidRemittances}</div>
                        <p className="text-xs text-muted-foreground mt-1">₱{totalPaid.toFixed(2)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{pendingRemittances}</div>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
                    </CardContent>
                </Card>

                <Card className={overdueRemittances > 0 ? "border-red-200 bg-red-50" : ""}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${overdueRemittances > 0 ? "text-red-600" : "text-green-600"}`}>
                            {overdueRemittances}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {overdueRemittances > 0 ? "Action needed" : "None"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Overdue Alert */}
            {overdueRemittances > 0 && (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <CardTitle className="text-base">Overdue Payment Alert</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-red-800">
                        <p>
                            {overdueRemittances} payment{overdueRemittances !== 1 ? "s" : ""} overdue. Late payments may incur penalties
                            from Pag-IBIG. Please settle immediately.
                        </p>
                        {totalPenalties > 0 && (
                            <p className="mt-2 font-semibold">Current Penalties: ₱{totalPenalties.toFixed(2)}</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Remittances Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Remittance Tracking</CardTitle>
                    <CardDescription>Monthly contribution payment records</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Period</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-center">Due Date</TableHead>
                                    <TableHead className="text-center">Payment Date</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Penalty</TableHead>
                                    <TableHead>Reference</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {remittances.map((remittance) => {
                                    const overdue = isOverdue(remittance.due_date, remittance.status);
                                    return (
                                        <TableRow
                                            key={remittance.id}
                                            className={overdue ? "bg-red-50" : ""}
                                        >
                                            <TableCell className="font-medium">{remittance.month}</TableCell>
                                            <TableCell className="text-right font-semibold">
                                                ₱{remittance.remittance_amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-center text-sm">
                                                {new Date(remittance.due_date).toLocaleDateString("en-PH")}
                                            </TableCell>
                                            <TableCell className="text-center text-sm">
                                                {remittance.payment_date
                                                    ? new Date(remittance.payment_date).toLocaleDateString("en-PH")
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={getStatusColor(remittance.status)}>
                                                    <span className="flex items-center gap-1">
                                                        {getStatusIcon(remittance.status)}
                                                        {remittance.status.replace(/_/g, " ").charAt(0).toUpperCase() +
                                                            remittance.status.slice(1).replace(/_/g, " ")}
                                                    </span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {remittance.has_penalty ? (
                                                    <span className="text-red-600 font-semibold">
                                                        ₱{remittance.penalty_amount.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs font-mono">
                                                {remittance.payment_reference || "-"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer Summary */}
                    <div className="mt-6 pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Total Remittances:</span>
                            <span className="font-semibold">₱{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Paid Amount:</span>
                            <span className="font-semibold text-green-600">₱{totalPaid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Outstanding Amount:</span>
                            <span className="font-semibold text-blue-600">
                                ₱{(totalAmount - totalPaid).toFixed(2)}
                            </span>
                        </div>
                        {totalPenalties > 0 && (
                            <div className="flex justify-between text-sm border-t pt-2">
                                <span>Total Penalties:</span>
                                <span className="font-semibold text-red-600">₱{totalPenalties.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-sm">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Due Date:</p>
                            <p className="text-muted-foreground text-xs">10th of following month</p>
                        </div>
                        <div>
                            <p className="font-medium">Late Payment Penalty:</p>
                            <p className="text-muted-foreground text-xs">5% of remittance amount per month</p>
                        </div>
                        <div>
                            <p className="font-medium">Remittance Method:</p>
                            <p className="text-muted-foreground text-xs">Via Pag-IBIG eSRS portal or authorized banks</p>
                        </div>
                        <div>
                            <p className="font-medium">Required Documents:</p>
                            <p className="text-muted-foreground text-xs">MCRF report with supporting documentation</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
