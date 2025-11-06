import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SuperadminOnboardingCard from '@/components/superadmin-onboarding-card';
import SLAWidgets from '@/components/sla-widgets';

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
    sla?: SLAMetrics;
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
    sla,
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

                {/* SLA Monitoring Widgets */}
                {sla && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">Service Level Agreement (SLA)</h2>
                            <p className="text-sm text-muted-foreground">
                                Monitor system health, incidents, and support status
                            </p>
                        </div>
                        <SLAWidgets sla={sla} />
                    </div>
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
