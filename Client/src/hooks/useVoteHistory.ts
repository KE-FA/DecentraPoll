import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export function useVoteHistory(wallet: string | null) {
  const [voteHistory, setVoteHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!wallet) return;

    async function fetchHistory() {
      try {
        const response = await axiosInstance.get("/api/vote/history", {
          withCredentials: true,
        });
        setVoteHistory(response.data);
      } catch (err) {
        console.error("Failed to fetch vote history", err);
      }
    }

    fetchHistory();
  }, [wallet]);

  return { voteHistory };
}