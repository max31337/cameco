import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Clock, Package, Shield } from 'lucide-react';

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
    };
}

interface SLAWidgetsProps {
    sla: SLAMetrics;
}

export default function SLAWidgets({ sla }: SLAWidgetsProps) {
    // Calculate uptime status color
    const getUptimeStatus = (percentage: number) => {
        if (percentage >= 99.9) return { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' };
        if (percentage >= 99) return { color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/30' };
        return { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' };
    };

    const uptimeStatus = getUptimeStatus(sla.uptime.uptime_percentage);

    // Calculate total open incidents
    const totalOpenIncidents = sla.incidents.open_critical + sla.incidents.open_major + sla.incidents.open_minor;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* System Uptime Card */}
            <Card className={`transition-shadow hover:shadow-md ${uptimeStatus.bg}`}>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Application Uptime</CardTitle>
                        <CheckCircle className={`h-4 w-4 ${uptimeStatus.color}`} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className={`text-3xl font-bold ${uptimeStatus.color}`}>
                        {sla.uptime.uptime_percentage}%
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {sla.uptime.current_uptime_hours} hours continuous
                    </p>
                    <Progress 
                        value={sla.uptime.uptime_percentage} 
                        className="mt-3 h-2" 
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Target: 99.9%</span>
                        <span>{sla.uptime.total_downtime_hours_this_month}h downtime</span>
                    </div>
                </CardContent>
            </Card>

            {/* Open Incidents Card */}
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">
                        {totalOpenIncidents}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {sla.incidents.incidents_this_month} total this month
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge 
                            variant={sla.incidents.open_critical > 0 ? 'destructive' : 'secondary'}
                            className="text-xs"
                        >
                            {sla.incidents.open_critical} Critical
                        </Badge>
                        <Badge 
                            variant={sla.incidents.open_major > 0 ? 'outline' : 'secondary'}
                            className={sla.incidents.open_major > 0 ? 'border-amber-500 text-amber-700 dark:text-amber-400' : ''}
                        >
                            {sla.incidents.open_major} Major
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            {sla.incidents.open_minor} Minor
                        </Badge>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                        <div>Avg response: {sla.incidents.avg_response_time_critical}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Patch Status Card */}
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Patch Status</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                        v{sla.patches.current_version}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Current version
                    </p>

                    <div className="mt-3">
                        {sla.patches.pending_patches === 0 ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                All patches applied
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400">
                                <Clock className="mr-1 h-3 w-3" />
                                {sla.patches.pending_patches} pending
                            </Badge>
                        )}
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                        <div>Last patch: {new Date(sla.patches.latest_patch_date).toLocaleDateString()}</div>
                        <div>Next patch: {new Date(sla.patches.next_scheduled_patch).toLocaleDateString()}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Support Status Card */}
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Support Status</CardTitle>
                        <Shield className="h-4 w-4 text-indigo-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <Badge 
                            variant={sla.support.status === 'available' ? 'secondary' : 'outline'}
                            className={sla.support.status === 'available' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                                : 'border-gray-400 text-gray-600'}
                        >
                            <div className={`mr-1.5 h-2 w-2 rounded-full ${
                                sla.support.status === 'available' ? 'bg-green-600 dark:bg-green-400' : 'bg-gray-400'
                            }`} />
                            {sla.support.status === 'available' ? 'Available' : 'Offline'}
                        </Badge>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                        <strong>Hours:</strong> {sla.support.hours}
                    </p>

                    <div className="mt-3 rounded-lg border border-border bg-muted/50 p-2">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                                {sla.support.days_until_support_end}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                days until support ends
                            </div>
                        </div>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                        Ends: {new Date(sla.support.support_end_date).toLocaleDateString()}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
