# Decentralized Student Opinion Collection System 

## 📌 Overview

This project is a **hybrid decentralized student opinion (polling) system** that combines a **centralized backend** with a **blockchain network** to ensure transparency, security and immutability of votes.

The system ensures:

* Tamper-proof voting (blockchain)
* Secure authentication (backend)
* Efficient data handling 

---

## 🏗 System Architecture

* **Frontend (React + MUI)** → User interaction
* **Backend (Node.js + Express)** → Authentication, control logic, blockchain interaction
* **Database (PostgreSQL)** → Stores users, roles, metadata
* **Blockchain (Ethereum)** → Stores votes immutably

---

## 🚀 Features

### 👨‍🎓 Student

* Login
* Connect wallet
* Browse polls
* Cast vote (blockchain)
* View results
* View vote history

### 👨‍💼 Admin

* Create polls
* Manage users & roles
* View analytics

---

## 🔐 Security Features

* JWT Authentication
* Role-Based Access Control (RBAC)
* Wallet signature verification (nonce-based)
* Immutable blockchain voting
* Secure backend-controlled transactions

---

## ⚙️ Technologies Used

### 🖥 Frontend

* React.js
* Material UI (MUI)
* Web3.js / Ethers.js

### 🧠 Backend

* Node.js
* Express.js
* Prisma ORM
* JSON Web Tokens (JWT)

### 🗄 Database

* PostgreSQL 

### ⛓ Blockchain

* Ethereum (ZkSync Sepolia Testnet)
* Solidity Smart Contracts
* Foundry (for testing & deployment)

### 🔗 Blockchain Infrastructure

* Alchemy (node provider)

---

## 🔄 System Workflow

### 1. Authentication

1. User logs in
2. Backend generates nonce
3. User signs nonce with wallet
4. Backend verifies signature
5. Wallet linked to account

---

### 2. Voting Process

1. Student selects poll
2. Backend checks eligibility
3. Backend submits transaction
4. Smart contract records vote
5. Transaction hash stored in the Database

---

### 3. Result Retrieval

* Results fetched from blockchain
* Displayed in frontend dashboard

---


## 🛠 Installation & Setup Guide

### 📥 1. Clone the Repository

```
git clone https://github.com/KE-FA/DecentraPoll.git
cd DecentraPoll
```

---

### 📦 2. Install Dependencies

#### Backend

```
cd Server
npm install
```

#### Frontend

```
cd Client
npm install
```

### 🗄 3. Setup Database

```
npx prisma migrate dev
npx prisma generate
```

---


### ▶️ 4. Run the Application

#### Start Backend

```
cd backend
npm run start:dev
```

#### Start Frontend

```
cd frontend
npm run dev
```

---


## 📊 Smart Contract Functions

* `createPoll()` → Create a poll
* `vote()` → Submit vote
* `getVotes()` → Retrieve results

---

## 📈 Future Improvements

* Mobile app integration
* Multi-chain support




