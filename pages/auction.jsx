import { useEffect, useState } from 'react';
import AuctionCard from '../components/AuctionCard';
import { Navbar } from '../components/Navbar';
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { Spotlight } from "../components/ui/Spotlight";

const AuctionPage = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check authentication when component mounts
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const verifyAuth = async () => {
            try {
                const response = await fetch('/api/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Not authenticated');
                }

                setIsAuthenticated(true);
                fetchAuctions(); // Only fetch auctions if authenticated
            } catch (error) {
                localStorage.removeItem('token');
                router.push('/auth/login');
            }
        };

        verifyAuth();
    }, [router]);

    const fetchAuctions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auction', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch auctions');
            }
            const data = await response.json();
            setAuctions(data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to load auctions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null; // or a loading spinner
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
            <Navbar />
            <Spotlight
                className="-top-40 left-0 md:left-60"
                fill="white"
            />
            <div className="container mx-auto px-4 py-24 relative z-10">
                <TextGenerateEffect
                    words="Available Auctions"
                    className="text-4xl font-bold text-white mb-8 text-center"
                />
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
                        Error: {error}
                    </div>
                ) : auctions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl text-white mb-4">No Auctions Available</h2>
                            <p className="text-gray-400">Be the first to create an auction!</p>
                        </div>
                        <Link href="/auction/create">
                            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2">
                                <FiPlus className="w-5 h-5" />
                                <span>Create New Auction</span>
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {auctions.map((auction) => (
                                <AuctionCard key={auction._id} auction={auction} />
                            ))}
                        </div>

                        {/* Floating Action Button */}
                        <Link href="/auction/create">
                            <button
                                className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center z-20"
                                aria-label="Create new auction"
                            >
                                <FiPlus className="w-6 h-6 text-white" />
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuctionPage;