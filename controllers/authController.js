exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    try {
        // Check if the email already exists
        const [results] = await db.query("SELECT email FROM users WHERE email = ?", [email]);

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: "Email already registered!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a Unique User ID (11-digit number)
        const userId = "0" + Math.floor(10000000000 + Math.random() * 90000000000);

        // Insert user into the database (Username can be duplicate)
        await db.query(
            "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
            [userId, username, email, hashedPassword]
        );

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
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

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
        res.json({ token, balance: user.balance, user: userData });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};
