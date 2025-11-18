import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { SalaryComponent, SalaryComponentFormData } from '@/types/payroll-pages';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

interface ComponentFormModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    mode: 'create' | 'edit' | 'view';
    component?: SalaryComponent;
    referenceComponents?: Array<{ id: number; name: string; code: string }>;
    onClose: () => void;
    onSubmit?: (data: SalaryComponentFormData) => void;
}

/**
 * Salary Component Form Modal
 * Handles creation and editing of salary components with all calculation settings and tax treatment options
 */
export function ComponentFormModal({
    isOpen,
    isLoading = false,
    mode,
    component,
    referenceComponents = [],
    onClose,
}: ComponentFormModalProps) {
    const isViewMode = mode === 'view';
    const title =
        mode === 'create'
            ? 'Create Salary Component'
            : mode === 'edit'
              ? 'Edit Salary Component'
              : 'View Salary Component';

    const { data, setData, processing, errors, reset, post, put } =
        useForm<SalaryComponentFormData>({
            name: component?.name || '',
            code: component?.code || '',
            component_type: component?.component_type || 'earning',
            category: component?.category || 'regular',
            calculation_method: component?.calculation_method || 'fixed_amount',
            default_amount: component?.default_amount || undefined,
            default_percentage: component?.default_percentage || undefined,
            reference_component_id: component?.reference_component_id || undefined,
            ot_multiplier: component?.ot_multiplier || undefined,
            is_premium_pay: component?.is_premium_pay || false,
            is_taxable: component?.is_taxable !== false,
            is_deminimis: component?.is_deminimis || false,
            deminimis_limit_monthly: component?.deminimis_limit_monthly || undefined,
            deminimis_limit_annual: component?.deminimis_limit_annual || undefined,
            is_13th_month: component?.is_13th_month || false,
            is_other_benefits: component?.is_other_benefits || false,
            affects_sss: component?.affects_sss || false,
            affects_philhealth: component?.affects_philhealth || false,
            affects_pagibig: component?.affects_pagibig || false,
            affects_gross_compensation: component?.affects_gross_compensation !== false,
            display_order: component?.display_order || 0,
            is_displayed_on_payslip: component?.is_displayed_on_payslip !== false,
            is_active: component?.is_active !== false,
        });

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post('/payroll/salary-components');
        } else if (mode === 'edit' && component) {
            put(`/payroll/salary-components/${component.id}`);
        }
    };

    const isLoadingOrProcessing = isLoading || processing;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create' && 'Create a new salary component for payroll calculations'}
                        {mode === 'edit' && 'Update the salary component details'}
                        {mode === 'view' && 'View salary component information'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="calculation">Calculation</TabsTrigger>
                            <TabsTrigger value="tax">Tax Treatment</TabsTrigger>
                            <TabsTrigger value="government">Government</TabsTrigger>
                        </TabsList>

                        {/* BASIC INFORMATION TAB */}
                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Component Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Basic Salary, Overtime Regular"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={isViewMode || isLoadingOrProcessing}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">Component Code *</Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g., BASIC, OT_REG"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        disabled={isViewMode || isLoadingOrProcessing || mode === 'edit'}
                                    />
                                    {errors.code && (
                                        <p className="text-xs text-red-600">{errors.code}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="component_type">Component Type *</Label>
                                    <Select
                                        value={data.component_type}
                                        onValueChange={(value: 'earning' | 'deduction' | 'benefit' | 'tax' | 'contribution' | 'loan' | 'allowance') => setData('component_type', value)}
                                        disabled={isViewMode || isLoadingOrProcessing}
                                    >
                                        <SelectTrigger id="component_type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="earning">Earning</SelectItem>
                                            <SelectItem value="deduction">Deduction</SelectItem>
                                            <SelectItem value="benefit">Benefit</SelectItem>
                                            <SelectItem value="tax">Tax</SelectItem>
                                            <SelectItem value="contribution">Contribution</SelectItem>
                                            <SelectItem value="loan">Loan</SelectItem>
                                            <SelectItem value="allowance">Allowance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.component_type && (
                                        <p className="text-xs text-red-600">{errors.component_type}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value: 'regular' | 'overtime' | 'holiday' | 'leave' | 'allowance' | 'deduction' | 'tax' | 'contribution' | 'loan' | 'adjustment') => setData('category', value)}
                                        disabled={isViewMode || isLoadingOrProcessing}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="regular">Regular</SelectItem>
                                            <SelectItem value="overtime">Overtime</SelectItem>
                                            <SelectItem value="holiday">Holiday</SelectItem>
                                            <SelectItem value="leave">Leave</SelectItem>
                                            <SelectItem value="allowance">Allowance</SelectItem>
                                            <SelectItem value="deduction">Deduction</SelectItem>
                                            <SelectItem value="tax">Tax</SelectItem>
                                            <SelectItem value="contribution">Contribution</SelectItem>
                                            <SelectItem value="loan">Loan</SelectItem>
                                            <SelectItem value="adjustment">Adjustment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-xs text-red-600">{errors.category}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="display_order">Display Order on Payslip</Label>
                                <Input
                                    id="display_order"
                                    type="number"
                                    placeholder="0"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <p className="text-xs text-gray-500">Lower numbers appear first</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_displayed_on_payslip"
                                    checked={data.is_displayed_on_payslip}
                                    onCheckedChange={(checked) =>
                                        setData('is_displayed_on_payslip', checked as boolean)
                                    }
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="is_displayed_on_payslip" className="font-normal">
                                    Display on Payslip
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="is_active" className="font-normal">
                                    Active
                                </Label>
                            </div>
                        </TabsContent>

                        {/* CALCULATION SETTINGS TAB */}
                        <TabsContent value="calculation" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="calculation_method">Calculation Method *</Label>
                                <Select
                                    value={data.calculation_method}
                                    onValueChange={(value: 'fixed_amount' | 'percentage_of_basic' | 'percentage_of_gross' | 'per_hour' | 'per_day' | 'per_unit' | 'percentage_of_component') => setData('calculation_method', value)}
                                    disabled={isViewMode || isLoadingOrProcessing}
                                >
                                    <SelectTrigger id="calculation_method">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                                        <SelectItem value="percentage_of_basic">
                                            Percentage of Basic Salary
                                        </SelectItem>
                                        <SelectItem value="percentage_of_gross">
                                            Percentage of Gross Pay
                                        </SelectItem>
                                        <SelectItem value="per_hour">Per Hour</SelectItem>
                                        <SelectItem value="per_day">Per Day</SelectItem>
                                        <SelectItem value="per_unit">Per Unit</SelectItem>
                                        <SelectItem value="percentage_of_component">
                                            Percentage of Component
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Fixed Amount */}
                            {['fixed_amount', 'per_hour', 'per_day', 'per_unit'].includes(
                                data.calculation_method
                            ) && (
                                <div className="space-y-2">
                                    <Label htmlFor="default_amount">
                                        {data.calculation_method === 'fixed_amount' ? 'Amount' : 'Rate'}
                                    </Label>
                                    <Input
                                        id="default_amount"
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        value={data.default_amount || ''}
                                        onChange={(e) =>
                                            setData(
                                                'default_amount',
                                                e.target.value ? parseFloat(e.target.value) : undefined
                                            )
                                        }
                                        disabled={isViewMode || isLoadingOrProcessing}
                                    />
                                </div>
                            )}

                            {/* Percentage */}
                            {data.calculation_method.includes('percentage') && (
                                <div className="space-y-2">
                                    <Label htmlFor="default_percentage">Percentage (%)</Label>
                                    <Input
                                        id="default_percentage"
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        value={data.default_percentage || ''}
                                        onChange={(e) =>
                                            setData(
                                                'default_percentage',
                                                e.target.value ? parseFloat(e.target.value) : undefined
                                            )
                                        }
                                        disabled={isViewMode || isLoadingOrProcessing}
                                    />
                                </div>
                            )}

                            {/* Reference Component */}
                            {data.calculation_method === 'percentage_of_component' && (
                                <div className="space-y-2">
                                    <Label htmlFor="reference_component_id">Reference Component</Label>
                                    <Select
                                        value={
                                            data.reference_component_id ? data.reference_component_id.toString() : 'none'
                                        }
                                        onValueChange={(value) =>
                                            setData('reference_component_id', value === 'none' ? undefined : parseInt(value))
                                        }
                                        disabled={isViewMode || isLoadingOrProcessing}
                                    >
                                        <SelectTrigger id="reference_component_id">
                                            <SelectValue placeholder="Select a component" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">-- Select a component --</SelectItem>
                                            {referenceComponents.map((comp) => (
                                                <SelectItem key={comp.id} value={comp.id.toString()}>
                                                    {comp.name} ({comp.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Overtime Multiplier */}
                            {data.category === 'overtime' && (
                                <div className="space-y-2">
                                    <Label htmlFor="ot_multiplier">Overtime Multiplier</Label>
                                    <Select
                                        value={data.ot_multiplier?.toString() || ''}
                                        onValueChange={(value) =>
                                            setData('ot_multiplier', parseFloat(value))
                                        }
                                        disabled={isViewMode || isLoadingOrProcessing}
                                    >
                                        <SelectTrigger id="ot_multiplier">
                                            <SelectValue placeholder="Select multiplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1.25">1.25x</SelectItem>
                                            <SelectItem value="1.30">1.30x</SelectItem>
                                            <SelectItem value="1.50">1.50x</SelectItem>
                                            <SelectItem value="2">2.00x</SelectItem>
                                            <SelectItem value="2.60">2.60x</SelectItem>
                                            <SelectItem value="3">3.00x</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_premium_pay"
                                    checked={data.is_premium_pay}
                                    onCheckedChange={(checked) =>
                                        setData('is_premium_pay', checked as boolean)
                                    }
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="is_premium_pay" className="font-normal">
                                    Is Premium Pay (e.g., Night Differential, Holiday Pay)
                                </Label>
                            </div>
                        </TabsContent>

                        {/* TAX TREATMENT TAB */}
                        <TabsContent value="tax" className="space-y-4">
                            <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                                <p className="text-xs text-blue-800">
                                    Configure how this component affects employee tax calculations
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_taxable"
                                    checked={data.is_taxable}
                                    onCheckedChange={(checked) => setData('is_taxable', checked as boolean)}
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="is_taxable" className="font-normal">
                                    Is Taxable (included in withholding tax calculation)
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_deminimis"
                                    checked={data.is_deminimis}
                                    onCheckedChange={(checked) => setData('is_deminimis', checked as boolean)}
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="is_deminimis" className="font-normal">
                                    Is De Minimis Benefit (non-taxable allowance)
                                </Label>
                            </div>

                            {data.is_deminimis && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="deminimis_limit_monthly">
                                            Monthly Limit
                                        </Label>
                                        <Input
                                            id="deminimis_limit_monthly"
                                            type="number"
                                            placeholder="2000.00"
                                            step="0.01"
                                            value={data.deminimis_limit_monthly || ''}
                                            onChange={(e) =>
                                                setData(
                                                    'deminimis_limit_monthly',
                                                    e.target.value ? parseFloat(e.target.value) : undefined
                                                )
                                            }
                                            disabled={isViewMode || isLoadingOrProcessing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deminimis_limit_annual">
                                            Annual Limit
                                        </Label>
                                        <Input
                                            id="deminimis_limit_annual"
                                            type="number"
                                            placeholder="10000.00"
                                            step="0.01"
                                            value={data.deminimis_limit_annual || ''}
                                            onChange={(e) =>
                                                setData(
                                                    'deminimis_limit_annual',
                                                    e.target.value ? parseFloat(e.target.value) : undefined
                                                )
                                            }
                                            disabled={isViewMode || isLoadingOrProcessing}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_13th_month"
                                    checked={data.is_13th_month}
                                    onCheckedChange={(checked) => setData('is_13th_month', checked as boolean)}
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="is_13th_month" className="font-normal">
                                    Is 13th Month Pay (annual special compensation)
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_other_benefits"
                                    checked={data.is_other_benefits}
                                    onCheckedChange={(checked) => setData('is_other_benefits', checked as boolean)}
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="is_other_benefits" className="font-normal">
                                    Is Other Benefits Pay (OBP - taxable benefits)
                                </Label>
                            </div>
                        </TabsContent>

                        {/* GOVERNMENT CONTRIBUTION TAB */}
                        <TabsContent value="government" className="space-y-4">
                            <div className="rounded-md border border-indigo-200 bg-indigo-50 p-3">
                                <p className="text-xs text-indigo-800">
                                    Select which government contributions this component affects
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="affects_sss"
                                    checked={data.affects_sss}
                                    onCheckedChange={(checked) => setData('affects_sss', checked as boolean)}
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="affects_sss" className="font-normal">
                                    Affects SSS Contribution
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="affects_philhealth"
                                    checked={data.affects_philhealth}
                                    onCheckedChange={(checked) =>
                                        setData('affects_philhealth', checked as boolean)
                                    }
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="affects_philhealth" className="font-normal">
                                    Affects PhilHealth Contribution
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="affects_pagibig"
                                    checked={data.affects_pagibig}
                                    onCheckedChange={(checked) => setData('affects_pagibig', checked as boolean)}
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="affects_pagibig" className="font-normal">
                                    Affects Pag-IBIG Contribution
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="affects_gross_compensation"
                                    checked={data.affects_gross_compensation}
                                    onCheckedChange={(checked) =>
                                        setData('affects_gross_compensation', checked as boolean)
                                    }
                                    disabled={isViewMode || isLoadingOrProcessing}
                                />
                                <Label htmlFor="affects_gross_compensation" className="font-normal">
                                    Affects Gross Compensation (for BIR reporting)
                                </Label>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Form Footer */}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoadingOrProcessing}
                        >
                            {isViewMode ? 'Close' : 'Cancel'}
                        </Button>
                        {!isViewMode && (
                            <Button
                                type="submit"
                                disabled={isLoadingOrProcessing}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {mode === 'create' ? 'Create Component' : 'Update Component'}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
