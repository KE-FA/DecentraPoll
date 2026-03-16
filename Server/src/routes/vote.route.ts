import express from "express";
import verifyUser from "../middlewares/verifyUser.middleware";
import { recordVote, getUserVoteHistory } from "../controllers/vote.controller";

const router = express.Router();

router.post("/record", verifyUser, recordVote);
router.get("/history", verifyUser, getUserVoteHistory);

export default router;