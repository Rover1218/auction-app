import jwt from 'jsonwebtoken';

// Utility function to verify JWT token
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
};

// Middleware to protect routes that require authentication
export const requireAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const user = verifyToken(token);
        req.user = user; // Attach user info to the request object
        next(); // Call the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
