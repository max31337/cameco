import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome - SyncingSteel System" />
            <div className="min-h-screen bg-white">
                {/* Hero Section - Full Width */}
                <div className="bg-gradient-to-br from-[#0056A4] via-[#0066B4] to-[#0056A4] relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full -ml-80 -mb-80"></div>
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#DC1E28] opacity-10 rounded-full"></div>
                    
                    <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-white space-y-8">
                                <div>
                                    <div className="inline-block mb-4">
                                        <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2 backdrop-blur-sm">
                                            <div className="w-2 h-2 bg-[#DC1E28] rounded-full"></div>
                                            <span className="text-sm font-medium">Enterprise HR Solution</span>
                                        </div>
                                    </div>
                                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                        Welcome to<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                                            SyncingSteel System
                                        </span>
                                    </h1>
                                    <p className="text-xl text-blue-100 leading-relaxed max-w-xl">
                                        Internal Information Management System for Cathay Metal Corporation
                                    </p>
                                    <div className="h-1 w-24 bg-gradient-to-r from-white to-[#DC1E28] rounded-full mt-6"></div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                                        <div className="text-3xl mb-2">👥</div>
                                        <div className="font-semibold mb-1">HR Management</div>
                                        <div className="text-sm text-blue-100">Employee lifecycle</div>
                                    </div>
                                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                                        <div className="text-3xl mb-2">⏰</div>
                                        <div className="font-semibold mb-1">Timekeeping</div>
                                        <div className="text-sm text-blue-100">RFID tracking</div>
                                    </div>
                                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                                        <div className="text-3xl mb-2">💰</div>
                                        <div className="font-semibold mb-1">Payroll</div>
                                        <div className="text-sm text-blue-100">BIR compliant</div>
                                    </div>
                                </div>

                                {canLogin && (
                                    <div className="flex items-center gap-4 pt-4">
                                        <Link href={route('login')}>
                                            <button className="bg-white text-[#0056A4] hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg">
                                                Sign In
                                            </button>
                                        </Link>
                                        {canRegister && (
                                            <Link href={route('register')}>
                                                <button className="border-2 border-white text-white hover:bg-white hover:text-[#0056A4] font-semibold py-4 px-8 rounded-lg transition-all duration-200">
                                                    Sign Up
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Content - Logo */}
                            <div className="flex justify-center lg:justify-end">
                                <div className="bg-white rounded-3xl p-12 shadow-2xl">
                                    <div className="flex items-end justify-center gap-2 mb-6">
                                        {/* Blue parallelogram */}
                                        <div className="relative" style={{ width: '90px', height: '110px' }}>
                                            <div className="absolute inset-0 bg-[#0056A4] transform skew-x-[-15deg]"></div>
                                        </div>
                                        {/* Red triangle */}
                                        <div className="relative" style={{ width: '90px', height: '110px' }}>
                                            <div className="absolute inset-0" style={{
                                                clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                                                backgroundColor: '#DC1E28'
                                            }}></div>
                                        </div>
                                    </div>
                                    <div className="text-[#0056A4] text-center">
                                        <div className="font-bold text-3xl tracking-wide mb-2">CATHAY METAL</div>
                                        <div className="font-bold text-2xl tracking-wider">CORPORATION</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HR Management Module - Full Width */}
                <div className="bg-gray-50 py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-20 h-20 bg-[#0056A4] rounded-2xl flex items-center justify-center">
                                <span className="text-5xl">👥</span>
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-2">HR Management Module</h2>
                                <p className="text-lg text-gray-600">Comprehensive employee lifecycle management</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white p-6 rounded-xl border-l-4 border-[#0056A4] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Employee Records</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Personal information management</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Employment history tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Document storage and management</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Emergency contact information</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border-l-4 border-[#0056A4] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Organizational Structure</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Department and position management</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Reporting hierarchy visualization</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Role-based access control (RBAC)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Team and group assignments</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border-l-4 border-[#0056A4] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Employee Self-Service</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Personal profile updates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Leave request submission</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Document access and downloads</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Payslip viewing and history</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border-l-4 border-[#0056A4] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Onboarding & Offboarding</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Streamlined hiring workflows</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Automated task assignments</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Exit interview management</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Clearance process tracking</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timekeeping Module - Full Width */}
                <div className="bg-white py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-20 h-20 bg-[#0056A4] rounded-2xl flex items-center justify-center">
                                <span className="text-5xl">⏰</span>
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-2">Timekeeping Module</h2>
                                <p className="text-lg text-gray-600">RFID-based attendance and time tracking system</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#DC1E28] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">RFID Integration</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Employee ID cards with RFID chips</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Multiple clock-in/out stations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Real-time attendance capture</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Device-agnostic architecture</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#DC1E28] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Attendance Tracking</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Daily time-in and time-out logs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Break time monitoring</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Overtime calculation and tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Late arrival and early departure flags</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#DC1E28] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Leave Management</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Leave application and approval workflow</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Leave balance tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Multiple leave types (sick, vacation, etc.)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Calendar integration and visualization</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#DC1E28] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Reconciliation & Reports</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Automated nightly reconciliation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Anomaly detection (missing punches)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Manual adjustment with audit trail</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#0056A4] mt-1">•</span>
                                        <span>Comprehensive attendance reports</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payroll Module - Full Width */}
                <div className="bg-gray-50 py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-20 h-20 bg-[#0056A4] rounded-2xl flex items-center justify-center">
                                <span className="text-5xl">💰</span>
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-2">Payroll Module</h2>
                                <p className="text-lg text-gray-600">BIR-compliant payroll with statutory integrations</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white p-6 rounded-xl border-l-4 border-[#0056A4] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Automated Calculation</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Gross pay computation (base + allowances)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Overtime and holiday pay</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Attendance-based deductions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Net pay calculation</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border-l-4 border-[#0056A4] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Philippine Statutory Compliance</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>SSS contributions (employee/employer)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>PhilHealth premium calculations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Pag-IBIG contributions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>BIR withholding tax computation</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border-l-4 border-[#0056A4] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Payslip Generation</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Detailed breakdown of earnings</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Deductions and contributions itemized</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>PDF generation and distribution</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Employee self-service access</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border-l-4 border-[#0056A4] hover:shadow-lg transition-shadow">
                                <h4 className="font-bold text-gray-900 mb-3 text-lg">Government Reporting</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>BIR Form 2316 (Annual ITR)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>SSS/PhilHealth/Pag-IBIG remittance files</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Contribution schedule exports (CSV/Excel)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#DC1E28] mt-1">•</span>
                                        <span>Audit trail and compliance tracking</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technology Section - Full Width */}
                <div className="bg-white py-20 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
                            <p className="text-lg text-gray-600">Enterprise-grade architecture for security, performance, and scalability</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-5xl mb-4">🚀</div>
                                <div className="font-bold text-xl text-gray-900 mb-2">Laravel {laravelVersion}</div>
                                <div className="text-sm text-gray-600">Backend Framework</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-5xl mb-4">⚛️</div>
                                <div className="font-bold text-xl text-gray-900 mb-2">React 18</div>
                                <div className="text-sm text-gray-600">UI Framework</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-5xl mb-4">🎨</div>
                                <div className="font-bold text-xl text-gray-900 mb-2">Tailwind CSS</div>
                                <div className="text-sm text-gray-600">Styling</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-lg transition-shadow">
                                <div className="text-5xl mb-4">🔐</div>
                                <div className="font-bold text-xl text-gray-900 mb-2">Jetstream</div>
                                <div className="text-sm text-gray-600">Authentication</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Full Width */}
                <div className="bg-gradient-to-r from-[#0056A4] to-[#0066B4] py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl font-bold">SyncingSteel System</div>
                                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                                    v{laravelVersion}
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-blue-100">
                                <span>Laravel {laravelVersion}</span>
                                <span className="hidden md:inline">•</span>
                                <span>PHP {phpVersion}</span>
                                <span className="hidden md:inline">•</span>
                                <span>React + Inertia</span>
                            </div>
                        </div>
                        <div className="text-center mt-8 text-blue-100 text-sm">
                            <p className="mb-2">© {new Date().getFullYear()} Cathay Metal Corporation. All rights reserved.</p>
                            <p className="text-xs">Internal use only • Authorized personnel access required</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}