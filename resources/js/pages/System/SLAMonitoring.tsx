import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import SLAWidgets from '@/components/system/sla-widgets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Package, Shield, Calendar, RefreshCw } from 'lucide-react';

interface SLAMetrics {
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
        contract_number?: string;
        contract_status?: string;
        support_level?: string;
        contact_email?: string;
        contact_phone?: string;
        response_time?: string;
        renewal_url?: string | null;
        is_expiring_soon?: boolean;
        is_expired?: boolean;
        source?: string;
    };
}

interface SLAMonitoringProps {
    sla: SLAMetrics;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'System',
        href: '/system/dashboard',
    },
    {
        title: 'SLA Monitoring',
        href: '/system/sla',
    },
];

export default function SLAMonitoring({ sla }: SLAMonitoringProps) {
    const getSupportStatusColor = (daysRemaining: number) => {
        if (daysRemaining > 180) return 'text-green-600';
        if (daysRemaining > 90) return 'text-yellow-600';
        return 'text-red-600';
    };

    const supportStatusColor = getSupportStatusColor(sla.support.days_until_support_end);

    const handleRefresh = () => {
        router.post('/system/sla/cache/clear', {}, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SLA Monitoring" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Service Level Agreement Monitoring</h1>
                        <p className="text-muted-foreground">
                            Monitor Application uptime, incident response, patches, and vendor support contract status
                        </p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Data
                    </Button>
                </div>

                {/* Support Contract Status - Prominent positioning */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Vendor Support Contract
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Primary Contract Info */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Contract Number</p>
                                <p className="text-lg font-semibold font-mono">
                                    {sla.support.contract_number || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Contract Status</p>
                                <div className="flex items-center gap-2">
                                    <Badge 
                                        variant={sla.support.contract_status === 'active' ? 'default' : 'destructive'}
                                        className="font-semibold"
                                    >
                                        {sla.support.contract_status === 'active' ? 'Active' : 'Expired'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Support Level</p>
                                <Badge variant="outline" className="text-sm font-semibold">
                                    {sla.support.support_level?.toUpperCase() || 'BASIC'}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Days Remaining</p>
                                <p className={`text-lg font-semibold ${supportStatusColor}`}>
                                    {sla.support.days_until_support_end} days
                                </p>
                            </div>
                        </div>

                        {/* Support Details */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Support Availability</p>
                                <p className="text-sm font-medium">{sla.support.hours}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Response Time</p>
                                <p className="text-sm font-medium">{sla.support.response_time || 'N/A'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Contract Expires</p>
                                <p className="text-sm font-medium">
                                    {new Date(sla.support.support_end_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <h4 className="text-sm font-semibold mb-3">Support Contact Information</h4>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">Email:</span>
                                    <a 
                                        href={`mailto:${sla.support.contact_email}`} 
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {sla.support.contact_email}
                                    </a>
                                </div>
                                {sla.support.contact_phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Phone:</span>
                                        <a 
                                            href={`tel:${sla.support.contact_phone}`} 
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {sla.support.contact_phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expiration Warning */}
                        {sla.support.days_until_support_end < 90 && (
                            <div className="flex items-center gap-2 rounded-md bg-yellow-50 dark:bg-yellow-950/30 p-3 text-yellow-800 dark:text-yellow-200">
                                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm font-medium">
                                    {sla.support.days_until_support_end < 30
                                        ? 'Critical: Support contract expires soon! Please contact vendor for renewal.'
                                        : 'Warning: Support contract expiring in less than 90 days. Consider renewal planning.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* SLA Metrics Widgets */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">System Metrics</h2>
                    <SLAWidgets sla={sla} />
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            SLA Quick Reference
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="font-semibold">Incident Response SLA</h3>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Critical: 1 hour response
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Major: 4 hours response
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Minor: 24 hours response
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold">Uptime SLA</h3>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Target Uptime: 99.9%
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Max Downtime: 43.2 minutes/month
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
