import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

export function useVote(contract: any) {
  const vote = async (
    contractPollId: number,
    pollId: number,
    optionIndex: number
  ): Promise<boolean> => {
    const toastId = "vote"; // Single toast to prevent duplicates
    try {
      const tx = await contract.vote(contractPollId, optionIndex);
      const receipt = await tx.wait();
      console.log("Tx receipt:", receipt);

      // Record vote in backend
      await axiosInstance.post(
        "/api/vote/record",
        { pollId, optionIndex, txHash: receipt.hash },
        { withCredentials: true }
      );

      toast.success("Vote Successful", {
        id: toastId,
        position: "top-center",
      });

      return true; // Vote successful
    } catch (error: any) {
      console.error("Vote error:", error);

      // Detect user cancellation
      if (error?.code === "ACTION_REJECTED") {
        toast("Transaction cancelled", {
          id: toastId,
          position: "top-center",
          icon: "⚠️",
        });
      } else {
        toast.error(error?.data?.message || error?.message || "Vote failed", {
          id: toastId,
          position: "top-center",
        });
      }

      return false; // Vote failed or cancelled
    }
  };

  return { vote };
}