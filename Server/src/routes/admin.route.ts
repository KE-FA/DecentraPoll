import { Router } from "express";
import {
  getAllUsers,
  addUser,
  deleteUser,
  updateUserInfo,
  getUserInfo
} from "../controllers/admin.controller";

import { verifyAdmin } from "../middlewares/verifyAdmin.middleware";

const router = Router();

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
