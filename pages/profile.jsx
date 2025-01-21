import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '../styles/globals.css';
import { FiPackage, FiDollarSign, FiClock } from 'react-icons/fi';
import { Navbar } from '../components/Navbar';
import { ProfileAuctionCard } from '../components/AuctionCard';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeListings, setActiveListings] = useState([]);
    const [biddingHistory, setBiddingHistory] = useState([]);
    const router = useRouter();

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('./auth/login');
                return;
            }

            try {
                // Verify user
                const verifyResponse = await fetch('/api/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!verifyResponse.ok) {
                    throw new Error('Verification failed');
                }

                const userData = await verifyResponse.json();
                setUser(userData.user);

                // Fetch user's active listings
                const listingsResponse = await fetch('/api/auction/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!listingsResponse.ok) {
                    throw new Error('Failed to fetch listings');
                }

                const listingsData = await listingsResponse.json();
                setActiveListings(listingsData);

            } catch (error) {
                console.error('Error:', error);
                localStorage.removeItem('token');
                router.push('./auth/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Please sign in to view your profile</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Navbar />
            {/* Cover Image */}
            <div className="relative h-48 md:h-72 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Profile Header - Simplified */}
                <div className="relative -mt-32 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-white/90">
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold">{user.email}</h1>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <FiPackage className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                                    <div className="text-xl font-bold">{activeListings.length}</div>
                                    <div className="text-sm text-gray-600">Active Listings</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <FiDollarSign className="w-6 h-6 mx-auto text-green-500 mb-2" />
                                    <div className="text-xl font-bold">{biddingHistory.length}</div>
                                    <div className="text-sm text-gray-600">Total Bids</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <FiClock className="w-6 h-6 mx-auto text-purple-500 mb-2" />
                                    <div className="text-xl font-bold">0</div>
                                    <div className="text-sm text-gray-600">Won Auctions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Listings Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Active Listings */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                            <FiPackage className="mr-2 text-blue-500" />
                            Your Active Listings
                        </h2>
                        {activeListings.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <FiPackage className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-4">No active listings yet</p>
                                <Link href={`../auction/create`}>
                                    <button className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:-translate-y-0.5 transition-all duration-200">
                                        Create Your First Listing
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeListings.map((listing) => (
                                    <ProfileAuctionCard
                                        key={listing._id}
                                        auction={listing}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bidding History */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                            <FiDollarSign className="mr-2 text-green-500" />
                            Bidding History
                        </h2>
                        {biddingHistory.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <FiDollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-4">No bidding history yet</p>
                                <Link href="/auction">
                                    <button className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:-translate-y-0.5 transition-all duration-200">
                                        Explore Auctions
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {biddingHistory.map((bid) => (
                                    <div key={bid.id}
                                        className="group relative border rounded-xl p-4 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden">
                                                <Image
                                                    src={bid.itemImage || '/default-item.png'}
                                                    alt={bid.itemTitle}
                                                    width={96}
                                                    height={96}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold group-hover:text-green-500 transition-colors">
                                                    {bid.itemTitle}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Your Bid: ${bid.amount}
                                                </p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <FiClock className="mr-1" />
                                                    {bid.date}
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm ${bid.status === 'won' ? 'bg-green-100 text-green-700' :
                                                bid.status === 'outbid' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {bid.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
