import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome - SyncingSteel System" />
            <div className="relative min-h-screen flex flex-col items-center justify-center selection:bg-red-500 selection:text-white">
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                    <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                        <div className="flex lg:justify-center lg:col-start-2">
                            <div className="text-3xl font-bold text-gray-900">
                                SyncingSteel System
                            </div>
                        </div>
                        {canLogin && (
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {/* Add auth user check when available */}
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            </nav>
                        )}
                    </header>

                    <main className="mt-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                            <div className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] md:row-span-3 lg:p-10">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                                    <svg className="size-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>

                                <div className="pt-3 sm:pt-5">
                                    <h2 className="text-xl font-semibold text-black">HR Management</h2>
                                    <p className="mt-4 text-sm/relaxed text-gray-600">
                                        Comprehensive employee management system for Cathay Metal Corporation. 
                                        Manage personal information, employment details, tax status, and organizational structure.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:p-10">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                                    <svg className="size-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                <div className="pt-3 sm:pt-5">
                                    <h2 className="text-xl font-semibold text-black">Timekeeping</h2>
                                    <p className="mt-4 text-sm/relaxed text-gray-600">
                                        Digital timekeeping with biometric device support. Track attendance, manage punches, 
                                        and automate reconciliation processes.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:p-10">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-50">
                                    <svg className="size-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>

                                <div className="pt-3 sm:pt-5">
                                    <h2 className="text-xl font-semibold text-black">Payroll System</h2>
                                    <p className="mt-4 text-sm/relaxed text-gray-600">
                                        BIR & Philippine statutory-compliant payroll calculation with SSS, PhilHealth, 
                                        and Pag-IBIG integration. Automated remittances and reporting.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="py-16 text-center text-sm text-black">
                        <p>Laravel v{laravelVersion} (PHP v{phpVersion}) + React + Inertia.js</p>
                        <p className="mt-2">SyncingSteel System - Internal Information Management for Cathay Metal Corporation</p>
                    </footer>
                </div>
            </div>
        </>
    );
}