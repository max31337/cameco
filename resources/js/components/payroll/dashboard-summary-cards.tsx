import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    Calendar, 
    Users, 
    DollarSign, 
    AlertCircle,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import type { DashboardSummary } from '@/types/payroll-pages';
import { Link } from '@inertiajs/react';

interface DashboardSummaryCardsProps {
    summary: DashboardSummary;
}

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
    const { current_period, total_employees, net_payroll, pending_actions } = summary;

    // Determine status badge color
    const getStatusBadgeVariant = (color: string) => {
        switch (color) {
            case 'blue':
                return 'default';
            case 'yellow':
                return 'warning';
            case 'green':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Current Period Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Period</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">{current_period.name}</div>
                            <Badge variant={getStatusBadgeVariant(current_period.status_color)}>
                                {current_period.status_label}
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {new Date(current_period.start_date).toLocaleDateString()} - {new Date(current_period.end_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                <Users className="mr-1 inline h-3 w-3" />
                                {current_period.total_employees} employees
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{current_period.progress_percentage}%</span>
                            </div>
                            <Progress value={current_period.progress_percentage} className="h-2" />
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">
                            Pay date in {current_period.days_until_pay} days
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total Employees Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="text-2xl font-bold">{total_employees.active}</div>
                        <div className="flex items-center gap-2">
                            <Badge variant="success" className="text-xs">
                                +{total_employees.new_hires_this_period} new
                            </Badge>
                            <Badge variant="destructive" className="text-xs">
                                -{total_employees.separations_this_period} sep
                            </Badge>
                        </div>
                        <div className="flex items-center text-xs">
                            <span className="text-muted-foreground mr-2">On leave:</span>
                            <span className="font-medium">{total_employees.on_leave}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            {total_employees.change_from_previous.startsWith('+') ? (
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                            <span className={total_employees.change_from_previous.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                {total_employees.change_percentage}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">vs previous</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Net Payroll Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Payroll</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="text-2xl font-bold">{net_payroll.formatted_current}</div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">vs Previous Period</span>
                                <span className="font-medium">{net_payroll.formatted_previous}</span>
                            </div>
                            <Progress 
                                value={(net_payroll.current_period / net_payroll.previous_period) * 100} 
                                className="h-2"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            {net_payroll.trend === 'up' ? (
                                <>
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">
                                        {net_payroll.percentage_change}
                                    </span>
                                </>
                            ) : net_payroll.trend === 'down' ? (
                                <>
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-600">
                                        {net_payroll.percentage_change}
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm font-medium text-gray-600">
                                    {net_payroll.percentage_change}
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground ml-1">change</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Difference: ₱{net_payroll.difference.toLocaleString()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Actions Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="text-2xl font-bold">{pending_actions.total}</div>
                        <div className="space-y-2 text-xs">
                            {pending_actions.periods_to_calculate > 0 && (
                                <Link 
                                    href="/payroll/periods?filter=to_calculate"
                                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                >
                                    <span className="text-muted-foreground">To Calculate</span>
                                    <Badge variant="secondary" className="ml-auto">
                                        {pending_actions.periods_to_calculate}
                                    </Badge>
                                </Link>
                            )}
                            {pending_actions.periods_to_review > 0 && (
                                <Link 
                                    href="/payroll/periods?filter=to_review"
                                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                >
                                    <span className="text-muted-foreground">To Review</span>
                                    <Badge variant="secondary" className="ml-auto">
                                        {pending_actions.periods_to_review}
                                    </Badge>
                                </Link>
                            )}
                            {pending_actions.periods_to_approve > 0 && (
                                <Link 
                                    href="/payroll/periods?filter=to_approve"
                                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                >
                                    <span className="text-muted-foreground">To Approve</span>
                                    <Badge variant="secondary" className="ml-auto">
                                        {pending_actions.periods_to_approve}
                                    </Badge>
                                </Link>
                            )}
                            {pending_actions.adjustments_pending > 0 && (
                                <Link 
                                    href="/payroll/adjustments?filter=pending"
                                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                >
                                    <span className="text-muted-foreground">Adjustments Pending</span>
                                    <Badge variant="secondary" className="ml-auto">
                                        {pending_actions.adjustments_pending}
                                    </Badge>
                                </Link>
                            )}
                            {pending_actions.government_reports_due > 0 && (
                                <Link 
                                    href="/payroll/government/reports?filter=due"
                                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                >
                                    <span className="text-muted-foreground">Gov Reports Due</span>
                                    <Badge variant="destructive" className="ml-auto">
                                        {pending_actions.government_reports_due}
                                    </Badge>
                                </Link>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
