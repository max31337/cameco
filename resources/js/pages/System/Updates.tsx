import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    Download, 
    RefreshCw, 
    CheckCircle2, 
    XCircle, 
    Clock,
    Shield,
    Info,
    Loader2
} from 'lucide-react';
import { useState } from 'react';

interface UpdateInfo {
    available: boolean;
    current_version: string;
    latest_version?: string;
    release_date?: string;
    download_url?: string;
    changelog?: string[];
    patch_notes?: string;
    is_security_update?: boolean;
    minimum_php_version?: string;
    file_size?: number;
    checksum?: string;
    message?: string;
}

interface UpdateHistory {
    version: string;
    date: string;
    status: string;
    message: string;
}

interface SystemInfo {
    current_version: string;
    php_version: string;
    laravel_version: string;
    environment: string;
}

interface UpdatesProps {
    updateInfo: UpdateInfo;
    history: UpdateHistory[];
    systemInfo: SystemInfo;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Updates',
        href: '/system/updates',
    },
];

export default function Updates({ updateInfo, history, systemInfo }: UpdatesProps) {
    const [checking, setChecking] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [deploying, setDeploying] = useState(false);
    const [downloadedFile, setDownloadedFile] = useState<string | null>(null);

    const handleCheckUpdates = () => {
        setChecking(true);
        router.post('/system/updates/check', {}, {
            preserveScroll: true,
            onFinish: () => setChecking(false),
        });
    };

    const handleDownload = async () => {
        if (!updateInfo.download_url || !updateInfo.checksum) return;

        setDownloading(true);
        try {
            const response = await fetch('/system/updates/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    download_url: updateInfo.download_url,
                    checksum: updateInfo.checksum,
                    version: updateInfo.latest_version,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setDownloadedFile(result.filepath);
            } else {
                alert('Download failed: ' + result.message);
            }
        } catch (error) {
            alert('Download error: ' + error);
        } finally {
            setDownloading(false);
        }
    };

    const handleDeploy = async () => {
        if (!downloadedFile || !updateInfo.latest_version) return;

        if (!confirm('Are you sure you want to deploy this update? A backup will be created automatically.')) {
            return;
        }

        setDeploying(true);
        try {
            const response = await fetch('/system/updates/deploy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    filepath: downloadedFile,
                    version: updateInfo.latest_version,
                }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Update deployed successfully! The page will reload.');
                window.location.reload();
            } else {
                alert('Deployment failed: ' + result.message);
            }
        } catch (error) {
            alert('Deployment error: ' + error);
        } finally {
            setDeploying(false);
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default">Success</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Updates" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">System Updates</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage system updates and patch deployments
                        </p>
                    </div>
                    <Button
                        onClick={handleCheckUpdates}
                        disabled={checking}
                        variant="outline"
                    >
                        {checking ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Check for Updates
                    </Button>
                </div>

                {/* System Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>Current system version and environment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Application Version</div>
                                <div className="text-lg font-semibold">{systemInfo.current_version}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">PHP Version</div>
                                <div className="text-lg font-semibold">{systemInfo.php_version}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Laravel Version</div>
                                <div className="text-lg font-semibold">{systemInfo.laravel_version}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Environment</div>
                                <Badge variant={systemInfo.environment === 'production' ? 'destructive' : 'default'}>
                                    {systemInfo.environment}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Update Available Alert */}
                {updateInfo.available ? (
                    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertTitle className="text-blue-900 dark:text-blue-100">
                            {updateInfo.is_security_update && (
                                <Shield className="mr-2 inline h-4 w-4 text-red-600" />
                            )}
                            Update Available: Version {updateInfo.latest_version}
                        </AlertTitle>
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            <div className="mt-2 space-y-2">
                                <p>A new version is available for download and installation.</p>
                                {updateInfo.is_security_update && (
                                    <p className="font-semibold text-red-600">
                                        ⚠️ This is a security update and should be installed as soon as possible.
                                    </p>
                                )}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>Release Date: {updateInfo.release_date}</div>
                                    <div>File Size: {formatFileSize(updateInfo.file_size)}</div>
                                    <div>Min PHP Version: {updateInfo.minimum_php_version}</div>
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="dark:text-foreground">System Up to Date</AlertTitle>
                        <AlertDescription className="dark:text-gray-300">
                            {updateInfo.message || 'You are running the latest version of the application.'}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Patch Notes and Changelog */}
                {updateInfo.available && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Patch Notes - Version {updateInfo.latest_version}</CardTitle>
                            <CardDescription>What's new in this update</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {updateInfo.patch_notes && (
                                <div className="prose prose-sm max-w-none dark:prose-invert mb-4">
                                    <p className="whitespace-pre-wrap">{updateInfo.patch_notes}</p>
                                </div>
                            )}
                            {updateInfo.changelog && updateInfo.changelog.length > 0 && (
                                <div>
                                    <h4 className="mb-2 font-semibold">Changelog:</h4>
                                    <ul className="list-disc space-y-1 pl-5">
                                        {updateInfo.changelog.map((item, idx) => (
                                            <li key={idx} className="text-sm">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-6 flex gap-3">
                                {!downloadedFile ? (
                                    <Button
                                        onClick={handleDownload}
                                        disabled={downloading}
                                        variant="default"
                                    >
                                        {downloading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Download className="mr-2 h-4 w-4" />
                                        )}
                                        {downloading ? 'Downloading...' : 'Download Update'}
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleDeploy}
                                            disabled={deploying}
                                            variant="default"
                                        >
                                            {deploying ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                            )}
                                            {deploying ? 'Deploying...' : 'Deploy Update'}
                                        </Button>
                                        <Badge variant="secondary" className="flex items-center gap-1 px-3">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Downloaded
                                        </Badge>
                                    </>
                                )}
                            </div>

                            {deploying && (
                                <Alert className="mt-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <AlertTitle>Deployment in Progress</AlertTitle>
                                    <AlertDescription>
                                        Creating backup, applying patch, and running post-deployment tasks...
                                        Do not close this window.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Update History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Update History</CardTitle>
                        <CardDescription>Recent system updates and deployments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {history.length > 0 ? (
                            <div className="space-y-3">
                                {history.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(item.status)}
                                            <div>
                                                <div className="font-medium">Version {item.version}</div>
                                                <div className="text-sm text-muted-foreground">{item.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {item.message && (
                                                <span className="text-sm text-muted-foreground">{item.message}</span>
                                            )}
                                            {getStatusBadge(item.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                No update history available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
