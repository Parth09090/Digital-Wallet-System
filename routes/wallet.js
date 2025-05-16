const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware'); // your auth middleware to protect routes

// Protect all wallet routes - user must be authenticated
router.use(authMiddleware);

// Deposit virtual cash
router.post('/deposit', walletController.deposit);

// Withdraw virtual cash
router.post('/withdraw', walletController.withdraw);

// Transfer virtual cash to another user
router.post('/transfer', walletController.transfer);

// Get transaction history
router.get('/transactions', walletController.getTransactionHistory);

module.exports = router;
