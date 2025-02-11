const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "bep_app",
    waitForConnections: true,
    connectionLimit: 10,  // Adjust this based on your expected load
    queueLimit: 0,
});

module.exports = pool.promise();  // Use promise-based pool for cleaner async code
