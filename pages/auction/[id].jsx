import { useEffect, useState } from 'react';

export default function AuctionDetail({ id }) {
    const [auction, setAuction] = useState(null);

    useEffect(() => {
        const fetchAuction = async () => {
            const res = await fetch(`/api/auction/${id}`);
            const data = await res.json();
            setAuction(data);
        };

        fetchAuction();
    }, [id]);

    if (!auction) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{auction.title}</h1>
            <p>{auction.description}</p>
            <p>Start Price: ${auction.startPrice}</p>
            <p>End Date: {auction.endDate}</p>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    return {
        props: { id },
    };
}
