import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Database, HardDrive, Shield, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ServerMetrics {
    cpu_usage: number;
    memory_usage: number;
    load_average: string | null;
    uptime: number;
    uptime_formatted: string;
    status: 'healthy' | 'warning' | 'critical';
}

interface StorageMetrics {
    usage_percentage: number;
    used_formatted: string;
    total_formatted: string;
    free_formatted: string;
    status: 'healthy' | 'warning' | 'critical';
}

interface BackupSummary {
    latest_backup: {
        backup_type: string;
        status: string;
        created_at: string;
        completed_at?: string;
        size_bytes?: number;
    } | null;
    success_rate: number;
    status: 'healthy' | 'warning' | 'critical';
}

interface SecurityOverview {
    critical_events_24h: number;
    failed_logins_24h: number;
    status: 'healthy' | 'warning' | 'critical';
}

interface SystemHealthData {
    server: ServerMetrics;
    storage: StorageMetrics;
    backup: BackupSummary;
    security: SecurityOverview;
    overall_status: 'healthy' | 'warning' | 'critical';
}

interface SystemHealthWidgetsProps {
    health: SystemHealthData;
}

const getStatusTextColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
        case 'healthy': return 'text-green-600 dark:text-green-400';
        case 'warning': return 'text-yellow-600 dark:text-yellow-400';
        case 'critical': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
    }
};

const getStatusBadgeVariant = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
        case 'healthy': return 'default';
        case 'warning': return 'secondary';
        case 'critical': return 'destructive';
        default: return 'outline';
    }
};

export function ServerHealthCard({ server }: { server: ServerMetrics }) {
    return (
        <Card className="border-l-4 cursor-pointer hover:shadow-lg transition-shadow" style={{ borderLeftColor: server.cpu_usage > 70 ? '#EF4444' : '#10B981' }}>
            <Link href="/system/health" className="flex flex-col h-full">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">Server Health</CardTitle>
                        </div>
                        <Badge variant={getStatusBadgeVariant(server.status)}>
                            {server.status}
                        </Badge>
                    </div>
                    <CardDescription>System resources monitoring</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">CPU Usage</span>
                        <span className={`font-semibold ${server.cpu_usage > 70 ? 'text-red-600' : 'text-green-600'}`}>
                            {server.cpu_usage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Memory Usage</span>
                        <span className={`font-semibold ${server.memory_usage > 75 ? 'text-red-600' : 'text-green-600'}`}>
                            {server.memory_usage.toFixed(1)}%
                        </span>
                    </div>
                    {server.load_average && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Load Average</span>
                            <span className="font-mono text-sm">{server.load_average}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Uptime</span>
                        </div>
                        <span className="font-medium text-sm">{server.uptime_formatted}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs text-primary pt-3 mt-auto">
                        <span>View Details</span>
                        <ArrowRight className="h-3 w-3" />
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}

export function StorageHealthCard({ storage }: { storage: StorageMetrics }) {
    const progressColor = storage.usage_percentage > 90 ? 'bg-red-500' : 
                          storage.usage_percentage > 80 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <Card className="border-l-4 cursor-pointer hover:shadow-lg transition-shadow" style={{ borderLeftColor: storage.usage_percentage > 80 ? '#EF4444' : '#10B981' }}>
            <Link href="/system/storage" className="flex flex-col h-full">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">Storage</CardTitle>
                        </div>
                        <Badge variant={getStatusBadgeVariant(storage.status)}>
                            {storage.status}
                        </Badge>
                    </div>
                    <CardDescription>Disk space utilization</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Disk Usage</span>
                            <span className={`font-semibold ${getStatusTextColor(storage.status)}`}>
                                {storage.usage_percentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                                className={`${progressColor} h-2 rounded-full transition-all`}
                                style={{ width: `${storage.usage_percentage}%` }}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                            <p className="text-xs text-muted-foreground">Used</p>
                            <p className="font-semibold text-sm">{storage.used_formatted}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Free</p>
                            <p className="font-semibold text-sm">{storage.free_formatted}</p>
                        </div>
                    </div>
                    <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Total Capacity</p>
                        <p className="font-medium text-sm">{storage.total_formatted}</p>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs text-primary pt-3 mt-auto">
                        <span>View Details</span>
                        <ArrowRight className="h-3 w-3" />
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}

export function BackupStatusCard({ backup }: { backup: BackupSummary }) {
    const latestBackup = backup.latest_backup;

    return (
        <Card className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-lg transition-shadow">
            <Link href="/system/backups" className="flex flex-col h-full">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">Backups</CardTitle>
                        </div>
                        <Badge variant={getStatusBadgeVariant(backup.status)}>
                            {backup.success_rate.toFixed(0)}% success
                        </Badge>
                    </div>
                    <CardDescription>Backup system status</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-3">
                    {latestBackup ? (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Last Backup</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(latestBackup.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Type</span>
                                <Badge variant="outline" className="capitalize">
                                    {latestBackup.backup_type}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <div className="flex items-center gap-1">
                                    {latestBackup.status === 'completed' ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    )}
                                    <span className="text-sm capitalize">{latestBackup.status}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground">No backups found</p>
                        </div>
                    )}
                    <div className="flex items-center justify-end gap-1 text-xs text-primary pt-3 mt-auto">
                        <span>View All Backups</span>
                        <ArrowRight className="h-3 w-3" />
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}

export function SecurityAuditCard({ security }: { security: SecurityOverview }) {
    return (
        <Card className="border-l-4 cursor-pointer hover:shadow-lg transition-shadow" style={{ borderLeftColor: security.status === 'critical' ? '#EF4444' : security.status === 'warning' ? '#F59E0B' : '#10B981' }}>
            <Link href="/system/security/audit" className="flex flex-col h-full">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">Security</CardTitle>
                        </div>
                        <Badge variant={getStatusBadgeVariant(security.status)}>
                            {security.status}
                        </Badge>
                    </div>
                    <CardDescription>24-hour security overview</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Critical Events</span>
                        <span className={`font-semibold ${security.critical_events_24h > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {security.critical_events_24h}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Failed Logins</span>
                        <span className={`font-semibold ${security.failed_logins_24h > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {security.failed_logins_24h}
                        </span>
                    </div>
                    <div className="pt-2 border-t">
                        {security.critical_events_24h === 0 && security.failed_logins_24h < 5 ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-sm">No security concerns</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-yellow-600">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-sm">Review security logs</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs text-primary pt-3 mt-auto">
                        <span>View Audit Logs</span>
                        <ArrowRight className="h-3 w-3" />
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}

export function SystemHealthWidgets({ health }: SystemHealthWidgetsProps) {
    if (!health) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Loading health metrics...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Overall Status Banner */}
            <Card className={`border-l-4 ${
                health.overall_status === 'healthy' ? 'border-l-green-500' :
                health.overall_status === 'warning' ? 'border-l-yellow-500' :
                'border-l-red-500'
            }`}>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity className="h-6 w-6 text-primary" />
                            <div>
                                <h3 className="font-semibold">System Status</h3>
                                <p className="text-sm text-muted-foreground">Overall health monitoring</p>
                            </div>
                        </div>
                        <Badge 
                            variant={getStatusBadgeVariant(health.overall_status)}
                            className="text-lg px-4 py-1"
                        >
                            {health.overall_status.toUpperCase()}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Health Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <ServerHealthCard server={health.server} />
                <StorageHealthCard storage={health.storage} />
                <BackupStatusCard backup={health.backup} />
                <SecurityAuditCard security={health.security} />
            </div>
        </div>
    );
}
