const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // ✅ Use promise-based MySQL connection
require("dotenv").config();

// 🚀 Register User
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    try {
        // 🔹 Check if email already exists
        const [existingUsers] = await db.execute("SELECT email FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: "Email already registered!" });
        }

        // 🔹 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Generate a unique 11-digit User ID
        let userId;
        let isUnique = false;
        while (!isUnique) {
            userId = "0" + Math.floor(10000000000 + Math.random() * 90000000000);
            const [existingIds] = await db.execute("SELECT id FROM users WHERE id = ?", [userId]);
            if (existingIds.length === 0) isUnique = true;
        }

        // 🔹 Insert new user
        await db.execute(
            "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
            [userId, username, email, hashedPassword]
        );

        return res.json({
            success: true,
            message: "User registered successfully",
            user: { id: userId, username, email },
        });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        return res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

// 🚀 Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔹 Fetch user by email
        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = users[0];

        // 🔹 Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // 🔹 Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // 🔹 Send response
        return res.json({
            token,
            balance: user.balance,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                balance: user.balance, // Add other fields if needed
            },
        });
    } catch (error) {
        console.error("❌ Login Error:", error);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
};
