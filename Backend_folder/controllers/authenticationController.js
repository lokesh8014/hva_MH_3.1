const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Creating new user
exports.createUser = async (req, res) => {
    try {
        console.log("Received Data:", req.body); 

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({name,email,password});

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("User Creation Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



//getting users data
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find(); 
        res.json(users);  
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};


exports.loginUser = async (req, res) => {
    try {
        console.log("Login attempt:", req.body);

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "User not found" });
        }

        console.log("User found:", user);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("Generating token...");
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        console.log("Generated Token:", token);
        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

