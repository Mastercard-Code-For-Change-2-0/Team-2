const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // For now, let's use a simple hardcoded admin check
        if (email === 'roshanshelke135@gmail.com' && password === '123456') {
            const token = generateToken('admin123');
            
            return res.json({
                success: true,
                token,
                admin: {
                    id: 'admin123',
                    name: 'Roshan Shelke',
                    email: 'roshanshelke135@gmail.com'
                }
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.signupAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // For now, just return success for any signup
        const token = generateToken(email);

        res.status(201).json({
            success: true,
            token,
            admin: {
                id: Date.now().toString(),
                name,
                email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};