import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyMessage } from "ethers";
import crypto from "crypto";

const client = new PrismaClient();

// In-memory nonce store 
const nonceStore = new Map<number, string>();

// Hardcoded admin wallet
const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS!.toLowerCase();

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

// Get Wallet Status
export const getWalletStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await client.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true } // Only return wallet address
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      walletAddress: user.walletAddress // Could be null if not bound
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch wallet status" });
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

    const user = await client.user.findUnique({
      where: { id: userId }
    });

    // If user already has a wallet
    if (user?.walletAddress) {
      if (user.walletAddress.toLowerCase() === recoveredAddress) {
        // Same wallet -> allow reconnect
        return res.status(200).json({
          message: "Wallet already connected",
          walletAddress: recoveredAddress
        });
      } else {
        // If Different wallet block
        return res.status(403).json({
          message: "Wallet already assigned. Contact admin to reset."
        });
      }
    }

    // Prevent admin wallet from being used by students
    if (recoveredAddress === ADMIN_WALLET_ADDRESS) {
      return res.status(403).json({ message: "Admin wallet cannot be linked to student" });
    }

    try {
      await client.user.update({
        where: { id: userId },
        data: { walletAddress: recoveredAddress }
      });
    } catch (err: any) {
      // Handle unique constraint (wallet already linked) error
      if (err.code === "P2002") {
        return res.status(409).json({
          message: "Wallet already linked to another account"
        });
      }
      throw err;
    }

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