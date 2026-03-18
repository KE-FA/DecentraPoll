import { Router } from "express";
import {
  getAllPolls,
  getPollResults,
  getAllPollResults
} from "../controllers/poll.controller";

import {
  createPoll,
  approvePoll,
  rejectPoll,
  deletePoll,
  getActivePolls,
  // getPollDetails,
} from "../controllers/admin.controller";

import {verifyAdmin} from "../middlewares/verifyAdmin.middleware";

const router = Router();

// Public
router.get("/", getAllPolls);
router.get("/active", getActivePolls);
// router.get("/:id", getPollDetails);
router.get("/results", getAllPollResults);
router.get("/:id/results", getPollResults);



// Admin
router.post("/create", verifyAdmin, createPoll);
router.delete("/:id", verifyAdmin, deletePoll);
router.post("/:id/approve", verifyAdmin, approvePoll);
router.post("/:id/reject", verifyAdmin, rejectPoll);

export default router;