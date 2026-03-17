// Handles Vote Transaction Logic

import toast from "react-hot-toast";

export function useVote(contract: any) {
  const vote = async (pollId: number, optionIndex: number) => {
    try {
      const tx = await contract.vote(pollId, optionIndex);

      toast.loading("⏳ Processing transaction...", { id: "vote" });
      
      await tx.wait();

      toast.success("✅ Vote Successful!");
    } catch (error: any) {
      console.error(error);

      toast.error("❌ Vote failed. Please try again.");
    }
  };

  return { vote };
}