import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SuperadminOnboardingCard from '@/components/superadmin-onboarding-card';
import { SystemHealthWidgets } from '@/components/system-health-widgets';

interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    action_url?: string;
    action_label?: string;
    required: boolean;
}

interface SystemOnboarding {
    id: number;
    status: string;
    checklist_json?: string | Record<string, unknown>;
}

interface UserOnboarding {
    id: number | null;
    user_id: number;
    status: string;
    checklist_json?: ChecklistItem[];
    completion_percentage?: number;
}

interface SystemHealthData {
    server: {
        cpu_usage: number;
        memory_usage: number;
        load_average: string | null;
        uptime: number;
        uptime_formatted: string;
        status: 'healthy' | 'warning' | 'critical';
    };
    database: {
        status: string;
        response_time_ms: number;
        connection_status: string;
    };
    cache: {
        driver: string;
        status: string;
    };
    queue: {
        pending_jobs: number;
        failed_jobs: number;
        status: string;
    };
    storage: {
        total_bytes: number;
        used_bytes: number;
        free_bytes: number;
        usage_percentage: number;
        total_formatted: string;
        used_formatted: string;
        free_formatted: string;
        status: 'healthy' | 'warning' | 'critical';
    };
    backup: {
        latest_backup: {
            backup_type: string;
            status: string;
            created_at: string;
            completed_at?: string;
            size_bytes?: number;
        } | null;
        success_rate: number;
        status: 'healthy' | 'warning' | 'critical';
    };
    patches: {
        pending_total: number;
        security_pending: number;
        status: string;
    };
    security: {
        critical_events_24h: number;
        failed_logins_24h: number;
        recent_events: Array<{
            id: number;
            event_type: string;
            severity: string;
            created_at: string;
        }>;
        status: 'healthy' | 'warning' | 'critical';
    };
    overall_status: 'healthy' | 'warning' | 'critical';
}

interface SystemDashboardProps {
    counts: {
        users: number;
    };
    company: {
        name: string | null;
    };
    systemOnboarding: SystemOnboarding | null;
    userOnboarding: UserOnboarding | null;
    onboardingStatus: string;
    showSetupModal: boolean;
    canCompleteOnboarding: boolean;
    welcomeText: string;
    systemHealth: SystemHealthData | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'System Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    counts,
    company,
    onboardingStatus,
    welcomeText,
    userOnboarding,
    showSetupModal,
    systemHealth,
}: SystemDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">
                        {company.name ? `${company.name} - System Dashboard` : 'System Dashboard'}
                    </h1>
                    <p className="text-muted-foreground">{welcomeText}</p>
                </div>

                {/* User Onboarding Section - Show if profile is incomplete */}
                {userOnboarding && showSetupModal && (
                    <SuperadminOnboardingCard 
                        onboarding={userOnboarding}
                        compact={false}
                        dismissible={false}
                    />
                )}

                {/* System Health Monitoring */}
                {systemHealth && (
                    <SystemHealthWidgets health={systemHealth} />
                )}

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Users</CardTitle>
                            <CardDescription>Registered users in the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{counts.users}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Onboarding Status</CardTitle>
                            <CardDescription>System configuration status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-semibold capitalize">
                                {onboardingStatus.replace('_', ' ')}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}

