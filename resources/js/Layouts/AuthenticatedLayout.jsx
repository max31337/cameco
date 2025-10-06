import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const { props, url } = usePage();
    const user = props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-blue-800 shadow-lg" style={{ backgroundColor: '#0056A4' }}>
                {/* Primary Navigation Menu */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/" className="flex items-center">
                                    {/* Cathay Metal Corporation Logo */}
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <svg viewBox="0 0 120 40" className="h-8 w-auto">
                                            {/* Blue parallelogram background */}
                                            <path d="M10 5 L35 5 L45 35 L20 35 Z" fill="#0056A4"/>
                                            {/* Red triangle accent */}
                                            <path d="M45 5 L55 5 L50 20 Z" fill="#DC2626"/>
                                            {/* Company text */}
                                            <text x="65" y="15" fontSize="8" fontWeight="bold" fill="#0056A4">CATHAY</text>
                                            <text x="65" y="25" fontSize="6" fill="#666">METAL CORP</text>
                                        </svg>
                                    </div>
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link 
                                    href={route('dashboard')} 
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                                        url === '/dashboard' 
                                            ? 'border-white text-white' 
                                            : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    href={route('admin.employees')} 
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                                        url === '/admin/employees' 
                                            ? 'border-white text-white' 
                                            : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
                                    }`}
                                >
                                    Employees
                                </Link>
                                <Link 
                                    href={route('admin.payroll')} 
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                                        url === '/admin/payroll' 
                                            ? 'border-white text-white' 
                                            : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
                                    }`}
                                >
                                    Payroll
                                </Link>
                                <Link 
                                    href={route('admin.reports')} 
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                                        url === '/admin/reports' 
                                            ? 'border-white text-white' 
                                            : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
                                    }`}
                                >
                                    Reports
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {/* Notification Bell */}
                            <button className="p-2 text-blue-200 hover:text-white transition-colors duration-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5V7h10v10z"/>
                                </svg>
                            </button>

                            {/* Settings Dropdown */}
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-white/20 text-sm leading-4 font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.show')}>Profile</Dropdown.Link>
                                        {/* Admin Profile Completion Link */}
                                        {props.auth.user.isAdmin && (
                                            <Dropdown.Link href={route('admin.profile.complete')}>
                                                Complete Profile
                                            </Dropdown.Link>
                                        )}
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 focus:outline-none focus:bg-white/10 focus:text-white transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Responsive Navigation Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={url === '/dashboard'}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.employees')} active={url === '/admin/employees'}>
                            Employees
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.payroll')} active={url === '/admin/payroll'}>
                            Payroll
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.reports')} active={url === '/admin/reports'}>
                            Reports
                        </ResponsiveNavLink>
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.show')}>Profile</ResponsiveNavLink>
                            {/* Admin Profile Completion Link */}
                            {props.auth.user.isAdmin && (
                                <ResponsiveNavLink href={route('admin.profile.complete')}>
                                    Complete Profile
                                </ResponsiveNavLink>
                            )}
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Heading */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Page Content */}
            <main>{children}</main>
        </div>
    );
}