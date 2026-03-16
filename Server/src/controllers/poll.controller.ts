import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { blockchainService } from "../services/blockchain.service";

const prisma = new PrismaClient();

// Fetch poll results
export const getPollResults = async (req: Request, res: Response) => {
  try {
    const pollId = Number(req.params.pollId);

    const options = await prisma.pollOption.findMany({ where: { pollId } });
    const results = [];

    for (const option of options) {
      const votes = await blockchainService.getVotes(pollId, option.index);
      results.push({ option: option.label, votes: Number(votes) });
    }

    return res.json(results);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch results" });
  }
};

export const getAllPolls = async (_req: Request, res: Response) => {
  try {
    const polls = await prisma.poll.findMany({
      include: { options: true, voteHistory: true }
    });
    return res.json(polls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch polls" });
  }
};

export const getActivePolls = async (req: Request, res: Response) => {
  const polls = await prisma.poll.findMany({
    where: { status: "ACTIVE" }
  });

  res.json(polls);
};

export const getPollById = async (req: Request, res: Response) => {
  const poll = await prisma.poll.findUnique({
    where: { id: Number(req.params.id) }
  });

  res.json(poll);
};