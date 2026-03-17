// Handles Vote Transaction Logic

export function useVote(contract: any) {

  const vote = async (pollId: number, optionIndex: number) => {

    const tx = await contract.vote(pollId, optionIndex);

    await tx.wait();

    alert("Vote Successful");
  };

  return { vote };
}