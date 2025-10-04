import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/Card';
import { Button } from '../Components/ui/Button';
import { Badge } from '../Components/ui/Badge';

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome - SyncingSteel System" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <div>
                                <h1 className="font-semibold text-gray-900">SyncingSteel</h1>
                                <p className="text-xs text-gray-500">Version {laravelVersion}</p>
                            </div>
                        </div>
                        {canLogin && (
                            <nav className="flex items-center gap-3">
                                <Link href={route('login')}>
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                {canRegister && (
                                    <Link href={route('register')}>
                                        <Button className="bg-purple-600 hover:bg-purple-700">
                                            Get Started
                                        </Button>
                                    </Link>
                                )}
                            </nav>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-6 py-12">
                    {/* Hero Section */}
                    <section className="text-center py-16">
                        <Badge variant="secondary" className="mb-4">
                            Enterprise HR Solution
                        </Badge>
                        <h1 className="text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
                            All-in-one HR, Timekeeping,<br />and Payroll System
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Internal Information Management for Cathay Metal Corporation with modern UX. 
                            Streamline your workforce management with our comprehensive solution.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href={canLogin ? route('login') : '#'}>
                                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8">
                                    Access System
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg">
                                Learn More
                            </Button>
                        </div>
                    </section>

                    {/* Stats Preview - Inspired by Dashboard Cards */}
                    <section className="py-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Trusted by Organizations</h2>
                            <p className="text-gray-600">See what our system can handle for your workforce</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="p-6 text-center hover:shadow-md transition-shadow">
                                <div className="text-3xl font-bold text-purple-600 mb-2">1,245</div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Employees Managed</div>
                                <div className="text-xs text-gray-400">Across 6 departments</div>
                            </Card>
                            <Card className="p-6 text-center hover:shadow-md transition-shadow">
                                <div className="text-3xl font-bold text-green-600 mb-2">99.2%</div>
                                <div className="text-sm font-medium text-gray-500 mb-1">System Uptime</div>
                                <div className="text-xs text-gray-400">24/7 reliability</div>
                            </Card>
                            <Card className="p-6 text-center hover:shadow-md transition-shadow">
                                <div className="text-3xl font-bold text-blue-600 mb-2">850+</div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Reports Generated</div>
                                <div className="text-xs text-gray-400">Monthly average</div>
                            </Card>
                            <Card className="p-6 text-center hover:shadow-md transition-shadow">
                                <div className="text-3xl font-bold text-orange-600 mb-2">15min</div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Payroll Processing</div>
                                <div className="text-xs text-gray-400">Average completion time</div>
                            </Card>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Complete HR Solution</h2>
                            <p className="text-gray-600">Everything you need to manage your workforce effectively</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <CardTitle className="text-xl">Employee Management</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">
                                        Manage employee information, employment details, tax status, and organizational structure 
                                        with comprehensive record-keeping and document management.
                                    </p>
                                    <ul className="text-sm text-gray-500 space-y-2">
                                        <li>• Personal & employment records</li>
                                        <li>• Organizational structure</li>
                                        <li>• Document management</li>
                                        <li>• Employee onboarding</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                        <span className="text-2xl">⏰</span>
                                    </div>
                                    <CardTitle className="text-xl">Timekeeping System</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">
                                        Biometric device support, attendance tracking, punch management, and reconciliation 
                                        with automated reporting and real-time monitoring.
                                    </p>
                                    <ul className="text-sm text-gray-500 space-y-2">
                                        <li>• Biometric integration</li>
                                        <li>• Attendance tracking</li>
                                        <li>• Leave management</li>
                                        <li>• Automated reporting</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <span className="text-2xl">💰</span>
                                    </div>
                                    <CardTitle className="text-xl">Payroll System</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">
                                        BIR & Philippine statutory-compliant payroll with SSS, PhilHealth, and Pag-IBIG 
                                        integration for seamless government compliance.
                                    </p>
                                    <ul className="text-sm text-gray-500 space-y-2">
                                        <li>• BIR compliance</li>
                                        <li>• SSS, PhilHealth, Pag-IBIG</li>
                                        <li>• Automated calculations</li>
                                        <li>• Government reporting</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Technology Stack Section */}
                    <section className="py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Built with Modern Technology</h2>
                                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                    Our system is built using the latest web technologies to ensure performance, 
                                    security, and scalability for your organization's needs.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                        <span className="text-gray-700">Laravel v{laravelVersion} - Robust backend framework</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                        <span className="text-gray-700">PHP v{phpVersion} - Server-side processing</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                        <span className="text-gray-700">React + Inertia.js - Modern user interface</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                        <span className="text-gray-700">Tailwind CSS - Beautiful, responsive design</span>
                                    </div>
                                </div>
                            </div>
                            <Card className="p-8">
                                <CardHeader>
                                    <CardTitle className="text-xl">System Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Organization</h4>
                                            <p className="text-lg text-gray-900">Cathay Metal Corporation</p>
                                            <p className="text-sm text-gray-500">Internal Information Management System</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Current Version</h4>
                                            <Badge variant="secondary" className="text-purple-700 bg-purple-50">
                                                v{laravelVersion}
                                            </Badge>
                                        </div>
                                        <div className="pt-4">
                                            {canLogin ? (
                                                <Link href={route('login')}>
                                                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                                        Access System
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                                    Get Started
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-16 text-center">
                        <Card className="p-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                                Ready to streamline your HR processes?
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                                Join Cathay Metal Corporation in using the most comprehensive HR management solution 
                                designed for Philippine businesses.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                {canLogin ? (
                                    <>
                                        <Link href={route('login')}>
                                            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                                                Access Dashboard
                                            </Button>
                                        </Link>
                                        {canRegister && (
                                            <Link href={route('register')}>
                                                <Button variant="outline" size="lg">
                                                    Create Account
                                                </Button>
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                                        Get Started Today
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-12">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">S</span>
                            </div>
                            <span className="font-semibold text-gray-900">SyncingSteel System</span>
                        </div>
                        <p className="text-gray-500 mb-2">
                            Internal Information Management for Cathay Metal Corporation
                        </p>
                        <p className="text-sm text-gray-400">
                            Laravel v{laravelVersion} (PHP v{phpVersion}) + React + Inertia.js
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}