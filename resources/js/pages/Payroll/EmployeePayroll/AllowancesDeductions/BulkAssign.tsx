import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
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
import { Card } from '@/components/ui/card';

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

interface BulkAssignFormData {
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

interface BulkAssignPageProps {
  employees: Employee[];
  components: SalaryComponent[];
}

const FREQUENCY_OPTIONS = [
  { value: 'per_payroll', label: 'Per Payroll' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi_annual', label: 'Semi-Annual' },
  { value: 'annually', label: 'Annually' },
  { value: 'one_time', label: 'One-Time' },
];

export default function BulkAssignPage({ employees, components }: BulkAssignPageProps) {
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
  const [isLoading, setIsLoading] = useState(false);

  const selectedComponent = components.find((c) => c.id === formData.salary_component_id);

  const breadcrumb = [
    { title: 'Payroll', href: '/payroll' },
    { title: 'Allowances & Deductions', href: '/payroll/allowances-deductions' },
    { title: 'Bulk Assign', href: '/payroll/allowances-deductions/bulk-assign' },
  ];

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

    setIsLoading(true);
    try {
      const response = await fetch('/payroll/allowances-deductions/bulk-assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          employee_ids: formData.employee_ids,
          salary_component_id: formData.salary_component_id,
          amount: formData.amount ? parseFloat(formData.amount) : null,
          percentage: formData.percentage ? parseFloat(formData.percentage) : null,
          units: formData.units ? parseFloat(formData.units) : null,
          frequency: formData.frequency,
          effective_date: formData.effective_date,
          end_date: formData.end_date || null,
          is_prorated: formData.is_prorated,
          requires_attendance: formData.requires_attendance,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to bulk assign components');
      }

      alert(`Successfully assigned component to ${formData.employee_ids.length} employee${formData.employee_ids.length !== 1 ? 's' : ''}`);
      router.visit('/payroll/allowances-deductions');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
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

  const handleCancel = () => {
    router.visit('/payroll/allowances-deductions');
  };

  return (
    <AppLayout breadcrumbs={breadcrumb}>
      <Head title="Bulk Assign Component" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Assign Component</h1>
              <p className="text-gray-600 mt-1">Assign a component to multiple employees at once</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: Employee Selection */}
            <Card className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-lg">Select Employees *</Label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAllChange}
                        disabled={isLoading}
                      />
                      Select All
                    </label>
                  </div>

                  {errors.employee_ids && (
                    <p className="text-sm text-red-600">{errors.employee_ids}</p>
                  )}

                  {/* Search */}
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Department Filter */}
                  <div>
                    <Label className="block text-sm font-medium mb-2">Department</Label>
                    <Select
                      value={selectedDepartment || 'all'}
                      onValueChange={(value) => setSelectedDepartment(value === 'all' ? null : value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Employee List */}
                <div className="border rounded-lg bg-white max-h-[500px] overflow-y-auto">
                  <div className="space-y-2 p-4">
                    {filteredEmployees.length === 0 ? (
                      <p className="p-4 text-center text-sm font-medium text-gray-500">No employees found</p>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <label
                          key={employee.id}
                          className="flex items-start gap-3 rounded-md border border-transparent p-3 transition-colors hover:border-blue-200 hover:bg-gray-50 cursor-pointer"
                        >
                          <Checkbox
                            checked={formData.employee_ids.includes(employee.id)}
                            onCheckedChange={(checked) => handleEmployeeToggle(employee.id, !!checked)}
                            disabled={isLoading}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900">
                              {employee.first_name} {employee.last_name}
                            </div>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              <div className="font-medium">{employee.employee_number}</div>
                              <div className="text-gray-500">{employee.department}</div>
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {formData.employee_ids.length > 0 && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
                    <p className="text-sm font-semibold text-blue-800">
                      ✓ {formData.employee_ids.length} of {filteredEmployees.length} employees selected
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Right Column: Assignment Details */}
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold">Assignment Details</Label>
                </div>

                {/* Component Selection */}
                <div>
                  <Label htmlFor="component" className="block text-sm font-medium mb-2">Component *</Label>
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
                    <SelectTrigger>
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
                    <p className="text-xs text-red-600 mt-1">{errors.salary_component_id}</p>
                  )}
                  {selectedComponent && (
                    <div className="text-xs text-gray-600 mt-2 p-3 bg-gray-50 rounded border space-y-1">
                      <div>Type: <span className="font-semibold">{selectedComponent.component_type}</span></div>
                      <div>Taxable: <span className="font-semibold">{selectedComponent.is_taxable ? 'Yes' : 'No'}</span></div>
                      <div>De minimis: <span className="font-semibold">{selectedComponent.is_deminimis ? 'Yes' : 'No'}</span></div>
                    </div>
                  )}
                </div>

                {/* Amount Section */}
                <div>
                  <Label className="block text-sm font-semibold mb-3">Amount / % / Units</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="amount" className="block text-sm mb-2">Amount</Label>
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
                      {errors.amount && <p className="text-xs text-red-600 mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                      <Label htmlFor="percentage" className="block text-sm mb-2">Percentage</Label>
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
                      {errors.percentage && <p className="text-xs text-red-600 mt-1">{errors.percentage}</p>}
                    </div>

                    <div>
                      <Label htmlFor="units" className="block text-sm mb-2">Units</Label>
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
                </div>

                {/* Schedule Section */}
                <div>
                  <Label className="block text-sm font-semibold mb-3">Schedule</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="frequency" className="block text-sm mb-2">Frequency *</Label>
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
                        <SelectTrigger>
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
                      <Label htmlFor="effective_date" className="block text-sm mb-2">Effective Date *</Label>
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
                        <p className="text-xs text-red-600 mt-1">{errors.effective_date}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="end_date" className="block text-sm mb-2">End Date</Label>
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
                      {errors.end_date && <p className="text-xs text-red-600 mt-1">{errors.end_date}</p>}
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-sm font-semibold">Options</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="is_prorated"
                      checked={formData.is_prorated}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, is_prorated: !!checked }))
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor="is_prorated" className="cursor-pointer font-normal text-sm">
                      Prorated
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="requires_attendance"
                      checked={formData.requires_attendance}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, requires_attendance: !!checked }))
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor="requires_attendance" className="cursor-pointer font-normal text-sm">
                      Requires attendance
                    </Label>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || formData.employee_ids.length === 0}>
              {isLoading ? 'Assigning...' : `Assign to ${formData.employee_ids.length} Employee${formData.employee_ids.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
