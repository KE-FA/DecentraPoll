import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

export function useVote(contract: any) {

  const vote = async (contractPollId: number, pollId: number, optionIndex: number) => {
    const toastId = "vote"; // single toast to prevent duplicates
    try {
      const tx = await contract.vote(contractPollId, optionIndex);

      const receipt = await tx.wait();
      console.log(receipt)

      await axiosInstance.post(
        "/api/vote/record",
        { pollId, optionIndex, txHash: receipt.hash },
        { withCredentials: true }
      );



      toast.success("Vote Successful",
        {
          id: toastId,
          position: "top-center"

        });
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.data?.message || error?.message || "Vote failed",
        {
          id: toastId,
          position: "top-center"

        }
      );
    }
  };

  return { vote };
}