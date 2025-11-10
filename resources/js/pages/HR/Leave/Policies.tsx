import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit2, Shield } from 'lucide-react';
import { LeavePoliciesPageProps } from '@/types/hr-pages';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HR', href: '/hr/dashboard' },
    { title: 'Leave Management', href: '#' },
    { title: 'Policies', href: '/hr/leave/policies' },
];

const leaveTypeDescriptions: Record<string, string> = {
    'Vacation Leave': 'Annual leave for vacation and personal time',
    'Sick Leave': 'Leave for illness and medical appointments',
    'Emergency Leave': 'Leave for unexpected emergencies',
    'Maternity Leave': 'Leave for mothers before and after childbirth',
    'Paternity Leave': 'Leave for fathers after childbirth',
    'Privilege Leave': 'Special leave for personal matters',
    'Bereavement Leave': 'Leave for dealing with family deaths',
};

function getLeaveTypeIcon(type: string) {
    const icons: Record<string, React.ReactNode> = {
        'Vacation Leave': <Calendar className="h-5 w-5 text-blue-600" />,
        'Sick Leave': <Shield className="h-5 w-5 text-red-600" />,
        'Emergency Leave': <Shield className="h-5 w-5 text-yellow-600" />,
        'Maternity Leave': <Calendar className="h-5 w-5 text-pink-600" />,
        'Paternity Leave': <Calendar className="h-5 w-5 text-pink-600" />,
        'Privilege Leave': <Calendar className="h-5 w-5 text-green-600" />,
        'Bereavement Leave': <Calendar className="h-5 w-5 text-purple-600" />,
    };
    return icons[type] || <Calendar className="h-5 w-5 text-gray-600" />;
}

export default function LeavePolicies({ policies }: LeavePoliciesPageProps) {
    const policiesData = (Array.isArray(policies) ? policies : (policies as Record<string, unknown>)?.data || []) as Record<string, unknown>[];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave Policies" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Leave Policies</h1>
                        <Button variant="outline">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Policies
                        </Button>
                    </div>
                    <p className="text-muted-foreground">
                        Configure and manage organization-wide leave policies
                    </p>
                </div>

                {/* Leave Policies Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {policiesData && policiesData.length > 0 ? (
                        policiesData.map((policy) => (
                            <Card key={policy.id as React.Key} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            {getLeaveTypeIcon(String(policy.type || ''))}
                                            <div>
                                                <CardTitle className="text-lg">{String(policy.type)}</CardTitle>
                                                <CardDescription className="text-xs mt-1">
                                                    {leaveTypeDescriptions[String(policy.type)] || 'Leave policy'}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Policy Details */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Annual Entitlement</span>
                                            <Badge variant="outline">{Number(policy.annual_entitlement) || 0} days</Badge>
                                        </div>

                                        {policy.max_carry_forward !== null && policy.max_carry_forward !== undefined && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Max Carryover</span>
                                                <Badge variant="outline">{Number(policy.max_carry_forward)} days</Badge>
                                            </div>
                                        )}

                                        {policy.max_consecutive_days !== null && policy.max_consecutive_days !== undefined && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Max Consecutive</span>
                                                <Badge variant="outline">{Number(policy.max_consecutive_days)} days</Badge>
                                            </div>
                                        )}

                                        {policy.requires_approval !== undefined && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Requires Approval</span>
                                                <Badge variant={policy.requires_approval ? 'default' : 'secondary'}>
                                                    {policy.requires_approval ? 'Yes' : 'No'}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Edit2 className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="ghost" className="flex-1">
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <Card>
                                <CardContent className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">No leave policies configured</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Create leave policies to manage organization-wide leave rules
                                    </p>
                                    <Button className="mt-4">
                                        Create Policy
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Standard Leave Types Reference */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Standard Leave Types</CardTitle>
                        <CardDescription>
                            Common leave types used in organizations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="grid gap-3 md:grid-cols-2">
                                {Object.entries(leaveTypeDescriptions).map(([type, description]) => (
                                    <div key={type} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                                        <div>{getLeaveTypeIcon(type)}</div>
                                        <div>
                                            <p className="text-sm font-medium">{type}</p>
                                            <p className="text-xs text-muted-foreground">{description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
