import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ needsProfileCompletion, profileCompletionUrl, profileCompletion, user }) {
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
                    {/* Profile Status Section */}
                    <div className="mb-8">
                        {profileCompletion?.status === 'complete' ? (
                            /* Profile Completed - Show Profile Info */
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                                                <span className="text-2xl font-bold">
                                                    {user?.employee?.first_name?.charAt(0) || user?.name?.charAt(0) || 'A'}
                                                    {user?.employee?.last_name?.charAt(0) || ''}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">
                                                    {user?.employee ? 
                                                        `${user.employee.first_name} ${user.employee.last_name}` : 
                                                        user?.name
                                                    }
                                                </h3>
                                                <p className="text-green-100 mt-1">
                                                    {user?.employee?.position || 'Administrator'}
                                                    {user?.employee?.department && ` • ${user.employee.department.name}`}
                                                </p>
                                                {user?.employee?.employee_number && (
                                                    <p className="text-green-200 text-sm mt-1">
                                                        Employee ID: {user.employee.employee_number}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center text-green-100 mb-2">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                Profile Complete ({profileCompletion?.percentage || 100}%)
                                            </div>
                                            {user?.employee?.hire_date && (
                                                <p className="text-green-200 text-sm">
                                                    Since: {new Date(user.employee.hire_date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                    </svg>
                                                    {user?.employee?.email || user?.email}
                                                </div>
                                                {user?.employee?.phone_number && (
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                                        </svg>
                                                        {user.employee.phone_number}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Employment Details</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                {user?.employee?.employment_type && (
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z"/>
                                                        </svg>
                                                        {user.employee.employment_type.charAt(0).toUpperCase() + user.employee.employment_type.slice(1)}
                                                    </div>
                                                )}
                                                {user?.employee?.department && (
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                                        </svg>
                                                        {user.employee.department.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                                            <div className="space-y-2">
                                                <Link
                                                    href="#"
                                                    className="block text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                                >
                                                    Update Profile
                                                </Link>
                                                <Link
                                                    href="#"
                                                    className="block text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                                >
                                                    View Employee Record
                                                </Link>
                                                <Link
                                                    href="#"
                                                    className="block text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                                >
                                                    Account Settings
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Profile Incomplete or Skipped */
                            <div className={`rounded-2xl shadow-xl overflow-hidden ${
                                profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial'
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700'
                            }`}>
                                <div className={`text-white ${
                                    profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? 'p-6' : 'p-8'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className={`flex items-center ${
                                                profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? 'mb-4' : 'mb-6'
                                            }`}>
                                                <div className={`bg-white/20 rounded-xl mr-4 ${
                                                    profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? 'p-2' : 'p-3'
                                                }`}>
                                                    {profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold ${
                                                        profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? 'text-xl' : 'text-2xl'
                                                    }`}>
                                                        {profileCompletion?.status === 'skipped' 
                                                            ? 'Profile Completion Skipped'
                                                            : profileCompletion?.status === 'skipped_partial'
                                                            ? 'Profile Partially Complete'
                                                            : 'Complete Your Admin Profile'
                                                        }
                                                    </h3>
                                                    <p className={`text-white/80 ${
                                                        profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? 'mt-1 text-sm' : 'mt-2'
                                                    }`}>
                                                        {profileCompletion?.status === 'skipped' 
                                                            ? 'Complete your profile to unlock all features'
                                                            : profileCompletion?.message || 'Set up your employee information to access all system features'
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            {profileCompletion?.status !== 'skipped' && profileCompletion?.status !== 'skipped_partial' && (
                                                <div className="mb-6">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-white/90">Profile Completion</span>
                                                        <span className="text-2xl font-bold">{profileCompletion?.percentage || 0}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/20 rounded-full h-3">
                                                        <div 
                                                            className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                                                            style={{ width: `${profileCompletion?.percentage || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Status Steps */}
                                            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
                                                profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? 'mb-4' : 'mb-8'
                                            }`}>
                                                <div className={`bg-white/10 rounded-lg p-4 ${
                                                    user?.id ? 'opacity-100' : 'opacity-50'
                                                }`}>
                                                    <div className="flex items-center text-sm">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                        Account Created
                                                    </div>
                                                </div>
                                                <div className={`bg-white/10 rounded-lg p-4 ${
                                                    (profileCompletion?.percentage || 0) > 0 ? 'opacity-100' : 'opacity-50'
                                                }`}>
                                                    <div className="flex items-center text-sm">
                                                        {(profileCompletion?.percentage || 0) > 0 ? (
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                            </svg>
                                                        )}
                                                        Profile Information
                                                    </div>
                                                </div>
                                                <div className={`bg-white/10 rounded-lg p-4 ${
                                                    (profileCompletion?.percentage || 0) >= 100 ? 'opacity-100' : 'opacity-50'
                                                }`}>
                                                    <div className="flex items-center text-sm">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                                        </svg>
                                                        Full Access
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Link
                                                    href={profileCompletionUrl}
                                                    className={`inline-flex items-center justify-center bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-lg ${
                                                        profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial'
                                                            ? 'px-6 py-3 text-sm' 
                                                            : 'px-8 py-4 font-bold'
                                                    }`}
                                                >
                                                    <svg className={`mr-2 ${
                                                        profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? 'w-4 h-4' : 'w-5 h-5'
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                    </svg>
                                                    {profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial'
                                                        ? 'Complete Profile Now' 
                                                        : profileCompletion?.percentage > 0 
                                                            ? 'Continue Profile Setup'
                                                            : 'Start Profile Setup'
                                                    }
                                                </Link>
                                                
                                                {(profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial') && (
                                                    <div className="text-white/80 text-sm flex items-center px-4">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                        Previously skipped - Complete anytime to unlock all features
                                                    </div>
                                                )}
                                            </div>

                                            {/* Missing Fields Info */}
                                            {profileCompletion?.missingFields && profileCompletion.missingFields.length > 0 && profileCompletion?.status !== 'skipped' && profileCompletion?.status !== 'skipped_partial' && (
                                                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                                                    <h4 className="font-medium text-white mb-2">Missing Information:</h4>
                                                    <div className="text-sm text-white/80">
                                                        {profileCompletion.missingFields.slice(0, 5).join(', ')}
                                                        {profileCompletion.missingFields.length > 5 && ` and ${profileCompletion.missingFields.length - 5} more...`}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="hidden lg:block ml-8">
                                            <div className={`bg-white/10 rounded-full flex items-center justify-center ${
                                                profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? 'w-20 h-20' : 'w-32 h-32'
                                            }`}>
                                                <div className="text-center">
                                                    <div className={`font-bold mb-1 ${
                                                        profileCompletion?.status === 'skipped' || profileCompletion?.status === 'skipped_partial' ? 'text-2xl' : 'text-4xl'
                                                    }`}>
                                                        {profileCompletion?.percentage || 0}%
                                                    </div>
                                                    <div className="text-xs text-white/80">Complete</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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