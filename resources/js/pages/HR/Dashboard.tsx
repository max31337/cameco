import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

export default function HRDashboard({ systemOnboarding, userOnboarding, showSetupModal = false, canCompleteOnboarding = false }: HRDashboardProps) {
    const [open, setOpen] = useState<boolean>(!!showSetupModal);

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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Onboarding</DialogTitle>
                        <DialogDescription>
                            {userOnboarding?.status === 'skipped'
                                ? 'You have skipped onboarding.'
                                : 'Please complete your profile and review the system onboarding checklist.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-3">
                        <div>
                            <div className="text-sm text-muted-foreground">System onboarding</div>
                            <pre className="mt-2 text-xs rounded bg-slate-50 p-2">{JSON.stringify(systemOnboarding ?? {}, null, 2)}</pre>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground">Your onboarding</div>
                            <pre className="mt-2 text-xs rounded bg-slate-50 p-2">{JSON.stringify(userOnboarding ?? {}, null, 2)}</pre>
                        </div>

                        <div className="flex gap-2">
                            {canCompleteOnboarding && (
                                <Button
                                    onClick={() => {
                                        router.post('/superadmin/onboarding/complete', {}, {
                                            onSuccess: () => setOpen(false),
                                            onError: () => {},
                                        });
                                    }}
                                >
                                    Complete onboarding
                                </Button>
                            )}

                            <Button variant="ghost" onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </div>

                    <DialogFooter />
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
