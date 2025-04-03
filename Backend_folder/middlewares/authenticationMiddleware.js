const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Authentication Middleware
exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};


