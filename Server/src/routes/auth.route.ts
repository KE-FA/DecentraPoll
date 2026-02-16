import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateUserPassword,
  logOutUser
} from "../controllers/auth.controller";

import verifyUser  from "../middlewares/verifyUser.middleware";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware";

const router = Router();

// Only admin can register new users
router.post("/register", verifyAdmin, registerUser);

// Login (any user)
router.post("/login", loginUser);

// Update password (Logged-in user)
router.patch("/password", verifyUser, updateUserPassword);

// Logout (Logged-in user)
router.post("/logout", verifyUser, logOutUser);

export default router;
