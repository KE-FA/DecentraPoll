import { useEffect, useState } from "react";

export function useVoteHistory(contract: any, wallet: string | null) {
  const [voteHistory, setVoteHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!contract || !wallet) return;

    async function fetchHistory() {
      try {
        const filter = contract.filters.Voted(wallet);
        const events = await contract.queryFilter(filter);

        const history = events.map((event: any) => ({
          pollId: event.args.pollId.toString(),
          option: event.args.option.toString(),
          txHash: event.transactionHash
        }));

        setVoteHistory(history);
      } catch (err) {
        console.error("Failed to fetch vote history", err);
      }
    }

    fetchHistory();
  }, [contract, wallet]);

  return { voteHistory };
}