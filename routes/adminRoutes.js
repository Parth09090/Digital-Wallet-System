const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

router.use(authMiddleware, isAdmin);

router.get("/flagged-transactions", adminController.getFlaggedTransactions);
router.get("/total-balance", adminController.getTotalBalance);
router.get("/top-users/balance", adminController.getTopUsersByBalance);
router.get("/top-users/transactions", adminController.getTopUsersByTxnVolume);

module.exports = router;
