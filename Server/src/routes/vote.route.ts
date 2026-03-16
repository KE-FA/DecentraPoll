import express from "express";
import { recordVote, getUserVoteHistory } from "../controllers/vote.controller";

const router = express.Router();

router.post("/record", recordVote);
router.get("/history", getUserVoteHistory);

export default router;