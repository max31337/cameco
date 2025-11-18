import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import type { SalaryComponentsPageProps, SalaryComponent } from '@/types/payroll-pages';
import { SalaryComponentsTable } from '@/components/payroll/salary-components-table';
import { ComponentFormModal } from '@/components/payroll/component-form-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { Plus, Search, Filter, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll',
        href: '/payroll/dashboard',
    },
    {
        title: 'Employee Payroll',
        href: '#',
    },
    {
        title: 'Salary Components',
        href: '/payroll/salary-components',
    },
];

export default function SalaryComponentsPage({
    components,
    filters,
    available_component_types,
    available_categories,
    reference_components,
}: SalaryComponentsPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedType, setSelectedType] = useState(filters?.component_type || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [selectedStatus, setSelectedStatus] = useState(
        filters?.is_active === undefined ? 'all' : filters.is_active ? 'active' : 'inactive'
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedComponent, setSelectedComponent] = useState<SalaryComponent | undefined>();
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter components
    const filteredComponents = useMemo(() => {
        return components.filter((component) => {
            const matchesSearch =
                searchQuery === '' ||
                component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                component.code.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = selectedType === '' || component.component_type === selectedType;
            const matchesCategory = selectedCategory === '' || component.category === selectedCategory;

            const matchesStatus =
                selectedStatus === 'all' ||
                (selectedStatus === 'active' && component.is_active) ||
                (selectedStatus === 'inactive' && !component.is_active);

            return matchesSearch && matchesType && matchesCategory && matchesStatus;
        });
    }, [components, searchQuery, selectedType, selectedCategory, selectedStatus]);

    const handleCreateClick = () => {
        setModalMode('create');
        setSelectedComponent(undefined);
        setIsModalOpen(true);
    };

    const handleEditComponent = (component: SalaryComponent) => {
        setModalMode('edit');
        setSelectedComponent(component);
        setIsModalOpen(true);
    };

    const handleViewComponent = (component: SalaryComponent) => {
        setModalMode('view');
        setSelectedComponent(component);
        setIsModalOpen(true);
    };

    const handleDeleteComponent = async (component: SalaryComponent) => {
        if (component.is_system_component) {
            alert('System components cannot be deleted');
            return;
        }

        if (confirm(`Are you sure you want to delete "${component.name}"?`)) {
            setIsDeleting(true);
            try {
                router.delete(`/payroll/salary-components/${component.id}`, {
                    onSuccess: () => {
                        setIsDeleting(false);
                    },
                    onError: () => {
                        setIsDeleting(false);
                        alert('Failed to delete component');
                    },
                });
            } catch {
                setIsDeleting(false);
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedComponent(undefined);
        setModalMode('create');
    };

    const systemComponents = components.filter((c) => c.is_system_component);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Salary Components" />
            <div className="space-y-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Salary Components</h1>
                        <p className="text-muted-foreground">
                            Manage salary components for payroll calculations including earnings, deductions,
                            benefits, and government contributions
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateClick}
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Create Component
                    </Button>
                </div>

                {/* Info Alert */}
                {systemComponents.length > 0 && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">System Components</p>
                                <p>
                                    {systemComponents.length} system components are locked and cannot be
                                    deleted. You can only create and manage custom components.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Type</label>
                                <Select value={selectedType || 'all-types'} onValueChange={(value) => setSelectedType(value === 'all-types' ? '' : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-types">All Types</SelectItem>
                                        {available_component_types.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <Select value={selectedCategory || 'all-categories'} onValueChange={(value) => setSelectedCategory(value === 'all-categories' ? '' : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-categories">All Categories</SelectItem>
                                        {available_categories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active Only</SelectItem>
                                        <SelectItem value="inactive">Inactive Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedType('all-types');
                                        setSelectedCategory('all-categories');
                                        setSelectedStatus('all');
                                    }}
                                    className="w-full"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="text-sm text-gray-600">
                    Showing {filteredComponents.length} of {components.length} components
                </div>

                {/* Components Table */}
                <SalaryComponentsTable
                    components={filteredComponents}
                    onEdit={handleEditComponent}
                    onDelete={handleDeleteComponent}
                    onView={handleViewComponent}
                    isLoading={isDeleting}
                />

                {/* Empty State */}
                {filteredComponents.length === 0 && (
                    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">
                            {components.length === 0
                                ? 'No salary components yet. Create one to get started.'
                                : 'No components match your filters. Try adjusting your search.'}
                        </p>
                        {components.length === 0 && (
                            <Button onClick={handleCreateClick} className="mt-4 gap-2">
                                <Plus className="h-4 w-4" />
                                Create First Component
                            </Button>
                        )}
                    </div>
                )}

                {/* Form Modal */}
                <ComponentFormModal
                    isOpen={isModalOpen}
                    mode={modalMode}
                    component={selectedComponent}
                    referenceComponents={reference_components}
                    onClose={handleModalClose}
                    onSubmit={() => {
                        // Form now handles submission directly in the modal
                        // This callback is kept for backward compatibility
                    }}
                />
            </div>
        </AppLayout>
    );
}
