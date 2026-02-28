import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";


const client = new PrismaClient();


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
        role:true,
        
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
