import clientPromise from '../../../../lib/mongodb';
import { requireAuth } from '../../../../utils/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        const client = await clientPromise;
        const db = client.db("auctionDB");

        switch (req.method) {
            case 'DELETE':
                await requireAuth(req, res, async () => {
                    const { userId } = req.user;
                    const auction = await db.collection("auctions").findOne({ _id: new ObjectId(id) });

                    if (!auction) {
                        return res.status(404).json({ message: 'Auction not found' });
                    }

                    if (auction.ownerId !== userId) {
                        return res.status(403).json({ message: 'Not authorized to delete this auction' });
                    }

                    await db.collection("auctions").deleteOne({ _id: new ObjectId(id) });
                    res.status(200).json({ message: 'Auction deleted successfully' });
                });
                break;

            default:
                res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
