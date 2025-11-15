import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { PayrollPeriodsPageProps, PayrollPeriodFormData, PayrollPeriod } from '@/types/payroll-pages';
import { PeriodsTable } from '@/components/payroll/periods-table';
import { PeriodsFilter, type PeriodFilters } from '@/components/payroll/periods-filter';
import { PeriodFormModal } from '@/components/payroll/period-form-modal';
import type { BreadcrumbItem } from '@/types';

// ============================================================================
// Type Definitions
// ============================================================================

type PeriodIndexProps = PayrollPeriodsPageProps;

// ============================================================================
// Breadcrumbs
// ============================================================================

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll',
        href: '/payroll/dashboard',
    },
    {
        title: 'Periods',
        href: '/payroll/periods',
    },
];

// ============================================================================
// Component
// ============================================================================

export default function PayrollPeriods({ 
    periods: initialPeriods, 
    filters: initialFilters 
}: PeriodIndexProps) {
    const [filters, setFilters] = useState<PeriodFilters>(initialFilters);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [isLoading, setIsLoading] = useState(false);

    // Debounced filter change to avoid excessive requests
    const debouncedFilterChange = useDebouncedCallback(
        (newFilters: PeriodFilters) => {
            const queryParams = new URLSearchParams();
            
            if (newFilters.search) queryParams.append('search', newFilters.search);
            if (newFilters.status) queryParams.append('status', newFilters.status);
            if (newFilters.period_type) queryParams.append('period_type', newFilters.period_type);

            router.get(`/payroll/periods?${queryParams.toString()}`, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        300
    );

    const handleFilterChange = (newFilters: PeriodFilters) => {
        setFilters(newFilters);
        debouncedFilterChange(newFilters);
    };

    const handleCreateClick = () => {
        setSelectedPeriod(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEditClick = (period: PayrollPeriod) => {
        setSelectedPeriod(period);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleViewClick = (period: PayrollPeriod) => {
        router.get(`/payroll/periods/${period.id}`);
    };

    const handleModalSubmit = async (data: PayrollPeriodFormData) => {
        setIsLoading(true);

        try {
            if (modalMode === 'create') {
                // Submit create request
                router.post('/payroll/periods', {
                    name: data.name,
                    period_type: data.period_type,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    cutoff_date: data.cutoff_date,
                    pay_date: data.pay_date,
                }, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                    onError: (errors) => {
                        console.error('Creation failed:', errors);
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    },
                });
            } else if (selectedPeriod) {
                // Submit update request
                router.put(`/payroll/periods/${selectedPeriod.id}`, {
                    name: data.name,
                    period_type: data.period_type,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    cutoff_date: data.cutoff_date,
                    pay_date: data.pay_date,
                }, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                    onError: (errors) => {
                        console.error('Update failed:', errors);
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    },
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (period: PayrollPeriod) => {
        if (confirm(`Are you sure you want to delete "${period.name}"? This action cannot be undone.`)) {
            setIsLoading(true);
            router.delete(`/payroll/periods/${period.id}`, {
                onSuccess: () => {
                    // Refresh the page
                    router.get('/payroll/periods', filters as unknown as Record<string, string | undefined>);
                },
                onError: (errors) => {
                    console.error('Deletion failed:', errors);
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            });
        }
    };

    const handleCalculateClick = (period: PayrollPeriod) => {
        if (confirm(`Calculate payroll for "${period.name}"? This will process all employees.`)) {
            setIsLoading(true);
            router.post(`/payroll/periods/${period.id}/calculate`, {}, {
                onSuccess: () => {
                    // Refresh the list
                    router.get('/payroll/periods', filters as unknown as Record<string, string | undefined>);
                },
                onError: (errors) => {
                    console.error('Calculation failed:', errors);
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            });
        }
    };

    const handleApproveClick = (period: PayrollPeriod) => {
        if (confirm(`Approve payroll for "${period.name}"? Approved payroll cannot be modified.`)) {
            setIsLoading(true);
            router.post(`/payroll/periods/${period.id}/approve`, {}, {
                onSuccess: () => {
                    // Refresh the list
                    router.get('/payroll/periods', filters as unknown as Record<string, string | undefined>);
                },
                onError: (errors) => {
                    console.error('Approval failed:', errors);
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payroll Periods" />

            <div className="space-y-6 p-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                Payroll Periods
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Create and manage payroll periods for salary calculations
                            </p>
                        </div>
                        <Button
                            onClick={handleCreateClick}
                            disabled={isLoading}
                            className="flex items-center gap-2 w-full sm:w-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Create Period
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="mb-6">
                        <PeriodsFilter
                            onFilterChange={handleFilterChange}
                            initialFilters={filters}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Periods Table */}
                    <PeriodsTable
                        periods={initialPeriods}
                        onView={handleViewClick}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onCalculate={handleCalculateClick}
                        onApprove={handleApproveClick}
                        isLoading={isLoading}
                    />

                    {/* Empty State Help */}
                    {initialPeriods.length === 0 && !filters.search && !filters.status && !filters.period_type && (
                        <Card className="mt-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                            <CardContent className="pt-6">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>Getting Started:</strong> Create your first payroll period by clicking the 
                                    "Create Period" button above. You'll need to specify the payroll dates, cutoff date, 
                                    and pay date for your organization's payroll cycle.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Period Form Modal */}
            <PeriodFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                period={selectedPeriod}
                mode={modalMode}
            />
        </AppLayout>
    );
}
