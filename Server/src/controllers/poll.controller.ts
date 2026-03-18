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


// Cache Setup

type CacheEntry = { data: any; expiresAt: number };

const cache: Record<string, CacheEntry> = {};
const inFlight: Partial<Record<string, Promise<any>>> = {}; //De duplication

// TTLs
const ACTIVE_TTL = 10_000;   // 10s
const INACTIVE_TTL = 60_000; // 60s

// Clean cache periodically (Not per request)
function cleanCache() {
  const now = Date.now();
  for (const key in cache) {
    if (cache[key].expiresAt <= now) {
      delete cache[key];
    }
  }
}

// Run every 30 seconds
setInterval(cleanCache, 30_000);

// Get All Poll Results
export const getAllPollResults = async (req: Request, res: Response) => {
  try {
    const now = Date.now();

    // Pagination (default: 5 polls)
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch only relevant polls
    const polls = await prisma.poll.findMany({
      where: {
        contractPollId: { not: null },
      },
      include: { options: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Concurrency limits
    const pollLimit = pLimit(3);
    const optionLimit = pLimit(5);

    const allResults = await Promise.all(
      polls.map((poll) =>
        pollLimit(async () => {
          const cacheKey = `poll-${poll.contractPollId}`;

          // Return cached if valid
          if (cache[cacheKey] && cache[cacheKey].expiresAt > now) {
            return cache[cacheKey].data;
          }

          // Prevent duplicate requests (in-flight deduplication)
          if (inFlight[cacheKey]) {
            return inFlight[cacheKey];
          }

          // Create new request
          inFlight[cacheKey] = (async () => {
            try {
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

              const totalVotes = results.reduce(
                (sum, r) => sum + r.voteCount,
                0
              );

              const pollResult = {
                pollId: poll.id,
                title: poll.title,
                description: poll.description,
                status: poll.status,
                deadline: poll.deadline,
                results,
                totalVotes,
              };

              // Smarter TTL
              const isActive = poll.status === "ACTIVE";
              const ttl = isActive ? ACTIVE_TTL : INACTIVE_TTL;

              cache[cacheKey] = {
                data: pollResult,
                expiresAt: Date.now() + ttl,
              };

              return pollResult;
            } catch (err) {
              console.error(`Failed for poll ${poll.id}`, err);
              return null;
            } finally {
              delete inFlight[cacheKey]; // cleanup
            }
          })();

          return inFlight[cacheKey];
        })
      )
    );

    const filteredResults = allResults.filter(Boolean);

    // Response with pagination metadata
    res.json({
      data: filteredResults,
      page,
      limit,
    });
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