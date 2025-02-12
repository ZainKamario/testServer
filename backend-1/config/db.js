const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "bep_app",
    waitForConnections: true,
    connectionLimit: 10,  // Allow multiple connections
    queueLimit: 0
});

// ✅ Correct Way to Check Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err);
        return;
    }
    console.log("✅ MySQL Connected");
    connection.release(); // ✅ Release connection after checking
});

module.exports = db.promise();
