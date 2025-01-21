import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export const Navbar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Initial check
        checkAuth();

        // Add event listener for storage changes
        window.addEventListener('storage', checkAuth);

        // Create a custom event listener for auth changes
        window.addEventListener('authChange', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        console.log('Checking auth, token:', token); // Add debug log

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        try {
            const response = await fetch('/api/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log('Auth response:', data); // Add debug log

            if (response.ok) {
                setIsLoggedIn(true);
            } else {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsLoggedIn(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.dispatchEvent(new Event('authChange'));
        router.push('/');
    };

    const NavItems = () => (
        <>
            {!isLoggedIn ? (
                <>
                    <button
                        onClick={() => {
                            router.push('/auth/login');
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full md:w-auto px-4 py-2 text-white hover:text-blue-400 transition-colors text-center"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => {
                            router.push('/auth/register');
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full md:w-auto p-[3px] relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-4 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent text-center">
                            Register
                        </div>
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={() => {
                            router.push('/');
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full md:w-auto px-4 py-2 text-white hover:text-blue-400 transition-colors text-center"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => {
                            if (!localStorage.getItem('token')) {
                                router.push('/auth/login');
                            } else {
                                router.push('/auction');
                            }
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full md:w-auto px-4 py-2 text-white hover:text-blue-400 transition-colors text-center"
                    >
                        Auctions
                    </button>
                    <button
                        onClick={() => {
                            router.push('../profile');
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full md:w-auto px-4 py-2 text-white hover:text-blue-400 transition-colors text-center"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full md:w-auto px-4 py-2 text-white hover:text-red-400 transition-colors text-center"
                    >
                        Logout
                    </button>
                </>
            )}
        </>
    );

    return (
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-center px-2 sm:px-4 pt-3 sm:pt-6">
            <nav className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-8 w-full max-w-7xl rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_1rem_rgba(0,0,0,0.1)]">
                <div className="text-white/90 text-xl sm:text-2xl font-bold tracking-tight">AuctionHub</div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4">
                    <NavItems />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 mx-2 p-4 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md md:hidden flex flex-col space-y-4">
                    <NavItems />
                </div>
            )}
        </div>
    );
};
