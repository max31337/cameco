import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { PayrollAdjustmentsPageProps, PayrollAdjustment } from '@/types/payroll-pages';
import { AdjustmentsTable } from '@/components/payroll/adjustments-table';
import { AdjustmentsFilter, type AdjustmentFilters } from '@/components/payroll/adjustments-filter';
import { AdjustmentFormModal } from '@/components/payroll/adjustment-form-modal';
import { 
    ApproveAdjustmentModal, 
    RejectAdjustmentModal 
} from '@/components/payroll/adjustment-action-modals';
import type { BreadcrumbItem } from '@/types';

// ============================================================================
// Type Definitions
// ============================================================================

type AdjustmentIndexProps = PayrollAdjustmentsPageProps;

// ============================================================================
// Breadcrumbs
// ============================================================================

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll',
        href: '/payroll/dashboard',
    },
    {
        title: 'Adjustments',
        href: '/payroll/adjustments',
    },
];

// ============================================================================
// Component
// ============================================================================

export default function PayrollAdjustments({ 
    adjustments: initialAdjustments, 
    available_periods,
    available_employees,
    filters: initialFilters 
}: AdjustmentIndexProps) {
    const [filters, setFilters] = useState<AdjustmentFilters>({
        period_id: initialFilters.period_id,
        employee_id: initialFilters.employee_id,
        status: initialFilters.status as AdjustmentFilters['status'],
        adjustment_type: initialFilters.adjustment_type as AdjustmentFilters['adjustment_type'],
    });
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedAdjustment, setSelectedAdjustment] = useState<PayrollAdjustment | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Action modal states
    const [approveModal, setApproveModal] = useState<{ isOpen: boolean; adjustment: PayrollAdjustment | null }>({ 
        isOpen: false, 
        adjustment: null 
    });
    const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; adjustment: PayrollAdjustment | null }>({ 
        isOpen: false, 
        adjustment: null 
    });

    // Debounced filter change to avoid excessive requests
    const debouncedFilterChange = useDebouncedCallback(
        (newFilters: AdjustmentFilters) => {
            const queryParams = new URLSearchParams();
            
            if (newFilters.period_id) queryParams.append('period_id', newFilters.period_id.toString());
            if (newFilters.employee_id) queryParams.append('employee_id', newFilters.employee_id.toString());
            if (newFilters.status) queryParams.append('status', newFilters.status);
            if (newFilters.adjustment_type) queryParams.append('adjustment_type', newFilters.adjustment_type);

            router.get(`/payroll/adjustments?${queryParams.toString()}`, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        300
    );

    const handleFilterChange = (newFilters: AdjustmentFilters) => {
        setFilters(newFilters);
        debouncedFilterChange(newFilters);
    };

    const handleCreateNew = () => {
        setSelectedAdjustment(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (adjustment: PayrollAdjustment) => {
        setSelectedAdjustment(adjustment);
        setIsFormModalOpen(true);
    };

    const handleDelete = (adjustment: PayrollAdjustment) => {
        if (confirm(`Delete adjustment for "${adjustment.employee_name}"? This action cannot be undone.`)) {
            setIsLoading(true);
            router.delete(`/payroll/adjustments/${adjustment.id}`, {
                onSuccess: () => {
                    router.get('/payroll/adjustments', filters as unknown as Record<string, string | undefined>);
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

    const handleApprove = (adjustment: PayrollAdjustment) => {
        setApproveModal({ isOpen: true, adjustment });
    };

    const confirmApprove = () => {
        if (!approveModal.adjustment) return;
        
        setIsLoading(true);
        router.post(`/payroll/adjustments/${approveModal.adjustment.id}/approve`, {}, {
            onSuccess: () => {
                router.get('/payroll/adjustments', filters as unknown as Record<string, string | undefined>);
                setApproveModal({ isOpen: false, adjustment: null });
            },
            onError: (errors) => {
                console.error('Approval failed:', errors);
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    const handleReject = (adjustment: PayrollAdjustment) => {
        setRejectModal({ isOpen: true, adjustment });
    };

    const confirmReject = (notes: string) => {
        if (!rejectModal.adjustment) return;
        
        setIsLoading(true);
        router.post(`/payroll/adjustments/${rejectModal.adjustment.id}/reject`, { notes }, {
            onSuccess: () => {
                router.get('/payroll/adjustments', filters as unknown as Record<string, string | undefined>);
                setRejectModal({ isOpen: false, adjustment: null });
            },
            onError: (errors) => {
                console.error('Rejection failed:', errors);
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payroll Adjustments" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payroll Adjustments</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage manual payroll adjustments and corrections
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateNew}
                        disabled={isLoading}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Adjustment
                    </Button>
                </div>

                {/* Filters */}
                <AdjustmentsFilter
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                    availablePeriods={available_periods}
                    availableEmployees={available_employees}
                    isLoading={isLoading}
                />

                {/* Adjustments Table */}
                <Card>
                    <CardContent>
                        <AdjustmentsTable
                            adjustments={initialAdjustments}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            isLoading={isLoading}
                        />

                        {/* Empty State Help */}
                        {initialAdjustments.length === 0 && !filters.period_id && !filters.status && (
                            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>Getting Started:</strong> Create manual adjustments to correct payroll 
                                    calculations, add bonuses, or process retroactive payments. All adjustments require 
                                    approval before being applied to payroll.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Form Modal */}
            <AdjustmentFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setSelectedAdjustment(null);
                }}
                adjustment={selectedAdjustment}
                availablePeriods={available_periods}
                availableEmployees={available_employees}
            />

            {/* Action Modals */}
            {approveModal.adjustment && (
                <ApproveAdjustmentModal
                    isOpen={approveModal.isOpen}
                    onClose={() => setApproveModal({ isOpen: false, adjustment: null })}
                    onConfirm={confirmApprove}
                    adjustment={approveModal.adjustment}
                    isLoading={isLoading}
                />
            )}

            {rejectModal.adjustment && (
                <RejectAdjustmentModal
                    isOpen={rejectModal.isOpen}
                    onClose={() => setRejectModal({ isOpen: false, adjustment: null })}
                    onConfirm={confirmReject}
                    adjustment={rejectModal.adjustment}
                    isLoading={isLoading}
                />
            )}
        </AppLayout>
    );
}
