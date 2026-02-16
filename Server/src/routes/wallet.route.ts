import { Router } from "express";
import {
  generateNonce,
  verifyAndBindWallet
} from "../controllers/wallet.controller";

import verifyUser from "../middlewares/verifyUser.middleware";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware";

const router = Router();


// Generate a unique nonce for the logged-in student
 
router.get("/nonce", verifyUser, generateNonce);


// Verify wallet signature and bind wallet to student account
 
router.post("/verify", verifyUser, verifyAndBindWallet);


// Admin-only wallet action (e.g create polls)

router.post("/admin-action", verifyAdmin, (_req, res) => {
  res.status(200).json({ message: "Admin wallet action executed" });
});

export default router;
