import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { blockchainService } from "../services/blockchain.service";

const prisma = new PrismaClient();

// Fetch poll results
export const getPollResults = async (req: Request, res: Response) => {
  try {
    const pollId = Number(req.params.id);

    // Fetch poll with options
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });

    if (!poll) return res.status(404).json({ error: "Poll not found" });
    if (!poll.contractPollId)
      return res.status(400).json({ error: "Poll not synced with blockchain yet" });

    // Fetch votes directly from blockchain
    const results = await Promise.all(
      poll.options.map(async (option) => {
        const votes = await blockchainService.getVotes(poll.contractPollId!, option.index);
        return { option: option.label, voteCount: Number(votes) };
      })
    );

    res.json({
      pollId: poll.id,
      title: poll.title,
      description: poll.description,
      status: poll.status,
      deadline: poll.deadline,
      results,
    });
  } catch (err) {
    console.error("Failed to fetch poll results:", err);
    res.status(500).json({ error: "Failed to fetch poll results" });
  }
};

// Fetch All poll results
export const getAllPollResults = async (req: Request, res: Response) => {
  try {
    // Get all polls with options
    const polls = await prisma.poll.findMany({
      include: { options: true },
      orderBy: { createdAt: "desc" },
    });

    const allResults = await Promise.all(
      polls.map(async (poll) => {
        // Skip polls not on blockchain
        if (!poll.contractPollId) {
          return null;
        }

        try {
          const results = await Promise.all(
            poll.options.map(async (option) => {
              const votes = await blockchainService.getVotes(
                poll.contractPollId!,
                option.index
              );

              return {
                optionId: option.id,
                optionLabel: option.label,
                optionIndex: option.index,
                voteCount: Number(votes),
              };
            })
          );

          const totalVotes = results.reduce(
            (sum, r) => sum + r.voteCount,
            0
          );

          return {
            pollId: poll.id,
            title: poll.title,
            description: poll.description,
            status: poll.status,
            deadline: poll.deadline,
            results,
            totalVotes,
          };
        } catch (err) {
          console.error(`Failed for poll ${poll.id}`, err);
          return null;
        }
      })
    );

    // Remove failed/null polls
    const filteredResults = allResults.filter(Boolean);

    res.json(filteredResults);
  } catch (err) {
    console.error("Failed to fetch all poll results:", err);
    res.status(500).json({ error: "Failed to fetch all poll results" });
  }
};

// Get All polls
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

// export const getActivePolls = async (req: Request, res: Response) => {
//   const polls = await prisma.poll.findMany({
//     where: { status: "ACTIVE" }
//   });

//   res.json(polls);
// };

// export const getPollById = async (req: Request, res: Response) => {
//   try {
//     const pollId = Number(req.params.id);
//     if (isNaN(pollId)) {
//       return res.status(400).json({ error: "Invalid poll ID" });
//     }

//     const poll = await prisma.poll.findUnique({
//       where: { id: pollId },
//       include: { options: true, voteHistory: true }
//     });

//     if (!poll) return res.status(404).json({ error: "Poll not found" });

//     res.json(poll);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch poll" });
//   }
// };