// Handles Vote Transaction Logic

export function useVote(contract: any) {

  const vote = async (pollId: number, option: number) => {

    const tx = await contract.vote(pollId, option);
    await tx.wait();

    alert("Vote Successful");
  };

  return { vote };
}