import { useEffect, useState } from 'react';
import AuctionCard from '../components/AuctionCard';

const AuctionPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch('/api/auction');
                if (!response.ok) {
                    throw new Error('Failed to fetch auctions');
                }
                const data = await response.json();
                setAuctions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1>Available Auctions</h1>
            <div style={styles.auctionList}>
                {auctions.length > 0 ? (
                    auctions.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    ))
                ) : (
                    <p>No auctions available</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
    },
    auctionList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
};

export default AuctionPage;
