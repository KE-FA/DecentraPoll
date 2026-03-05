import { Router } from "express";
import {
  getAllPolls,
  getActivePolls,
  getPollById
} from "../controllers/poll.controller";

import {
  createPoll,
  approvePoll,
  rejectPoll
} from "../controllers/admin.controller";

import {verifyAdmin} from "../middlewares/verifyAdmin.middleware";

const router = Router();

// Public
router.get("/", getAllPolls);
router.get("/active", getActivePolls);
router.get("/:id", getPollById);

// Admin
router.post("/admin/create", verifyAdmin, createPoll);
router.post("/admin/:id/approve", verifyAdmin, approvePoll);
router.post("/admin/:id/reject", verifyAdmin, rejectPoll);

export default router;