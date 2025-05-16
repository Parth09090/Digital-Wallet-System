const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Helper to validate currency
const SUPPORTED_CURRENCIES = ['INR', 'USD', 'BTC'];

function isValidCurrency(currency) {
  return SUPPORTED_CURRENCIES.includes(currency);
}

module.exports = {

  deposit: async (req, res) => {
    try {
       const userId = req.user.userId;  // access userId from req.user
       const { amount, currency } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid deposit amount' });
      }
      if (!isValidCurrency(currency)) {
        return res.status(400).json({ message: 'Unsupported currency' });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Update wallet balance
      user.wallets[currency] += amount;

      // Create transaction record
      const transaction = await Transaction.create({
        user: user._id,
        type: 'deposit',
        amount,
        currency,
        date: new Date(),
      });

      // Add transaction reference to user
      user.transactions.push(transaction._id);
      await user.save();

      res.json({ message: 'Deposit successful', balance: user.wallets[currency] });
    } catch (err) {
      console.error('Deposit error:', err);
      res.status(500).json({ message: 'Server error during deposit' });
    }
  },

  withdraw: async (req, res) => {
    try {
      const userId = req.user.userId;  // access userId from req.user;
      const { amount, currency } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount' });
      }
      if (!isValidCurrency(currency)) {
        return res.status(400).json({ message: 'Unsupported currency' });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (user.wallets[currency] < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      user.wallets[currency] -= amount;

      const transaction = await Transaction.create({
        user: user._id,
        type: 'withdraw',
        amount,
        currency,
        date: new Date(),
      });

      user.transactions.push(transaction._id);
      await user.save();

      res.json({ message: 'Withdrawal successful', balance: user.wallets[currency] });
    } catch (err) {
      console.error('Withdraw error:', err);
      res.status(500).json({ message: 'Server error during withdrawal' });
    }
  },

  transfer: async (req, res) => {
    try {
      const userId = req.user.userId;  // access userId from req.user;
      const { amount, currency, toUsername } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid transfer amount' });
      }
      if (!isValidCurrency(currency)) {
        return res.status(400).json({ message: 'Unsupported currency' });
      }
      if (!toUsername) {
        return res.status(400).json({ message: 'Recipient username required' });
      }

      const fromUser = await User.findById(userId);
      if (!fromUser) return res.status(404).json({ message: 'Sender not found' });

      const toUser = await User.findOne({ username: toUsername });
      if (!toUser) return res.status(404).json({ message: 'Recipient not found' });

      if (fromUser.wallets[currency] < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Deduct from sender
      fromUser.wallets[currency] -= amount;
      // Add to recipient
      toUser.wallets[currency] += amount;

      // Create transaction for sender
      const transactionFrom = await Transaction.create({
        user: fromUser._id,
        type: 'transfer_out',
        amount,
        currency,
        date: new Date(),
        details: { to: toUser.username },
      });

      // Create transaction for recipient
      const transactionTo = await Transaction.create({
        user: toUser._id,
        type: 'transfer_in',
        amount,
        currency,
        date: new Date(),
        details: { from: fromUser.username },
      });

      fromUser.transactions.push(transactionFrom._id);
      toUser.transactions.push(transactionTo._id);

      await fromUser.save();
      await toUser.save();

      res.json({ message: 'Transfer successful', balance: fromUser.wallets[currency] });
    } catch (err) {
      console.error('Transfer error:', err);
      res.status(500).json({ message: 'Server error during transfer' });
    }
  },

  getTransactionHistory: async (req, res) => {
    try {
      const userId = req.user.userId;  // access userId from req.user;

      const user = await User.findById(userId).populate('transactions');
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ transactions: user.transactions });
    } catch (err) {
      console.error('Get transaction history error:', err);
      res.status(500).json({ message: 'Server error fetching transactions' });
    }
  },

};
