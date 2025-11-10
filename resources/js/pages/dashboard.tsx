import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { SystemOnboardingModal } from '@/components/system/system-onboarding-modal';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardPageProps extends SharedData {
    onboarding_status?: string;
}

interface Role {
    name: string;
    [key: string]: unknown;
}

interface UserWithRoles {
    id: number;
    name: string;
    email: string;
    roles?: Role[];
    [key: string]: unknown;
}

export default function Dashboard() {
    const { auth, onboarding_status } = usePage<DashboardPageProps>().props;
    
    // Only show modal if user is Superadmin and onboarding hasn't been started
    const user = auth?.user as UserWithRoles | undefined;
    const isSuperAdmin = user?.roles?.some((role) => role.name === 'Superadmin') ?? false;
    const showOnboardingModal = isSuperAdmin && onboarding_status === 'not_started';

    return (
        <>
            <SystemOnboardingModal isOpen={showOnboardingModal} />
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
