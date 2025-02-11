const express = require("express");
const { deposit, withdraw } = require("../controllers/transactionController"); // Check this import
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);

module.exports = router;
