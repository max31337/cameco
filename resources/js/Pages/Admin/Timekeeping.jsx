import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Timekeeping({ attendanceRecords = [] }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('daily'); // daily, weekly, monthly

    // Get current time
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });

    // Dummy attendance data
    const dummyAttendanceRecords = [
        {
            id: 1,
            employee_number: 'EMP-2025-0001',
            employee_name: 'John Doe',
            department: 'Administration',
            position: 'Admin',
            date: '2025-10-06',
            time_in: '08:00 AM',
            time_out: null,
            status: 'Present',
            hours_worked: '0h 0m',
            is_late: false,
            is_overtime: false,
        },
        {
            id: 2,
            employee_number: 'EMP-2025-0002',
            employee_name: 'Jane Smith',
            department: 'Human Resources',
            position: 'HR Manager',
            date: '2025-10-06',
            time_in: '07:55 AM',
            time_out: '05:30 PM',
            status: 'Present',
            hours_worked: '9h 35m',
            is_late: false,
            is_overtime: true,
        },
        {
            id: 3,
            employee_number: 'EMP-2025-0003',
            employee_name: 'Mike Johnson',
            department: 'Finance',
            position: 'Accountant',
            date: '2025-10-06',
            time_in: '08:45 AM',
            time_out: '05:15 PM',
            status: 'Present',
            hours_worked: '8h 30m',
            is_late: true,
            is_overtime: false,
        },
        {
            id: 4,
            employee_number: 'EMP-2025-0004',
            employee_name: 'Sarah Williams',
            department: 'Sales',
            position: 'Sales Representative',
            date: '2025-10-06',
            time_in: null,
            time_out: null,
            status: 'Absent',
            hours_worked: '0h 0m',
            is_late: false,
            is_overtime: false,
        },
        {
            id: 5,
            employee_number: 'EMP-2025-0005',
            employee_name: 'Robert Brown',
            department: 'Information Technology',
            position: 'IT Support',
            date: '2025-10-06',
            time_in: '08:10 AM',
            time_out: null,
            status: 'Present',
            hours_worked: '0h 0m',
            is_late: true,
            is_overtime: false,
        },
    ];

    const attendanceList = attendanceRecords.length > 0 ? attendanceRecords : dummyAttendanceRecords;

    // Calculate statistics
    const totalEmployees = attendanceList.length;
    const presentCount = attendanceList.filter(r => r.status === 'Present').length;
    const absentCount = attendanceList.filter(r => r.status === 'Absent').length;
    const lateCount = attendanceList.filter(r => r.is_late).length;
    const overtimeCount = attendanceList.filter(r => r.is_overtime).length;
    const attendanceRate = ((presentCount / totalEmployees) * 100).toFixed(1);

    return (
        <AuthenticatedLayout>
            <Head title="Timekeeping" />

            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Timekeeping & Attendance</h1>
                                <p className="text-gray-600 mt-1">Monitor employee attendance and working hours</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-right mr-4">
                                    <div className="text-sm text-gray-500">Current Time</div>
                                    <div className="text-2xl font-bold text-blue-600">{currentTime}</div>
                                </div>
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    Export DTR
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                    Manual Time Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Total</p>
                            <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Present</p>
                            <p className="text-3xl font-bold text-green-600">{presentCount}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Absent</p>
                            <p className="text-3xl font-bold text-red-600">{absentCount}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Late</p>
                            <p className="text-3xl font-bold text-yellow-600">{lateCount}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Overtime</p>
                            <p className="text-3xl font-bold text-purple-600">{overtimeCount}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Rate</p>
                            <p className="text-3xl font-bold text-indigo-600">{attendanceRate}%</p>
                        </div>
                    </div>

                    {/* Filters and View Mode */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={viewMode}
                                    onChange={(e) => setViewMode(e.target.value)}
                                >
                                    <option value="daily">Daily View</option>
                                    <option value="weekly">Weekly View</option>
                                    <option value="monthly">Monthly View</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
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
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                    <option value="on-leave">On Leave</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search employee..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Daily Attendance Record</h2>
                            <div className="text-sm text-gray-500">
                                {new Date(selectedDate).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                        </div>
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
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time In
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time Out
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hours Worked
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendanceList.map((record) => (
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
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {record.time_in ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-sm font-medium ${record.is_late ? 'text-red-600' : 'text-green-600'}`}>
                                                            {record.time_in}
                                                        </span>
                                                        {record.is_late && (
                                                            <span className="text-xs text-red-500">Late</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">--:--</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {record.time_out ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-sm font-medium ${record.is_overtime ? 'text-purple-600' : 'text-gray-900'}`}>
                                                            {record.time_out}
                                                        </span>
                                                        {record.is_overtime && (
                                                            <span className="text-xs text-purple-500">OT</span>
                                                        )}
                                                    </div>
                                                ) : record.status === 'Present' ? (
                                                    <span className="text-sm text-blue-600 font-medium">Active</span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">--:--</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {record.hours_worked}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    record.status === 'Present' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : record.status === 'Absent'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                                <button className="text-gray-600 hover:text-gray-900">Log</button>
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
