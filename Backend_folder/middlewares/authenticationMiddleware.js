const jwt = require('jsonwebtoken');
const user = require('../models/userModel');

// Authentication Middleware
exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    console.log("Token in header:", req.headers.authorization);
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        req.user = decoded;
        console.log('Decoded User:', decoded);
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};


