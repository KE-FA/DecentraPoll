import { ethers } from "ethers";
import contractABI from "../abi/contract.json";

const RPC_URL = process.env.RPC_URL!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Admin wallet for creating polls
const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY!, provider);

export const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, wallet);

export const blockchainService = {
  async createPoll(options: string[], duration: number) {
    if (!contract) throw new Error("Contract not deployed yet");
    const tx = await contract.createPoll(options, duration);
    return tx;
  },

  async getVotes(pollId: number, optionIndex: number) {
    return await contract.getVotes(pollId, optionIndex);
  },

  async getOptions(pollId: number) {
    return await contract.getOptions(pollId);
  },

  async verifyTransaction(txHash: string) {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || receipt.status !== 1) return false;
    return true;
  }
};