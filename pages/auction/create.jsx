import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navbar } from '../../components/Navbar';
import { FiDollarSign, FiClock, FiFileText, FiImage } from 'react-icons/fi';
import { TextGenerateEffect } from "../../components/ui/text-generate-effect";
import '../../styles/globals.css';
import { Spotlight } from "../../components/ui/Spotlight";
import Head from 'next/head';

export default function CreateAuction() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startingBid: '',
        endDate: '',
        image: ''
    });

    useEffect(() => {
        // Check authentication when component mounts
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        // Verify token
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
            } catch (error) {
                localStorage.removeItem('token');
                router.push('/auth/login');
            }
        };

        verifyAuth();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Extract direct image URL if it's a Google Images URL
            let imageUrl = formData.image;
            if (imageUrl && imageUrl.includes('google.com/imgres')) {
                const params = new URLSearchParams(new URL(imageUrl).search);
                imageUrl = params.get('imgurl') || imageUrl;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch('/api/auction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    image: imageUrl
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create auction');
            }

            router.push('/auction');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <Head>
                <link rel="icon" href="https://cdn.iconscout.com/icon/free/png-256/free-auction-hammer-1851279-1569181.png" />
                <title>AuctionHub - Create Auction</title>
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
                <Navbar />
                <Spotlight
                    className="-top-40 left-0 md:left-60"
                    fill="white"
                />
                <div className="container mx-auto px-4 py-24 relative z-10">
                    <div className="max-w-2xl mx-auto">
                        <TextGenerateEffect
                            words="Create New Auction"
                            className="text-4xl font-bold text-white mb-8 text-center"
                        />

                        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-6 border border-white/20">
                            <div>
                                <label className="flex items-center text-white mb-2">
                                    <FiFileText className="mr-2" />
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-white mb-2">
                                    <FiFileText className="mr-2" />
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 h-32"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-white mb-2">
                                    <FiDollarSign className="mr-2" />
                                    Starting Bid
                                </label>
                                <input
                                    type="number"
                                    name="startingBid"
                                    value={formData.startingBid}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-white mb-2">
                                    <FiClock className="mr-2" />
                                    End Date
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-white mb-2">
                                    <FiImage className="mr-2" />
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm">{error}</div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                            >
                                {isLoading ? 'Creating...' : 'Create Auction'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
