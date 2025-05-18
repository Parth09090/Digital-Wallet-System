const Transaction = require('../models/Transaction');
const FRAUD_LOG_PREFIX = "[FRAUD DETECTION]";

// Thresholds
const MAX_TRANSFERS_PER_MINUTE = 3;
const WITHDRAWAL_LIMIT = 50000;

const checkFraud = async ({ userId, type, amount }) => {
  if (type === 'transfer_out') {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentTransfers = await Transaction.find({
      fromUser: userId,
      type: 'transfer_out',
      createdAt: { $gte: oneMinuteAgo },
    });

    if (recentTransfers.length + 1 > MAX_TRANSFERS_PER_MINUTE) {
      console.warn(`${FRAUD_LOG_PREFIX} User ${userId} made ${recentTransfers.length + 1} transfers within 1 minute`);
      return true;
    }
  }

  if (type === 'withdraw' && amount >= WITHDRAWAL_LIMIT) {
    console.warn(`${FRAUD_LOG_PREFIX} User ${userId} attempted to withdraw ₹${amount} (suspiciously high)`);
    return true;
  }

  return false;
};

module.exports = { checkFraud };
