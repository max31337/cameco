import { type CriticalAlert } from '@/types/payroll-pages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertCircle,
    XCircle,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react';

interface CriticalAlertsPanelProps {
    alerts: CriticalAlert[];
}

const getSeverityColor = (severity: CriticalAlert['severity']) => {
    switch (severity) {
        case 'critical':
            return 'border-red-200 bg-red-50';
        case 'warning':
            return 'border-yellow-200 bg-yellow-50';
        case 'info':
            return 'border-blue-200 bg-blue-50';
        default:
            return 'border-gray-200 bg-gray-50';
    }
};

const getSeverityBadgeColor = (severity: CriticalAlert['severity']) => {
    switch (severity) {
        case 'critical':
            return 'bg-red-100 text-red-800';
        case 'warning':
            return 'bg-yellow-100 text-yellow-800';
        case 'info':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getSeverityIcon = (severity: CriticalAlert['severity']) => {
    switch (severity) {
        case 'critical':
            return <XCircle className="h-5 w-5 text-red-600" />;
        case 'warning':
            return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
        case 'info':
            return <AlertCircle className="h-5 w-5 text-blue-600" />;
        default:
            return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
};

export function CriticalAlertsPanel({ alerts }: CriticalAlertsPanelProps) {
    if (alerts.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Critical Alerts</CardTitle>
                    <CardDescription>System alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <p className="text-sm font-medium text-green-700">No alerts at this time</p>
                        <p className="text-xs text-muted-foreground">All systems operating normally</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Critical Alerts</CardTitle>
                <CardDescription>{alerts.length} alert(s) requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {alerts.map((alert) => {
                    return (
                        <div
                            key={alert.id}
                            className={`border rounded-lg p-4 space-y-2 ${getSeverityColor(alert.severity)}`}
                        >
                            {/* Header: Title and Severity Badge */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="mt-0.5 flex-shrink-0">
                                        {getSeverityIcon(alert.severity)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                                        <Badge
                                            variant="outline"
                                            className={`mt-1 text-xs ${getSeverityBadgeColor(alert.severity)}`}
                                        >
                                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <p className="text-sm leading-relaxed">{alert.message}</p>

                            {/* Metadata Grid */}
                            {alert.metadata && (
                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                    {alert.metadata.formatted_amount && (
                                        <div>
                                            <span className="text-muted-foreground">Amount: </span>
                                            <span className="font-medium">{alert.metadata.formatted_amount}</span>
                                        </div>
                                    )}
                                    {alert.metadata.deadline && (
                                        <div>
                                            <span className="text-muted-foreground">Deadline: </span>
                                            <span className="font-medium">
                                                {new Date(alert.metadata.deadline).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    )}
                                    {alert.metadata.days_overdue !== undefined && alert.metadata.days_overdue > 0 && (
                                        <div>
                                            <span className="text-red-600 font-medium">
                                                {alert.metadata.days_overdue} days overdue
                                            </span>
                                        </div>
                                    )}
                                    {alert.metadata.days_until_due !== undefined && alert.metadata.days_until_due > 0 && (
                                        <div>
                                            <span className="text-muted-foreground">Due in: </span>
                                            <span className="font-medium">{alert.metadata.days_until_due} days</span>
                                        </div>
                                    )}
                                    {alert.metadata.affected_employees && (
                                        <div>
                                            <span className="text-muted-foreground">Employees: </span>
                                            <span className="font-medium">{alert.metadata.affected_employees}</span>
                                        </div>
                                    )}
                                    {alert.metadata.variance_percentage && (
                                        <div>
                                            <span className="text-muted-foreground">Variance: </span>
                                            <span className="font-medium text-yellow-600">
                                                {alert.metadata.variance_percentage}
                                            </span>
                                        </div>
                                    )}
                                    {alert.metadata.agency && (
                                        <div>
                                            <span className="text-muted-foreground">Agency: </span>
                                            <span className="font-medium">{alert.metadata.agency}</span>
                                        </div>
                                    )}
                                    {alert.metadata.period && (
                                        <div>
                                            <span className="text-muted-foreground">Period: </span>
                                            <span className="font-medium">{alert.metadata.period}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                {alert.action && alert.action_url && (
                                    <Button size="sm" variant="default" className="text-xs">
                                        {alert.action}
                                    </Button>
                                )}
                                {alert.can_dismiss && (
                                    <Button size="sm" variant="outline" className="text-xs">
                                        Dismiss
                                    </Button>
                                )}
                                <Button size="sm" variant="ghost" className="text-xs">
                                    Details
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
