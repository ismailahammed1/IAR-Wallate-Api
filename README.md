# 💸 Digital Wallet API

A secure, modular, and role-based backend API for a **digital wallet system** (inspired by Bkash/Nagad), built with **Express.js**, **TypeScript**, and **MongoDB**.

This system allows **users**, **agents**, and **admins** to register, manage wallets, perform transactions (add/withdraw/send money), and includes robust authentication and authorization mechanisms.

---

## 📌 Features

- 🔐 **JWT Authentication** (Login/Registration)
- 🎭 **Role-Based Access Control** (`admin`, `agent`, `user`)
- 🏦 **Wallet Management** with balance and status tracking
- 💸 **Transactional Logic** (add, withdraw, send money)
- 📄 **Transaction History**
- 🧾 **Agent Operations**: cash-in, cash-out, commissions (optional)
- 🛑 **Admin Controls**: approve/suspend agents, block wallets
- 🧱 Clean modular architecture using MVC pattern
- 🧪 Tested via Postman

---

## ⚙️ Setup & Installation
    express-session, bcrypt, bcryptjs, cookie-parser, cors, dotenv,
    express, express-session, http-status-codes, jsonwebtoken, mongoose,
    passport, passport-google-oauth20, passport-local,
### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/digital-wallet-api.git
cd digital-wallet-api
