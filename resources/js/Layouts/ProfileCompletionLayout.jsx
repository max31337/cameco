import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function ProfileCompletionLayout({ title, children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <Head title={title} />
            
            {/* Header */}
            <header className="bg-[#0056A4] shadow-lg border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Cathay Metal Logo and Company Info */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {/* Cathay Metal Logo with white background */}
                                <div className="bg-white p-2 rounded-md shadow-sm">
                                    <div className="flex items-end gap-1">
                                        {/* Blue parallelogram */}
                                        <div className="relative" style={{ width: '20px', height: '28px' }}>
                                            <div className="absolute inset-0 bg-[#0056A4] transform skew-x-[-15deg]"></div>
                                        </div>
                                        {/* Red triangle */}
                                        <div className="relative" style={{ width: '20px', height: '28px' }}>
                                            <div className="absolute inset-0" style={{
                                                clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                                                backgroundColor: '#DC1E28'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-wide">CATHAY METAL</h1>
                                <p className="text-sm text-blue-100">SyncingSteel HR System</p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="inline-flex items-center px-4 py-2 bg-white border-2 border-[#DC1E28] rounded-lg font-semibold text-sm text-[#DC1E28] hover:bg-[#DC1E28] hover:text-white focus:bg-[#DC1E28] focus:text-white active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#0056A4] border-t border-blue-700 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="text-center text-sm text-blue-100">
                        © 2025 Cathay Metal Corporation. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}