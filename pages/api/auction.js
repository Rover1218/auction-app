import { requireAuth } from '../../utils/auth';

export default async function handler(req, res) {
    // Protect this route with the requireAuth middleware
    await requireAuth(req, res, async () => {
        switch (req.method) {
            case 'GET':
                // Fetch auction data (e.g., from database)
                const auctions = [
                    { id: 1, name: 'Vintage Car', highestBid: 1000 },
                    { id: 2, name: 'Antique Watch', highestBid: 500 },
                ];
                res.status(200).json(auctions);
                break;

            case 'POST':
                // Handle auction creation logic
                const { name, startingBid } = req.body;
                if (!name || !startingBid) {
                    return res.status(400).json({ message: 'Missing auction data' });
                }

                const newAuction = { id: Date.now(), name, highestBid: startingBid };
                // Save newAuction to the database here

                res.status(201).json(newAuction);
                break;

            default:
                res.status(405).json({ message: 'Method Not Allowed' });
                break;
        }
    });
}
