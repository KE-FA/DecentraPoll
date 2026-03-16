import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Card,
  CardContent
} from "@mui/material";
import { motion } from "framer-motion";
import { useWallet } from "../../hooks/useWallet";
import { useVote } from "../../hooks/useVote";
import { usePollsApi } from "../../hooks/usePollsApi";
import { useVoteHistory } from "../../hooks/useVoteHistory";
import WalletGate from "../../components/WalletGate";

// Vote progress bar
type Option = {
  id: number;
  pollId: number;
  label: string;
  index: number;
};

function VoteProgressBar({
  contract,
  pollId,
  options,
  refreshSignal
}: any) {
  const [counts, setCounts] = useState<number[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadVotes = async () => {
      if (!contract) return;

      let temp: number[] = [];
      let sum = 0;

      for (const opt of options) {
        const count = await contract.voteCounts(pollId, opt.index);
        const value = Number(count);
        temp.push(value);
        sum += value;
      }

      setCounts(temp);
      setTotal(sum);
    };

    loadVotes();
  }, [refreshSignal, contract, options, pollId]);

  return (
    <Box mt={3}>
      {options.map((opt: Option, index: number) => {
        const percentage = total === 0 ? 0 : (counts[index] / total) * 100;

        return (
          <Box key={opt.id} mb={2}>
            <Typography>{opt.label}</Typography>

            <Box sx={{ background: "#eee", borderRadius: 2 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6 }}
                style={{
                  height: 12,
                  background: "#6366f1",
                  borderRadius: 8
                }}
              />
            </Box>

            <Typography variant="caption">{counts[index] || 0} votes</Typography>
          </Box>
        );
      })}
    </Box>
  );
}

// Poll Card
function PollCard({ poll, vote, contract }: any) {
  if (!poll) return null;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">{poll.title}</Typography>

        {poll.options?.map((opt: Option) => (
          <Button
            key={opt.id}
            sx={{ mr: 1, mt: 2 }}
            variant="outlined"
            onClick={() => vote(poll.contract_poll_id, opt.index)}
          >
            {opt.label}
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

// Poll List
function PollList({ polls, vote, contract }: any) {
  return (
    <>
      {polls.map((poll: any) => (
        <PollCard key={poll.id} poll={poll} vote={vote} contract={contract} />
      ))}
    </>
  );
}

// Vote History
function VoteHistory() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    import("../../api/studentApi").then(({ getVoteHistoryAPI }) => {
      getVoteHistoryAPI().then((res) => setHistory(res.data));
    });
  }, []);

  return (
    <Box mt={5}>
      <Typography variant="h5">🧾 My Vote History</Typography>

      {history.length === 0 ? (
        <Typography>No votes yet.</Typography>
      ) : (
        history.map((item) => (
          <Box
            key={item.id}
            p={2}
            mt={2}
            border="1px solid #ddd"
            borderRadius={2}
          >
            <Typography>Poll ID: {item.poll_id}</Typography>
            <Typography>Option Index: {item.option_index}</Typography>
            <Typography variant="caption">Tx: {item.tx_hash}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
}

// Analytics Chart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function AnalyticsChart({ voteHistory }: { voteHistory: any[] }) {
  const grouped: any = {};
  voteHistory.forEach((item) => {
    grouped[item.poll_id] = (grouped[item.poll_id] || 0) + 1;
  });

  const data = Object.keys(grouped).map((key) => ({
    poll: key,
    votes: grouped[key]
  }));

  return (
    <Box mt={5}>
      <Typography variant="h5">📊 Participation Analytics</Typography>

      {data.length === 0 ? (
        <Typography>No analytics yet.</Typography>
      ) : (
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="poll" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="votes" fill="#6366f1" />
        </BarChart>
      )}
    </Box>
  );
}

// Student Dashboard
export default function StudentDashboard() {
  const { wallet, contract, connectWallet, bindWallet } = useWallet();
  const { polls, loading } = usePollsApi();
  const { voteHistory } = useVoteHistory(contract, wallet);
  const { vote } = useVote(contract);

  if (!wallet) return <WalletGate connectWallet={connectWallet} />;

  if (!contract)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography>Loading Blockchain...</Typography>
      </Box>
    );

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography>Loading Polls...</Typography>
      </Box>
    );

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" mb={3}>
        🎓 Student Dashboard
      </Typography>

      <Typography variant="body1">Wallet: {wallet}</Typography>

      <Button variant="contained" sx={{ mt: 2 }} onClick={bindWallet}>
        🔐 Bind Wallet To Account
      </Button>

      <PollList polls={polls} vote={vote} contract={contract} />

      <VoteHistory />

      <AnalyticsChart voteHistory={voteHistory} />
    </Container>
  );
}