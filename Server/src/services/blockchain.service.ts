// Handles smart contract interaction
import { ethers } from "ethers";
import contractABI from "../abi/contract.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(
  process.env.ADMIN_PRIVATE_KEY!,
  provider
);

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  contractABI,
  wallet
);

export const blockchainService = {

  async createPoll(options: string[], duration: number) {

    const tx = await contract.createPoll(
      options,
      duration
    );

    return tx;
  },

  async getVoteEvents() {

    const filter = contract.filters.Voted();

    return await contract.queryFilter(filter);
  }
};