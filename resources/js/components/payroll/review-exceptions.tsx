import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PayrollException } from '@/types/payroll-review-types';
import { AlertCircle, AlertTriangle, Info, TrendingDown, TrendingUp, Zap } from 'lucide-react';

interface ReviewExceptionsProps {
    exceptions: PayrollException[];
}

export function ReviewExceptions({ exceptions }: ReviewExceptionsProps) {
    const getIconForType = (type: string) => {
        switch (type) {
            case 'zero_net_pay':
                return <AlertTriangle className="h-5 w-5 text-red-600" />;
            case 'negative_net_pay':
                return <Zap className="h-5 w-5 text-red-600" />;
            case 'high_variance':
                return <TrendingDown className="h-5 w-5 text-yellow-600" />;
            case 'new_hire':
            case 'resign':
                return <Info className="h-5 w-5 text-blue-600" />;
            case 'tax_anomaly':
                return <TrendingUp className="h-5 w-5 text-orange-600" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-600" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getBadgeVariant = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'destructive';
            case 'warning':
                return 'default';
            default:
                return 'secondary';
        }
    };

    // Group exceptions by severity
    const groupedByType = exceptions.reduce((acc, exc) => {
        if (!acc[exc.type]) acc[exc.type] = [];
        acc[exc.type].push(exc);
        return acc;
    }, {} as Record<string, PayrollException[]>);

    return (
        <div className="space-y-4">
            {Object.entries(groupedByType).map(([type, items]) => (
                <div key={type} className="space-y-2">
                    <h3 className="text-sm font-semibold capitalize text-gray-900">
                        {type.replace(/_/g, ' ')} ({items.length})
                    </h3>
                    <div className="space-y-2">
                        {items.map((exception) => (
                            <Card
                                key={exception.id}
                                className={`border p-4 ${getSeverityColor(exception.severity)}`}
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">{getIconForType(exception.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900">{exception.title}</h4>
                                                    <Badge variant={getBadgeVariant(exception.severity)}>
                                                        {exception.severity}
                                                    </Badge>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-700">{exception.description}</p>
                                                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                                                    <span className="text-gray-600">
                                                        <strong>Employee:</strong> {exception.employee_name} (
                                                        {exception.employee_number})
                                                    </span>
                                                    <span className="text-gray-600">
                                                        <strong>Department:</strong> {exception.department}
                                                    </span>
                                                    {exception.affected_amount !== undefined && (
                                                        <span className="text-gray-600">
                                                            <strong>Amount:</strong> {exception.formatted_amount}
                                                        </span>
                                                    )}
                                                    {exception.variance_percentage !== undefined && (
                                                        <span className="text-gray-600">
                                                            <strong>Variance:</strong> {exception.variance_percentage}
                                                        </span>
                                                    )}
                                                </div>

                                                {exception.action_required && (
                                                    <div className="mt-3 rounded-lg bg-white/60 p-2 text-xs text-gray-800">
                                                        <strong>Action Required:</strong> {exception.action_description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}

            {exceptions.length === 0 && (
                <Card className="border-green-200 bg-green-50 p-8 text-center">
                    <p className="text-green-800">✓ No exceptions found. Payroll is ready for approval.</p>
                </Card>
            )}
        </div>
    );
}
