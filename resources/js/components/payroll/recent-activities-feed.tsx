import { type RecentActivity } from '@/types/payroll-pages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Calculator,
    Edit,
    FileText,
    CheckCircle,
    Upload,
    Printer,
    CreditCard,
    Settings,
    AlertCircle,
    type LucideIcon,
} from 'lucide-react';

interface RecentActivitiesFeedProps {
    activities: RecentActivity[];
}

const iconMap: Record<string, LucideIcon> = {
    calculator: Calculator,
    edit: Edit,
    'file-text': FileText,
    'check-circle': CheckCircle,
    upload: Upload,
    printer: Printer,
    'credit-card': CreditCard,
    settings: Settings,
    'alert-circle': AlertCircle,
};

const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600',
};

export function RecentActivitiesFeed({ activities }: RecentActivitiesFeedProps) {
    if (activities.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Timeline of recent payroll actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        <p>No recent activities.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Timeline of recent payroll actions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, index) => {
                        const Icon = iconMap[activity.icon] || AlertCircle;
                        const colorClass = colorClasses[activity.icon_color] || colorClasses.gray;

                        return (
                            <div key={activity.id} className="flex gap-4">
                                {/* Timeline line and icon */}
                                <div className="flex flex-col items-center">
                                    <div className={`rounded-full p-2 ${colorClass}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    {index !== activities.length - 1 && (
                                        <div className="mt-2 h-8 w-0.5 bg-gray-200" />
                                    )}
                                </div>

                                {/* Activity content */}
                                <div className="flex-1 pb-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{activity.title}</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {activity.description}
                                            </p>

                                            {/* User and time info */}
                                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                <span className="font-medium">{activity.user_name}</span>
                                                {activity.user_role && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{activity.user_role}</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Timestamp */}
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {activity.relative_time}
                                            </div>

                                            {/* Metadata details if present */}
                                            {activity.metadata && (
                                                <div className="mt-3 p-2 bg-gray-50 rounded text-xs space-y-1">
                                                    {activity.metadata.period_name && (
                                                        <div>
                                                            <span className="text-muted-foreground">Period: </span>
                                                            <span className="font-medium">{activity.metadata.period_name}</span>
                                                        </div>
                                                    )}
                                                    {activity.metadata.employee_count && (
                                                        <div>
                                                            <span className="text-muted-foreground">Employees: </span>
                                                            <span className="font-medium">{activity.metadata.employee_count}</span>
                                                        </div>
                                                    )}
                                                    {activity.metadata.formatted_amount && (
                                                        <div>
                                                            <span className="text-muted-foreground">Amount: </span>
                                                            <span className="font-medium">{activity.metadata.formatted_amount}</span>
                                                        </div>
                                                    )}
                                                    {activity.metadata.report_type && (
                                                        <div>
                                                            <span className="text-muted-foreground">Report Type: </span>
                                                            <span className="font-medium">{activity.metadata.report_type}</span>
                                                        </div>
                                                    )}
                                                    {activity.metadata.file_name && (
                                                        <div>
                                                            <span className="text-muted-foreground">File: </span>
                                                            <span className="font-medium truncate">{activity.metadata.file_name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
