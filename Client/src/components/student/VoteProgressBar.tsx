import { LinearProgress, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function VoteProgressBar({
  contract,
  pollId,
  options
}: any) {

  const [counts, setCounts] = useState<number[]>([]);

  useEffect(() => {

    const loadVotes = async () => {

      const temp: number[] = [];

      for (let i = 0; i < options.length; i++) {
        const count = await contract.voteCounts(pollId, i);
        temp.push(Number(count));
      }

      setCounts(temp);
    };

    if (contract) loadVotes();

  }, [contract, pollId]);

  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <Box mt={3}>
      {options.map((opt: string, index: number) => {

        const percentage =
          total === 0 ? 0 :
          (counts[index] / total) * 100;

        return (
          <Box key={index} mb={2}>
            <Typography>
              {opt} ({counts[index] || 0} votes)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={percentage}
            />
          </Box>
        );
      })}
    </Box>
  );
}