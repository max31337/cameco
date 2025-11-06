import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Onboarding = {
    status?: string;
    checklist_json?: unknown;
    [key: string]: unknown;
};

type OnboardingItem = {
    key: string;
    label: string;
    done: boolean;
};

interface Props {
    userOnboarding?: Onboarding | null;
    showSetupModal?: boolean;
}

export default function UserOnboarding({ userOnboarding, showSetupModal = false }: Props) {
    const [open, setOpen] = useState<boolean>(() => {
        return (
            !!showSetupModal ||
            Boolean(
                userOnboarding &&
                    (userOnboarding.status === undefined ||
                        ['pending', 'in_progress'].includes(userOnboarding.status as string))
            )
        );
    });

    // derive initial items from userOnboarding
    const initialItems = useMemo<OnboardingItem[]>(() => {
        const u = userOnboarding as unknown as Record<string, unknown> | undefined | null;
        const raw = u?.checklist_json ?? u?.checklist ?? null;

        const parsed: OnboardingItem[] = [];

        try {
            if (typeof raw === 'string') {
                const p = JSON.parse(raw || 'null');
                if (Array.isArray(p)) {
                    return p.map((it: unknown, idx: number) => {
                        if (typeof it === 'string') return { key: String(idx), label: it, done: false };
                        if (it && typeof it === 'object') {
                            const obj = it as Record<string, unknown>;
                            return { key: String(obj.key ?? idx), label: String(obj.label ?? obj.key ?? idx), done: !!(obj.done ?? obj.completed ?? obj.checked) };
                        }
                        return { key: String(idx), label: String(it), done: false };
                    });
                }
                if (p && typeof p === 'object') {
                    return Object.entries(p).map(([k, v]) => ({ key: k, label: String(k), done: !!v }));
                }
            } else if (Array.isArray(raw)) {
                return (raw as unknown[]).map((it, idx) => {
                    if (typeof it === 'string') return { key: String(idx), label: it, done: false };
                    if (it && typeof it === 'object') {
                        const obj = it as Record<string, unknown>;
                        return { key: String(obj.key ?? idx), label: String(obj.label ?? obj.key ?? idx), done: !!(obj.done ?? obj.completed ?? obj.checked) };
                    }
                    return { key: String(idx), label: String(it), done: false };
                });
            } else if (raw && typeof raw === 'object') {
                return Object.entries(raw as Record<string, unknown>).map(([k, v]) => ({ key: k, label: String(k), done: !!v }));
            }
        } catch (err) {
            void err;
        }

        return parsed;
    }, [userOnboarding]);

    // items are derived from props; keep in sync but prevent manual mutation here.
    const [items] = useState<OnboardingItem[]>(initialItems);

    // keep open state in sync when props change
    useEffect(() => {
        const nextOpen = !!showSetupModal || Boolean(userOnboarding && (userOnboarding.status === undefined || ['pending', 'in_progress'].includes(userOnboarding.status as string)));
        if (open !== nextOpen) {
            // Defer the state update to the next microtask to avoid synchronous setState
            // inside the effect which can cause cascading renders.
            void Promise.resolve().then(() => setOpen(nextOpen));
        }
    }, [showSetupModal, userOnboarding, open]);

    // When profile data changes elsewhere, the parent/controller will pass updated
    // `userOnboarding` props and `initialItems` will update accordingly. We avoid
    // letting users manually toggle checklist items here to ensure the checklist
    // reflects authoritative profile data.

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Onboarding</DialogTitle>
                    <DialogDescription>
                        {userOnboarding?.status === 'skipped' ? 'You have skipped onboarding.' : 'Please complete your profile and review the onboarding checklist.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-3">
                    <div>
                        <div className="text-sm text-muted-foreground">Your onboarding</div>
                        {items.length > 0 ? (
                            <div className="mt-2">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="text-sm">Progress</div>
                                    <div className="text-sm font-medium">{Math.round((items.filter((i) => !!i.done).length / Math.max(1, items.length)) * 100)}%</div>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden mb-3">
                                    <div className="bg-primary h-2" style={{ width: `${Math.round((items.filter((i) => !!i.done).length / Math.max(1, items.length)) * 100)}%` }} />
                                </div>
                                <ul className="space-y-1 text-sm">
                                    {items.map((it, idx) => (
                                        <li key={it.key ?? idx} className="flex items-center gap-2">
                                            <input type="checkbox" checked={!!it.done} disabled className="w-4 h-4" />
                                            <span className={it.done ? 'line-through text-muted-foreground' : ''}>{it.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="mt-2 text-sm">{userOnboarding?.status ? `Status: ${userOnboarding.status}` : 'No onboarding checklist available.'}</div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {/* Continue onboarding navigates to the onboarding page where users can fill steps */}
                        <Button
                            onClick={() => {
                                router.visit('/onboarding');
                            }}
                        >
                            Continue Onboarding
                        </Button>

                        {/* Allow users to finalize only when checklist is fully completed */}
                        {(() => {
                            const total = items.length || 0;
                            const completed = items.filter((i) => !!i.done).length;
                            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                            return (
                                <Button
                                    disabled={percent < 100}
                                    onClick={() => {
                                        if (percent < 100) return;
                                        router.post('/onboarding/complete', {}, {
                                            onSuccess: () => setOpen(false),
                                            onError: () => {},
                                        });
                                    }}
                                >
                                    Complete onboarding
                                </Button>
                            );
                        })()}

                        <Button
                            variant="ghost"
                            onClick={() => {
                                router.post('/user/onboarding/skip', {}, {
                                    onSuccess: () => setOpen(false),
                                    onError: () => {},
                                });
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </div>

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
}
