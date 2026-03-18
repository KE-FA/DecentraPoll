import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export function usePollsApi(contract?: any) {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    try {
      const res = await axiosInstance.get("/api/polls/active");
      setPolls(res.data);
    } catch (err) {
      console.error("Failed to fetch polls", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();

    // Auto refresh every 5 seconds
    const interval = setInterval(() => {
      fetchPolls();
    }, 5000);

    // Listen to blockchain events
    if (!contract) return;

    const handleVoteCast = () => {
      fetchPolls(); // Refresh after vote
    };

    const handlePollCreated = () => {
      fetchPolls(); // Refresh after new poll
    };

    contract.on("VoteCast", handleVoteCast);
    contract.on("PollCreated", handlePollCreated);

    return () => {
      clearInterval(interval);

      contract.off("VoteCast", handleVoteCast);
      contract.off("PollCreated", handlePollCreated);
    };
  }, [contract]);

  return { polls, loading, refetchPolls: fetchPolls };
}