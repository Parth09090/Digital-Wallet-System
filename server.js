const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/wallet');
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/wallet', walletRoutes);
app.use("/api/admin", adminRoutes);

// DB Connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch(err => console.error('MongoDB connection failed:', err));
 
