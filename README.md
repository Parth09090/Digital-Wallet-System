# Digital Wallet System with Fraud Detection

A secure digital wallet application built with Node.js, Express, MongoDB, and Mongoose, featuring robust transaction management and real-time fraud detection for transfers and withdrawals.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Technology Stack](#technology-stack)  
- [Setup and Installation](#setup-and-installation)  
- [Usage](#usage)  
- [Fraud Detection](#fraud-detection)  
- [API Endpoints](#api-endpoints)  

---

## Project Overview

This project implements a multi-currency digital wallet system supporting INR, USD, and BTC with basic wallet operations like deposits, withdrawals, and transfers between users. The system also includes a real-time fraud detection module to monitor suspicious activity, such as excessive transfer frequency and unusually large withdrawals.

---

## Features

- User registration and authentication with secure password hashing  
- Wallet management supporting multiple currencies (INR, USD, BTC)  
- Deposit, withdrawal, and transfer functionalities  
- Transaction logging with detailed metadata  
- Fraud detection rules:  
  - Block users who attempt more than 3 transfers within one minute  
  - Flag withdrawals exceeding ₹50,000  
- Admin route to retrieve flagged transactions  
- User blocking and unblocking functionality based on fraud detection  
- Error handling and input validations  

---

## Technology Stack

| Layer          | Technology             |
| -------------- | ---------------------- |
| Backend        | Node.js, Express       |
| Database       | MongoDB, Mongoose ORM  |
| Authentication | JWT, bcrypt            |
| Logging        | Console, custom logs   |
| Environment    | Nodemon, dotenv        |

---

## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/digital-wallet-system.git
   cd digital-wallet-system
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

Create a .env file at the root with the following:

   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4.**Run the server:**

   ```bash
   npm run dev
   ```

## Usage

- Register a new user 
- Log in to receive a JWT token
- Use the token to authenticate API requests (e.g., transfers, withdrawals) 
- Transfers and withdrawals are monitored for fraud
- Suspicious activities trigger user blocking or alerts 
- User registration and authentication with secure password hashing  

## Fraud Detection

The system monitors two primary fraud rules:

Rapid Transfers:
A user making more than 3 transfers (transfer_out) within 1 minute will be flagged and blocked. This helps prevent automated or suspicious transfer spamming.

Large Withdrawals:
Any withdrawal exceeding ₹50,000 is flagged as suspicious.

When fraud is detected, the user account is blocked to prevent further transactions. Admins can review flagged transactions via the /admin/flagged-transactions API endpoint and unblock users if necessary.

## API Endpoints 

### Health Check

| Method | Endpoint        | Description                 | Body Parameters |
|--------|-----------------|-----------------------------|-----------------|
| GET    | `/api/auth/health` | Check if the server is running | None            |

---

### Authentication

| Method | Endpoint        | Description                  | Body Parameters                                  |
|--------|-----------------|------------------------------|-------------------------------------------------|
| POST   | `/api/auth/register` | Register a new user          | `username` (string), `email` (string), `password` (string) |
| POST   | `/api/auth/login`    | Login user and get JWT token | `email` (string), `password` (string)           |

---

### Wallet Operations

All wallet routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint          | Description                         | Body Parameters                                   |
|--------|-------------------|-----------------------------------|--------------------------------------------------|
| POST   | `/wallet/deposit`  | Deposit virtual cash to wallet     | `amount` (number), `currency` (string: INR/USD/BTC) |
| POST   | `/wallet/withdraw` | Withdraw virtual cash from wallet  | `amount` (number), `currency` (string: INR/USD/BTC) |
| POST   | `/wallet/transfer` | Transfer virtual cash to another user | `amount` (number), `currency` (string), `toUsername` (string) |
| GET    | `/wallet/transactions` | Get transaction history for logged-in user | None                                         |

---

### Admin Operations

All admin routes require an `Authorization: Bearer <admin_token>` header.

| Method | Endpoint                          | Description                        | URL Parameters |
|--------|----------------------------------|----------------------------------|----------------|
| GET    | `/api/admin/flagged-transactions`| Get list of transactions flagged for fraud | None |
| GET    | `/api/admin/total-balance`        | Get total balance of all users    | None           |
| GET    | `/api/admin/top-users/balance`    | Get top users by wallet balance   | None           |
| GET    | `/api/admin/top-users/transactions`| Get top users by transaction volume | None          |


 
