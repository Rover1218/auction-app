import clientPromise from '../../lib/mongodb';
import { requireAuth } from '../../utils/auth';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        if (!client) {
            throw new Error('Failed to connect to database');
        }

        const db = client.db("auctionDB");
        if (!db) {
            throw new Error('Failed to connect to auctionDB');
        }

        switch (req.method) {
            case 'GET':
                try {
                    const auctions = await db.collection("auctions").find({}).toArray();
                    return res.status(200).json(auctions || []);
                } catch (error) {
                    console.error('Database query error:', error);
                    return res.status(500).json({
                        message: 'Failed to fetch auctions',
                        error: error.message
                    });
                }

            case 'POST':
                await requireAuth(req, res, async () => {
                    const { name, startingBid, description, endDate, image } = req.body;
                    const { userId } = req.user; // Get from auth token

                    if (!name || !startingBid) {
                        return res.status(400).json({ message: 'Missing required fields' });
                    }

                    // Validate image URL
                    let validatedImage = null;
                    if (image) {
                        try {
                            const url = new URL(image);
                            validatedImage = url.toString();
                        } catch {
                            validatedImage = null;
                        }
                    }

                    const newAuction = {
                        name,
                        startingBid: parseFloat(startingBid),
                        currentBid: parseFloat(startingBid),
                        description,
                        endDate,
                        image: validatedImage,
                        createdAt: new Date(),
                        ownerId: userId,
                        bids: []
                    };

                    const result = await db.collection("auctions").insertOne(newAuction);
                    return res.status(201).json({ ...newAuction, _id: result.insertedId });
                });
                break;

            case 'DELETE':
                await requireAuth(req, res, async () => {
                    const { id } = req.query;
                    const { userId } = req.user;

                    const auction = await db.collection("auctions").findOne({ _id: id });

                    if (!auction) {
                        return res.status(404).json({ message: 'Auction not found' });
                    }

                    if (auction.ownerId !== userId) {
                        return res.status(403).json({ message: 'Not authorized to delete this auction' });
                    }

                    await db.collection("auctions").deleteOne({ _id: id });
                    return res.status(200).json({ message: 'Auction deleted successfully' });
                });
                break;

            default:
                res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}
