import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ needsProfileCompletion, profileCompletionUrl, profileCompletion, onboardingDraft, user }) {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {greeting}, {user?.name || 'Admin'}!
                                </h1>
                                <p className="text-gray-600 mt-1">Here's your SyncingSteel dashboard overview for today.</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5V7h10v10z"/>
                                    </svg>
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5V7h10v10z"/>
                                    </svg>
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </button>
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-600 font-medium text-sm">{user?.name?.charAt(0) || 'A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Consolidated Onboarding/Profile Completion Card */}
                    {profileCompletion?.percentage < 100 && (
                        <div className="mb-8">
                            <div className="rounded-2xl shadow-xl overflow-hidden bg-gradient-to-r from-yellow-400 to-blue-600">
                                <div className="p-8 flex flex-col md:flex-row md:items-center md:justify-between text-white">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center mb-2">
                                            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            <h3 className="font-bold text-2xl">Complete Your Admin Profile</h3>
                                        </div>
                                        {onboardingDraft && (
                                            <div className="text-white/90 mb-2 text-sm">
                                                <span className="font-semibold">In-progress onboarding draft</span>
                                                <span className="ml-2">Last saved step: <b>Step {onboardingDraft.step_completed}</b></span>
                                                {onboardingDraft.updated_at && (
                                                    <span> &middot; Last updated: {new Date(onboardingDraft.updated_at).toLocaleString()}</span>
                                                )}
                                            </div>
                                        )}
                                        <div className="mb-4 text-white/90">
                                            {profileCompletion?.message || 'Set up your employee information to access all system features.'}
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium">Profile Completion</span>
                                                <span className="text-lg font-bold">{profileCompletion?.percentage || 0}%</span>
                                            </div>
                                            <div className="w-full bg-white/30 rounded-full h-3">
                                                <div 
                                                    className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                                                    style={{ width: `${profileCompletion?.percentage || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        {/* Missing Fields Info */}
                                        {profileCompletion?.missingFields && profileCompletion.missingFields.length > 0 && (
                                            <div className="mt-2 p-3 bg-white/10 rounded-lg">
                                                <h4 className="font-medium mb-1">Missing Information:</h4>
                                                <div className="text-sm">
                                                    {profileCompletion.missingFields.slice(0, 5).join(', ')}
                                                    {profileCompletion.missingFields.length > 5 && ` and ${profileCompletion.missingFields.length - 5} more...`}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end mt-6 md:mt-0 md:ml-8">
                                        <div className="bg-white/20 rounded-full flex items-center justify-center w-24 h-24 mb-4">
                                            <div className="text-center">
                                                <div className="font-bold text-3xl mb-1">{profileCompletion?.percentage || 0}%</div>
                                                <div className="text-xs">Complete</div>
                                            </div>
                                        </div>
                                        <Link
                                            href={profileCompletionUrl}
                                            className="inline-flex items-center justify-center bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-lg px-8 py-4 font-bold"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            {profileCompletion?.percentage > 0 ? 'Continue Profile Setup' : 'Start Profile Setup'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Employees */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">520</p>
                                    <div className="flex items-center mt-3">
                                        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                                        </svg>
                                        <span className="text-sm text-green-600">+1.2% this month</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                                    <div className="flex items-center mt-3">
                                        <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                                        </svg>
                                        <span className="text-sm text-red-600">3 requests</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Holidays */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Upcoming Holidays</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">5 days</p>
                                    <div className="flex items-center mt-3">
                                        <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                        </svg>
                                        <span className="text-sm text-blue-600">Next: Dec 25</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Open Positions */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Open Positions</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
                                    <div className="flex items-center mt-3">
                                        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                                        </svg>
                                        <span className="text-sm text-green-600">2 new openings</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Modules */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Access Modules</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* Employee Directory */}
                            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                        </svg>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mt-3">Employee Directory</h4>
                                </div>
                            </div>

                            {/* Payroll Management */}
                            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mt-3">Payroll Management</h4>
                                </div>
                            </div>

                            {/* Attendance Tracking */}
                            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-200">
                                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mt-3">Attendance Tracking</h4>
                                </div>
                            </div>

                            {/* Leave Request */}
                            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-200">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mt-3">Leave Request</h4>
                                </div>
                            </div>

                            {/* Visitors */}
                            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
                                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mt-3">Visitors</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activities */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">New employee <span className="font-medium">Maria Santos</span> has been added to the system</p>
                                                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">Payroll for October 2025 has been processed</p>
                                                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">Leave request from <span className="font-medium">John Dela Cruz</span> needs approval</p>
                                                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">System backup completed successfully</p>
                                                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employee Spotlight */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">Employee Spotlight</h3>
                                <p className="text-sm text-gray-600 mt-1">Recognizing outstanding contributions</p>
                            </div>
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">AS</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">Ana Reyes</h4>
                                    <p className="text-sm text-gray-600 mb-4">Senior HR Specialist</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Exceptional performance in implementing the new employee onboarding system. 
                                        Reduced processing time by 40% and improved satisfaction scores.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}