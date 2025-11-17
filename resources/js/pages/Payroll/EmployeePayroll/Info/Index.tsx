import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { EmployeePayrollInfo, EmployeePayrollInfoFormData, EmployeePayrollInfoPageProps, EmployeePayrollInfoFilters } from '@/types/payroll-pages';
import { EmployeePayrollTable } from '@/components/payroll/employee-payroll-table';
import { EmployeePayrollFilter } from '@/components/payroll/employee-payroll-filter';
import { EmployeePayrollFormModal } from '@/components/payroll/employee-payroll-form-modal';
import type { BreadcrumbItem } from '@/types';

// ============================================================================
// Breadcrumbs
// ============================================================================

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll',
        href: '/payroll/dashboard',
    },
    {
        title: 'Employee Payroll',
        href: '/payroll/employee-payroll-info',
    },
    {
        title: 'Payroll Information',
        href: '/payroll/employee-payroll-info',
    },
];

// ============================================================================
// Component
// ============================================================================

export default function EmployeePayrollInfo({
    employees: initialEmployees,
    filters: initialFilters,
}: EmployeePayrollInfoPageProps) {
    const [filters, setFilters] = useState<EmployeePayrollInfoFilters>(initialFilters);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeePayrollInfo | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [isLoading, setIsLoading] = useState(false);

    // Debounced filter change to avoid excessive requests
    const debouncedFilterChange = useDebouncedCallback(
        (newFilters: EmployeePayrollInfoFilters) => {
            const queryParams = new URLSearchParams();

            if (newFilters.search) queryParams.append('search', newFilters.search);
            if (newFilters.salary_type) queryParams.append('salary_type', newFilters.salary_type);
            if (newFilters.payment_method) queryParams.append('payment_method', newFilters.payment_method);
            if (newFilters.tax_status) queryParams.append('tax_status', newFilters.tax_status);
            if (newFilters.status && newFilters.status !== 'all') queryParams.append('status', newFilters.status);

            router.get(`/payroll/employee-payroll-info?${queryParams.toString()}`, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        300
    );

    const handleFilterChange = (newFilters: EmployeePayrollInfoFilters) => {
        setFilters(newFilters);
        debouncedFilterChange(newFilters);
    };

    const handleCreateClick = () => {
        setSelectedEmployee(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleViewClick = (employee: EmployeePayrollInfo) => {
        setSelectedEmployee(employee);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleEditClick = (employee: EmployeePayrollInfo) => {
        setSelectedEmployee(employee);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: EmployeePayrollInfoFormData) => {
        setIsLoading(true);

        try {
            if (modalMode === 'create') {
                // Submit create request
                router.post('/payroll/employee-payroll-info', data as unknown as Record<string, string>, {
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
            } else if (selectedEmployee) {
                // Submit update request
                router.put(`/payroll/employee-payroll-info/${selectedEmployee.id}`, data as unknown as Record<string, string>, {
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

    const handleDeleteClick = (employee: EmployeePayrollInfo) => {
        if (confirm(`Are you sure you want to delete payroll information for "${employee.employee_name}"? This action cannot be undone.`)) {
            setIsLoading(true);
            router.delete(`/payroll/employee-payroll-info/${employee.id}`, {
                onSuccess: () => {
                    // Refresh the page
                    router.get('/payroll/employee-payroll-info', filters as unknown as Record<string, string | undefined>);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee Payroll Information" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Employee Payroll Information</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage employee salary information, tax settings, government numbers, and bank details
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateClick}
                        disabled={isLoading}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Employee Payroll
                    </Button>
                </div>

                {/* Filters */}
                <EmployeePayrollFilter
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                    isLoading={isLoading}
                />

                {/* Table */}
                <EmployeePayrollTable
                    employees={initialEmployees}
                    onView={handleViewClick}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    isLoading={isLoading}
                />

                {/* Empty State Help */}
                {initialEmployees.length === 0 && !filters.search && !filters.salary_type && !filters.payment_method && !filters.tax_status && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>Getting Started:</strong> Add employee payroll information by clicking the
                            "Add Employee Payroll" button above. You'll need to configure salary details, tax status, government numbers (SSS, PhilHealth, Pag-IBIG), and bank information for each employee.
                        </p>
                    </div>
                )}
            </div>

            {/* Employee Payroll Form Modal */}
            <EmployeePayrollFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                employee={selectedEmployee}
                mode={modalMode}
            />
        </AppLayout>
    );
}
