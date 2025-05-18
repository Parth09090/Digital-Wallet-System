const User = require("../models/User");
const Transaction = require("../models/Transaction");
const FraudLog = require("../models/FraudLog");

// 1. Get all flagged transactions (rule-based)

exports.getFlaggedTransactions = async (req, res) => {
  try {
    // 1. Find large withdrawals (≥ ₹50,000)
    const largeWithdrawals = await Transaction.find({
      type: "withdraw",
      amount: { $gte: 50000 }
    }).populate("fromUser", "username email"); 

    // 2. Find users who made more than 3 transfers in the last minute
    const recentTransfers = await Transaction.aggregate([
      {
        $match: {
          type: "transfer_out", 
          createdAt: { $gte: new Date(Date.now() - 60 * 1000) }
        }
      },
      {
        $group: {
          _id: "$fromUser",
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 3 }
        }
      },
      {
        $lookup: {
          from: "users",           
          localField: "_id",      
          foreignField: "_id",    
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          username: "$user.username",
          email: "$user.email",
          transferCount: "$count"
        }
      }
    ]);

    res.json({
      largeWithdrawals,
      rapidTransfers: recentTransfers
    });
  } catch (err) {
    console.error("Error in getFlaggedTransactions:", err);
    res.status(500).json({ error: "Error fetching flagged transactions" });
  }
};


// 2. Get total system balance from User.wallets
exports.getTotalBalance = async (req, res) => {
  try {
    const users = await User.find();

    let total = {
      INR: 0,
      USD: 0,
      BTC: 0
    };

    users.forEach(user => {
      total.INR += user.wallets.INR;
      total.USD += user.wallets.USD;
      total.BTC += user.wallets.BTC;
    });

    res.json({ totalBalance: total });
  } catch (err) {
    res.status(500).json({ error: "Error calculating total balance" });
  }
};

// 3. Top users by wallet balance (for each currency)
exports.getTopUsersByBalance = async (req, res) => {
  try {
    const users = await User.find().select('username email wallets');

    const topINR = [...users].sort((a, b) => b.wallets.INR - a.wallets.INR).slice(0, 5);
    const topUSD = [...users].sort((a, b) => b.wallets.USD - a.wallets.USD).slice(0, 5);
    const topBTC = [...users].sort((a, b) => b.wallets.BTC - a.wallets.BTC).slice(0, 5);

    res.json({ topINR, topUSD, topBTC });
  } catch (err) {
    res.status(500).json({ error: "Error fetching top users by balance" });
  }
};

// 4. Top users by total transaction volume
exports.getTopUsersByTxnVolume = async (req, res) => {
  try {
    const topUsers = await Transaction.aggregate([
      {
        $group: {
          _id: "$user",
          totalAmount: { $sum: "$amount" },
          txnCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 }
    ]);

    const enriched = await Promise.all(topUsers.map(async (user) => {
      const userInfo = await User.findById(user._id).select("username email");
      return { ...user, user: userInfo };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Error fetching top transaction users" });
  }
};

// 5. View all fraud logs (if FraudLog is implemented)
exports.getFraudLogs = async (req, res) => {
  try {
    const logs = await FraudLog.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching fraud logs' });
  }
};
