import { Card, CardContent, Typography, Button } from "@mui/material";
import VoteProgressBar from "./VoteProgressBar";

export default function PollCard({
  poll,
  vote,
  contract
}: any) {

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>

        <Typography variant="h6">
          {poll.title}
        </Typography>

        {poll.options.map((opt: string, i: number) => (
          <Button
            key={i}
            sx={{ mr: 1, mt: 2 }}
            variant="outlined"
            onClick={() => vote(poll.contract_poll_id, i)}
          >
            {opt}
          </Button>
        ))}

        <VoteProgressBar
          contract={contract}
          pollId={poll.contract_poll_id}
          options={poll.options}
        />

      </CardContent>
    </Card>
  );
}