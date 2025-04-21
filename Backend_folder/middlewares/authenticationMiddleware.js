const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decoding the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Finding user and including the role explicitly
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    // Attaching user to request
    req.user = user;
    console.log("Authenticated User:", req.user);

    next();
  } catch (err) {
    console.error("Authentication Error:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};
