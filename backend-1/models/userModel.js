const db = require("../config/db");

const User = {
    findByEmail: (email, callback) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], callback);
    },
    createUser: (username, email, hashedPassword, callback) => {
        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], callback);
    },
};

module.exports = User;
