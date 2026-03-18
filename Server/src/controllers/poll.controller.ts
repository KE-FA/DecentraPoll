import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { blockchainService } from "../services/blockchain.service";
import pLimit from "p-limit";


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

// In-memory cache with auto-clean
type CacheEntry = { data: any; expiresAt: number };
const cache: Record<string, CacheEntry> = {};
const CACHE_TTL = 10_000; // 10 seconds

// Clean expired cache entries
function cleanCache() {
  const now = Date.now();
  for (const key in cache) {
    if (cache[key].expiresAt <= now) {
      delete cache[key];
    }
  }
}

// Fetch all poll results with concurrency limits and auto-clean cache
export const getAllPollResults = async (req: Request, res: Response) => {
  try {
    // Clean expired cache entries
    cleanCache();

    // Fetch all polls with options
    const polls = await prisma.poll.findMany({
      include: { options: true },
      orderBy: { createdAt: "desc" },
    });

    // Concurrency limits
    const pollLimit = pLimit(3); // Max 3 polls at a time
    const optionLimit = pLimit(5); // Max 5 option calls at a time per poll

    const allResults = await Promise.all(
      polls.map((poll) =>
        pollLimit(async () => {
          if (!poll.contractPollId) return null;

          const cacheKey = `poll-${poll.contractPollId}`;
          const now = Date.now();

          // Return cached results if valid
          if (cache[cacheKey] && cache[cacheKey].expiresAt > now) {
            return cache[cacheKey].data;
          }

          try {
            // Fetch votes for options with concurrency limit
            const results = await Promise.all(
              poll.options.map((option) =>
                optionLimit(async () => {
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
              )
            );

            const totalVotes = results.reduce((sum, r) => sum + r.voteCount, 0);

            const pollResult = {
              pollId: poll.id,
              title: poll.title,
              description: poll.description,
              status: poll.status,
              deadline: poll.deadline,
              results,
              totalVotes,
            };

            // Cache the poll result
            cache[cacheKey] = { data: pollResult, expiresAt: now + CACHE_TTL };

            return pollResult;
          } catch (err) {
            console.error(`Failed for poll ${poll.id}`, err);
            return null;
          }
        })
      )
    );

    // Filter out null/failed polls
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