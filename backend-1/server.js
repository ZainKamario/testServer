const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();
const app = express();


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route for "/"
app.get("/", (req, res) => {
    res.send("Welcome to the MySQL Dummy Backend API 🚀");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at: http://localhost:${PORT}`));
