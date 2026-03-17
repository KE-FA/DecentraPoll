import toast from "react-hot-toast";

export function useVote(contract: any) {

  const vote = async (pollId: number, optionIndex: number) => {
    const toastId = "vote"; // single toast to prevent duplicates
    try {
      const tx = await contract.vote(pollId, optionIndex);

      await tx.wait();

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