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

// let contract: ethers.Contract | undefined;

// if (process.env.CONTRACT_ADDRESS && process.env.CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
//   const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY!, provider);

//   contract = new ethers.Contract(
//     process.env.CONTRACT_ADDRESS!,
//     contractABI,
//     wallet
//   );
// } else {
//   console.log("Contract not deployed yet, skipping blockchain calls");
// }

// export { contract };


export const blockchainService = {

  async createPoll(options: string[], duration: number) {
        if (!contract) throw new Error("Contract not deployed yet");


    const tx = await contract.createPoll(
      options,
      duration
    );

    return tx;
  },

  async getVoteEvents() {
        if (!contract) throw new Error("Contract not deployed yet");


    const filter = contract.filters.Voted();

    return await contract.queryFilter(filter);
  }
};

