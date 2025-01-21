import { verifyToken } from '../../utils/auth';

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        return res.status(200).json({ isValid: true, user: decoded });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
