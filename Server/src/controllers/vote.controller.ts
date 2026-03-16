import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { blockchainService } from "../services/blockchain.service";

const client = new PrismaClient();


// Record a vote submitted by the user
export const recordVote = async (req: Request, res: Response) => {
  try {
    const { txHash, pollId, optionIndex, walletAddress } = req.body;

    // Verify the transaction actually succeeded on-chain
    const verified = await blockchainService.verifyTransaction(txHash);
    if (!verified) return res.status(400).json({ error: "Invalid or failed transaction" });

    // Check if vote already recorded
    const existing = await client.voteHistory.findUnique({ where: { txHash } });
    if (existing) return res.json({ message: "Vote already recorded" });

    // Find the user
    const user = await client.user.findUnique({ where: { walletAddress } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Find the poll option
    const option = await client.pollOption.findFirst({ where: { pollId, index: optionIndex } });
    if (!option) return res.status(404).json({ error: "Option not found" });

    // Store vote in DB
    await client.voteHistory.create({
      data: {
        userId: user.id,
        pollId,
        optionId: option.id,
        txHash
      }
    });

    return res.json({ message: "Vote recorded successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Fetch user's vote history
export const getUserVoteHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // middleware sets req.user

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