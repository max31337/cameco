import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Visitors({ visitorRecords = [] }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Get current time
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });

    // Dummy visitor data
    const dummyVisitorRecords = [
        {
            id: 1,
            visitor_name: 'Michael Anderson',
            company: 'ABC Trading Corp',
            purpose: 'Business Meeting',
            visit_type: 'Client',
            host_employee: 'John Doe',
            department: 'Sales',
            time_in: '09:30 AM',
            time_out: '11:15 AM',
            date: '2025-10-06',
            contact_number: '09171234567',
            email: 'michael.anderson@abctrading.com',
            visitor_count: 1,
            badge_number: 'V-001',
            status: 'Checked Out',
            items_brought: 'Laptop, Documents',
        },
        {
            id: 2,
            visitor_name: 'Sarah Chen',
            company: 'Tech Solutions Inc',
            purpose: 'Technical Support',
            visit_type: 'Vendor',
            host_employee: 'Robert Brown',
            department: 'IT',
            time_in: '10:00 AM',
            time_out: null,
            date: '2025-10-06',
            contact_number: '09182345678',
            email: 'sarah.chen@techsolutions.com',
            visitor_count: 2,
            badge_number: 'V-002',
            status: 'Currently Inside',
            items_brought: 'Laptop, Tools',
        },
        {
            id: 3,
            visitor_name: 'David Martinez',
            company: 'Global Logistics',
            purpose: 'Delivery',
            visit_type: 'Delivery',
            host_employee: 'Jane Smith',
            department: 'Warehouse',
            time_in: '08:00 AM',
            time_out: '08:45 AM',
            date: '2025-10-06',
            contact_number: '09193456789',
            email: 'david.m@globallogistics.com',
            visitor_count: 1,
            badge_number: 'V-003',
            status: 'Checked Out',
            items_brought: 'Packages',
        },
        {
            id: 4,
            visitor_name: 'Jennifer Lee',
            company: 'HR Consultancy Group',
            purpose: 'Interview Candidate',
            visit_type: 'Candidate',
            host_employee: 'Jane Smith',
            department: 'HR',
            time_in: '02:00 PM',
            time_out: null,
            date: '2025-10-06',
            contact_number: '09204567890',
            email: 'jennifer.lee@email.com',
            visitor_count: 1,
            badge_number: 'V-004',
            status: 'Currently Inside',
            items_brought: 'Resume, Portfolio',
        },
        {
            id: 5,
            visitor_name: 'Robert Thompson',
            company: 'Government Agency',
            purpose: 'Inspection',
            visit_type: 'Official',
            host_employee: 'John Doe',
            department: 'Administration',
            time_in: '11:00 AM',
            time_out: '12:30 PM',
            date: '2025-10-06',
            contact_number: '09215678901',
            email: 'r.thompson@gov.ph',
            visitor_count: 3,
            badge_number: 'V-005',
            status: 'Checked Out',
            items_brought: 'Documents, Camera',
        },
    ];

    const visitorList = visitorRecords.length > 0 ? visitorRecords : dummyVisitorRecords;

    // Calculate statistics
    const totalToday = visitorList.length;
    const currentlyInside = visitorList.filter(v => v.status === 'Currently Inside').length;
    const checkedOut = visitorList.filter(v => v.status === 'Checked Out').length;
    const totalPeople = visitorList.reduce((sum, v) => sum + v.visitor_count, 0);

    return (
        <AuthenticatedLayout>
            <Head title="Visitor Management" />

            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Visitor Management System</h1>
                                <p className="text-gray-600 mt-1">Track and manage company visitors</p>
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
                                    Export Log
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                    </svg>
                                    Register Visitor
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
                                    <p className="text-sm font-medium text-gray-600">Total Visitors Today</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalToday}</p>
                                    <p className="text-xs text-gray-500 mt-1">{totalPeople} people total</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Currently Inside</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">{currentlyInside}</p>
                                    <p className="text-xs text-gray-500 mt-1">Active visitors</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Checked Out</p>
                                    <p className="text-3xl font-bold text-gray-600 mt-2">{checkedOut}</p>
                                    <p className="text-xs text-gray-500 mt-1">Completed visits</p>
                                </div>
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Duration</p>
                                    <p className="text-3xl font-bold text-purple-600 mt-2">1.5h</p>
                                    <p className="text-xs text-gray-500 mt-1">Per visit</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Visitor Type</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="all">All Types</option>
                                    <option value="client">Client</option>
                                    <option value="vendor">Vendor</option>
                                    <option value="candidate">Candidate</option>
                                    <option value="delivery">Delivery</option>
                                    <option value="official">Official</option>
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
                                    <option value="inside">Currently Inside</option>
                                    <option value="checked-out">Checked Out</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by name, company, or badge..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visitor Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Visitor Log</h2>
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
                                            Badge
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Visitor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Purpose
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Host
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time In
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time Out
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
                                    {visitorList.map((visitor) => (
                                        <tr key={visitor.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {visitor.badge_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <span className="text-indigo-600 font-medium text-sm">
                                                                {visitor.visitor_name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{visitor.visitor_name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {visitor.visitor_count > 1 && `+${visitor.visitor_count - 1} companion(s)`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{visitor.company}</div>
                                                <div className="text-sm text-gray-500">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        visitor.visit_type === 'Client' 
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : visitor.visit_type === 'Vendor'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : visitor.visit_type === 'Candidate'
                                                            ? 'bg-green-100 text-green-800'
                                                            : visitor.visit_type === 'Delivery'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {visitor.visit_type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{visitor.purpose}</div>
                                                <div className="text-xs text-gray-500">{visitor.items_brought}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{visitor.host_employee}</div>
                                                <div className="text-sm text-gray-500">{visitor.department}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="text-sm font-medium text-green-600">
                                                    {visitor.time_in}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {visitor.time_out ? (
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {visitor.time_out}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-blue-600 font-medium">Inside</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    visitor.status === 'Currently Inside' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {visitor.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                                {visitor.status === 'Currently Inside' && (
                                                    <button className="text-red-600 hover:text-red-900">Check Out</button>
                                                )}
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
