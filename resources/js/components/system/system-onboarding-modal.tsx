import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface SystemOnboardingModalProps {
    isOpen: boolean;
}

type OnboardingStep = 'info' | 'review' | 'submitting' | 'success';

interface FormData {
    company_name: string;
    company_reg_number: string;
    country: string;
    timezone: string;
    currency: string;
    fiscal_year_start_month: string;
}

const TIMEZONES = [
    { value: 'Asia/Manila', label: 'Philippines (Asia/Manila)' },
    { value: 'Asia/Bangkok', label: 'Thailand (Asia/Bangkok)' },
    { value: 'Asia/Singapore', label: 'Singapore (Asia/Singapore)' },
    { value: 'Asia/Tokyo', label: 'Japan (Asia/Tokyo)' },
    { value: 'America/New_York', label: 'USA (America/New_York)' },
];

const CURRENCIES = [
    { value: 'PHP', label: 'PHP - Philippine Peso' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'SGD', label: 'SGD - Singapore Dollar' },
    { value: 'THB', label: 'THB - Thai Baht' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
];

const COUNTRIES = [
    { value: 'PH', label: 'Philippines' },
    { value: 'US', label: 'United States' },
    { value: 'SG', label: 'Singapore' },
    { value: 'TH', label: 'Thailand' },
    { value: 'JP', label: 'Japan' },
];

const FISCAL_MONTHS = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

export function SystemOnboardingModal({ isOpen }: SystemOnboardingModalProps) {
    const [step, setStep] = useState<OnboardingStep>('info');
    const [formData, setFormData] = useState<FormData>({
        company_name: '',
        company_reg_number: '',
        country: 'PH',
        timezone: 'Asia/Manila',
        currency: 'PHP',
        fiscal_year_start_month: '1',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            const id = window.setTimeout(() => {
                setStep('info');
                setErrors({});
            }, 0);
            return () => clearTimeout(id);
        }
    }, [isOpen]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.company_name.trim()) {
            newErrors.company_name = 'Company name is required';
        } else if (formData.company_name.trim().length < 2) {
            newErrors.company_name = 'Company name must be at least 2 characters';
        }
        if (!formData.country) {
            newErrors.country = 'Country is required';
        }
        if (!formData.timezone) {
            newErrors.timezone = 'Timezone is required';
        }
        if (!formData.currency) {
            newErrors.currency = 'Currency is required';
        }
        if (!formData.fiscal_year_start_month) {
            newErrors.fiscal_year_start_month = 'Fiscal year start month is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = (e: FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setStep('review');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStep('submitting');
        try {
            router.post('/system/onboarding/initialize-company', formData as unknown as Record<string, string>, {
                onSuccess: () => {
                    setStep('success');
                },
                onError: (errors) => {
                    setStep('review');
                    setErrors(typeof errors === 'object' ? errors : { form: 'An error occurred' });
                },
            });
        } catch {
            setStep('review');
            setErrors({ form: 'An error occurred. Please try again.' });
        }
    };

    const getCountryLabel = (value: string) => COUNTRIES.find((c) => c.value === value)?.label || value;
    const getTimezoneLabel = (value: string) => TIMEZONES.find((t) => t.value === value)?.label || value;
    const getCurrencyLabel = (value: string) => CURRENCIES.find((c) => c.value === value)?.label || value;
    const getFiscalMonthLabel = (value: string) => FISCAL_MONTHS.find((m) => m.value === value)?.label || value;

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>System Initialization</DialogTitle>
                    <DialogDescription>
                        {step === 'info' && 'Complete your company profile to initialize the system'}
                        {step === 'review' && 'Review your company information before proceeding'}
                        {step === 'submitting' && 'Initializing your system...'}
                        {step === 'success' && 'System initialized successfully!'}
                    </DialogDescription>
                </DialogHeader>

                {step === 'info' && (
                    <form onSubmit={handleNextStep} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="company_name">Company Name *</Label>
                                <Input
                                    id="company_name"
                                    placeholder="e.g., Acme Corporation"
                                    value={formData.company_name}
                                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                                    className={errors.company_name ? 'border-red-500' : ''}
                                />
                                {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="company_reg_number">Company Registration Number <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                                <Input
                                    id="company_reg_number"
                                    placeholder="e.g., 1234-567-890"
                                    value={formData.company_reg_number}
                                    onChange={(e) => handleInputChange('company_reg_number', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                                    <SelectTrigger id="country"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {COUNTRIES.map((country) => (
                                            <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone *</Label>
                                <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                                    <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {TIMEZONES.map((tz) => (
                                            <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.timezone && <p className="text-sm text-red-500">{errors.timezone}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency *</Label>
                                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                                    <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {CURRENCIES.map((curr) => (
                                            <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.currency && <p className="text-sm text-red-500">{errors.currency}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fiscal_year_start_month">Fiscal Year Start Month *</Label>
                                <Select value={formData.fiscal_year_start_month} onValueChange={(value) => handleInputChange('fiscal_year_start_month', value)}>
                                    <SelectTrigger id="fiscal_year_start_month"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {FISCAL_MONTHS.map((month) => (
                                            <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.fiscal_year_start_month && <p className="text-sm text-red-500">{errors.fiscal_year_start_month}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="submit">Review & Proceed</Button>
                        </div>
                    </form>
                )}

                {step === 'review' && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4 rounded-lg bg-muted p-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div><p className="text-sm text-muted-foreground">Company Name</p><p className="font-semibold">{formData.company_name}</p></div>
                                {formData.company_reg_number && (
                                    <div><p className="text-sm text-muted-foreground">Registration Number</p><p className="font-semibold">{formData.company_reg_number}</p></div>
                                )}
                                <div><p className="text-sm text-muted-foreground">Country</p><p className="font-semibold">{getCountryLabel(formData.country)}</p></div>
                                <div><p className="text-sm text-muted-foreground">Timezone</p><p className="font-semibold">{getTimezoneLabel(formData.timezone)}</p></div>
                                <div><p className="text-sm text-muted-foreground">Currency</p><p className="font-semibold">{getCurrencyLabel(formData.currency)}</p></div>
                                <div><p className="text-sm text-muted-foreground">Fiscal Year Start</p><p className="font-semibold">{getFiscalMonthLabel(formData.fiscal_year_start_month)}</p></div>
                            </div>
                        </div>
                        {errors.form && (
                            <div className="rounded-lg border border-red-500 bg-red-50 p-3 text-sm text-red-700">{errors.form}</div>
                        )}
                        <div className="flex justify-between gap-3">
                            <Button type="button" variant="outline" onClick={() => setStep('info')}>Back</Button>
                            <Button type="submit">Initialize System</Button>
                        </div>
                    </form>
                )}

                {step === 'submitting' && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Initializing your system...</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <CheckCircle2 className="size-12 text-green-500" />
                        <div className="text-center">
                            <p className="text-lg font-semibold">System Initialized Successfully!</p>
                            <p className="text-sm text-muted-foreground">Redirecting to organization setup...</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}