const AuctionCard = ({ auction }) => {
    return (
        <div style={styles.card}>
            <h3>{auction.name}</h3>
            <p>Highest Bid: ${auction.highestBid}</p>
            <button style={styles.button}>Place a Bid</button>
        </div>
    );
};

const styles = {
    card: {
        width: '200px',
        padding: '10px',
        margin: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    },
    button: {
        padding: '8px 16px',
        fontSize: '14px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default AuctionCard;
