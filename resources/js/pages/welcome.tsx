import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { ArrowRight, Building2, Users, Shield, TrendingUp, Zap, Globe  } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Cameco">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            
            {/* Modern Header */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
                <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/80">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Cameco</h1>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Enterprise Solutions</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <AppearanceToggleDropdown />
                            {auth.user ? (
                                <Button asChild className="shadow-lg">
                                    <Link href={dashboard()}>
                                        <span>Dashboard</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" asChild>
                                        <Link href={login()}>
                                            Log in
                                        </Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild className="shadow-lg">
                                            <Link href={register()}>
                                                Get Started
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                {/* Hero Section */}
                <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 shadow-2xl">
                            <Building2 className="h-12 w-12 text-white" />
                        </div>
                        
                        <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-6xl lg:text-7xl">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Cameco
                            </span>
                        </h1>
                        
                        <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                            Enterprise-grade workforce management and HR solutions. 
                            Streamline your operations with our comprehensive platform designed for modern businesses.
                        </p>
                        
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {!auth.user && (
                                <>
                                    {canRegister && (
                                        <Button size="lg" asChild className="shadow-xl">
                                            <Link href={register()}>
                                                Get Started Today
                                                <ArrowRight className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                    )}
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href={login()}>
                                            Sign In
                                        </Link>
                                    </Button>
                                </>
                            )}
                            {auth.user && (
                                <Button size="lg" asChild className="shadow-xl">
                                    <Link href={dashboard()}>
                                        Go to Dashboard
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    {/* Feature Cards */}
                    <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:scale-[1.02] dark:border-slate-700/60 dark:bg-slate-800/80">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Workforce Management
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300">
                                Comprehensive employee management, scheduling, and performance tracking in one unified platform.
                            </p>
                        </div>
                        
                        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:scale-[1.02] dark:border-slate-700/60 dark:bg-slate-800/80">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Analytics & Insights
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300">
                                Advanced reporting and analytics to make data-driven decisions and optimize your operations.
                            </p>
                        </div>
                        
                        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:scale-[1.02] dark:border-slate-700/60 dark:bg-slate-800/80">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Enterprise Security
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300">
                                Bank-level security with role-based access control, audit trails, and compliance features.
                            </p>
                        </div>
                        
                        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:scale-[1.02] dark:border-slate-700/60 dark:bg-slate-800/80">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Automation Tools
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300">
                                Streamline workflows with intelligent automation for payroll, onboarding, and routine tasks.
                            </p>
                        </div>
                        
                        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:scale-[1.02] dark:border-slate-700/60 dark:bg-slate-800/80">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
                                <Globe className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Global Integration
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300">
                                Connect with popular business tools and services through our extensive API ecosystem.
                            </p>
                        </div>
                        
                        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:scale-[1.02] dark:border-slate-700/60 dark:bg-slate-800/80">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Scalable Platform
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300">
                                Built to grow with your business, from small teams to enterprise-level organizations.
                            </p>
                        </div>
                    </div>
                </main>
                
                {/* Footer */}
                <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/50">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                © 2024 Cameco. Built with modern web technologies for enterprise excellence.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}