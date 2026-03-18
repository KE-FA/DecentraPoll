import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import { contract } from "../services/blockchain.service";

const client = new PrismaClient();


// Record a vote submitted by the user
export const recordVote = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { pollId, optionIndex, txHash } = req.body;

    // Fetch poll with options
    const poll = await client.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });

    if (!poll) return res.status(404).json({ error: "Poll not found" });

    if (poll.status !== "ACTIVE")
      return res.status(400).json({ error: "Poll not active" });

    // Validate optionIndex
    if (
      optionIndex === undefined ||
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      return res.status(400).json({ error: "Invalid option selected" });
    }

    // Check if user already voted
    const existing = await client.voteHistory.findUnique({
      where: { userId_pollId: { userId, pollId } },
    });
    if (existing) return res.status(400).json({ error: "User already voted" });

    // Send vote to blockchain
    // const tx = await contract.vote(poll.contractPollId!, optionIndex);
    // const receipt = await tx.wait();
    // Find correct option in DB
    const selectedOption = poll.options.find(opt => opt.index === optionIndex);
    if (!selectedOption) {
      return res.status(400).json({ error: "Option not found in DB" });
    }

    // Store vote history in DB
    const vote = await client.voteHistory.create({
      data: {
        userId,
        pollId,
        optionId: selectedOption.id,
        txHash,
      },
    });

    res.status(201).json({ message: "Vote recorded", vote });
  } catch (err) {
    console.error("Failed to record vote:", err);
    res.status(500).json({ error: "Failed to record vote" });
  }
};

// Fetch user's vote history
export const getUserVoteHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const votes = await client.voteHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        poll: { select: { id: true, title: true, description: true, status: true, deadline: true } },
        option: { select: { id: true, label: true, index: true } }
      }
    });

    const history = votes.map(v => ({
      pollId: v.poll.id,
      pollTitle: v.poll.title,
      pollDescription: v.poll.description,
      pollStatus: v.poll.status,
      pollDeadline: v.poll.deadline,
      optionId: v.option.id,
      optionLabel: v.option.label,
      optionIndex: v.option.index,
      votedAt: v.createdAt,
      txHash: v.txHash
    }));

    return res.json(history);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch vote history" });
  }
};