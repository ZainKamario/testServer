const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const pool = require("./config/db"); // Import the pool (MySQL connection)
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();
const app = express();

// CORS Middleware
app.use(cors({
  origin: "*",  // In production, replace '*' with the frontend URL
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Body Parsing Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route for "/"
app.get("/", (req, res) => {
    res.send("Welcome to the MySQL Dummy Backend API 🚀");
});

// MySQL Database Connection Check
pool.getConnection()
  .then((connection) => {
    console.log("✅ MySQL Database connected successfully!");
    connection.release();  // Release the connection after successful test
  })
  .catch((error) => {
    console.error("❌ MySQL Database connection failed: ", error.message);
    process.exit(1); // Exit the server if database connection fails
  });

// API Routes
app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);

// Handle Preflight OPTIONS Requests (Critical for CORS)
app.options("*", cors());  // Ensure that preflight requests are handled properly

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at: http://localhost:${PORT}`));
