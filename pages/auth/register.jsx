import '../../styles/globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Modal from '../../components/Modal';
import { Spotlight } from "../../components/ui/Spotlight";
import Head from 'next/head';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        color: ''
    });
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setModal({
                isOpen: true,
                title: 'Error',
                message: 'Passwords do not match',
                type: 'error'
            });
            return;
        }

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify({ ...formData, isRegister: true }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();
            if (res.ok) {
                setModal({
                    isOpen: true,
                    title: 'Account Created!',
                    message: 'Your account has been created successfully. Redirecting to login...',
                    type: 'success'
                });
                setTimeout(() => router.push('/auth/login'), 3000);
            } else {
                setError(data.message);
                setModal({
                    isOpen: true,
                    title: 'Registration Failed',
                    message: data.message,
                    type: 'error'
                });
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setModal({
                isOpen: true,
                title: 'Error',
                message: 'An error occurred. Please try again.',
                type: 'error'
            });
        }
    };

    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (!password) return score;

        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;

        // Character type checks
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        const strengthMap = {
            0: { message: 'Very Weak', color: '#2DD4BF' }, // teal-400
            1: { message: 'Weak', color: '#14B8A6' },      // teal-500
            2: { message: 'Fair', color: '#0D9488' },      // teal-600
            3: { message: 'Good', color: '#0F766E' },      // teal-700
            4: { message: 'Strong', color: '#115E59' },    // teal-800
            5: { message: 'Very Strong', color: '#134E4A' } // teal-900
        };

        return {
            score,
            ...strengthMap[score]
        };
    };

    useEffect(() => {
        setPasswordStrength(calculatePasswordStrength(formData.password));
    }, [formData.password]);

    return (
        <>
            <Head>
                <link rel="icon" href="https://cdn.iconscout.com/icon/free/png-256/free-auction-hammer-1851279-1569181.png" />
                <title>AuctionHub - Register</title>
            </Head>
            <div className="relative min-h-screen w-full overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <Spotlight
                        className="-top-40 left-0 md:left-60 animate-spotlight"
                        fill="white"
                    />
                </div>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-700 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-50">
                            <div className="absolute top-0 -left-4 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
                        </div>

                        {/* Main content */}
                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold text-center mb-2 text-white tracking-tight">Create Account</h1>
                            <p className="text-slate-400 text-center mb-8 text-sm">Join us to start bidding on amazing items</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email input with label */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition placeholder:text-slate-500"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Password inputs with labels */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                                    <div className="relative group">
                                        <input
                                            className="w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition placeholder:text-slate-500"
                                            type={showPassword.password ? "text" : "password"}
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400 transition"
                                            onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                                        >
                                            {showPassword.password ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 ml-1">Must be at least 6 characters</p>
                                    {formData.password && (
                                        <div className="mt-2 space-y-2">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            backgroundColor: i < passwordStrength.score
                                                                ? passwordStrength.color
                                                                : 'rgba(71, 85, 105, 0.5)' // slate-600/50
                                                        }}
                                                        className="h-1 w-full rounded-full transition-all duration-300"
                                                    ></div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span
                                                    className="text-xs font-medium"
                                                    style={{ color: passwordStrength.color }}
                                                >
                                                    {passwordStrength.message}
                                                </span>
                                                {passwordStrength.score >= 3 && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill={passwordStrength.color}
                                                        className="w-4 h-4"
                                                    >
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <ul className="text-xs text-slate-400 ml-1 space-y-1">
                                        <li className={`${formData.password.length >= 8 ? 'text-teal-400' : ''}`}>
                                            • At least 8 characters
                                        </li>
                                        <li className={`${/[A-Z]/.test(formData.password) ? 'text-teal-400' : ''}`}>
                                            • At least one uppercase letter
                                        </li>
                                        <li className={`${/[0-9]/.test(formData.password) ? 'text-teal-400' : ''}`}>
                                            • At least one number
                                        </li>
                                        <li className={`${/[^A-Za-z0-9]/.test(formData.password) ? 'text-teal-400' : ''}`}>
                                            • At least one special character
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <input
                                            className="w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition placeholder:text-slate-500"
                                            type={showPassword.confirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400 transition"
                                            onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                                        >
                                            {showPassword.confirmPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="w-full px-8 py-3.5 rounded-full relative bg-slate-700 text-white hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600 group"
                                    type="submit"
                                >
                                    <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                                    <span className="relative z-20">Create Account</span>
                                </button>
                            </form>

                            {error && (
                                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-center text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <Link
                                href="/auth/login"
                                className="block mt-8 text-center text-slate-400 hover:text-teal-400 transition text-sm"
                            >
                                Already have an account? <span className="font-medium text-teal-400 hover:text-teal-300">Sign in</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={modal.isOpen}
                    onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                    title={modal.title}
                    message={modal.message}
                    type={modal.type}
                />
            </div>
        </>
    );
}
