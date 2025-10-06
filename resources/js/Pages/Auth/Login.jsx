import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen flex">
                {/* Left Side - Login Form */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 bg-white">
                    <div className="w-full max-w-md">
                        {/* Logo/Back Link */}
                        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>

                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-[#0056A4] mb-2">Sign in</h1>
                        </div>

                        {status && (
                            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                                <p className="text-sm font-medium text-green-800">{status}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={data.email}
                                    className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#0056A4] focus:border-[#0056A4] transition-all ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter username or email"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#0056A4] focus:border-[#0056A4] transition-all ${
                                            errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter password"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 bg-[#0056A4] hover:bg-[#004080] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing In</span>
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-medium text-[#0056A4] hover:text-[#0066B4] underline transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Logo/Brand */}
                <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0056A4] via-[#0066B4] to-[#0056A4] items-center justify-center p-12">
                    <div className="max-w-lg">
                        <div className="bg-white rounded-2xl p-12 shadow-2xl">
                            <div className="flex items-end justify-center gap-2 mb-8">
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
                        
                        <div className="mt-8 text-white text-center">
                            <h2 className="text-2xl font-bold mb-4">SyncingSteel HRIS</h2>
                            <p className="text-blue-100">
                                Enterprise Human Resource Information System for streamlined workforce management
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
