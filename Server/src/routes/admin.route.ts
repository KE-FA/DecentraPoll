import { Router } from "express";
import {
  getAllUsers,
  addUser,
  resetUserWallet,
  updateUserInfo,
  getUserInfo
} from "../controllers/admin.controller";
// import { createPoll, approvePoll, rejectPoll } from "../controllers/admin.controller";

import { verifyAdmin } from "../middlewares/verifyAdmin.middleware";
import { verify } from "crypto";

const router = Router();

// // Create Poll
// router.post("/create", verifyAdmin, createPoll);

// // Approve Poll
// router.post("/approve/:id", verifyAdmin, approvePoll);

// // Reject Poll
// router.post("/reject/:id", verifyAdmin, rejectPoll);

// Get all users 
router.get("/users", verifyAdmin, getAllUsers);

// Get one user by ID 
router.get("/user/:id", verifyAdmin, getUserInfo);

// Create a new user 
router.post("/user", verifyAdmin, addUser);

// Update user info 
router.put("/user/:id", verifyAdmin, updateUserInfo);

// Reset (unlink) user wallet
router.patch("/users/:id/reset-wallet",verifyAdmin, resetUserWallet);

export default router;
