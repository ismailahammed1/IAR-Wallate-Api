# 💸 Digital Wallet API

A secure, modular, and role-based backend API for a **digital wallet system** (inspired by Bkash/Nagad), built with **Express.js**, **TypeScript**, and **MongoDB**.

This system allows **users**, **agents**, and **admins** to register, manage wallets, perform transactions (add/withdraw/send money), and includes robust authentication and authorization mechanisms.

---

## 📌 Features


- 🎭 **Role-Based Access Control** (`admin`, `agent`, `user`)
- 🏦 **Wallet Management** with balance and status tracking
- 💸 **Transactional Logic** (add, withdraw, send money)
- 📄 **Transaction History**
- 🧾 **Agent Operations**: cash-in, cash-out, commissions (optional)
- 🛑 **Admin Controls**: approve/suspend agents, block wallets
- 🧱 Clean modular architecture using MVC pattern
- 🧪 Tested via Postman
- 🔐 **JWT Authentication** (Login/Registration) with Role-based Access Control (Admin / User / Agent)

- 🏦 **Wallet Management** with balance and status tracking

*Add Money (User → Wallet)*

*Withdraw Money*

*Send Money (User → User)*

*Cash In / Cash Out (Agent)*

*Commission Tracking for Agents*

**Admin Controls:**

*Block / Unblock Wallet*

*Approve / Suspend Agents*

*View All Transactions (User & Agent)*

**Transaction Logging:**

*Stores sender/receiver, amount, type, date, commission*

**Profile Management:**

*Users/Agents can update only their name, phone, address, profile image, DOB, national ID*

*Only Admin can update role and email*

**Validation & Error Handling:**

*Centralized error handler with HTTP status codes*

*Input validation with Zod*

*Database:*

*MongoDB with separate collections for User, Agent, Wallet, Transaction*

*Unit Tests:*

*Coverage for all wallet operations, role restrictions, and transactions*


---

## ⚙️ Setup & Installation
    express-session, bcrypt, bcryptjs, cookie-parser, cors, dotenv,
    express, express-session, http-status-codes, jsonwebtoken, mongoose,
    passport, passport-google-oauth20, passport-local,
### 1. Clone the Repository

```bash
git clone https://github.com/ismailahammed1/IAR-Wallate-Api
cd digital-wallet-api
