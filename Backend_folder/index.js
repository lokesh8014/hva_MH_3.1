require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
const taskRoutes = require("./routes/taskRoute");
const User = require("./models/userModel");
const cors = require("cors"); 

// Checking environment variables
if (!process.env.SECRET_KEY || !process.env.MONGODB_URI) {
    console.error("ERROR: Missing required environment variables.");
    process.exit(1);
}

// Setting up Express
const app = express();
const corsOptions = {
    origin: "https://hva-mh-3-1.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  };

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));// Handle preflight requests explicitly
app.use(express.json()); 

// Connecting to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log(" MongoDB Connected"))
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });

// Creating Admin User
const createAdmin = async () => {
    try {
        const adminEmail = "admin@hyperverge.co";
        const existingAdmin = await User.findOne({ email: adminEmail });

        const hashedPassword = await bcrypt.hash("admin123", 10);

        if (!existingAdmin) {
            await User.create({
                name: "Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            });
            console.log("Admin user created successfully.");
        } else {
            await User.updateOne({ email: adminEmail }, { $set: { password: hashedPassword } });
            console.log("Admin password updated.");
        }
    } catch (error) {
        console.error("Error in createAdmin:", error);
    }
};

mongoose.connection.once("open", createAdmin);

console.log("SECRET_KEY:", process.env.SECRET_KEY);
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Route Configuration
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

// Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
