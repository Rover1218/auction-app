import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiClock, FiDollarSign, FiTrash2 } from 'react-icons/fi';
import { DeleteModal } from './DeleteModal';
import { BackgroundGradient } from "./ui/background-gradient";

const AuctionCard = ({ auction }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();

    const isOwner = auction.ownerId === localStorage.getItem('userId');

    const handleBid = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const res = await fetch(`/api/auction/${auction._id}/bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: parseFloat(bidAmount) })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }

            router.reload();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/auction/${auction._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete auction');
            }

            router.reload();
        } catch (error) {
            setError(error.message);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return '/default-auction.jpg';
        try {
            // Extract direct image URL if it's a Google Images URL
            if (url.includes('google.com/imgres')) {
                const params = new URLSearchParams(new URL(url).search);
                const directUrl = params.get('imgurl');
                return directUrl || '/default-auction.jpg';
            }
            return url;
        } catch {
            return '/default-auction.jpg';
        }
    };

    const formatPrice = (price) => {
        return Number(price).toFixed(2);
    };

    return (
        <>
            <BackgroundGradient className="rounded-xl p-[1px] overflow-hidden">
                <div className="relative h-full bg-black rounded-xl overflow-hidden">
                    <div className="relative h-48 group">
                        <Image
                            src={getImageUrl(auction.image)}
                            alt={auction.name || 'Auction item'}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                e.target.src = '/default-auction.jpg';
                            }}
                            unoptimized={true}
                        />
                        {isOwner && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-all duration-200"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{auction.name}</h3>
                        <p className="text-gray-400 mb-2">Hosted by: {auction.ownerName || 'Anonymous'}</p>
                        <p className="text-gray-400 mb-4">{auction.description}</p>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center text-blue-400">
                                <FiDollarSign className="mr-1" />
                                <span>Start: ${formatPrice(auction.startingBid)}</span>
                            </div>
                            <div className="flex items-center text-green-400">
                                <FiDollarSign className="mr-1" />
                                <span>Current: ${formatPrice(auction.currentBid)}</span>
                            </div>
                            <div className="flex items-center text-purple-400">
                                <FiClock className="mr-1" />
                                <span>{new Date(auction.endDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <form onSubmit={handleBid} className="space-y-3">
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder="Enter bid amount"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    min={auction.currentBid + 1}
                                    step="0.01"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                                >
                                    {isLoading ? 'Bidding...' : 'Place Bid'}
                                </button>
                            </div>
                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}
                        </form>
                    </div>
                </div>
            </BackgroundGradient>
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                itemName={auction.name}
            />
        </>
    );
};

export const ProfileAuctionCard = ({ auction }) => {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/auction/${auction._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete auction');
            }

            router.reload();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const endTime = new Date(auction.endDate).getTime();
            const difference = endTime - now;

            if (difference <= 0) {
                return 'Ended';
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) return `${days}d ${hours}h left`;
            if (hours > 0) return `${hours}h ${minutes}m left`;
            return `${minutes}m left`;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [auction.endDate]);

    return (
        <>
            <div className="group relative border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => router.push(`/auction/${auction._id}`)}>
                <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden relative">
                        <Image
                            src={auction.image || '/default-auction.jpg'}
                            alt={auction.name}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-105"
                            unoptimized={true}
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold group-hover:text-blue-500 transition-colors">
                                {auction.name}
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(true);
                                }}
                                className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-all duration-200"
                                aria-label="Delete auction"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Current Bid: ${auction.currentBid}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            <span>{timeLeft}</span>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                itemName={auction.name}
            />
        </>
    );
};

export default AuctionCard;
