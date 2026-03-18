import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export function useVoteHistory(wallet: string | null, contract?: any) {
  const [voteHistory, setVoteHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    if (!wallet) return;

    try {
      const response = await axiosInstance.get("/api/vote/history", {
        withCredentials: true,
      });
      setVoteHistory(response.data);
    } catch (err) {
      console.error("Failed to fetch vote history", err);
    }
  };

  useEffect(() => {
    fetchHistory();

    // Auto refresh every 5 seconds
    const interval = setInterval(() => {
      fetchHistory();
    }, 5000);

    // Listen to blockchain votes
    if (!contract) return;

    const handleVoteCast = (voter: string) => {
      if (voter.toLowerCase() === wallet?.toLowerCase()) {
        fetchHistory(); // Only refetch if it is this user
      }
    };

    contract.on("VoteCast", handleVoteCast);

    return () => {
      clearInterval(interval);
      contract.off("VoteCast", handleVoteCast);
    };
  }, [wallet, contract]);

  return { voteHistory, refetchHistory: fetchHistory };
}