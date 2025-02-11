const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // ✅ FIX: Import MySQL connection
const User = require("../models/userModel");
require("dotenv").config();

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    try {
        // Check if the email already exists
        db.query("SELECT email FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ success: false, message: "Database error, please try again later" });
            }

            if (results.length > 0) {
                return res.status(400).json({ success: false, message: "Email already registered!" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate a Unique User ID (11-digit number)
            const userId = "0" + Math.floor(10000000000 + Math.random() * 90000000000);

            // Insert user into the database (Username can be duplicate)
            db.query(
                "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
                [userId, username, email, hashedPassword],
                (insertErr, result) => {
                    if (insertErr) {
                        console.error("❌ Registration Insert Error:", insertErr);
                        return res.status(500).json({ success: false, message: "Registration failed, please try again." });
                    }

                    // Return user details including generated ID
                    res.json({
                        success: true,
                        message: "User registered successfully",
                        user: {
                            id: userId,
                            username,
                            email,
                        },
                    });
                }
            );
        });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};
exports.login = (req, res) => {
    const { email, password } = req.body;
    
    User.findByEmail(email, async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            balance: user.balance, // Add other required fields
        };
        res.json({ token, balance: user.balance, user:userData });
    });
};
