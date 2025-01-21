import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Check if JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const { email, password, isRegister, confirmPassword } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (isRegister && password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Connect to database
        const { db } = await connectToDatabase();

        if (isRegister) {
            try {
                // Check if user already exists
                const existingUser = await db.collection('users').findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email already registered' });
                }

                // Hash password and create user
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.collection('users').insertOne({
                    email,
                    password: hashedPassword,
                    createdAt: new Date(),
                });

                return res.status(201).json({ message: 'User created successfully!' });
            } catch (error) {
                console.error('Registration error:', error);
                return res.status(500).json({ message: 'Error creating user' });
            }
        } else {
            try {
                // Login flow
                const user = await db.collection('users').findOne({ email });

                if (!user) {
                    return res.status(400).json({ message: 'Invalid email or password' });
                }

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return res.status(400).json({ message: 'Invalid email or password' });
                }

                // Create JWT token
                const token = jwt.sign(
                    {
                        userId: user._id.toString(),
                        email: user.email
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return res.status(200).json({ token });
            } catch (error) {
                console.error('Login error:', error);
                return res.status(500).json({ message: 'Error during login' });
            }
        }
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: 'Server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
