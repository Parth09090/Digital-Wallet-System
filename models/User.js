const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallets: {
    INR: { type: Number, default: 0 },
    USD: { type: Number, default: 0 },
    BTC: { type: Number, default: 0 },
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
