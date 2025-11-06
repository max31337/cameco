import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

type OnboardingChecklistItem = {
    key?: string;
    label?: string;
    done?: boolean;
    [k: string]: any;
};

type PageProps = {
    userOnboarding?: {
        checklist_json?: OnboardingChecklistItem[] | null;
    } | null;
};

export default function Onboarding() {
    const props = usePage<PageProps>().props;
    const userOnboarding = props.userOnboarding ?? null;
    const items = Array.isArray(userOnboarding?.checklist_json) ? userOnboarding.checklist_json : [];

    const total = items.length;
    const completed = items.filter((i: any) => !!i.done).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // local state for simple inline edits
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});

    const saveStep = (stepKey: string) => {
        const value = formValues[stepKey] ?? '';
        setSaving((s) => ({ ...s, [stepKey]: true }));
        const data: any = { step: stepKey };
        if (stepKey === 'name') data.data = { name: value };
        if (stepKey === 'phone') data.data = { contact_number: value };
        if (stepKey === 'address') data.data = { address: value };
        if (stepKey === 'emergency_contact') data.data = { emergency_contact: value };

        router.post('/onboarding/step', data, {
            onSuccess: () => {
                setSaving((s) => ({ ...s, [stepKey]: false }));
            },
            onError: () => {
                setSaving((s) => ({ ...s, [stepKey]: false }));
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Onboarding" />

            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold">Welcome — Onboarding</h1>
                <p className="mt-2 text-sm text-muted-foreground">Complete the steps below to finish your profile and access the platform.</p>

                <div className="mt-6">
                    <div className="mb-4">Progress: <strong>{percent}%</strong></div>
                    <div className="w-full bg-slate-100 h-2 rounded overflow-hidden mb-4">
                        <div className="bg-primary h-2" style={{ width: `${percent}%` }} />
                    </div>

                    <ul className="space-y-4">
                        {items.map((it: any, idx: number) => (
                            <li key={it.key ?? idx} className="border rounded p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{it.label}</div>
                                        <div className="text-sm text-muted-foreground">{it.done ? 'Completed' : 'Incomplete'}</div>
                                    </div>
                                    <div>
                                        {/* Provide edit buttons or inline forms for profile-related steps */}
                                        {it.key === 'name' && (
                                            <div className="flex items-center gap-2">
                                                <input value={formValues['name'] ?? ''} onChange={(e) => setFormValues((s) => ({ ...s, name: e.target.value }))} placeholder="Full name" className="border rounded px-2 py-1" />
                                                <button disabled={saving['name']} onClick={() => saveStep('name')} className="btn">Save</button>
                                            </div>
                                        )}

                                        {it.key === 'phone' && (
                                            <div className="flex items-center gap-2">
                                                <input value={formValues['phone'] ?? ''} onChange={(e) => setFormValues((s) => ({ ...s, phone: e.target.value }))} placeholder="Contact number" className="border rounded px-2 py-1" />
                                                <button disabled={saving['phone']} onClick={() => saveStep('phone')} className="btn">Save</button>
                                            </div>
                                        )}

                                        {it.key === 'address' && (
                                            <div className="flex items-center gap-2">
                                                <input value={formValues['address'] ?? ''} onChange={(e) => setFormValues((s) => ({ ...s, address: e.target.value }))} placeholder="Address" className="border rounded px-2 py-1 w-64" />
                                                <button disabled={saving['address']} onClick={() => saveStep('address')} className="btn">Save</button>
                                            </div>
                                        )}

                                        {it.key === 'emergency_contact' && (
                                            <div className="flex items-center gap-2">
                                                <input value={formValues['emergency_contact'] ?? ''} onChange={(e) => setFormValues((s) => ({ ...s, emergency_contact: e.target.value }))} placeholder="Emergency contact" className="border rounded px-2 py-1" />
                                                <button disabled={saving['emergency_contact']} onClick={() => saveStep('emergency_contact')} className="btn">Save</button>
                                            </div>
                                        )}

                                        {['verify_email'].includes(it.key) && (
                                            <div>
                                                <a href="/settings/profile" className="underline">Verify or resend email</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex gap-2">
                        <button disabled={percent < 100} onClick={() => router.post('/onboarding/complete')} className={`btn ${percent < 100 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Complete onboarding
                        </button>

                        <button onClick={() => router.post('/user/onboarding/skip')} className="btn btn-ghost">Skip and return to dashboard</button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
