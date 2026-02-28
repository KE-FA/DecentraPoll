// Handles Vote Transaction Logic

export function useVote(contract: any) {

  const vote = async (
    pollId: number,
    optionIndex: number
  ) => {

    if (!contract) {
      alert("Contract not loaded");
      return;
    }

    try {

      const tx = await contract.vote(pollId, optionIndex);
      await tx.wait();

      alert("Vote successful ✅");

    } catch (err: any) {

      console.error(err);
      alert(err.reason || "Voting failed ❌");
    }
  };

  return { vote };
}