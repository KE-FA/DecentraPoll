// Handles fetching polls from blockchain and listening to events.

import { useEffect, useState } from "react";
import { listenToEvents } from "../../src/web3/eventListener";

export function usePolls(contract: any, wallet: string) {

  const [polls, setPolls] = useState<any[]>([]);
  const [votes, setVotes] = useState<any>({});
  const [voteHistory, setVoteHistory] = useState<any[]>([]);

  useEffect(() => {

    if (!contract || !wallet) return;

    // Start listening to blockchain events
    listenToEvents(
      setPolls,
      setVotes,
      setVoteHistory,
      wallet
    );

  }, [contract, wallet]);

  return {
    polls,
    votes,
    voteHistory,
    setPolls,
  };
}