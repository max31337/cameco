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
                            <div className="text-sm text-muted-foreground">Your onboarding</div>
                            {/* Render a friendly progress view instead of raw JSON */}
                            {(() => {
                                const u = userOnboarding as unknown as Record<string, unknown> | undefined | null;
                                const raw = u?.checklist_json ?? u?.checklist ?? null;

                                let items: Array<{ label: string; done?: boolean }> = [];

                                try {
                                    if (typeof raw === 'string') {
                                        const parsed = JSON.parse(raw || 'null');
                                        if (Array.isArray(parsed)) {
                                            items = parsed.map((it: unknown) => {
                                                if (typeof it === 'string') return { label: it, done: false };
                                                if (it && typeof it === 'object') {
                                                    const obj = it as Record<string, unknown>;
                                                    return { label: (obj['label'] as string) ?? String(obj), done: !!(obj['done'] ?? obj['completed'] ?? obj['checked']) };
                                                }
                                                return { label: String(it), done: false };
                                            });
                                        } else if (parsed && typeof parsed === 'object') {
                                            items = Object.entries(parsed as Record<string, unknown>).map(([k, v]) => ({ label: k, done: !!v }));
                                        }
                                    } else if (Array.isArray(raw)) {
                                        items = (raw as unknown[]).map((it) => {
                                            if (typeof it === 'string') return { label: it, done: false };
                                            if (it && typeof it === 'object') {
                                                const obj = it as Record<string, unknown>;
                                                return { label: (obj['label'] as string) ?? String(obj), done: !!(obj['done'] ?? obj['completed'] ?? obj['checked']) };
                                            }
                                            return { label: String(it), done: false };
                                        });
                                    } else if (raw && typeof raw === 'object') {
                                        items = Object.entries(raw as Record<string, unknown>).map(([k, v]) => ({ label: k, done: !!v }));
                                    }
                                } catch (err) {
                                    void err;
                                    items = [];
                                }

                                if (items.length > 0) {
                                    const total = items.length;
                                    const completed = items.filter((i) => !!i.done).length;
                                    const percent = Math.round((completed / total) * 100);

                                    return (
                                        <div className="mt-2">
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="text-sm">Progress</div>
                                                <div className="text-sm font-medium">{percent}%</div>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded overflow-hidden mb-3">
                                                <div className="bg-primary h-2" style={{ width: `${percent}%` }} />
                                            </div>
                                            <ul className="space-y-1 text-sm">
                                                {items.map((it, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <input type="checkbox" checked={!!it.done} readOnly className="w-4 h-4" />
                                                        <span className={it.done ? 'line-through text-muted-foreground' : ''}>{it.label}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }

                                return <div className="mt-2 text-sm">{u?.status ? `Status: ${u.status}` : 'No onboarding checklist available.'}</div>;
                            })()}
                        </div>

                        <div className="flex gap-2">
                            {canCompleteOnboarding && (
                                <Button
                                    onClick={() => {
                                        router.patch('/user/onboarding', { status: 'completed' }, {
                                            onSuccess: () => setOpen(false),
                                            onError: () => {},
                                        });
                                    }}
                                >
                                    Complete onboarding
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                onClick={() => {
                                    router.post('/user/onboarding/skip', {}, {
                                        onSuccess: () => setOpen(false),
                                        onError: () => {},
                                    });
                                }}
                            >
                                Close / Skip
                            </Button>
                        </div>
                    </div>

                    <DialogFooter />
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
