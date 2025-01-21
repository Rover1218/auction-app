import '../styles/globals.css';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Navbar } from '../components/Navbar';
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { AnimatedTestimonials } from "../components/ui/animated-testimonials";

const testimonials = [
    {
        quote: "I found a rare vintage watch at an incredible price. The bidding process was exciting and transparent!",
        name: "John Smith",
        title: "Collector",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
    },
    {
        quote: "AuctionHub has transformed how I source antiques for my business. The platform is reliable and user-friendly.",
        name: "Sarah Johnson",
        title: "Antique Dealer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60"
    },
    {
        quote: "The live bidding feature is amazing! I've won several auctions and each transaction was smooth and secure.",
        name: "Michael Chen",
        title: "Art Collector",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60"
    }
];

const LandingPage = () => {
    const router = useRouter();

    return (
        <>
            <Head>
                <link rel="icon" href="https://cdn.iconscout.com/icon/free/png-256/free-auction-hammer-1851279-1569181.png" />
                <title>AuctionHub - Online Auction Platform</title>
            </Head>
            <div className="min-h-screen w-full relative flex flex-col overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-400/30 via-transparent to-transparent animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/30 via-transparent to-transparent animate-pulse"></div>
                </div>

                <div className="relative z-10 w-full text-white">
                    <div className="sticky top-0 z-50 w-full bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
                        <Navbar />
                    </div>
                    <div className="container mx-auto px-4">
                        {/* Hero Section */}
                        <div className="min-h-[calc(100vh-80px)] pt-20 md:pt-24 pb-10 md:pb-20 flex flex-col items-center justify-center">
                            <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold mb-8 text-center">
                                <TextGenerateEffect
                                    words="Welcome to AuctionHub"
                                    className="inline-block tracking-tight"
                                />
                            </h1>
                            <p className="text-lg md:text-xl mb-8 max-w-2xl text-center px-4">
                                The premier platform for online auctions. Discover unique items, bid in real-time, and win amazing deals!
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12 max-w-4xl w-full px-4">
                                <div className="p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <h3 className="text-xl font-semibold mb-2">Live Bidding</h3>
                                    <p>Participate in real-time auctions with instant updates</p>
                                </div>
                                <div className="p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <h3 className="text-xl font-semibold mb-2">Secure Trading</h3>
                                    <p>Safe and transparent transactions guaranteed</p>
                                </div>
                                <div className="p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                                    <p>Browse through thousands of unique items daily</p>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/auction')}
                                className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:scale-105 transition-all duration-300"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                    Start Exploring Auctions
                                </span>
                            </button>
                        </div>

                        {/* Statistics Section */}
                        <div className="py-10 md:py-20 w-full">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-6xl mx-auto">
                                <div className="text-center p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <h3 className="text-4xl font-bold mb-2">5K+</h3>
                                    <p>Active Auctions</p>
                                </div>
                                <div className="text-center p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <h3 className="text-4xl font-bold mb-2">50K+</h3>
                                    <p>Happy Users</p>
                                </div>
                                <div className="text-center p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <h3 className="text-4xl font-bold mb-2">$10M+</h3>
                                    <p>Items Sold</p>
                                </div>
                                <div className="text-center p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <h3 className="text-4xl font-bold mb-2">99%</h3>
                                    <p>Success Rate</p>
                                </div>
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="py-10 md:py-20">
                            <div className="max-w-6xl mx-auto px-4">
                                <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                                    How It Works
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                                    <div className="p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                        <div className="text-3xl font-bold mb-4">1</div>
                                        <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                                        <p>Sign up for free and verify your identity</p>
                                    </div>
                                    <div className="p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                        <div className="text-3xl font-bold mb-4">2</div>
                                        <h3 className="text-xl font-semibold mb-2">Place Bids</h3>
                                        <p>Find items you love and place your bids</p>
                                    </div>
                                    <div className="p-6 rounded-lg border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                                        <div className="text-3xl font-bold mb-4">3</div>
                                        <h3 className="text-xl font-semibold mb-2">Win & Collect</h3>
                                        <p>Win auctions and receive your items safely</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonials Section */}
                        <div className="py-10 md:py-20">
                            <div className="w-full max-w-6xl mx-auto px-4">
                                <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                                    What Our Users Say
                                </h2>
                                <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/30 shadow-xl">
                                    <AnimatedTestimonials
                                        testimonials={testimonials}
                                        className="[&>div]:bg-white/5 [&>div]:p-6 [&>div]:rounded-lg [&>div]:backdrop-blur-sm [&_p]:text-white [&_p]:!opacity-100 [&_h3]:text-white [&_h3]:!opacity-100 [&_span]:text-white [&_span]:!opacity-100 [&_*]:!text-opacity-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="py-10 md:py-20">
                            <div className="text-center max-w-6xl mx-auto px-4 bg-white/10 backdrop-blur-md p-12 rounded-2xl border border-white/30 shadow-xl">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                                    Ready to Start Bidding?
                                </h2>
                                <p className="text-lg md:text-xl mb-8">
                                    Join thousands of satisfied users and start your auction journey today.
                                </p>
                                <button
                                    onClick={() => router.push('/auction')}
                                    className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                                >
                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                        Start Exploring Auctions
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};

LandingPage.propTypes = {
    testimonials: PropTypes.arrayOf(
        PropTypes.shape({
            quote: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        })
    ),
};

export default LandingPage;
