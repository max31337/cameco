import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Backup {
    id: number;
    backup_type: string;
    status: string;
    size_bytes: number;
    formatted_size: string;
    storage_location: string;
    started_at: string;
    completed_at: string | null;
    duration_minutes: number | null;
    error_message: string | null;
    created_at: string;
}

interface PaginatedBackups {
    data: Backup[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Stats {
    total: number;
    completed: number;
    failed: number;
    total_size: number;
    latest: Backup | null;
}

interface Filters {
    status: string | null;
    type: string | null;
    days: number;
}

interface Props {
    backups: PaginatedBackups;
    stats: Stats;
    filters: Filters;
}

export default function Backups({ backups, stats, filters }: Props) {
    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        router.get('/system/backups', newFilters, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge className="bg-red-500">
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                    </Badge>
                );
            case 'in_progress':
                return (
                    <Badge className="bg-blue-500">
                        <Clock className="h-3 w-3 mr-1 animate-spin" />
                        In Progress
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const successRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0';

    return (
        <AppLayout>
            <Head title="Backup Management" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">Backup Management</h1>
                    <p className="text-muted-foreground">Monitor and manage system backups</p>
                </div>

                {/* Statistics */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">Last {filters.days} days</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
                            <p className="text-xs text-muted-foreground mt-1">{stats.completed} completed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Failed Backups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                            <p className="text-xs text-muted-foreground mt-1">Require attention</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatBytes(stats.total_size)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Storage used</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.type || 'all'}
                                onValueChange={(value) => handleFilterChange('type', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="full">Full Backup</SelectItem>
                                    <SelectItem value="incremental">Incremental</SelectItem>
                                    <SelectItem value="database">Database</SelectItem>
                                    <SelectItem value="files">Files</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.days.toString()}
                                onValueChange={(value) => handleFilterChange('days', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Time period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">Last 7 days</SelectItem>
                                    <SelectItem value="30">Last 30 days</SelectItem>
                                    <SelectItem value="90">Last 90 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Backup List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Backup History</CardTitle>
                        <CardDescription>
                            Showing {backups.data.length} of {backups.total} backups
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {backups.data.map((backup) => (
                                <div key={backup.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <Database className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{backup.backup_type}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Started: {new Date(backup.started_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        {backup.error_message && (
                                            <p className="text-sm text-red-600 ml-8">{backup.error_message}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{backup.formatted_size}</p>
                                            {backup.duration_minutes && (
                                                <p className="text-xs text-muted-foreground">{backup.duration_minutes} min</p>
                                            )}
                                        </div>
                                        {getStatusBadge(backup.status)}
                                    </div>
                                </div>
                            ))}

                            {backups.data.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No backups found for the selected filters</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {backups.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Page {backups.current_page} of {backups.last_page}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={backups.current_page === 1}
                                        onClick={() =>
                                            router.get(`/system/backups`, {
                                                page: backups.current_page - 1,
                                                status: filters.status || undefined,
                                                type: filters.type || undefined,
                                                days: filters.days
                                            })
                                        }
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={backups.current_page === backups.last_page}
                                        onClick={() =>
                                            router.get(`/system/backups`, {
                                                page: backups.current_page + 1,
                                                status: filters.status || undefined,
                                                type: filters.type || undefined,
                                                days: filters.days
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
