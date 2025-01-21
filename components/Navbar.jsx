import { useRouter } from 'next/router';

export const Navbar = () => {
    const router = useRouter();

    return (
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-center px-2 sm:px-4 pt-3 sm:pt-6">
            <nav className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-8 w-full max-w-7xl rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_1rem_rgba(0,0,0,0.1)]">
                <div className="text-white/90 text-xl sm:text-2xl font-bold tracking-tight">AuctionHub</div>
                <div className="space-x-2 sm:space-x-4">
                    <button
                        onClick={() => router.push('../auth/login')}
                        className="px-4 py-2 text-white hover:text-blue-400 transition-colors"
                    >
                        Login
                    </button>
                    <button onClick={() => router.push('../auth/register')} className="p-[3px] relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-4 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                            Register
                        </div>
                    </button>
                </div>
            </nav>
        </div>
    );
};
