import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, DollarSign, User, Building2, CreditCard, Heart } from 'lucide-react';
import type { EmployeePayrollInfo, EmployeePayrollInfoFormData } from '@/types/payroll-pages';

// ============================================================================
// Type Definitions
// ============================================================================

interface EmployeePayrollFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EmployeePayrollInfoFormData) => Promise<void>;
    employee?: EmployeePayrollInfo | null;
    mode?: 'create' | 'edit';
}

interface FormErrors {
    employee_id?: string;
    salary_type?: string;
    basic_salary?: string;
    daily_rate?: string;
    hourly_rate?: string;
    payment_method?: string;
    tax_status?: string;
    [key: string]: string | undefined;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date for input type="date"
 */
function formatDateForInput(date: string | undefined): string {
    if (!date) return '';
    return date.split('T')[0];
}

// ============================================================================
// Component
// ============================================================================

export function EmployeePayrollFormModal({
    isOpen,
    onClose,
    onSubmit,
    employee,
    mode = 'create',
}: EmployeePayrollFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [activeTab, setActiveTab] = useState('salary');

    const [formData, setFormData] = useState<EmployeePayrollInfoFormData>({
        employee_id: employee?.employee_id || 0,
        salary_type: employee?.salary_type || 'monthly',
        basic_salary: employee?.basic_salary || 0,
        daily_rate: employee?.daily_rate,
        hourly_rate: employee?.hourly_rate,
        payment_method: employee?.payment_method || 'bank_transfer',
        tax_status: employee?.tax_status || 'S',
        rdo_code: employee?.rdo_code,
        withholding_tax_exemption: employee?.withholding_tax_exemption || 0,
        is_tax_exempt: employee?.is_tax_exempt || false,
        is_substituted_filing: employee?.is_substituted_filing || false,
        sss_number: employee?.sss_number,
        philhealth_number: employee?.philhealth_number,
        pagibig_number: employee?.pagibig_number,
        tin_number: employee?.tin_number,
        sss_bracket: employee?.sss_bracket,
        is_sss_voluntary: employee?.is_sss_voluntary || false,
        philhealth_is_indigent: employee?.philhealth_is_indigent || false,
        pagibig_employee_rate: employee?.pagibig_employee_rate || 1,
        bank_name: employee?.bank_name,
        bank_code: employee?.bank_code,
        bank_account_number: employee?.bank_account_number,
        bank_account_name: employee?.bank_account_name,
        is_entitled_to_rice: employee?.is_entitled_to_rice ?? true,
        is_entitled_to_uniform: employee?.is_entitled_to_uniform ?? true,
        is_entitled_to_laundry: employee?.is_entitled_to_laundry ?? true,
        is_entitled_to_medical: employee?.is_entitled_to_medical ?? true,
        effective_date: employee?.effective_date ? formatDateForInput(employee.effective_date) : new Date().toISOString().split('T')[0],
        end_date: employee?.end_date ? formatDateForInput(employee.end_date) : undefined,
        is_active: employee?.is_active ?? true,
    });

    // Reset form when modal opens/closes or employee changes
    useEffect(() => {
        if (isOpen && employee) {
            setFormData(prev => ({
                ...prev,
                employee_id: employee.employee_id,
                salary_type: employee.salary_type,
                basic_salary: employee.basic_salary,
                daily_rate: employee.daily_rate,
                hourly_rate: employee.hourly_rate,
                payment_method: employee.payment_method,
                tax_status: employee.tax_status,
                rdo_code: employee.rdo_code,
                withholding_tax_exemption: employee.withholding_tax_exemption,
                is_tax_exempt: employee.is_tax_exempt,
                is_substituted_filing: employee.is_substituted_filing,
                sss_number: employee.sss_number,
                philhealth_number: employee.philhealth_number,
                pagibig_number: employee.pagibig_number,
                tin_number: employee.tin_number,
                sss_bracket: employee.sss_bracket,
                is_sss_voluntary: employee.is_sss_voluntary,
                philhealth_is_indigent: employee.philhealth_is_indigent,
                pagibig_employee_rate: employee.pagibig_employee_rate,
                bank_name: employee.bank_name,
                bank_code: employee.bank_code,
                bank_account_number: employee.bank_account_number,
                bank_account_name: employee.bank_account_name,
                is_entitled_to_rice: employee.is_entitled_to_rice,
                is_entitled_to_uniform: employee.is_entitled_to_uniform,
                is_entitled_to_laundry: employee.is_entitled_to_laundry,
                is_entitled_to_medical: employee.is_entitled_to_medical,
                effective_date: formatDateForInput(employee.effective_date),
                end_date: employee.end_date ? formatDateForInput(employee.end_date) : undefined,
                is_active: employee.is_active,
            }));
            setErrors({});
        }
    }, [isOpen, employee]);

    const handleInputChange = (
        field: keyof EmployeePayrollInfoFormData,
        value: string | number | boolean
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.salary_type) {
            newErrors.salary_type = 'Salary type is required';
        }

        if (formData.salary_type === 'monthly' && !formData.basic_salary) {
            newErrors.basic_salary = 'Basic salary is required for monthly employees';
        }

        if (formData.salary_type === 'daily' && !formData.daily_rate) {
            newErrors.daily_rate = 'Daily rate is required for daily employees';
        }

        if (formData.salary_type === 'hourly' && !formData.hourly_rate) {
            newErrors.hourly_rate = 'Hourly rate is required for hourly employees';
        }

        if (!formData.payment_method) {
            newErrors.payment_method = 'Payment method is required';
        }

        if (!formData.tax_status) {
            newErrors.tax_status = 'Tax status is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Add Employee Payroll Information' : 'Edit Employee Payroll Information'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Configure salary, tax, government, and bank information for the employee'
                            : 'Update employee payroll information and settings'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="salary">Salary</TabsTrigger>
                            <TabsTrigger value="tax">Tax</TabsTrigger>
                            <TabsTrigger value="government">Government</TabsTrigger>
                            <TabsTrigger value="bank">Bank</TabsTrigger>
                            <TabsTrigger value="benefits">Benefits</TabsTrigger>
                        </TabsList>

                        {/* Salary Tab */}
                        <TabsContent value="salary" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-2 items-center">
                                        <DollarSign className="h-5 w-5" />
                                        Salary Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Salary Type */}
                                    <div className="space-y-2">
                                        <Label>Salary Type *</Label>
                                        <Select
                                            value={formData.salary_type}
                                            onValueChange={(value) =>
                                                handleInputChange('salary_type', value)
                                            }
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="hourly">Hourly</SelectItem>
                                                <SelectItem value="contractual">Contractual</SelectItem>
                                                <SelectItem value="project_based">Project-Based</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.salary_type && (
                                            <p className="text-xs text-red-500">{errors.salary_type}</p>
                                        )}
                                    </div>

                                    {/* Basic Salary */}
                                    {formData.salary_type === 'monthly' && (
                                        <div className="space-y-2">
                                            <Label>Basic Salary *</Label>
                                            <Input
                                                type="number"
                                                value={formData.basic_salary || ''}
                                                onChange={(e) =>
                                                    handleInputChange('basic_salary', parseFloat(e.target.value) || 0)
                                                }
                                                disabled={isSubmitting}
                                                min="0"
                                                step="0.01"
                                            />
                                            {errors.basic_salary && (
                                                <p className="text-xs text-red-500">{errors.basic_salary}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Daily Rate */}
                                    {formData.salary_type === 'daily' && (
                                        <div className="space-y-2">
                                            <Label>Daily Rate *</Label>
                                            <Input
                                                type="number"
                                                value={formData.daily_rate || ''}
                                                onChange={(e) =>
                                                    handleInputChange('daily_rate', parseFloat(e.target.value))
                                                }
                                                disabled={isSubmitting}
                                                min="0"
                                                step="0.01"
                                            />
                                            {errors.daily_rate && (
                                                <p className="text-xs text-red-500">{errors.daily_rate}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Hourly Rate */}
                                    {formData.salary_type === 'hourly' && (
                                        <div className="space-y-2">
                                            <Label>Hourly Rate *</Label>
                                            <Input
                                                type="number"
                                                value={formData.hourly_rate || ''}
                                                onChange={(e) =>
                                                    handleInputChange('hourly_rate', parseFloat(e.target.value))
                                                }
                                                disabled={isSubmitting}
                                                min="0"
                                                step="0.01"
                                            />
                                            {errors.hourly_rate && (
                                                <p className="text-xs text-red-500">{errors.hourly_rate}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Payment Method */}
                                    <div className="space-y-2">
                                        <Label>Payment Method *</Label>
                                        <Select
                                            value={formData.payment_method}
                                            onValueChange={(value) =>
                                                handleInputChange('payment_method', value)
                                            }
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="check">Check</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.payment_method && (
                                            <p className="text-xs text-red-500">{errors.payment_method}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tax Tab */}
                        <TabsContent value="tax" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-2 items-center">
                                        <User className="h-5 w-5" />
                                        Tax Information
                                    </CardTitle>
                                    <CardDescription>
                                        Configure employee tax status and withholding exemptions per BIR regulations
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Tax Status */}
                                    <div className="space-y-2">
                                        <Label>Tax Status *</Label>
                                        <Select
                                            value={formData.tax_status}
                                            onValueChange={(value) =>
                                                handleInputChange('tax_status', value)
                                            }
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Z">Zero/Exempt (Z)</SelectItem>
                                                <SelectItem value="S">Single (S)</SelectItem>
                                                <SelectItem value="ME">Married Employee (ME)</SelectItem>
                                                <SelectItem value="S1">Single w/ 1 Dependent</SelectItem>
                                                <SelectItem value="ME1">Married w/ 1 Dependent</SelectItem>
                                                <SelectItem value="S2">Single w/ 2 Dependents</SelectItem>
                                                <SelectItem value="ME2">Married w/ 2 Dependents</SelectItem>
                                                <SelectItem value="S3">Single w/ 3 Dependents</SelectItem>
                                                <SelectItem value="ME3">Married w/ 3 Dependents</SelectItem>
                                                <SelectItem value="S4">Single w/ 4+ Dependents</SelectItem>
                                                <SelectItem value="ME4">Married w/ 4+ Dependents</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.tax_status && (
                                            <p className="text-xs text-red-500">{errors.tax_status}</p>
                                        )}
                                    </div>

                                    {/* RDO Code */}
                                    <div className="space-y-2">
                                        <Label>BIR Revenue District Office (RDO) Code</Label>
                                        <Input
                                            value={formData.rdo_code || ''}
                                            onChange={(e) => handleInputChange('rdo_code', e.target.value)}
                                            placeholder="e.g., NCR-01"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Withholding Tax Exemption */}
                                    <div className="space-y-2">
                                        <Label>Withholding Tax Exemption Amount (₱)</Label>
                                        <Input
                                            type="number"
                                            value={formData.withholding_tax_exemption || ''}
                                            onChange={(e) =>
                                                handleInputChange('withholding_tax_exemption', parseFloat(e.target.value) || 0)
                                            }
                                            disabled={isSubmitting}
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    {/* Tax Exempt Checkbox */}
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_tax_exempt"
                                            checked={formData.is_tax_exempt}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('is_tax_exempt', checked === true)
                                            }
                                            disabled={isSubmitting}
                                        />
                                        <Label htmlFor="is_tax_exempt" className="font-normal cursor-pointer">
                                            Employee is Tax Exempt (Minimum wage earner)
                                        </Label>
                                    </div>

                                    {/* Substituted Filing */}
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_substituted_filing"
                                            checked={formData.is_substituted_filing}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('is_substituted_filing', checked === true)
                                            }
                                            disabled={isSubmitting}
                                        />
                                        <Label htmlFor="is_substituted_filing" className="font-normal cursor-pointer">
                                            Use BIR Substituted Filing
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Government Tab */}
                        <TabsContent value="government" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-2 items-center">
                                        <Building2 className="h-5 w-5" />
                                        Government Numbers & Contributions
                                    </CardTitle>
                                    <CardDescription>
                                        Cached from HR module - Update through HR if needed
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* TIN */}
                                    <div className="space-y-2">
                                        <Label>Tax Identification Number (TIN)</Label>
                                        <Input
                                            value={formData.tin_number || ''}
                                            onChange={(e) => handleInputChange('tin_number', e.target.value)}
                                            placeholder="123-456-789-000"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* SSS Number */}
                                    <div className="space-y-2">
                                        <Label>SSS Number</Label>
                                        <Input
                                            value={formData.sss_number || ''}
                                            onChange={(e) => handleInputChange('sss_number', e.target.value)}
                                            placeholder="00-1234567-8"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* SSS Bracket */}
                                    <div className="space-y-2">
                                        <Label>SSS Bracket</Label>
                                        <Input
                                            value={formData.sss_bracket || ''}
                                            onChange={(e) => handleInputChange('sss_bracket', e.target.value)}
                                            placeholder="e.g., E4"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* SSS Voluntary */}
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_sss_voluntary"
                                            checked={formData.is_sss_voluntary}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('is_sss_voluntary', checked === true)
                                            }
                                            disabled={isSubmitting}
                                        />
                                        <Label htmlFor="is_sss_voluntary" className="font-normal cursor-pointer">
                                            SSS Voluntary Contribution
                                        </Label>
                                    </div>

                                    {/* PhilHealth Number */}
                                    <div className="space-y-2">
                                        <Label>PhilHealth Number</Label>
                                        <Input
                                            value={formData.philhealth_number || ''}
                                            onChange={(e) => handleInputChange('philhealth_number', e.target.value)}
                                            placeholder="00112233445566"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* PhilHealth Indigent */}
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="philhealth_is_indigent"
                                            checked={formData.philhealth_is_indigent}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('philhealth_is_indigent', checked === true)
                                            }
                                            disabled={isSubmitting}
                                        />
                                        <Label htmlFor="philhealth_is_indigent" className="font-normal cursor-pointer">
                                            PhilHealth Indigent (Government sponsored)
                                        </Label>
                                    </div>

                                    {/* Pag-IBIG Number */}
                                    <div className="space-y-2">
                                        <Label>Pag-IBIG Number</Label>
                                        <Input
                                            value={formData.pagibig_number || ''}
                                            onChange={(e) => handleInputChange('pagibig_number', e.target.value)}
                                            placeholder="121912-012-3456789"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Pag-IBIG Employee Rate */}
                                    <div className="space-y-2">
                                        <Label>Pag-IBIG Employee Contribution Rate</Label>
                                        <Select
                                            value={formData.pagibig_employee_rate.toString()}
                                            onValueChange={(value) =>
                                                handleInputChange('pagibig_employee_rate', parseFloat(value))
                                            }
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1% (Regular)</SelectItem>
                                                <SelectItem value="2">2% (Voluntary)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Bank Tab */}
                        <TabsContent value="bank" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-2 items-center">
                                        <CreditCard className="h-5 w-5" />
                                        Bank Information
                                    </CardTitle>
                                    <CardDescription>
                                        For bank transfer payroll processing
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Bank Name */}
                                    <div className="space-y-2">
                                        <Label>Bank Name</Label>
                                        <Input
                                            value={formData.bank_name || ''}
                                            onChange={(e) => handleInputChange('bank_name', e.target.value)}
                                            placeholder="e.g., BDO"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Bank Code */}
                                    <div className="space-y-2">
                                        <Label>Bank Code</Label>
                                        <Input
                                            value={formData.bank_code || ''}
                                            onChange={(e) => handleInputChange('bank_code', e.target.value)}
                                            placeholder="e.g., 006"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Bank Account Number */}
                                    <div className="space-y-2">
                                        <Label>Bank Account Number</Label>
                                        <Input
                                            value={formData.bank_account_number || ''}
                                            onChange={(e) => handleInputChange('bank_account_number', e.target.value)}
                                            placeholder="0100123456789"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Bank Account Name */}
                                    <div className="space-y-2">
                                        <Label>Account Name (As per bank)</Label>
                                        <Input
                                            value={formData.bank_account_name || ''}
                                            onChange={(e) => handleInputChange('bank_account_name', e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Benefits Tab */}
                        <TabsContent value="benefits" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-2 items-center">
                                        <Heart className="h-5 w-5" />
                                        De Minimis Benefits Entitlements
                                    </CardTitle>
                                    <CardDescription>
                                        Non-taxable benefits per BIR regulations
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {/* Rice Allowance */}
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="is_entitled_to_rice"
                                                checked={formData.is_entitled_to_rice}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange('is_entitled_to_rice', checked === true)
                                                }
                                                disabled={isSubmitting}
                                            />
                                            <Label htmlFor="is_entitled_to_rice" className="font-normal cursor-pointer">
                                                Rice Allowance (Max ₱2,000/month)
                                            </Label>
                                        </div>

                                        {/* Uniform Allowance */}
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="is_entitled_to_uniform"
                                                checked={formData.is_entitled_to_uniform}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange('is_entitled_to_uniform', checked === true)
                                                }
                                                disabled={isSubmitting}
                                            />
                                            <Label htmlFor="is_entitled_to_uniform" className="font-normal cursor-pointer">
                                                Uniform Allowance (Max ₱6,000/year)
                                            </Label>
                                        </div>

                                        {/* Laundry Allowance */}
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="is_entitled_to_laundry"
                                                checked={formData.is_entitled_to_laundry}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange('is_entitled_to_laundry', checked === true)
                                                }
                                                disabled={isSubmitting}
                                            />
                                            <Label htmlFor="is_entitled_to_laundry" className="font-normal cursor-pointer">
                                                Laundry Allowance (Max ₱300/month)
                                            </Label>
                                        </div>

                                        {/* Medical Allowance */}
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="is_entitled_to_medical"
                                                checked={formData.is_entitled_to_medical}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange('is_entitled_to_medical', checked === true)
                                                }
                                                disabled={isSubmitting}
                                            />
                                            <Label htmlFor="is_entitled_to_medical" className="font-normal cursor-pointer">
                                                Medical/Hospitalization Benefit (Max ₱1,500/month)
                                            </Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-2 border-t pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            {mode === 'create' ? 'Create' : 'Update'} Payroll Info
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
