import { Router } from "express";
import {
  getAllUsers,
  addUser,
  deleteUser,
  updateUserInfo,
  getUserInfo
} from "../controllers/admin.controller";
// import { createPoll, approvePoll, rejectPoll } from "../controllers/admin.controller";

import { verifyAdmin } from "../middlewares/verifyAdmin.middleware";

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

// Delete user 
router.delete("/user/:id", verifyAdmin, deleteUser);

export default router;
