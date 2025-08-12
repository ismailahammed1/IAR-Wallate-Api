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


```
  "auth": {
    "approve PATCH": {
      "note": "only admin approved user and admin, Without approval, users or agents cannot log in. Required: isVerified = true, approved = true, userStatus = true .",
      "link": "http://localhost:5000/api/v1/auth/approve/:id",
      "params id": {}
    },
    "suspend PATCH": {
      "note": "admin can suspend agent use bearer token",
      "link": "http://localhost:5000/api/v1/auth/suspend/:id",
      "params id": {}
    },
    "logout POST": {
      "note": " logout  part every one can logout this ",
      "link": "http://localhost:5000/api/v1/auth/logout"
    },
    "Login POST": {
      "note": "any one login this link but agent and user first account status approved then login ",
      "link": "http://localhost:5000/api/v1/auth/login",
      "params id": {}
    }
  },
```


```
  "userPart ": {
    "note": "only approved user can login his profile, first approved by admin then user can login",
    "createUser POST": {
      "link": "http://localhost:5000/api/v1/user/register",
      "body": {
        "name": "Ismail",
        "email": "Ismail@gmail.com",
        "password": "Ismail@123456",
        "role": "USER"
      }
    },
    "all user get ": {
      "link": "http://localhost:5000/api/v1/user/all-users",
      "note": "admin can get all user , bearer token "
    },
    "update user  PATCH": {
      "link": "http://localhost:5000/api/v1/user/:id",
      "note": "any one update his profile except role.only admin and super admin update role, email",
      "body": {
        "name": "Ismail"
      }
    },
    "get my self every one user ": {
      "link": "http://localhost:5000/api/v1/user/me",
      "note": "every one get his profile his section for user and admin",
      "body": {
        "name": "Ismail",
        "email": "Ismail@gmail.com",
        "password": "Ismail@123456",
        "role": "USER"
      }
    },
    "amdin get a single user ": {
      "link": "http://localhost:5000/api/v1/user/:id",
      "note": "only authorizetion admin can get a single user profile"
    }
  },
```
```
  "agentPart": {
    "note": "only approved agent can login his profile, first approved by admin then agent can login",
    "createAgent POST": {
      "link": "http://localhost:5000/api/v1/agent/agent-register",
      "body": {
        "name": "Ismail",
        "email": "Ismail@gmail.com",
        "password": "Ismail@123456",
        "role": "AGENT"
      }
    },
    "all agent get ": {
      "link": "http://localhost:5000/api/v1/agent/all-agents",
      "note": "admin can get all agent , bearer token "
    },
    "get my self every one agent ": {
      "link": "http://localhost:5000/api/v1/agent/me",
      "note": "every one get his profile his section for agent and admin"
    },
    "amdin get a single agent ": {
      "link": "http://localhost:5000/api/v1/agent/:id",
      "note": "only authorizetion admin can get a single agent profile"
    }
  },
```
```
"transaction": {
    "add money": {
      "note": "authenticet user can add money",
      "approve": {
        "link": "http://localhost:5000/api/v1/transactions/add-money",
        "body": {
          "amount": 1040
        }
      }
    },
    "send money": {
      "note": "authenticet user can withdraw send money account",
      "approve": {
        "link": "http://localhost:5000/api/v1/transactions/send-money",
        "body": {
    "receiverId":"6898cae33d4541b58e89f7a4", 
    "amount": 10 
}
      }
    },
    "user withdraw money to agent wallet": {
      "note": "authenticet user can withdraw agent account",
      "approve": {
        "link": "http://localhost:5000/api/v1/transactions/withdraw",
       "body": {
    "agentId":"6898c34cc49ca8cb63f05cfb",
    "amount":100
}
      }
    },
    "agent cash in user": {
      "note": "agent cash in user account , authenticet agent can cash in agent account ",
      "approve": {
        "link": "http://localhost:5000/api/v1/transactions/cash-in",
        "body":{
    "userId":"6896f1f2597a707a6c43d28a", 
    "amount":10 
}
      }
    },
    "agent cash out user": {
           "note": "agent cash out user account , authenticet agent can cash in agent account ",
      "approve": {
        "link": "http://localhost:5000/api/v1/transactions/cash-out",
        "body": {
    "userId":"6896f1f2597a707a6c43d28a",
     "amount":10 
}
      }
    },
    "admin get all agent transaction": {
           "note": "only admin can get all agent trasaction  ",
      "approve": {
        "link": "http://localhost:5000/api/v1/transactions/agent-transaction",
        "body": {
    "userId":"6896f1f2597a707a6c43d28a",
     "amount":10 
}
      }
    },
    "admin get all user transaction": {
           "note": "only admin can get all user trasaction  ",
      "approve": {
        "link": "http://localhost:5000/api/v1/transactions/user-transaction",
        "body": {
    "userId":"6896f1f2597a707a6c43d28a",
     "amount":10 
}
      }
    },
```

```
 "wallet part":"wallet block unblock",
    "waller block": {
           "note": "only admin can get all agetn trasaction  ",
      "approve": {
        "link": "http://localhost:5000/api/v1/wallets/block/:id"
    },
    "waller unblock": {
           "note": "only admin can get all agetn trasaction  ",
      "approve": {
        "link": "http://localhost:5000/api/v1/wallets/unblock/:id"
    },
    "personal wallet transaction": {
           "note": "only admin can get all agetn trasaction  ",
      "approve": {
        "link": "http://localhost:5000/api/v1/wallets/transactions/me"
    },
    "personal wallet": {
           "note": "only admin can get all agetn trasaction  ",
      "approve": {
        "link": "http://localhost:5000/api/v1/wallets/me"
    }
  }
}}}}

```

### 1. Clone the Repository


```bash
git clone https://github.com/ismailahammed1/IAR-Wallate-Api
cd digital-wallet-api
