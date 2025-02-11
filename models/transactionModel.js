const db = require("../config/db");

const Transaction = {
    deposit: (userId, amount, callback) => {
        db.query("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, userId], err => {
            if (err) return callback(err);
            db.query("INSERT INTO transactions (user_id, type, amount) VALUES (?, 'deposit', ?)", [userId, amount], callback);
        });
    },

    withdraw: (userId, amount, callback) => {
        db.query("SELECT balance FROM users WHERE id = ?", [userId], (err, results) => {
            if (err || results.length === 0) return callback(err || { message: "User not found" });

            if (results[0].balance < amount) return callback({ message: "Insufficient funds" });

            db.query("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, userId], err => {
                if (err) return callback(err);
                db.query("INSERT INTO transactions (user_id, type, amount) VALUES (?, 'withdrawal', ?)", [userId, amount], callback);
            });
        });
    },
};

module.exports = Transaction;
