import type { ReactElement } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import UserOnboarding from '@/components/user-onboarding';

type Onboarding = {
    status?: string;
    [key: string]: unknown;
};

interface HRDashboardProps {
    systemOnboarding?: Onboarding | null;
    userOnboarding?: Onboarding | null;
    showSetupModal?: boolean;
    canCompleteOnboarding?: boolean;
}

export default function HRDashboard({ systemOnboarding, userOnboarding, showSetupModal = false, canCompleteOnboarding = false }: HRDashboardProps): ReactElement {
    return (
        <AppLayout>
            <Head title="HR Dashboard" />

            <div className="p-6">
                <h1 className="text-2xl font-semibold">HR dashboard</h1>
                <p className="mt-2 text-sm text-muted-foreground">HR tasks and employee management</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">System onboarding</div>
                        <div className="font-medium">{systemOnboarding?.status ?? 'not_configured'}</div>
                    </div>

                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">Your onboarding</div>
                        <div className="font-medium">{userOnboarding?.status ?? 'not_started'}</div>
                    </div>
                </div>
            </div>

            <UserOnboarding userOnboarding={userOnboarding} showSetupModal={showSetupModal} canCompleteOnboarding={canCompleteOnboarding} />
        </AppLayout>
    );
}

