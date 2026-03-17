import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export function usePollsApi() {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolls() {
      try {
        const res = await axiosInstance.get("/api/polls/active"); 
        setPolls(res.data);
      } catch (err) {
        console.error("Failed to fetch polls", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
  }, []);

  return { polls, loading };
}