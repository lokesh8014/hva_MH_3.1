const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Role-Based Middleware
exports.authorizeRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: 'Access Denied. Insufficient permissions.' });
        }
        next();
    };
};

