import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { EmployeeCalculationPreview, EmployeeCalculationDetail } from '@/types/payroll-review-types';
import { Search, AlertCircle } from 'lucide-react';

interface EmployeeCalculationDetailsProps {
    employees: EmployeeCalculationPreview[];
    selectedEmployeeId: number | null;
    onSelectEmployee: (employeeId: number | null) => void;
}

// Mock detailed calculation data
const getMockDetailedCalculation = (employeeId: number): EmployeeCalculationDetail => {
    const preview = {
        id: employeeId,
        employee_id: employeeId,
        employee_name: 'Sample Employee',
        employee_number: 'EMP-001',
        department: 'Engineering',
        position: 'Senior Engineer',
    };

    return {
        id: employeeId,
        payroll_calculation_id: 1,
        payroll_period_id: 1,
        employee_id: employeeId,
        employee_name: preview.employee_name,
        employee_number: preview.employee_number,
        department: preview.department,
        position: preview.position,
        employment_status: 'Active',
        salary_type: 'Monthly',
        basic_salary: 50000,
        daily_rate: 2500,
        hourly_rate: 312.5,
        scheduled_days: 22,
        days_worked: 21,
        days_absent: 1,
        days_late: 0,
        days_undertime: 0,
        regular_hours: 168,
        overtime_regular_hours: 8,
        overtime_restday_hours: 0,
        overtime_special_holiday_hours: 0,
        overtime_regular_holiday_hours: 0,
        night_differential_hours: 0,
        regular_holiday_hours: 0,
        special_holiday_hours: 0,
        basic_pay: 47727.27,
        overtime_pay: 1250,
        night_differential_pay: 0,
        holiday_pay: 0,
        leave_pay: 0,
        allowances: {
            rice_allowance: 2000,
            cola: 1000,
        },
        bonuses: 0,
        incentives: 0,
        commissions: 0,
        gross_pay: 52000,
        non_taxable_earnings: 3000,
        total_earnings: 55000,
        sss_employee: 1500,
        philhealth_employee: 900,
        pagibig_employee: 200,
        withholding_tax: 1850,
        tardiness_deduction: 0,
        undertime_deduction: 0,
        absence_deduction: 0,
        sss_loan: 0,
        pagibig_loan: 0,
        company_loan: 0,
        cash_advance: 0,
        other_deductions: 0,
        total_statutory_deductions: 4450,
        total_other_deductions: 0,
        total_deductions: 4450,
        net_pay: 50550,
        sss_employer: 2000,
        philhealth_employer: 1000,
        pagibig_employer: 250,
        employer_contributions: 3250,
        total_employer_cost: 55250,
        ytd_gross: 520000,
        ytd_net_pay: 505500,
        ytd_tax: 18500,
        has_adjustments: false,
        has_errors: false,
        calculation_date: new Date().toISOString(),
        calculated_by: 'System',
    };
};

export function EmployeeCalculationDetails({
    employees,
    selectedEmployeeId,
    onSelectEmployee,
}: EmployeeCalculationDetailsProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEmployees = useMemo(() => {
        return employees.filter(
            (emp) =>
                emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.employee_number.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [employees, searchQuery]);

    const selectedDetail = selectedEmployeeId
        ? getMockDetailedCalculation(selectedEmployeeId)
        : null;

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {/* Employee List */}
            <div className="lg:col-span-1">
                <Card className="space-y-4 p-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Search Employees</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="max-h-96 space-y-1 overflow-y-auto">
                        {filteredEmployees.map((emp) => (
                            <Button
                                key={emp.id}
                                onClick={() => onSelectEmployee(emp.id)}
                                variant={selectedEmployeeId === emp.id ? 'default' : 'ghost'}
                                className="w-full justify-start"
                            >
                                <div className="w-full text-left">
                                    <p className="text-sm font-medium">{emp.employee_name}</p>
                                    <p className="text-xs text-muted-foreground">{emp.employee_number}</p>
                                </div>
                                {emp.has_errors && (
                                    <AlertCircle className="h-4 w-4 text-red-600 ml-auto" />
                                )}
                            </Button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Details View */}
            <div className="lg:col-span-2 space-y-4">
                {selectedDetail ? (
                    <>
                        {/* Header */}
                        <Card className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {selectedDetail.employee_name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedDetail.employee_number} • {selectedDetail.department} •{' '}
                                        {selectedDetail.position}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => onSelectEmployee(null)}
                                    variant="ghost"
                                    size="sm"
                                >
                                    ✕
                                </Button>
                            </div>
                        </Card>

                        {/* Earnings Section */}
                        <Card className="p-4">
                            <h4 className="mb-3 font-semibold text-gray-900">Earnings</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded bg-gray-50 p-3">
                                    <p className="text-xs text-muted-foreground">Basic Pay</p>
                                    <p className="text-lg font-semibold">
                                        ₱{selectedDetail.basic_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                {selectedDetail.overtime_pay > 0 && (
                                    <div className="rounded bg-gray-50 p-3">
                                        <p className="text-xs text-muted-foreground">Overtime</p>
                                        <p className="text-lg font-semibold">
                                            ₱{selectedDetail.overtime_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                )}
                                {selectedDetail.holiday_pay > 0 && (
                                    <div className="rounded bg-gray-50 p-3">
                                        <p className="text-xs text-muted-foreground">Holiday Pay</p>
                                        <p className="text-lg font-semibold">
                                            ₱{selectedDetail.holiday_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                )}
                                <div className="rounded bg-blue-50 p-3">
                                    <p className="text-xs text-muted-foreground">Allowances</p>
                                    <p className="text-lg font-semibold text-blue-600">
                                        ₱{Object.values(selectedDetail.allowances).reduce((a, b) => a + b, 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="col-span-2 rounded bg-green-50 p-3">
                                    <p className="text-xs text-muted-foreground">Gross Pay</p>
                                    <p className="text-xl font-bold text-green-600">
                                        ₱{selectedDetail.gross_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Deductions Section */}
                        <Card className="p-4">
                            <h4 className="mb-3 font-semibold text-gray-900">Deductions</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded bg-gray-50 p-3">
                                    <p className="text-xs text-muted-foreground">SSS</p>
                                    <p className="text-lg font-semibold">
                                        -₱{selectedDetail.sss_employee.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="rounded bg-gray-50 p-3">
                                    <p className="text-xs text-muted-foreground">PhilHealth</p>
                                    <p className="text-lg font-semibold">
                                        -₱{selectedDetail.philhealth_employee.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="rounded bg-gray-50 p-3">
                                    <p className="text-xs text-muted-foreground">Pag-IBIG</p>
                                    <p className="text-lg font-semibold">
                                        -₱{selectedDetail.pagibig_employee.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="rounded bg-gray-50 p-3">
                                    <p className="text-xs text-muted-foreground">Withholding Tax</p>
                                    <p className="text-lg font-semibold">
                                        -₱{selectedDetail.withholding_tax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="col-span-2 rounded bg-red-50 p-3">
                                    <p className="text-xs text-muted-foreground">Total Deductions</p>
                                    <p className="text-xl font-bold text-red-600">
                                        -₱{selectedDetail.total_deductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Net Pay Section */}
                        <Card className="border-2 border-green-200 bg-green-50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800">Net Pay</p>
                                    <p className="text-3xl font-bold text-green-700">
                                        ₱{selectedDetail.net_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-green-700">YTD Net Pay</p>
                                    <p className="text-lg font-semibold text-green-700">
                                        ₱{selectedDetail.ytd_net_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Employer Cost */}
                        <Card className="border border-orange-200 bg-orange-50 p-4">
                            <p className="text-xs font-medium text-orange-800">Employer Cost (for records)</p>
                            <p className="text-lg font-bold text-orange-700">
                                ₱{selectedDetail.total_employer_cost.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </Card>
                    </>
                ) : (
                    <Card className="flex h-96 items-center justify-center text-center">
                        <div>
                            <p className="text-lg font-medium text-gray-900">Select an employee</p>
                            <p className="text-sm text-muted-foreground">
                                Choose an employee from the list to view detailed calculation
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
