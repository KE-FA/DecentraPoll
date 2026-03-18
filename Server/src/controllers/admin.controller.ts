import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { contract, blockchainService } from "../services/blockchain.service";
import { PollStatus } from "@prisma/client";
import { Log, EventLog } from "ethers";


const client = new PrismaClient();

// Create Poll
export const createPoll = async (req: Request, res: Response) => {
  try {
    const adminId = req.user.id;
    const { title, description, options, duration } = req.body;

    if (!options || options.length < 2) {
      return res.status(400).json({ message: "Minimum 2 options required" });
    }

    // Create poll in DB as PENDING
    const poll = await client.poll.create({
      data: {
        title,
        description,
        adminId,
        deadline: new Date(Date.now() + duration * 1000), // In secs
        status: PollStatus.PENDING,
      },
    });

    // Send transaction to blockchain
    const tx = await blockchainService.createPoll(options, duration);

    // Save the transaction hash from the transaction object
    const transactionHash = tx.hash;

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    // Extract PollCreated event to get contractPollId
    let contractPollId: number | null = null;
    if (receipt.events && receipt.events.length) {
      for (const e of receipt.events) {
        if ("args" in e && e.event === "PollCreated") {
          contractPollId = Number(e.args.pollId);
          break;
        }
      }
    }


    // Fallback: query the event if not found in receipt
    if (!contractPollId) {
      const filter = contract.filters.PollCreated();
      const events = await contract.queryFilter(
        filter,
        receipt.blockNumber,
        receipt.blockNumber
      );
      if (events.length && "args" in events[0]) {
        contractPollId = Number(events[0].args.pollId);
      }
    }

    if (!contractPollId) {
      return res
        .status(500)
        .json({ error: "Failed to get contract poll ID from blockchain" });
    }

    // Save poll options in DB
    await client.pollOption.createMany({
      data: options.map((label: string, index: number) => ({
        pollId: poll.id,
        label,
        index,
      })),
    });

    // Update poll with blockchain info and set ACTIVE
    const updatedPoll = await client.poll.update({
      where: { id: poll.id },
      data: {
        contractPollId,
        transactionHash,
        status: PollStatus.ACTIVE,
      },
      include: { options: true },
    });

    // Return full poll object
    res.json({
      message: "Poll created successfully",
      poll: updatedPoll,
    });
  } catch (err) {
    console.error("Create Poll Error:", err);
    res.status(500).json({ error: "Poll creation failed" });
  }
};

// Get Active Polls
export const getActivePolls = async (_req: Request, res: Response) => {
  try {
    const now = new Date();

    // Step 1: Mark all polls with past deadlines as ENDED
    await client.poll.updateMany({
      where: {
        status: PollStatus.ACTIVE,
        deadline: { lte: now },
      },
      data: { status: PollStatus.ENDED },
    });

    // Step 2: Fetch all still active polls
    const activePolls = await client.poll.findMany({
      where: { status: PollStatus.ACTIVE },
      include: { options: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(activePolls);
  } catch (err) {
    console.error("Failed to fetch active polls:", err);
    res.status(500).json({ error: "Failed to fetch active polls" });
  }
};

// Get details of a single poll
// export const getPollDetails = async (req: Request, res: Response) => {
//   try {
//     const pollId = Number(req.params.id);

//     const poll = await client.poll.findUnique({
//       where: { id: pollId },
//       include: {
//         options: { select: { id: true, label: true, index: true } },
//         admin: { select: { id: true, regNo: true } },
//         voteHistory: { select: { id: true, userId: true, optionId: true, txHash: true, createdAt: true } }
//       }
//     });

//     if (!poll) return res.status(404).json({ error: "Poll not found" });

//     // Fetch blockchain vote counts for each option
//     const optionsWithCounts = await Promise.all(
//       poll.options.map(async (opt: any) => {
//         const count = await blockchainService.getVotes(pollId, opt.index);
//         return { ...opt, voteCount: Number(count) };
//       })
//     );

//     res.json({
//       id: poll.id,
//       title: poll.title,
//       description: poll.description,
//       status: poll.status,
//       deadline: poll.deadline,
//       admin: poll.admin,
//       options: optionsWithCounts,
//       voteHistory: poll.voteHistory
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch poll details" });
//   }
// };

// Approve Poll
export const approvePoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const poll = await client.poll.update({
      where: { id: Number(id) },
      data: { status: PollStatus.APPROVED }
    });

    res.json(poll);

  } catch (err) {
    res.status(500).json({ error: "Approval failed" });
  }
};

// Reject Poll
export const rejectPoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const poll = await client.poll.update({
      where: { id: Number(id) },
      data: { status: PollStatus.REJECTED }
    });

    res.json(poll);

  } catch (err) {
    res.status(500).json({ error: "Rejection failed" });
  }
};

// Delete Poll
export const deletePoll = async (req: Request, res: Response) => {
  try {
    const pollId = Number(req.params.id);

    if (isNaN(pollId)) {
      return res.status(400).json({ error: "Invalid poll ID" });
    }

    // Check if poll exists
    const poll = await client.poll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // Delete associated vote history first 
    await client.voteHistory.deleteMany({
      where: { pollId },
    });

    // Delete associated options
    await client.pollOption.deleteMany({
      where: { pollId },
    });

    // Delete the poll itself
    await client.poll.delete({
      where: { id: pollId },
    });

    res.json({ message: "Poll deleted successfully" });
  } catch (err) {
    console.error("Delete Poll Error:", err);
    res.status(500).json({ error: "Failed to delete poll" });
  }
};

// Get All Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await client.user.findMany({
      select: {
        id: true,
        regNo: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
    res.status(200).json(users);
  } catch (e) {
    console.error("❌ getAllUsers error:", e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update user info
export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { regNo, password, role } = req.body;

    // Build update data dynamically
    const updateData: any = {};
    if (regNo) updateData.regNo = regNo;
    if (role) updateData.role = role;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await client.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        regNo: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (e: any) {
    console.error("❌ updateUserInfo error:", e);
    res.status(500).json({ message: "Something went wrong", error: e.message });
  }
};

// Get user info by id
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = Number(id);


    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        regNo: true,
        role: true,

      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Add new user
export const addUser = async (req: Request, res: Response) => {
  try {
    const { regNo, password, role } = req.body;

    if (!regNo || !password || !role)
      return res.status(400).json({ message: "All fields required" });

    // Check if username already exists
    const existingUser = await client.user.findUnique({ where: { regNo } });
    if (existingUser) {
      return res.status(400).json({ message: "Registration Number already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await client.user.create({
      data: {
        regNo,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        regNo: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (e: any) {
    console.error("❌ addUser error:", e);
    res.status(500).json({ message: "Something went wrong", error: e.message });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    // Delete all login logs for this user first
    await client.login.deleteMany({ where: { userId } });

    // Then delete the user
    await client.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (e: any) {
    console.error("❌ deleteUser error:", e);
    res.status(500).json({ message: "Failed to delete user", error: e.message });
  }
};
