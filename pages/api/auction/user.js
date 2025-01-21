import clientPromise from '../../../lib/mongodb';
import { requireAuth } from '../../../utils/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await requireAuth(req, res, async () => {
            const { userId } = req.user;
            const client = await clientPromise;
            const db = client.db("auctionDB");

            const userAuctions = await db.collection("auctions")
                .find({ ownerId: userId })
                .sort({ createdAt: -1 })
                .toArray();

            res.status(200).json(userAuctions);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
