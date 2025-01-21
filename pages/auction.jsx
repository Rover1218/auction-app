import { useEffect, useState } from 'react';
import AuctionCard from '../components/AuctionCard';
import { Navbar } from '../components/Navbar';
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { Spotlight } from "../components/ui/Spotlight";
import Head from 'next/head';
import { MultiStepLoader as Loader } from "../components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";

const AuctionPage = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLoader, setShowLoader] = useState(true);  // Add this new state

    const loadingStates = [
        { text: 'Connecting to AuctionHub...' },
        { text: 'Authenticating your session...' },
        { text: 'Fetching available auctions...' },
        { text: 'Processing auction data...' },
        { text: 'Preparing your experience...' },
        { text: 'Almost ready to show auctions...' }
    ];

    const fetchAuctions = async () => {
        try {
            setShowLoader(true);
            const startTime = Date.now();
            const token = localStorage.getItem('token');
            const LOADING_DURATION = 4000; // Changed to 4 seconds

            const response = await fetch('/api/auction', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (Array.isArray(data)) {
                setAuctions(data);
            } else if (data.auctions && Array.isArray(data.auctions)) {
                setAuctions(data.auctions);
            } else {
                throw new Error('Invalid data format received');
            }

            // Ensure minimum 4 seconds loading time
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < LOADING_DURATION) {
                await new Promise(resolve => setTimeout(resolve, LOADING_DURATION - elapsedTime));
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to load auctions. Please try again later.');
            await new Promise(resolve => setTimeout(resolve, 4000)); // Also wait 4 seconds on error
        } finally {
            setShowLoader(false);
            setLoading(false);
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        const initializeApp = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                const response = await fetch('/api/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Not authenticated');

                setIsAuthenticated(true);
                await fetchAuctions();
            } catch (error) {
                console.error('Auth error:', error);
                localStorage.removeItem('token');
                router.push('/auth/login');
            }
        };

        initializeApp();
    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Head>
                <link rel="icon" href="https://cdn.iconscout.com/icon/free/png-256/free-auction-hammer-1851279-1569181.png" />
                <title>AuctionHub - Auctions</title>
            </Head>
            {/* Add Loader Component */}
            <Loader
                loadingStates={loadingStates}
                loading={showLoader}
                duration={2500} // Adjusted duration to spread states across 4 seconds
            />
            {showLoader && (
                <button
                    className="fixed top-4 right-4 text-white z-[120]"
                    onClick={() => setShowLoader(false)}
                >
                    <IconSquareRoundedX className="h-10 w-10" />
                </button>
            )}
            {/* Rest of the UI */}
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
                    {error ? (
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
        </>
    );
};

export default AuctionPage;