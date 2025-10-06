import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Payroll({ payrollRecords = [] }) {
    const [selectedPeriod, setSelectedPeriod] = useState('current');
    const [filterDepartment, setFilterDepartment] = useState('all');

    // Dummy payroll data
    const dummyPayrollRecords = [
        {
            id: 1,
            employee_number: 'EMP-2025-0001',
            employee_name: 'John Doe',
            department: 'Administration',
            position: 'Admin',
            basic_salary: 35000,
            allowances: 5000,
            deductions: 3500,
            net_pay: 36500,
            status: 'Processed',
            pay_date: '2025-10-15',
        },
        {
            id: 2,
            employee_number: 'EMP-2025-0002',
            employee_name: 'Jane Smith',
            department: 'Human Resources',
            position: 'HR Manager',
            basic_salary: 45000,
            allowances: 6000,
            deductions: 4800,
            net_pay: 46200,
            status: 'Processed',
            pay_date: '2025-10-15',
        },
        {
            id: 3,
            employee_number: 'EMP-2025-0003',
            employee_name: 'Mike Johnson',
            department: 'Finance',
            position: 'Accountant',
            basic_salary: 38000,
            allowances: 4500,
            deductions: 3900,
            net_pay: 38600,
            status: 'Pending',
            pay_date: '2025-10-15',
        },
        {
            id: 4,
            employee_number: 'EMP-2025-0004',
            employee_name: 'Sarah Williams',
            department: 'Sales',
            position: 'Sales Representative',
            basic_salary: 30000,
            allowances: 8000,
            deductions: 3200,
            net_pay: 34800,
            status: 'Processed',
            pay_date: '2025-10-15',
        },
        {
            id: 5,
            employee_number: 'EMP-2025-0005',
            employee_name: 'Robert Brown',
            department: 'Information Technology',
            position: 'IT Support',
            basic_salary: 32000,
            allowances: 3500,
            deductions: 3100,
            net_pay: 32400,
            status: 'Pending',
            pay_date: '2025-10-15',
        },
    ];

    const payrollList = payrollRecords.length > 0 ? payrollRecords : dummyPayrollRecords;

    const totalGrossPay = payrollList.reduce((sum, record) => sum + record.basic_salary + record.allowances, 0);
    const totalDeductions = payrollList.reduce((sum, record) => sum + record.deductions, 0);
    const totalNetPay = payrollList.reduce((sum, record) => sum + record.net_pay, 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Payroll" />

            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
                                <p className="text-gray-600 mt-1">Manage employee compensation and payroll processing</p>
                            </div>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    Export Report
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                                    </svg>
                                    Process Payroll
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {formatCurrency(totalGrossPay)}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Deductions</p>
                                    <p className="text-2xl font-bold text-red-600 mt-2">
                                        {formatCurrency(totalDeductions)}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">
                                        {formatCurrency(totalNetPay)}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Employees Paid</p>
                                    <p className="text-2xl font-bold text-purple-600 mt-2">
                                        {payrollList.filter(r => r.status === 'Processed').length}/{payrollList.length}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pay Period</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                >
                                    <option value="current">Current Period (Oct 1-15, 2025)</option>
                                    <option value="previous">Previous Period (Sep 16-30, 2025)</option>
                                    <option value="custom">Custom Date Range</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                >
                                    <option value="all">All Departments</option>
                                    <option value="administration">Administration</option>
                                    <option value="hr">Human Resources</option>
                                    <option value="finance">Finance</option>
                                    <option value="sales">Sales</option>
                                    <option value="it">Information Technology</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="all">All Status</option>
                                    <option value="processed">Processed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Payroll Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Basic Salary
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Allowances
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deductions
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Net Pay
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payrollList.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-blue-600 font-medium text-sm">
                                                                {record.employee_name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{record.employee_name}</div>
                                                        <div className="text-sm text-gray-500">{record.employee_number}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{record.department}</div>
                                                <div className="text-sm text-gray-500">{record.position}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                {formatCurrency(record.basic_salary)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">
                                                {formatCurrency(record.allowances)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                                                {formatCurrency(record.deductions)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-blue-600">
                                                {formatCurrency(record.net_pay)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    record.status === 'Processed' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                                <button className="text-green-600 hover:text-green-900">Pay</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
