const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['INR', 'USD', 'BTC'],
    default: 'INR'
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
