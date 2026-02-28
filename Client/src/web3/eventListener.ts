import { ethers } from "ethers";
import abi from "./abi.json";

const WS_URL = "YOUR_SEPOLIA_WEBSOCKET_URL";
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

const provider = new ethers.WebSocketProvider(WS_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

// Real Time Listener
export const listenToEvents = (
  setPolls: any,
  setVotes: any,
  setVoteHistory: any,
  walletAddress: string
) => {

  // Poll Created
  contract.on("PollCreated", (pollId, title, deadline) => {
    setPolls((prev: any) => [
      ...prev,
      {
        id: Number(pollId),
        title,
        deadline: Number(deadline),
      }
    ]);
  });

  // Vote Cast Real Time
  contract.on("VoteCast", (pollId, voter, option) => {

    // Update vote state
    setVotes((prev: any) => ({
      ...prev,
      [pollId.toString()]: true
    }));

    // Add to history ONLY if this wallet voted
    if (voter.toLowerCase() === walletAddress.toLowerCase()) {
      setVoteHistory((prev: any) => [
        ...prev,
        {
          pollId: Number(pollId),
          option: Number(option),
          voter,
          timestamp: Date.now()
        }
      ]);
    }
  });
};

// Fetch past vote history from blockchain

export const fetchVoteHistory = async (walletAddress: string) => {

  const filter = contract.filters.VoteCast(
    null,
    walletAddress,
    null
  );

  const events = await contract.queryFilter(filter, 0, "latest");

  return events.map((event: any) => ({
    pollId: Number(event.args.pollId),
    option: Number(event.args.option),
    voter: event.args.voter,
    txHash: event.transactionHash,
    blockNumber: event.blockNumber
  }));
};




  