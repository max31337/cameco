import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Performance({ performanceRecords = [] }) {
    const [selectedPeriod, setSelectedPeriod] = useState('current');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterRating, setFilterRating] = useState('all');

    // Dummy performance data
    const dummyPerformanceRecords = [
        {
            id: 1,
            employee_number: 'EMP-2025-0001',
            employee_name: 'John Doe',
            department: 'Administration',
            position: 'Admin',
            review_period: 'Q3 2025',
            overall_rating: 4.5,
            quality_of_work: 5,
            productivity: 4,
            teamwork: 5,
            communication: 4,
            attendance: 5,
            initiative: 4,
            goals_achieved: '8/10',
            strengths: 'Excellent leadership, Strong communication skills',
            areas_for_improvement: 'Time management',
            status: 'Completed',
            reviewer: 'Jane Smith',
            review_date: '2025-09-30',
        },
        {
            id: 2,
            employee_number: 'EMP-2025-0002',
            employee_name: 'Jane Smith',
            department: 'Human Resources',
            position: 'HR Manager',
            review_period: 'Q3 2025',
            overall_rating: 4.8,
            quality_of_work: 5,
            productivity: 5,
            teamwork: 5,
            communication: 5,
            attendance: 4,
            initiative: 5,
            goals_achieved: '10/10',
            strengths: 'Outstanding people skills, Strategic thinking',
            areas_for_improvement: 'Technical documentation',
            status: 'Completed',
            reviewer: 'Mike Johnson',
            review_date: '2025-09-28',
        },
        {
            id: 3,
            employee_number: 'EMP-2025-0003',
            employee_name: 'Mike Johnson',
            department: 'Finance',
            position: 'Accountant',
            review_period: 'Q3 2025',
            overall_rating: 4.2,
            quality_of_work: 4,
            productivity: 4,
            teamwork: 4,
            communication: 4,
            attendance: 5,
            initiative: 4,
            goals_achieved: '7/10',
            strengths: 'Detail-oriented, Analytical skills',
            areas_for_improvement: 'Collaboration, Meeting deadlines',
            status: 'Completed',
            reviewer: 'John Doe',
            review_date: '2025-09-25',
        },
        {
            id: 4,
            employee_number: 'EMP-2025-0004',
            employee_name: 'Sarah Williams',
            department: 'Sales',
            position: 'Sales Representative',
            review_period: 'Q3 2025',
            overall_rating: 3.8,
            quality_of_work: 4,
            productivity: 3,
            teamwork: 4,
            communication: 4,
            attendance: 3,
            initiative: 4,
            goals_achieved: '6/10',
            strengths: 'Customer relations, Negotiation skills',
            areas_for_improvement: 'Punctuality, Sales targets',
            status: 'In Progress',
            reviewer: 'Jane Smith',
            review_date: null,
        },
        {
            id: 5,
            employee_number: 'EMP-2025-0005',
            employee_name: 'Robert Brown',
            department: 'Information Technology',
            position: 'IT Support',
            review_period: 'Q3 2025',
            overall_rating: 4.6,
            quality_of_work: 5,
            productivity: 5,
            teamwork: 4,
            communication: 4,
            attendance: 5,
            initiative: 5,
            goals_achieved: '9/10',
            strengths: 'Technical expertise, Problem-solving',
            areas_for_improvement: 'User documentation',
            status: 'Completed',
            reviewer: 'John Doe',
            review_date: '2025-09-27',
        },
    ];

    const performanceList = performanceRecords.length > 0 ? performanceRecords : dummyPerformanceRecords;

    // Calculate statistics
    const totalReviews = performanceList.length;
    const completedReviews = performanceList.filter(r => r.status === 'Completed').length;
    const averageRating = (performanceList.reduce((sum, r) => sum + r.overall_rating, 0) / totalReviews).toFixed(1);
    const topPerformers = performanceList.filter(r => r.overall_rating >= 4.5).length;

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'text-green-600';
        if (rating >= 4.0) return 'text-blue-600';
        if (rating >= 3.5) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getRatingBadge = (rating) => {
        if (rating >= 4.5) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
        if (rating >= 4.0) return { text: 'Very Good', color: 'bg-blue-100 text-blue-800' };
        if (rating >= 3.5) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
        return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
    };

    return (
        <AuthenticatedLayout>
            <Head title="Performance Management" />

            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
                                <p className="text-gray-600 mt-1">Track and evaluate employee performance</p>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    New Review
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
                                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalReviews}</p>
                                    <p className="text-xs text-gray-500 mt-1">This period</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">{completedReviews}</p>
                                    <p className="text-xs text-gray-500 mt-1">{totalReviews - completedReviews} pending</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                    <p className="text-3xl font-bold text-yellow-600 mt-2">{averageRating}/5.0</p>
                                    <div className="flex items-center mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Top Performers</p>
                                    <p className="text-3xl font-bold text-purple-600 mt-2">{topPerformers}</p>
                                    <p className="text-xs text-gray-500 mt-1">Rating ≥ 4.5</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Review Period</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                >
                                    <option value="current">Q3 2025 (Current)</option>
                                    <option value="q2-2025">Q2 2025</option>
                                    <option value="q1-2025">Q1 2025</option>
                                    <option value="q4-2024">Q4 2024</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating Filter</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filterRating}
                                    onChange={(e) => setFilterRating(e.target.value)}
                                >
                                    <option value="all">All Ratings</option>
                                    <option value="excellent">Excellent (≥4.5)</option>
                                    <option value="very-good">Very Good (≥4.0)</option>
                                    <option value="good">Good (≥3.5)</option>
                                    <option value="needs-improvement">&lt;3.5</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Performance Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">Performance Reviews</h2>
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
                                            Overall Rating
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Goals Achieved
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reviewer
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
                                    {performanceList.map((record) => {
                                        const badge = getRatingBadge(record.overall_rating);
                                        return (
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
                                                    <div className={`text-2xl font-bold ${getRatingColor(record.overall_rating)}`}>
                                                        {record.overall_rating.toFixed(1)}
                                                    </div>
                                                    <div className="flex items-center justify-center mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`w-3 h-3 ${i < Math.floor(record.overall_rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.color}`}>
                                                        {badge.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="text-lg font-bold text-gray-900">{record.goals_achieved}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{record.reviewer}</div>
                                                    {record.review_date && (
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(record.review_date).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        record.status === 'Completed' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : record.status === 'In Progress'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
