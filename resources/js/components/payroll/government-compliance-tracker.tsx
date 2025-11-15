import { type GovernmentComplianceData } from '@/types/payroll-pages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface GovernmentComplianceTrackerProps {
    data: GovernmentComplianceData;
}

export function GovernmentComplianceTracker({ data }: GovernmentComplianceTrackerProps) {
    // Filter out undefined agencies and create agency array with null checks
    const agencies = [
        data.sss && { key: 'sss', ...data.sss },
        data.philhealth && { key: 'philhealth', ...data.philhealth },
        data.pagibig && { key: 'pagibig', ...data.pagibig },
        data.bir && { key: 'bir', ...data.bir },
    ].filter(Boolean);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            case 'overdue':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            case 'calculating':
                return <TrendingUp className="h-5 w-5 text-blue-600" />;
            default:
                return <FileText className="h-5 w-5 text-gray-600" />;
        }
    };

    const getDaysUntilDeadline = (deadline: string | null | undefined): number => {
        if (!deadline) return 0; // Return 0 if no deadline
        const today = new Date();
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) return 0; // Handle invalid dates
        const diffTime = deadlineDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getComplianceIcon = (score: number) => {
        if (score >= 95) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        if (score >= 80) return <Clock className="h-4 w-4 text-yellow-600" />;
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Government Compliance Tracker</CardTitle>
                <CardDescription>SSS, PhilHealth, Pag-IBIG, and BIR remittance status and compliance tracking</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agencies.map((agency) => {
                        const daysLeft = getDaysUntilDeadline(agency.compliance_deadline);
                        const isOverdue = daysLeft < 0;

                        return (
                            <div
                                key={agency.key}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow space-y-3"
                            >
                                {/* Header: Agency Name and Status Icon */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-base">{agency.name}</h3>
                                        <p className="text-xs text-muted-foreground">{agency.full_name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{agency.period}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {getStatusIcon(agency.status)}
                                        <span className="text-xs font-semibold text-right">
                                            {agency.status_label}
                                        </span>
                                    </div>
                                </div>

                                {/* Amount Information */}
                                <div className="space-y-2 border-t pt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Remittance:</span>
                                        <span className="font-semibold">{agency.formatted_amount || '₱0.00'}</span>
                                    </div>

                                    {/* Breakdown if available */}
                                    {(agency.employee_share || agency.employer_share) && (
                                        <div className="ml-4 text-xs text-muted-foreground space-y-1">
                                            {agency.employee_share && (
                                                <div className="flex justify-between">
                                                    <span>Employee:</span>
                                                    <span>
                                                        ₱
                                                        {agency.employee_share.toLocaleString('en-PH', {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                            {agency.employer_share && (
                                                <div className="flex justify-between">
                                                    <span>Employer:</span>
                                                    <span>
                                                        ₱
                                                        {agency.employer_share.toLocaleString('en-PH', {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Deadline and Days Tracking */}
                                <div className="space-y-2 border-t pt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Deadline:</span>
                                        <span className="text-sm font-medium">
                                            {agency.compliance_deadline
                                                ? new Date(agency.compliance_deadline).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })
                                                : 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Days:</span>
                                        <span
                                            className={`text-sm font-semibold ${
                                                daysLeft === 0 && !agency.compliance_deadline
                                                    ? 'text-gray-600'
                                                    : isOverdue
                                                        ? 'text-red-600'
                                                        : 'text-green-600'
                                            }`}
                                        >
                                            {!agency.compliance_deadline
                                                ? 'No deadline'
                                                : isOverdue
                                                    ? `${Math.abs(daysLeft)} days overdue`
                                                    : `${daysLeft} days remaining`}
                                        </span>
                                    </div>
                                </div>

                                {/* Report Status */}
                                <div className="border-t pt-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Report ({agency.report_type || 'N/A'}):</span>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                                agency.report_status === 'filed'
                                                    ? 'bg-green-50 text-green-700'
                                                    : agency.report_status === 'generated'
                                                      ? 'bg-blue-50 text-blue-700'
                                                      : 'bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            {agency.report_status
                                                ? agency.report_status.charAt(0).toUpperCase() +
                                                  agency.report_status.slice(1)
                                                : 'Not Generated'}
                                        </Badge>
                                    </div>

                                    {/* Payment info if paid */}
                                    {agency.status === 'paid' && agency.payment_reference && (
                                        <div className="text-xs">
                                            <span className="text-muted-foreground">Ref: </span>
                                            <span className="font-mono">{agency.payment_reference}</span>
                                        </div>
                                    )}

                                    {/* Compliance Score */}
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-sm text-muted-foreground">Compliance:</span>
                                        <div className="flex items-center gap-1">
                                            {getComplianceIcon(agency.compliance_score ?? 0)}
                                            <span className="text-sm font-semibold">{agency.compliance_score ?? 0}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-3 border-t">
                                    {agency.actions && agency.actions.length > 0 ? (
                                        agency.actions.slice(0, 2).map((action, idx) => (
                                            <Button
                                                key={idx}
                                                size="sm"
                                                variant={idx === 0 ? 'default' : 'outline'}
                                                className="text-xs flex-1"
                                            >
                                                {action.replace(/_/g, ' ')}
                                            </Button>
                                        ))
                                    ) : (
                                        <Button size="sm" variant="outline" className="text-xs w-full">
                                            View Details
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Compliance Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Consecutive On-Time Summary */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-green-900">Compliance Trend</p>
                                <p className="text-xs text-green-700">
                                    Consecutive on-time payments recorded across all agencies
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Remittance Reminder */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-blue-900">Reminder</p>
                                <p className="text-xs text-blue-700">
                                    Ensure timely submission to avoid penalties and compliance issues
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
