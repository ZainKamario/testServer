const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();
const app = express();

// CORS Middleware - Allow all origins during development
app.use(cors({
  origin: "*",  // Use your front-end URL in production (e.g., http://localhost:5173)
  methods: ["GET", "POST", "OPTIONS"],  // Allow specific methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allow specific headers
  credentials: true  // Enable credentials (cookies, HTTP authentication)
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route for "/"
app.get("/", (req, res) => {
    res.send("Welcome to the MySQL Dummy Backend API 🚀");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);

// Handle Preflight OPTIONS Requests (Critical for CORS)
app.options("*", cors());  // This will allow OPTIONS requests

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at: http://localhost:${PORT}`));
