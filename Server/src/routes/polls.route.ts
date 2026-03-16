import { Router } from "express";
import {
  getAllPolls,
  getActivePolls,
  getPollById,
  getPollResults
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
router.get("/results", getPollResults);


// Admin
router.post("/create", verifyAdmin, createPoll);
router.post("/:id/approve", verifyAdmin, approvePoll);
router.post("/:id/reject", verifyAdmin, rejectPoll);

export default router;