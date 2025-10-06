import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen flex">
                {/* Left Side - Registration Form */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 bg-white">
                    <div className="w-full max-w-md">
                        {/* Back Link */}
                        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>

                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-[#0056A4] mb-2">Sign Up</h1>
                            <div className="flex items-center gap-2">
                                <p className="text-gray-600 text-sm">Create your account to get started</p>
                                <div className="group relative inline-block">
                                    <div className="text-blue-600 hover:text-blue-800 cursor-help">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-0 top-6 z-50 w-72 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-xl transition-opacity duration-200">
                                        <p className="font-semibold mb-2">Account Creation Process:</p>
                                        <ol className="list-decimal list-inside space-y-1">
                                            <li>Complete the registration form</li>
                                            <li>System admin reviews your application</li>
                                            <li>Admin approves your registration</li>
                                            <li>You'll receive email notification</li>
                                            <li>You can now sign in to the system</li>
                                        </ol>
                                        <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#0056A4] focus:border-[#0056A4] transition-all ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Juan Dela Cruz"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#0056A4] focus:border-[#0056A4] transition-all ${
                                        errors.username ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    autoComplete="username"
                                    onChange={(e) => setData('username', e.target.value)}
                                    placeholder="jdelacruz"
                                    required
                                />
                                {errors.username && (
                                    <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#0056A4] focus:border-[#0056A4] transition-all ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="juan.delacruz@example.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className={`w-full px-4 py-2.5 border rounded-md focus:ring-2 focus:ring-[#0056A4] focus:border-[#0056A4] transition-all ${
                                            errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className={`w-full px-4 py-2.5 border rounded-md focus:ring-2 focus:ring-[#0056A4] focus:border-[#0056A4] transition-all ${
                                            errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-xs text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start pt-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={data.terms}
                                        onChange={(e) => setData('terms', e.target.checked)}
                                        className="rounded border-gray-300 text-[#0056A4] focus:ring-[#0056A4] h-4 w-4"
                                    />
                                </div>
                                <div className="ml-2">
                                    <label htmlFor="terms" className="text-xs text-gray-600">
                                        I agree to the{' '}
                                        <a href="#" className="text-[#0056A4] hover:text-[#0066B4] underline transition-colors">
                                            Terms and Conditions
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-[#0056A4] hover:text-[#0066B4] underline transition-colors">
                                            Privacy Policy
                                        </a>
                                    </label>
                                    {errors.terms && (
                                        <p className="mt-1 text-xs text-red-600">{errors.terms}</p>
                                    )}
                                </div>
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
                                        <span>Creating Account</span>
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-medium text-[#0056A4] hover:text-[#0066B4] underline transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Logo/Brand (Same as Login) */}
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
