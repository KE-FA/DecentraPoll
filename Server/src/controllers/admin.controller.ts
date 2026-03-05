import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { blockchainService } from "../services/blockchain.service";
import { PollStatus } from "@prisma/client";


const client = new PrismaClient();

// Create Poll
export const createPoll = async (req: Request, res: Response) => {
  try {
    if (!process.env.CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      return res.status(400).json({ error: "Contract not deployed yet. Cannot create poll." });
    }
    const adminId = req.user.id;
    const { title, description, options, duration } = req.body;

    if (!options || options.length < 2) {
      return res.status(400).json({ message: "Minimum 2 options required" });
    }

    // Save Poll as PENDING in DB
    const poll = await client.poll.create({
      data: {
        title,
        description,
        adminId,
        deadline: new Date(Date.now() + duration * 1000),
        status: PollStatus.PENDING
      }
    });

    // Call Smart Contract
    const tx = await blockchainService.createPoll(options, duration);

    const receipt = await tx.wait();

    const contractPollId = receipt.events?.find(
      (e: any) => e.event === "PollCreated"
    )?.args?.pollId;

    // Update DB with blockchain ID
    await client.poll.update({
      where: { id: poll.id },
      data: {
        contractPollId: Number(contractPollId),
        transactionHash: receipt.transactionHash,
        status: PollStatus.ACTIVE
      }
    });

    res.json({ message: "Poll created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Poll creation failed" });
  }
};

// Get all active polls
export const getActivePolls = async (req: Request, res: Response) => {
  try {
    const polls = await client.poll.findMany({
      where: { status: PollStatus.ACTIVE },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        deadline: true,
        adminId: true,
        contractPollId: true,
        createdAt: true
      }
    });

    res.json(polls);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch active polls" });
  }
};

// Get details of a single poll
export const getPollDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const poll = await client.poll.findUnique({
      where: { id: Number(id) },
      include: {
        admin: { select: { id: true, regNo: true } },
        options: {
          select: {
            id: true,
            label: true,
            index: true,
            votes: {
              select: {
                id: true,
                userId: true,
                txHash: true,
                createdAt: true
              }
            }
          },
          orderBy: { index: "asc" }
        },
        voteHistory: {
          select: {
            id: true,
            userId: true,
            optionId: true,
            txHash: true,
            createdAt: true
          }
        }
      }
    });

    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // Compute vote counts per option
    const optionsWithCounts = poll.options.map(opt => ({
      id: opt.id,
      label: opt.label,
      index: opt.index,
      voteCount: opt.votes.length
    }));

    res.json({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      deadline: poll.deadline,
      status: poll.status,
      contractPollId: poll.contractPollId,
      createdAt: poll.createdAt,
      admin: poll.admin,
      options: optionsWithCounts
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch poll details" });
  }
};

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
