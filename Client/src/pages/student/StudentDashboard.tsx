import { Container, Typography, Box, CircularProgress, Button } from "@mui/material";
import { useWallet } from "../../hooks/useWallet";
import { useVote } from "../../hooks/useVote";
// import { Web3Context } from "../../context/Web3Context";
import WalletGate from "../../components/WalletGate";
import PollList from "../../components/student/PollList";
// import { listenToEvents, fetchVoteHistory } from "../../web3/eventListener";
import AnalyticsChart from "../../components/student/AnalyticsChart";
import VoteHistory from "../../components/student/VoteHistory";
import { usePollsApi } from "../../hooks/usePollsApi";
import { useVoteHistory } from "../../hooks/useVoteHistory";

export default function StudentDashboard() {

  const { wallet, contract, connectWallet, bindWallet } = useWallet();
  const { polls, loading } = usePollsApi();
  const { voteHistory } = useVoteHistory(contract, wallet);
  const { vote } = useVote(contract);

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

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography>Loading Polls...</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" mb={3}>
        🎓 Student Dashboard
      </Typography>

      <Typography variant="body1">
        Wallet: {wallet}
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={bindWallet}
      >
        🔐 Bind Wallet To Account
      </Button>

      <PollList polls={polls} vote={vote} />

      <VoteHistory/>

      <AnalyticsChart voteHistory={voteHistory} />

    </Container>
  );
}