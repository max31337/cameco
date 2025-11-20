import React, { useState, useMemo } from 'react';
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
import { Search } from 'lucide-react';

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
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const selectedComponent = components.find((c) => c.id === formData.salary_component_id);

  // Get unique departments from employees
  const departments = Array.from(new Set(employees.map((e) => e.department))).sort();

  // Filter employees based on search and department
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        !searchText ||
        emp.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.employee_number.toLowerCase().includes(searchText.toLowerCase());

      const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchText, selectedDepartment]);

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
        employee_ids: filteredEmployees.map((e) => e.id),
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
      <DialogContent className="max-w-[95vw] max-h-[90vh] flex flex-col p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg">Bulk Assign Component to Employees</DialogTitle>
          <DialogDescription className="text-sm">
            Select employees and assign the same component to all of them at once
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1 overflow-hidden">
          {submitError && (
            <Alert variant="destructive" className="mb-3">
              <AlertDescription className="text-sm">{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
            {/* Left Column: Employee Selection */}
            <div className="col-span-4 flex flex-col gap-5 overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-semibold text-base">Select Employees *</Label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      disabled={isLoading}
                    />
                    All
                  </label>
                </div>

                {errors.employee_ids && (
                  <p className="text-xs text-red-600 mt-1">{errors.employee_ids}</p>
                )}

                {/* Search */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search employees..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10 text-sm py-2.5 h-auto font-medium"
                    disabled={isLoading}
                  />
                </div>

                {/* Department Filter */}
                <div>
                  <Label className="text-sm block mb-2 font-medium">Department</Label>
                  <Select
                    value={selectedDepartment || 'all'}
                    onValueChange={(value) => setSelectedDepartment(value === 'all' ? null : value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="text-sm py-2.5 h-auto">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept} className="text-sm">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Employee List */}
              <div className="border-2 border-gray-200 rounded-lg bg-gray-50 flex-1 overflow-y-auto flex flex-col">
                <div className="space-y-2 p-4 flex-1 overflow-y-auto">
                  {filteredEmployees.length === 0 ? (
                    <p className="text-sm text-gray-500 p-4 text-center font-medium">No employees found</p>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <label
                        key={employee.id}
                        className="flex items-start gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                      >
                        <Checkbox
                          checked={formData.employee_ids.includes(employee.id)}
                          onCheckedChange={(checked) => handleEmployeeToggle(employee.id, !!checked)}
                          disabled={isLoading}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base text-gray-900">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1 mt-1">
                            <div className="truncate font-medium">{employee.employee_number}</div>
                            <div className="truncate text-gray-500">{employee.department}</div>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {formData.employee_ids.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800 font-semibold">
                    ✓ {formData.employee_ids.length} of {filteredEmployees.length} employees selected
                  </p>
                </div>
              )}
            </div>

            {/* Right Columns: Assignment Details */}
            <div className="col-span-8 space-y-6 overflow-y-auto pr-4">
              {/* Component Selection */}
              <div>
                <Label htmlFor="component" className="text-sm font-medium block mb-1">Component *</Label>
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
                  <SelectTrigger className="text-xs py-1.5 h-auto">
                    <SelectValue placeholder="Select a component" />
                  </SelectTrigger>
                  <SelectContent>
                    {components.map((component) => (
                      <SelectItem key={component.id} value={component.id.toString()} className="text-xs">
                        {component.code} - {component.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.salary_component_id && (
                  <p className="text-xs text-red-600 mt-0.5">{errors.salary_component_id}</p>
                )}
                {selectedComponent && (
                  <div className="text-xs text-gray-600 mt-1.5 p-1.5 bg-gray-100 rounded border space-y-0.5">
                    <div>Type: <span className="font-semibold text-xs">{selectedComponent.component_type}</span></div>
                    <div>Taxable: <span className="font-semibold text-xs">{selectedComponent.is_taxable ? 'Yes' : 'No'}</span></div>
                    <div>De minimis: <span className="font-semibold text-xs">{selectedComponent.is_deminimis ? 'Yes' : 'No'}</span></div>
                  </div>
                )}
              </div>

              {/* Amount Section */}
              <div>
                <Label className="font-semibold text-sm block mb-2">Amount / % / Units</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="amount" className="text-xs block mb-1">Amount</Label>
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
                      className="text-xs py-2 h-auto"
                    />
                    {errors.amount && <p className="text-xs text-red-600 mt-0.5">{errors.amount}</p>}
                  </div>

                  <div>
                    <Label htmlFor="percentage" className="text-xs block mb-1">Percentage</Label>
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
                      className="text-xs py-2 h-auto"
                    />
                    {errors.percentage && <p className="text-xs text-red-600 mt-0.5">{errors.percentage}</p>}
                  </div>

                  <div>
                    <Label htmlFor="units" className="text-xs block mb-1">Units</Label>
                    <Input
                      id="units"
                      type="number"
                      placeholder="0"
                      step="0.01"
                      value={formData.units}
                      onChange={(e) => setFormData((prev) => ({ ...prev, units: e.target.value }))}
                      disabled={isLoading}
                      className="text-xs py-2 h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Frequency and Dates */}
              <div>
                <Label className="font-semibold text-sm block mb-2">Schedule</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="frequency" className="text-xs block mb-1">Frequency *</Label>
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
                      <SelectTrigger className="text-xs py-2 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-xs">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="effective_date" className="text-xs block mb-1">Effective Date *</Label>
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
                      className="text-xs py-2 h-auto"
                    />
                    {errors.effective_date && (
                      <p className="text-xs text-red-600 mt-0.5">{errors.effective_date}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="end_date" className="text-xs block mb-1">End Date</Label>
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
                      className="text-xs py-2 h-auto"
                    />
                    {errors.end_date && <p className="text-xs text-red-600 mt-0.5">{errors.end_date}</p>}
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-1.5 pt-1.5 border-t">
                <Label className="font-semibold text-sm">Options</Label>
                <div className="flex items-center gap-2 text-xs">
                  <Checkbox
                    id="is_prorated"
                    checked={formData.is_prorated}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_prorated: !!checked }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="is_prorated" className="font-normal cursor-pointer text-xs">
                    Prorated
                  </Label>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Checkbox
                    id="requires_attendance"
                    checked={formData.requires_attendance}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, requires_attendance: !!checked }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="requires_attendance" className="font-normal cursor-pointer text-xs">
                    Requires attendance
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-3 border-t">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="text-xs px-3 py-1 h-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || formData.employee_ids.length === 0} className="text-xs px-3 py-1 h-auto">
              {isLoading ? 'Assigning...' : `Assign to ${formData.employee_ids.length} Employee${formData.employee_ids.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
