const Transaction = require("../models/transactionModel");

exports.deposit = (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    Transaction.deposit(userId, amount, err => {
        if (err) return res.status(500).json({ message: "Error processing deposit" });
        res.json({ message: "Deposit successful" });
    });
};

exports.withdraw = (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    Transaction.withdraw(userId, amount, err => {
        if (err) return res.status(400).json({ message: err.message || "Error processing withdrawal" });
        res.json({ message: "Withdrawal successful" });
    });
};
