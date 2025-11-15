import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { AdjustmentsHistoryTable } from '@/components/payroll/adjustments-history-table';
import { AdjustmentsHistoryFilter } from '@/components/payroll/adjustments-history-filter';
import { EmployeeHeader } from '@/components/payroll/employee-header';
import { EmployeeSummaryCards } from '@/components/payroll/employee-summary-cards';
import { AdjustmentSummaryMetrics } from '@/components/payroll/adjustment-summary-metrics';
import type { BreadcrumbItem } from '@/types';
import type { PayrollAdjustment } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface AdjustmentHistoryPageProps {
    employee_id: number;
    employee_name: string;
    employee_number: string;
    department: string;
    position: string;
    adjustments: PayrollAdjustment[];
    summary: {
        total_adjustments: number;
        pending_adjustments: number;
        approved_adjustments: number;
        rejected_adjustments: number;
        total_pending_amount: number;
    };
    available_periods: Array<{
        id: number;
        name: string;
    }>;
    available_statuses: Array<{
        value: string;
        label: string;
    }>;
}

interface HistoryFilters {
    period_id?: number;
    status?: string;
    type?: string;
}

// ============================================================================
// Component
// ============================================================================

export default function AdjustmentHistory({
    employee_id,
    employee_name,
    employee_number,
    department,
    position,
    adjustments: initialAdjustments,
    summary,
    available_periods,
    available_statuses,
}: AdjustmentHistoryPageProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Extract current filters from query string
    const queryParams = new URLSearchParams(window.location.search);
    const currentFilters = {
        period_id: queryParams.get('period_id') ? parseInt(queryParams.get('period_id')!) : undefined,
        status: queryParams.get('status') || undefined,
        type: queryParams.get('type') || undefined,
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Payroll',
            href: '/payroll/dashboard',
        },
        {
            title: 'Adjustments',
            href: '/payroll/adjustments',
        },
        {
            title: `${employee_name} - History`,
            href: `/payroll/adjustments/${employee_id}/history`,
        },
    ];

    const handleFilterChange = (newFilters: HistoryFilters) => {
        setIsLoading(true);

        const queryParams = new URLSearchParams();
        if (newFilters.period_id) queryParams.append('period_id', newFilters.period_id.toString());
        if (newFilters.status) queryParams.append('status', newFilters.status);
        if (newFilters.type) queryParams.append('type', newFilters.type);

        router.get(
            `/payroll/adjustments/history/${employee_id}?${queryParams.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${employee_name} - Adjustment History`} />

            <div className="space-y-6 p-6">
                <EmployeeHeader
                    employeeName={employee_name}
                    backHref="/payroll/adjustments"
                    description="Adjustment history and details"
                />

                <EmployeeSummaryCards
                    employeeNumber={employee_number}
                    position={position}
                    department={department}
                />

                <AdjustmentSummaryMetrics summary={summary} />

                {/* Filters */}
                <AdjustmentsHistoryFilter
                    onFilterChange={handleFilterChange}
                    initialFilters={currentFilters}
                    availablePeriods={available_periods}
                    availableStatuses={available_statuses}
                    isLoading={isLoading}
                />

                {/* Adjustments History Table */}
                <AdjustmentsHistoryTable
                    adjustments={initialAdjustments}
                />
            </div>
        </AppLayout>
    );
}
