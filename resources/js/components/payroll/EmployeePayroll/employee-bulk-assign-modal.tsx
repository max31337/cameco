import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SalaryComponent {
  id: number;
  code: string;
  name: string;
  component_type: 'allowance' | 'deduction' | 'tax' | 'contribution';
  category: string;
  default_amount: number | null;
  is_taxable: boolean;
  is_deminimis: boolean;
}

interface Employee {
  id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
}

export interface BulkAssignFormData {
  employee_ids: number[];
  salary_component_id: number | null;
  amount: string;
  percentage: string;
  units: string;
  frequency: 'per_payroll' | 'monthly' | 'quarterly' | 'semi_annual' | 'annually' | 'one_time';
  effective_date: string;
  end_date: string;
  is_prorated: boolean;
  requires_attendance: boolean;
}

interface EmployeeBulkAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulkAssignFormData) => Promise<void>;
  employees: Employee[];
  components: SalaryComponent[];
  isLoading?: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: 'per_payroll', label: 'Per Payroll' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi_annual', label: 'Semi-Annual' },
  { value: 'annually', label: 'Annually' },
  { value: 'one_time', label: 'One-Time' },
];

export const EmployeeBulkAssignModal: React.FC<EmployeeBulkAssignModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employees,
  components,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<BulkAssignFormData>({
    employee_ids: [],
    salary_component_id: null,
    amount: '',
    percentage: '',
    units: '',
    frequency: 'per_payroll',
    effective_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_prorated: false,
    requires_attendance: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  const selectedComponent = components.find((c) => c.id === formData.salary_component_id);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.employee_ids.length === 0) {
      newErrors.employee_ids = 'Please select at least one employee';
    }

    if (!formData.salary_component_id) {
      newErrors.salary_component_id = 'Component is required';
    }

    // At least one of amount, percentage, or units must be filled
    if (!formData.amount && !formData.percentage && !formData.units) {
      newErrors.amount = 'Please enter amount, percentage, or units';
    }

    if (formData.amount && isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }

    if (formData.percentage && (isNaN(parseFloat(formData.percentage)) || parseFloat(formData.percentage) > 100)) {
      newErrors.percentage = 'Percentage must be between 0 and 100';
    }

    if (!formData.effective_date) {
      newErrors.effective_date = 'Effective date is required';
    }

    if (formData.end_date && formData.end_date <= formData.effective_date) {
      newErrors.end_date = 'End date must be after effective date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        employee_ids: [],
        salary_component_id: null,
        amount: '',
        percentage: '',
        units: '',
        frequency: 'per_payroll',
        effective_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_prorated: false,
        requires_attendance: true,
      });
      setSelectAll(false);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        employee_ids: employees.map((e) => e.id),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        employee_ids: [],
      }));
    }
  };

  const handleEmployeeToggle = (employeeId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      employee_ids: checked
        ? [...prev.employee_ids, employeeId]
        : prev.employee_ids.filter((id) => id !== employeeId),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Assign Component to Employees</DialogTitle>
          <DialogDescription>
            Select employees and assign the same component to all of them at once
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Employee Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">Select Employees *</Label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAllChange}
                  disabled={isLoading}
                />
                Select All
              </label>
            </div>

            {errors.employee_ids && (
              <p className="text-sm text-red-600 mb-2">{errors.employee_ids}</p>
            )}

            <div className="border rounded-lg max-h-48 overflow-y-auto p-3 space-y-2 bg-gray-50">
              {employees.map((employee) => (
                <label
                  key={employee.id}
                  className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer"
                >
                  <Checkbox
                    checked={formData.employee_ids.includes(employee.id)}
                    onCheckedChange={(checked) => handleEmployeeToggle(employee.id, !!checked)}
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {employee.first_name} {employee.last_name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {employee.employee_number} • {employee.department} • {employee.position}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {formData.employee_ids.length > 0 && (
              <p className="text-xs text-gray-600 mt-2">
                {formData.employee_ids.length} employee{formData.employee_ids.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Component Selection */}
          <div>
            <Label htmlFor="component">Component *</Label>
            <Select
              value={formData.salary_component_id?.toString() || ''}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  salary_component_id: parseInt(value),
                }));
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.salary_component_id;
                  return newErrors;
                });
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a component" />
              </SelectTrigger>
              <SelectContent>
                {components.map((component) => (
                  <SelectItem key={component.id} value={component.id.toString()}>
                    {component.code} - {component.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.salary_component_id && (
              <p className="text-sm text-red-600 mt-1">{errors.salary_component_id}</p>
            )}
            {selectedComponent && (
              <div className="text-xs text-gray-600 mt-2">
                Type: {selectedComponent.component_type} • Taxable: {selectedComponent.is_taxable ? 'Yes' : 'No'}
              </div>
            )}
          </div>

          {/* Amount Section */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.amount}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, amount: e.target.value }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.amount;
                    return newErrors;
                  });
                }}
                disabled={isLoading}
              />
              {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
            </div>

            <div>
              <Label htmlFor="percentage">Percentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                placeholder="0"
                step="0.01"
                min="0"
                max="100"
                value={formData.percentage}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, percentage: e.target.value }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.percentage;
                    return newErrors;
                  });
                }}
                disabled={isLoading}
              />
              {errors.percentage && <p className="text-sm text-red-600 mt-1">{errors.percentage}</p>}
            </div>

            <div>
              <Label htmlFor="units">Units</Label>
              <Input
                id="units"
                type="number"
                placeholder="0"
                step="0.01"
                value={formData.units}
                onChange={(e) => setFormData((prev) => ({ ...prev, units: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Frequency and Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    frequency: value as 'per_payroll' | 'monthly' | 'quarterly' | 'semi_annual' | 'annually' | 'one_time',
                  }))
                }
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="effective_date">Effective Date *</Label>
              <Input
                id="effective_date"
                type="date"
                value={formData.effective_date}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, effective_date: e.target.value }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.effective_date;
                    return newErrors;
                  });
                }}
                disabled={isLoading}
              />
              {errors.effective_date && (
                <p className="text-sm text-red-600 mt-1">{errors.effective_date}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, end_date: e.target.value }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.end_date;
                    return newErrors;
                  });
                }}
                disabled={isLoading}
              />
              {errors.end_date && <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_prorated"
                checked={formData.is_prorated}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_prorated: !!checked }))
                }
                disabled={isLoading}
              />
              <Label htmlFor="is_prorated" className="font-normal cursor-pointer">
                Prorated (adjust for partial months)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires_attendance"
                checked={formData.requires_attendance}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, requires_attendance: !!checked }))
                }
                disabled={isLoading}
              />
              <Label htmlFor="requires_attendance" className="font-normal cursor-pointer">
                Requires full attendance
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Assigning...' : `Assign to ${formData.employee_ids.length} Employee${formData.employee_ids.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
