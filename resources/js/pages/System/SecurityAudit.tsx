import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, Info, Download, User } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface SecurityLog {
    id: number;
    event_type: string;
    severity: string;
    user_id: number | null;
    ip_address: string;
    description: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
    user?: User;
}

interface PaginatedLogs {
    data: SecurityLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Stats {
    critical: number;
    warning: number;
    info: number;
    failed_logins: number;
    total_24h: number;
}

interface Filters {
    severity: string | null;
    event_type: string | null;
    user_id: number | null;
    days: number;
}

interface Props {
    logs: PaginatedLogs;
    stats: Stats;
    eventTypes: string[];
    filters: Filters;
}

export default function SecurityAudit({ logs, stats, eventTypes, filters }: Props) {
    const handleFilterChange = (key: string, value: string | number) => {
        const newFilters = { ...filters, [key]: value };
        router.get('/system/security/audit', newFilters, { preserveState: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        params.append('start_date', new Date(Date.now() - filters.days * 24 * 60 * 60 * 1000).toISOString());
        params.append('end_date', new Date().toISOString());
        if (filters.severity) params.append('severity', filters.severity);

        window.location.href = `/system/security/audit/export?${params.toString()}`;
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'critical':
                return (
                    <Badge className="bg-red-500">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Critical
                    </Badge>
                );
            case 'warning':
                return (
                    <Badge className="bg-yellow-500">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Warning
                    </Badge>
                );
            case 'info':
                return (
                    <Badge className="bg-blue-500">
                        <Info className="h-3 w-3 mr-1" />
                        Info
                    </Badge>
                );
            default:
                return <Badge>{severity}</Badge>;
        }
    };

    const getEventIcon = (eventType: string) => {
        if (eventType.includes('login')) return <User className="h-4 w-4" />;
        if (eventType.includes('security')) return <Shield className="h-4 w-4" />;
        return <Info className="h-4 w-4" />;
    };

    return (
        <AppLayout>
            <Head title="Security Audit Logs" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">Security Audit Logs</h1>
                        <p className="text-muted-foreground">Monitor security events and user activity</p>
                    </div>
                    <Button onClick={handleExport} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export to CSV
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid gap-6 md:grid-cols-5">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
                            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
                            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Info Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
                            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.failed_logins}</div>
                            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_24h}</div>
                            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 flex-wrap">
                            <Select
                                value={filters.severity || 'all'}
                                onValueChange={(value) => handleFilterChange('severity', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Severities</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.event_type || 'all'}
                                onValueChange={(value) => handleFilterChange('event_type', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="w-[220px]">
                                    <SelectValue placeholder="Filter by event type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Event Types</SelectItem>
                                    {eventTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.days.toString()}
                                onValueChange={(value) => handleFilterChange('days', parseInt(value))}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Time period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Last 24 hours</SelectItem>
                                    <SelectItem value="7">Last 7 days</SelectItem>
                                    <SelectItem value="30">Last 30 days</SelectItem>
                                    <SelectItem value="90">Last 90 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Audit Logs</CardTitle>
                        <CardDescription>
                            Showing {logs.data.length} of {logs.total} events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {logs.data.map((log) => (
                                <div key={log.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3">
                                                {getEventIcon(log.event_type)}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-medium">{log.event_type}</p>
                                                        {getSeverityBadge(log.severity)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{log.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-muted-foreground ml-7">
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {log.user?.name || 'System'}
                                                </span>
                                                <span>•</span>
                                                <span>IP: {log.ip_address}</span>
                                                <span>•</span>
                                                <span>{new Date(log.created_at).toLocaleString()}</span>
                                            </div>

                                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                <details className="ml-7 text-xs">
                                                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                                        View metadata
                                                    </summary>
                                                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                                                        {JSON.stringify(log.metadata, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {logs.data.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No security events found for the selected filters</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {logs.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Page {logs.current_page} of {logs.last_page}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={logs.current_page === 1}
                                        onClick={() =>
                                            router.get('/system/security/audit', {
                                                page: logs.current_page - 1,
                                                severity: filters.severity || undefined,
                                                event_type: filters.event_type || undefined,
                                                days: filters.days,
                                            })
                                        }
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={logs.current_page === logs.last_page}
                                        onClick={() =>
                                            router.get('/system/security/audit', {
                                                page: logs.current_page + 1,
                                                severity: filters.severity || undefined,
                                                event_type: filters.event_type || undefined,
                                                days: filters.days,
                                            })
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
