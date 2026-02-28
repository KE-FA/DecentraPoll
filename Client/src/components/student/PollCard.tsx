import { Card, CardContent, Typography, Button } from "@mui/material";
import ProgressBar from "./ProgressBar";
import { useContext } from "react";
import { Web3Context } from "../../context/Web3Context";

export default function PollCard({ poll, votes }: any) {

  const { contract } = useContext(Web3Context);

  const handleVote = async (index: number) => {
    const tx = await contract.vote(poll.id, index);
    await tx.wait();
    alert("Vote Successful");
  };

  const totalVotes = poll.options.reduce(
    (acc: number, _: any, i: number) =>
      acc + (votes?.[poll.id]?.[i] || 0),
    0
  );

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>

        <Typography variant="h6">
          {poll.title}
        </Typography>

        {poll.options.map((option: string, i: number) => (
          <div key={i}>
            <Button
              fullWidth
              sx={{ mt: 1 }}
              variant="outlined"
              onClick={() => handleVote(i)}
            >
              {option}
            </Button>

            <ProgressBar
              label={option}
              optionVotes={votes?.[poll.id]?.[i] || 0}
              totalVotes={totalVotes}
            />
          </div>
        ))}

      </CardContent>
    </Card>
  );
}