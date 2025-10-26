import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function SuperadminDashboard({ counts, showSetupModal = false, welcomeText = '' }: { counts?: { users?: number; companies?: number }; showSetupModal?: boolean; welcomeText?: string }) {
    const [open, setOpen] = useState<boolean>(!!showSetupModal);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [form, setForm] = useState<{ company_name?: string; contact_email?: string; timezone?: string; currency?: string }>({});
    const [errors, setErrors] = useState<Record<string, string | string[]>>({});

    return (
        <AppLayout>
            <Head title="Superadmin Dashboard" />

            <div className="p-6">
                <h1 className="text-2xl font-semibold">Superadmin dashboard</h1>
                <p className="mt-2 text-sm text-muted-foreground">{welcomeText || 'Superadmin area'}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">Users: {counts?.users ?? 0}</div>
                    <div className="rounded-lg border p-4">Companies: {counts?.companies ?? 0}</div>
                </div>
            </div>

            {/* Onboarding / setup modal that opens after Superadmin login (skippable) */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Welcome, Superadmin</DialogTitle>
                        <DialogDescription>
                            Would you like to update your profile or continue to system settings now? You can skip this and do it later from your settings.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex flex-col gap-2">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-white"
                            onClick={() => {
                                // Navigate to profile edit
                                window.location.href = '/settings/profile';
                            }}
                        >
                            Edit profile
                        </button>

                        {!showForm && (
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md border px-4 py-2"
                                onClick={() => setShowForm(true)}
                            >
                                Setup system settings
                            </button>
                        )}

                        {showForm && (
                            <div className="space-y-3">
                                <input
                                    className="w-full rounded-md border px-3 py-2"
                                    placeholder="Company name"
                                    value={form.company_name ?? ''}
                                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                                />
                                {errors.company_name && (
                                    <div className="text-sm text-red-600">{Array.isArray(errors.company_name) ? errors.company_name[0] : errors.company_name}</div>
                                )}

                                <input
                                    className="w-full rounded-md border px-3 py-2"
                                    placeholder="Contact email"
                                    value={form.contact_email ?? ''}
                                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                                />
                                {errors.contact_email && (
                                    <div className="text-sm text-red-600">{Array.isArray(errors.contact_email) ? errors.contact_email[0] : errors.contact_email}</div>
                                )}

                                <input
                                    className="w-full rounded-md border px-3 py-2"
                                    placeholder="Timezone"
                                    value={form.timezone ?? ''}
                                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                                />
                                {errors.timezone && (
                                    <div className="text-sm text-red-600">{Array.isArray(errors.timezone) ? errors.timezone[0] : errors.timezone}</div>
                                )}

                                <input
                                    className="w-full rounded-md border px-3 py-2"
                                    placeholder="Currency"
                                    value={form.currency ?? ''}
                                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                />
                                {errors.currency && (
                                    <div className="text-sm text-red-600">{Array.isArray(errors.currency) ? errors.currency[0] : errors.currency}</div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => {
                                            // Submit start onboarding
                                            setErrors({});
                                            router.post('/superadmin/onboarding/start', form, {
                                                onSuccess: () => setOpen(false),
                                                onError: (errs: Record<string, string | string[]>) => setErrors(errs),
                                            });
                                        }}
                                    >
                                        Start onboarding
                                    </Button>

                                    <Button variant="ghost" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    // Call skip endpoint and close modal on success
                                    router.post('/superadmin/onboarding/skip', {}, {
                                        onSuccess: () => setOpen(false),
                                    });
                                }}
                            >
                                Skip for now
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
