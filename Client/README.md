# Decentralized Student Opinion Collection System

## 📌 Overview

This project is a **hybrid decentralized student opinion (polling) system** that combines a **centralized backend** with a **blockchain network** to ensure transparency, security and immutability of votes.

The system allows students to securely submit opinions while ensuring:

* No vote tampering
* Transparent result verification
* Controlled administrative governance

---

## 🏗 System Architecture

The system follows a **hybrid model**:

* **Frontend** → User interaction (students & admin)
* **Backend** → Authentication, control logic, blockchain interaction
* **Database** → Stores user data and poll metadata
* **Blockchain** → Stores votes immutably

---

## 🚀 Features

### 👨‍🎓 Student

* Register / Login
* Connect wallet
* Browse available polls
* Cast vote securely
* View results
* View vote history

### 👨‍💼 Admin

* Create polls
* Manage users & roles
* View analytics
* Monitor system activity

---

## 🔐 Security Features

* JWT-based authentication
* Wallet signature verification (nonce-based)
* Role-Based Access Control (RBAC)
* Immutable vote storage on blockchain
* Secure backend-controlled transactions

---

## ⚙️ Technologies Used

### 🖥 Frontend

* React.js
* Material UI (MUI)
* Ethers.js (Wallet integration)

### 🧠 Backend

* Node.js
* Express.js
* JSON Web Tokens (JWT)
* Prisma ORM

### 🗄 Database

* PostgreSQL

### ⛓ Blockchain

* Ethereum (Testnet/Mainnet)
* Smart Contracts (Solidity & Foundry)

### 🔗 Blockchain Infrastructure

* Alchemy (Blockchain API & node provider)

### 🛠 Development Tools

* MetaMask (Wallet integration)
* Postman (API testing)
* Git & GitHub (Version control)

---

## 🔄 System Workflow

### 1. Authentication

1. User logs in
2. Backend generates a nonce
3. User signs nonce using wallet
4. Backend verifies signature
5. Wallet linked to user account

---

### 2. Voting Process

1. Student selects a poll
2. Backend checks eligibility
3. Backend submits transaction to blockchain
4. Smart contract records vote
5. Transaction hash stored in database

---

### 3. Result Retrieval

* Results fetched from blockchain
* Displayed via frontend dashboard

---

## 📊 Smart Contract Functions

* `createPoll()` → Create new poll
* `vote()` → Submit vote
* `getVotes()` → Fetch poll results

---


## 📈 Future Improvements

* Multi-chain support
* Mobile application


