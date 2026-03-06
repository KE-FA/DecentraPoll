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
router.post("/create", verifyAdmin, createPoll);
router.post("/:id/approve", verifyAdmin, approvePoll);
router.post("/:id/reject", verifyAdmin, rejectPoll);

export default router;