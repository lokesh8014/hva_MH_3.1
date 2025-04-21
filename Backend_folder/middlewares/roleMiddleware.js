const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Role-Based Middleware
exports.authorizeRole = (requiredRole) => {
    return (req, res, next) => {
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied: Insufficient permissions" });
      }
      next();
    };
  };
  

