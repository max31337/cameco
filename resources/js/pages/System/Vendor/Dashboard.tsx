import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SLAWidgets from '@/components/sla-widgets';
import { Activity, Shield, Users, TrendingUp } from 'lucide-react';

interface VendorDashboardProps {
    sla: {
        uptime: {
            current_uptime_hours: number;
            uptime_percentage: number;
            last_downtime: string | null;
            total_downtime_hours_this_month: number;
        };
        incidents: {
            open_critical: number;
            open_major: number;
            open_minor: number;
            avg_response_time_critical: string;
            avg_resolution_time_critical: string;
            incidents_this_month: number;
        };
        patches: {
            current_version: string;
            latest_patch_date: string;
            pending_patches: number;
            next_scheduled_patch: string;
        };
        support: {
            status: 'available' | 'offline';
            hours: string;
            days_until_support_end: number;
            support_end_date: string;
        };
    };
    vendor: {
        name: string;
        email: string;
    };
}

export default function VendorDashboard({ sla, vendor }: VendorDashboardProps) {
    return (
        <AppLayout>
            <Head title="Vendor SLA Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 bg-gradient-to-br from-background to-muted/20">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Activity className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Vendor SLA Dashboard</h1>
                                <p className="text-muted-foreground">
                                    Real-time service level agreement monitoring
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Vendor Info Card */}
                    <Card className="w-full md:w-fit border-2 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <CardDescription>Vendor Account</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">{vendor.name}</CardTitle>
                                <Badge variant="outline" className="text-xs">
                                    {sla.support.status === 'available' ? (
                                        <span className="flex items-center gap-1">
                                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                            Online
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <span className="h-2 w-2 rounded-full bg-gray-400" />
                                            Offline
                                        </span>
                                    )}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{vendor.email}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats Bar */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                System Uptime
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{sla.uptime.uptime_percentage}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {sla.uptime.current_uptime_hours.toFixed(0)} hours uptime
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Open Incidents
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {sla.incidents.open_critical + sla.incidents.open_major + sla.incidents.open_minor}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {sla.incidents.incidents_this_month} this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Current Version
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{sla.patches.current_version}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {sla.patches.pending_patches} pending patches
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Support Status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold capitalize">{sla.support.status}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {sla.support.hours}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* SLA Metrics Widgets */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Service Level Metrics</h2>
                    </div>
                    <SLAWidgets sla={sla} />
                </div>

                {/* Additional Information Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                What is Tracked?
                            </CardTitle>
                            <CardDescription>
                                Comprehensive monitoring of vendor services
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                                    <div>
                                        <p className="font-medium text-sm">System Uptime & Availability</p>
                                        <p className="text-xs text-muted-foreground">Real-time monitoring of service availability metrics</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="font-medium text-sm">Incident Response Times</p>
                                        <p className="text-xs text-muted-foreground">Track support ticket response and resolution</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                                    <div>
                                        <p className="font-medium text-sm">Patch Deployment</p>
                                        <p className="text-xs text-muted-foreground">Monitor patch schedules and deployment status</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-orange-500" />
                                    <div>
                                        <p className="font-medium text-sm">Support Contract</p>
                                        <p className="text-xs text-muted-foreground">Vendor support hours and contract information</p>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Support Information
                            </CardTitle>
                            <CardDescription>
                                Get help when you need it
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <p className="font-semibold text-sm mb-2">Business Hours</p>
                                <p className="text-sm text-muted-foreground">{sla.support.hours}</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <Badge variant={sla.support.status === 'available' ? 'default' : 'secondary'}>
                                        {sla.support.status === 'available' ? 'Available Now' : 'Currently Offline'}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <p className="font-semibold text-sm mb-2">Support Contract</p>
                                <p className="text-sm text-muted-foreground">
                                    {sla.support.days_until_support_end} days remaining
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Valid until {new Date(sla.support.support_end_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <p className="text-xs font-medium text-primary mb-1">Need Urgent Help?</p>
                                <p className="text-xs text-muted-foreground">
                                    For critical issues during business hours, contact support immediately for priority assistance.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
