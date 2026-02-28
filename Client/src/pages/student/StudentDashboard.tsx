import { Container, Typography, Box, CircularProgress, Button } from "@mui/material";
import { useWallet } from "../../hooks/useWallet";
import { usePolls } from "../../hooks/usePolls";
import { useVote } from "../../hooks/useVote";
// import { Web3Context } from "../../context/Web3Context";
import WalletGate from "../../components/student/WalletGate";
import PollList from "../../components/student/PollList";
// import { listenToEvents, fetchVoteHistory } from "../../web3/eventListener";
import AnalyticsChart from "../../components/student/AnalyticsChart";

export default function StudentDashboard() {

  // Wallet
  const {
    wallet,
    contract,
    connectWallet,
    bindWallet
  } = useWallet();

  // Polls and History
  const {
    polls,
    votes,
    voteHistory
  } = usePolls(contract, wallet);

  // Vote Function
  const { vote } = useVote(contract);

  // UI

  if (!wallet) {
    return <WalletGate connectWallet={connectWallet} />;
  }

  if (!contract) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography>Loading Blockchain...</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>

      {/* HEADER */}
      <Typography variant="h4" mb={3}>
        🎓 Student Dashboard
      </Typography>

      <Typography variant="body1" mb={2}>
        Wallet: {wallet}
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={bindWallet}
      >
        🔐 Bind Wallet To Account
      </Button>

      {/* POLL LIST */}
      <PollList
        polls={polls}
        votes={votes}
        vote={vote}
      />

      {/* VOTE HISTORY */}
      <Box mt={6}>
        <Typography variant="h5" mb={2}>
          🧾 My Vote History
        </Typography>

        {voteHistory.length === 0 ? (
          <Typography>No blockchain vote history yet.</Typography>
        ) : (
          voteHistory.map((v: any, index: number) => (
            <Box
              key={index}
              p={2}
              mb={2}
              border="1px solid #ddd"
              borderRadius={2}
            >
              <Typography>Poll ID: {v.pollId}</Typography>
              <Typography>Option: {v.option}</Typography>
              <Typography variant="caption">
                Tx: {v.txHash}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      {/* PARTICIPATION ANALYTICS */}
      <AnalyticsChart voteHistory={voteHistory} />

    </Container>
  );
}