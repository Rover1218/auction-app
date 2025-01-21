import '../../styles/globals.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Modal from '../../components/Modal';
import { Spotlight } from "../../components/ui/Spotlight";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify({ ...formData, isRegister: false }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token); // Changed from auth_token to token
                window.dispatchEvent(new Event('authChange')); // Add this line to trigger navbar update
                setModal({
                    isOpen: true,
                    title: 'Welcome Back!',
                    message: 'Successfully logged in. Redirecting...',
                    type: 'success'
                });
                setTimeout(() => router.push('/'), 3000);
            } else {
                setError(data.message);
                setModal({
                    isOpen: true,
                    title: 'Login Failed',
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
        } finally {
            setLoading(false);
        }
    };

    return (
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
                        <h1 className="text-4xl font-bold text-center mb-2 text-white tracking-tight">Welcome Back</h1>
                        <p className="text-slate-400 text-center mb-8 text-sm">Sign in to your account to continue</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                                <div className="relative group">
                                    <input
                                        className="w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition placeholder:text-slate-500"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400 transition"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
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
                                className="w-full px-8 py-3.5 rounded-full relative bg-slate-700 text-white hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed group"
                                type="submit"
                                disabled={loading}
                            >
                                <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                                <span className="relative z-20 flex items-center justify-center">
                                    {loading && (
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                    )}
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </span>
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-center text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <Link
                            href="/auth/register"
                            className="block mt-8 text-center text-slate-400 hover:text-teal-400 transition text-sm"
                        >
                            Don't have an account? <span className="font-medium text-teal-400 hover:text-teal-300">Sign up</span>
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
    );
}
