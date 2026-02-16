import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyMessage } from "ethers";
import crypto from "crypto";

const client = new PrismaClient();

// In-memory nonce store (OK for prototype)
const nonceStore = new Map<number, string>();

// Hardcoded admin wallet
const ADMIN_WALLET_ADDRESS = "0xADMIN_WALLET_ADDRESS_HERE".toLowerCase();

// Generate Nonce - Student Must be Logged In
export const generateNonce = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const nonce = crypto.randomUUID();
    nonceStore.set(userId, nonce);

    res.status(200).json({ nonce });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate nonce" });
  }
};

// Verify Signature and bind wallet
export const verifyAndBindWallet = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { signature } = req.body;

    if (!userId || !signature) {
      return res.status(400).json({ message: "Missing data" });
    }

    const nonce = nonceStore.get(userId);
    if (!nonce) {
      return res.status(400).json({ message: "Nonce expired or missing" });
    }

    // Recover wallet address from signature
    const recoveredAddress = verifyMessage(nonce, signature).toLowerCase();

    // Prevent admin wallet from being used by students
    if (recoveredAddress === ADMIN_WALLET_ADDRESS) {
      return res.status(403).json({ message: "Admin wallet cannot be linked to student" });
    }

    // Prevent wallet reuse
    const walletExists = await client.user.findUnique({
      where: { walletAddress: recoveredAddress }
    });

    if (walletExists) {
      return res.status(409).json({ message: "Wallet already linked to another account" });
    }

    // Bind wallet to user
    await client.user.update({
      where: { id: userId },
      data: { walletAddress: recoveredAddress }
    });

    nonceStore.delete(userId);

    res.status(200).json({
      message: "Wallet connected successfully",
      walletAddress: recoveredAddress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wallet verification failed" });
  }
};
