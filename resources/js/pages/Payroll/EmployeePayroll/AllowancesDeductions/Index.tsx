import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Plus, Search, Upload } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { EmployeeComponentsTable, EmployeeComponent } from '@/components/payroll/EmployeePayroll/employee-components-table';
import {
  EmployeeComponentAssignModal,
  EmployeeComponentAssignmentFormData,
} from '@/components/payroll/EmployeePayroll/employee-component-assign-modal';

interface SalaryComponent {
  id: number;
  code: string;
  name: string;
  component_type: 'allowance' | 'deduction' | 'tax' | 'contribution';
  category: string;
  description: string;
  default_amount: number | null;
  is_taxable: boolean;
  is_deminimis: boolean;
}

interface Department {
  id: number;
  code: string;
  name: string;
}

interface ComponentType {
  id: string;
  name: string;
}

interface EmployeeComponentData {
  id: number;
  employee_id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  department: string;
  department_id: number;
  position: string;
  components: EmployeeComponent[];
  total_allowances: number;
  total_deductions: number;
}

interface AllowancesDeductionsPageProps {
  employeeComponents: EmployeeComponentData[];
  components: SalaryComponent[];
  departments: Department[];
  componentTypes: ComponentType[];
  filters: {
    search: string;
    department_id: number | null;
    status: string;
    component_type: string | null;
  };
}

interface HistoryItem {
  id: number;
  employee_id: number;
  component_id: number;
  component_name: string;
  amount: number | null;
  percentage: number | null;
  frequency: string;
  effective_date: string;
  end_date: string | null;
  status: 'active' | 'expired';
  changed_at: string;
  changed_by: string;
}

export default function AllowancesDeductionsIndex({
  employeeComponents,
  components,
  departments,
  componentTypes,
  filters: initialFilters,
}: AllowancesDeductionsPageProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<EmployeeComponentAssignmentFormData | undefined>();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Filter employees based on current filters
  const filteredEmployees = employeeComponents.filter((emp) => {
    let match = true;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      match =
        match &&
        (emp.first_name.toLowerCase().includes(search) ||
          emp.last_name.toLowerCase().includes(search) ||
          emp.employee_number.toLowerCase().includes(search));
    }

    if (filters.department_id) {
      match = match && emp.department_id === filters.department_id;
    }

    if (filters.component_type) {
      match =
        match &&
        emp.components.some((c) => c.component_type === filters.component_type);
    }

    return match;
  });

  const handleAssignComponent = async (data: EmployeeComponentAssignmentFormData) => {
    setIsLoading(true);
    try {
      // In a real app, this would call the backend API with the data parameter
      // TODO: Replace with actual API call using POST request with data
      console.log('Assigning component with data:', data);
      await new Promise((resolve) => setTimeout(resolve, 500));

      alert('Component assigned successfully');
      setIsModalOpen(false);
      setEditingAssignment(undefined);

      // Reload page or update local state
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAssignment = (assignment: EmployeeComponent, employeeId: number) => {
    setEditingAssignment({
      employee_id: employeeId,
      salary_component_id: assignment.salary_component_id,
      amount: assignment.amount?.toString() || '',
      percentage: assignment.percentage?.toString() || '',
      units: assignment.units?.toString() || '',
      frequency: assignment.frequency,
      effective_date: assignment.effective_date,
      end_date: assignment.end_date || '',
      is_prorated: assignment.is_prorated,
      requires_attendance: assignment.requires_attendance,
    });
    setIsModalOpen(true);
  };

  const handleDeleteAssignment = async (employeeId: number) => {
    if (confirm('Are you sure you want to remove this component assignment?')) {
      setIsLoading(true);
      try {
        // In a real app, this would call the backend API with employeeId
        console.log('Deleting assignment for employee:', employeeId);
        await new Promise((resolve) => setTimeout(resolve, 500));

        alert('Component assignment deleted successfully');
        window.location.reload();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewHistory = async (employeeId: number, componentId: number) => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from the backend API
      // Mock data structure shown
      setHistoryData([
        {
          id: 1,
          employee_id: employeeId,
          component_id: componentId,
          component_name: 'Component Name',
          amount: 2000,
          percentage: null,
          frequency: 'per_payroll',
          effective_date: '2025-01-01',
          end_date: '2025-10-31',
          status: 'expired',
          changed_at: '2025-10-31',
          changed_by: 'Admin User',
        },
      ]);
      setShowHistory(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAssign = () => {
    // TODO: Implement bulk assignment logic
    alert('Bulk assignment feature coming soon');
  };

  const employees = employeeComponents.map((emp) => ({
    id: emp.employee_id,
    employee_number: emp.employee_number,
    first_name: emp.first_name,
    last_name: emp.last_name,
    department: emp.department,
    position: emp.position,
  }));

  return (
    <AppLayout>
      <Head title="Allowances & Deductions" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Allowances & Deductions</h1>
            <p className="text-gray-600 mt-1">Manage employee salary components and assignments</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBulkAssign}>
              <Upload size={16} className="mr-2" />
              Bulk Assign
            </Button>
            <Button onClick={() => {
              setEditingAssignment(undefined);
              setIsModalOpen(true);
            }}>
              <Plus size={16} className="mr-2" />
              Assign Component
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Employees</div>
            <div className="text-2xl font-bold mt-2">{employeeComponents.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Components</div>
            <div className="text-2xl font-bold mt-2">{components.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Active Assignments</div>
            <div className="text-2xl font-bold mt-2">
              {employeeComponents.reduce((sum, emp) => sum + emp.components.length, 0)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Allowances</div>
            <div className="text-2xl font-bold mt-2 text-green-600">
              ₱{employeeComponents
                .reduce((sum, emp) => sum + emp.total_allowances, 0)
                .toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative mt-1">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Name or employee #"
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Department</label>
              <Select
                value={filters.department_id?.toString() || ''}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    department_id: value ? parseInt(value) : null,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Component Type</label>
              <Select
                value={filters.component_type || ''}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, component_type: value || null }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {componentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <EmployeeComponentsTable
          data={filteredEmployees}
          onEdit={handleEditAssignment}
          onDelete={handleDeleteAssignment}
          onViewHistory={handleViewHistory}
          isLoading={isLoading}
        />

        {/* Modal */}
        <EmployeeComponentAssignModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAssignment(undefined);
          }}
          onSubmit={handleAssignComponent}
          employees={employees}
          components={components}
          initialData={editingAssignment}
          isLoading={isLoading}
          mode={editingAssignment ? 'edit' : 'create'}
        />

        {/* History Dialog */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 flex flex-col">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Component Assignment History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {historyData.length === 0 ? (
                  <p className="text-gray-500">No history found</p>
                ) : (
                  <div className="space-y-4">
                    {historyData.map((item) => (
                      <div key={item.id} className="border rounded p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{item.component_name}</h3>
                            <p className="text-sm text-gray-600">
                              {item.amount && `₱${item.amount.toLocaleString('en-PH')}`}
                              {item.percentage && `${item.percentage}%`}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              item.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Effective: {new Date(item.effective_date).toLocaleDateString()}
                          {item.end_date && ` - ${new Date(item.end_date).toLocaleDateString()}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          Changed by {item.changed_by} on {new Date(item.changed_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
