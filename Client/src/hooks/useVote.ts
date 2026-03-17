import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

export function useVote(contract: any) {

  const vote = async (pollId: number, optionIndex: number) => {
    const toastId = "vote"; // single toast to prevent duplicates
    try {
      const tx = await contract.vote(pollId, optionIndex);

      await tx.wait();

      await axiosInstance.post(
        "/api/vote/record",
        { pollId, optionIndex },
        { withCredentials: true }
      );

      

      toast.success("Vote Successful", { id: toastId });
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.data?.message || error?.message || "Vote failed",
        { id: toastId }
      );
    }
  };

  return { vote };
}