import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

// Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, regNo, role, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await client.user.create({
      data: {
        firstName,
        lastName,
        regNo,
        role,
        password: hashedPassword,
        
      },
    });
    res.status(201).json({ message: "User created successfully" });
    // console.log(firstName,userName)
    // res.send("Register a new user")
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { regNo, password } = req.body;

    const user = await client.user.findUnique({
      where: { regNo: regNo },
    });

    if (!user) {
      return res.status(400).json({ message: "Wrong Login Credentials" });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      // Record failed login
      await client.login.create({
        data: {
          userId: user.id,
          
        },
      });
      return res.status(400).json({ message: "Wrong Login Credentials" });
    }

    
    // Create JWT payload
    const payload = { id: user.id, regNo: user.regNo, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Update last login timestamp
    await client.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Return user info 
    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        message: "Login successful",
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        regNo: user.regNo,
        role: user.role.toUpperCase(),
        
      });
  } catch (e: any) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Something went wrong", error: e.message });
  }
};

// Logout
export const logOutUser = async (_req: Request, res: Response) => {
  try {
    res
      .clearCookie("authToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong during logout" });
  }
};

// Change Password
export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const { id } = req.user;

    const user = await client.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res
        .status(200)
        .json({ success: false, message: "Incorrect current password" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await client.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get vote history for the logged-in user
export const getUserVoteHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // from your middleware

    // Fetch all votes by this user
    const votes = await client.voteHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        poll: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            deadline: true,
          }
        },
        option: {
          select: {
            id: true,
            label: true,
            index: true
          }
        }
      }
    });

    // Format response
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

    res.json(history);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vote history" });
  }
};