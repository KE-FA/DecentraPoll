import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
  Skeleton,
  TextField,
  Pagination,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { useVote } from "../hooks/useVote";
import { usePollsApi } from "../hooks/usePollsApi";
import { useVoteHistory } from "../hooks/useVoteHistory";
import axiosInstance from "../api/axiosInstance";

// Navbar Component with integrated wallet connection
const DashboardNavbar = ({
  wallet,
  onConnect,
  isConnecting,
  onProfileClick,
  activeTab,
  setActiveTab,
}: {
  wallet: string | null;
  onConnect: () => void;
  isConnecting: boolean;
  onProfileClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background:
          "linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(15, 23, 42, 0.95))",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ py: 2.5, display: "flex", alignItems: "center", gap: 4 }}>
          {/* Logo and Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              "&:hover": { opacity: 0.9 },
            }}
            onClick={() => setActiveTab("active-polls")}
          >
            <Box
              sx={{
                width: 45,
                height: 45,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
              }}
            >
              <Typography variant="h6">🎓</Typography>
            </Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DecentraPoll
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Stack direction="row" spacing={1} sx={{ ml: 4, flex: 1 }}>
            {[
              { id: "active-polls", label: "Active Polls", icon: "📊" },
              { id: "my-votes", label: "My Votes", icon: "🗳️" },
              { id: "results", label: "Results", icon: "📈" },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={!wallet}
                sx={{
                  px: 4,
                  py: 1.5,
                  color: activeTab === tab.id ? "#14b8a6" : "rgba(255,255,255,0.7)",
                  background:
                    activeTab === tab.id
                      ? "rgba(20, 184, 166, 0.1)"
                      : "transparent",
                  borderRadius: "50px",
                  textTransform: "none",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  border:
                    activeTab === tab.id
                      ? "1px solid rgba(20, 184, 166, 0.3)"
                      : "1px solid transparent",
                  transition: "all 0.3s ease",
                  opacity: !wallet ? 0.5 : 1,
                  "&:hover": {
                    background: "rgba(20, 184, 166, 0.15)",
                    border: "1px solid rgba(20, 184, 166, 0.4)",
                  },
                  "&:disabled": {
                    color: "rgba(255,255,255,0.4)",
                  },
                }}
              >
                {tab.icon} {tab.label}
              </Button>
            ))}
          </Stack>

          {/* Connect Wallet Button / Profile */}
          {!wallet ? (
            <Button
              variant="contained"
              onClick={onConnect}
              disabled={isConnecting}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: "50px",
                background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                fontWeight: 700,
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5858d6, #10a89f)",
                  boxShadow: "0 0 40px rgba(99, 102, 241, 0.6)",
                },
                "&:disabled": {
                  background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                  opacity: 0.7,
                },
              }}
            >
              {isConnecting ? (
                <>
                  <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                  Connecting...
                </>
              ) : (
                "🔐 Connect Wallet"
              )}
            </Button>
          ) : (
            <IconButton
              onClick={onProfileClick}
              sx={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                border: "2px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)",
                },
              }}
            >
              <Avatar sx={{ width: 35, height: 35, fontSize: "1.2rem" }}>
                🎓
              </Avatar>
            </IconButton>
          )}
        </Box>
      </Container>
    </Box>
  );
};

// Vote Progress Bar
type Option = {
  id: number;
  pollId: number;
  label: string;
  index: number;
};

function VoteProgressBar({
  contract,
  contractPollId,
  options,
  refreshSignal,
}: {
  contract: any;
  contractPollId: number;
  options: Option[];
  refreshSignal: number;
}) {
  const [counts, setCounts] = useState<number[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadVotes = async () => {
      if (!contract) return;

      const temp: number[] = [];
      let sum = 0;

      for (const opt of options) {
        const count = await contract.voteCounts(contractPollId, opt.index);
        const value = Number(count);
        temp.push(value);
        sum += value;
      }

      setCounts(temp);
      setTotal(sum);
    };

    loadVotes();
  }, [refreshSignal, contract, options, contractPollId]);

  return (
    <Box mt={3}>
      {options.map((opt: Option, index: number) => {
        const percentage = total === 0 ? 0 : (counts[index] / total) * 100;

        return (
          <Box key={opt.id} mb={2}>
            <Typography variant="body2" sx={{ mb: 0.5, color: "rgba(255,255,255,0.8)" }}>
              {opt.label}
            </Typography>

            <Box sx={{ background: "rgba(255,255,255,0.1)", borderRadius: 2, height: 12, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                  borderRadius: 8,
                }}
              />
            </Box>

            <Typography variant="caption" sx={{ mt: 0.5, color: "rgba(255,255,255,0.6)" }}>
              {counts[index] || 0} votes ({percentage.toFixed(1)}%)
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

// Poll Card
function PollCard({ poll, vote, contract, timeLeft }: { poll: any; vote: any; contract: any; timeLeft: any }) {
  const [voted, setVoted] = useState(() => {
    return localStorage.getItem(`voted_${poll.id}`) === "true";
  });
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const { refetchPolls } = usePollsApi(contract);
  const { refetchHistory } = useVoteHistory(contract);

  const handleVote = async (optionIndex: number) => {
    if (isVoting) return;

    setIsVoting(true);

    try {
      await vote(poll.contractPollId, poll.id, optionIndex);

      localStorage.setItem(`voted_${poll.id}`, "true");

      setVoted(true);

      refetchPolls();
      refetchHistory();


      setRefreshSignal((prev) => prev + 1);
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: "rgba(17, 24, 39, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            border: "1px solid rgba(99, 102, 241, 0.4)",
            boxShadow: "0 20px 60px rgba(99, 102, 241, 0.2)",
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <Chip
              label="Active"
              sx={{
                background: "rgba(20, 184, 166, 0.2)",
                color: "#14b8a6",
                fontWeight: 600,
                height: 28,
              }}
            />
            <Chip
              label={
                timeLeft
                  ? `⏳ ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
                  : "⏰ Ended"

              }
            />
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
              {poll.end_date ? `Ends: ${new Date(poll.end_date).toLocaleDateString()}` : ""}
            </Typography>
          </Stack>

          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#fff" }}>
            {poll.title}
          </Typography>

          {poll.description && (
            <Typography variant="body2" sx={{ mb: 3, color: "rgba(255,255,255,0.7)" }}>
              {poll.description}
            </Typography>
          )}

          {!voted && poll.options?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, color: "rgba(255,255,255,0.8)" }}>
                Choose your option:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {poll.options.map((opt: Option) => (
                  <Button
                    key={opt.id}
                    onClick={() => handleVote(opt.index)}
                    variant="outlined"
                    disabled={!timeLeft || !contract || voted || poll.contractPollId === undefined}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: "50px",
                      border: "1px solid rgba(99, 102, 241, 0.4)",
                      color: "#6366f1",
                      textTransform: "none",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(99, 102, 241, 0.1)",
                        border: "1px solid #6366f1",
                      },
                    }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}

          {voted && (
            <Alert severity="success" sx={{ mb: 3 }}>
              You have voted! Check the results on the results tab.
            </Alert>
          )}

          {!voted && timeLeft && poll.options?.length > 0 && (
            <VoteProgressBar
              contract={contract}
              contractPollId={poll.id}
              options={poll.options}
              refreshSignal={refreshSignal}
            />
          )}

          {/* {!timeLeft && (
            <Alert severity="info" sx={{ mb: 3 }}>
              ⏰ This poll has ended. Voting is closed.
            </Alert>
          )} */}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Active Polls Section

// Helper to calculate time left
function getTimeLeft(deadline: string) {
  const now = new Date().getTime();
  const end = new Date(deadline).getTime();
  const diff = end - now;

  if (diff <= 0) return null; // poll ended

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

function ActivePollsSection({
  polls,
  vote,
  contract,
  loading
}: {
  polls: any[];
  vote: any;
  contract: any;
  loading: boolean;
}) {
  // Filter active polls
  const activePolls = polls.filter((poll) => poll.status === "ACTIVE");

  // Countdown state
  const [timeLeftMap, setTimeLeftMap] = useState<Record<string, any>>({});

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      const map: Record<string, any> = {};

      polls.forEach((poll) => {
        if (poll.status === "ACTIVE") {
          map[poll.id] = getTimeLeft(poll.deadline);
        }
      });

      setTimeLeftMap(map);
    }, 1000);

    return () => clearInterval(interval);
  }, [polls]);

  if (loading) {
    return <p>Loading active polls...</p>;
  }

  if (activePolls.length === 0) {
    return <p>No active polls available.</p>;
  }

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress sx={{ color: "#6366f1" }} />
        <Typography variant="body1" sx={{ mt: 2, color: "rgba(255,255,255,0.7)" }}>
          Loading polls...
        </Typography>
      </Box>
    );
  }

  if (polls.length === 0) {
    return (
      <Paper
        sx={{
          p: 8,
          textAlign: "center",
          background: "rgba(17, 24, 39, 0.4)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          borderRadius: "20px",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "rgba(255,255,255,0.7)" }}>
          📭 No active polls available
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
          Check back later for new polls!
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          vote={vote}
          contract={contract}
          timeLeft={timeLeftMap[poll.id]}
        />
      ))}
    </Stack>
  );
}

// My Votes Section
function MyVotesSection({
  voteHistory,
  wallet,
}: {
  voteHistory: any[];
  wallet: string | null;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const RESULTS_PER_PAGE = 10;

  if (!wallet) {
    return (
      <Paper
        sx={{
          p: 8,
          textAlign: "center",
          background: "rgba(17, 24, 39, 0.4)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          borderRadius: "20px",
        }}
      >
        <Typography sx={{ mb: 2, color: "rgba(255,255,255,0.7)" }}>
          🔐 Connect your wallet to view votes
        </Typography>
      </Paper>
    );
  }

  // Filter votes (by poll title or option)
  const filteredVotes = voteHistory.filter((vote) =>
    `${vote.pollTitle} ${vote.optionLabel || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredVotes.length / RESULTS_PER_PAGE);

  const displayedVotes = filteredVotes.slice(
    (page - 1) * RESULTS_PER_PAGE,
    page * RESULTS_PER_PAGE
  );

  if (voteHistory.length === 0) {
    return (
      <Paper
        sx={{
          p: 8,
          textAlign: "center",
          background: "rgba(17, 24, 39, 0.4)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          borderRadius: "20px",
        }}
      >
        <Typography sx={{ mb: 2, color: "rgba(255,255,255,0.7)" }}>
          🧾 No votes yet
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
          Start voting in active polls to see your history here!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search your votes..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // reset page on search
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 260,
            backdropFilter: "blur(10px)",
            background: "rgba(17, 24, 39, 0.6)",
            borderRadius: "12px",
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "& fieldset": {
                borderColor: "rgba(20, 184, 166, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "#14b8a6",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#14b8a6",
                boxShadow: "0 0 0 1px rgba(20,184,166,0.3)",
              },
            },
          }}
        />
      </Box>

      {/* Empty after filtering */}
      {filteredVotes.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
          No matching votes found
        </Typography>
      ) : (
        <>
          {/* Votes */}
          <Stack spacing={2}>
            {displayedVotes.map((vote: any, index: number) => (
              <motion.div
                key={vote.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card
                  sx={{
                    background: "rgba(17, 24, 39, 0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(20, 184, 166, 0.3)",
                    borderRadius: "15px",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 1 , alignItems:"center"  }}>
                      <Chip
                        label="Voted"
                        sx={{
                          background: "rgba(20, 184, 166, 0.2)",
                          color: "#14b8a6",
                        }}
                      />
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                        {vote.votedAt
                          ? new Date(vote.votedAt).toLocaleString()
                          : ""}
                      </Typography>
                    </Stack>

                    <Typography sx={{ color: "#fff" }}>
                      <strong>Poll Title:</strong> {vote.pollTitle}
                    </Typography>

                    <Typography sx={{ color: "#fff" }}>
                      <strong>Option:</strong>{" "}
                      {vote.optionLabel || `Index ${vote.optionIndex}`}
                    </Typography>

                    {vote.txHash && (
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                        <strong>Transaction:</strong>{" "}
                        {vote.txHash.substring(0, 10)}...
                        {vote.txHash.substring(vote.txHash.length - 8)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#fff",
                },
                "& .Mui-selected": {
                  backgroundColor: "#14b8a6 !important",
                },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

// Results Section

interface ResultOption {
  optionId: number;
  optionLabel: string;
  optionIndex: number;
  voteCount: number;
}

interface PollResult {
  pollId: number;
  title: string;
  description: string;
  status: string;
  deadline: string;
  results: ResultOption[];
  totalVotes: number;
}

function ResultsSection({ loading }: { loading: boolean }) {
  const [results, setResults] = useState<PollResult[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [page, setPage] = useState(1);


  const RESULTS_PER_PAGE = 10; // Limit results shown

  useEffect(() => {
    const loadResults = async () => {
      try {
        const res = await axiosInstance.get("/api/polls/results");
        setResults(res.data);
      } catch (error) {
        console.error("Failed to load results:", error);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress sx={{ color: "#6366f1" }} />
        <Typography variant="body1" sx={{ mt: 2, color: "rgba(255,255,255,0.7)" }}>
          Loading results...
        </Typography>
      </Box>
    );
  }

  // Filter results by search term
  const filteredResults = results.filter((poll) =>
    poll.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);

  // Limit to 10 results
  const displayedResults = filteredResults.slice(
    (page - 1) * RESULTS_PER_PAGE,
    page * RESULTS_PER_PAGE
  );

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search polls..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // reset page when searching
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 260,
            backdropFilter: "blur(10px)",
            background: "rgba(17, 24, 39, 0.6)",
            borderRadius: "12px",
            input: {
              color: "#fff",
              fontSize: "0.9rem",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "& fieldset": {
                borderColor: "rgba(99, 102, 241, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "#6366f1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6366f1",
                boxShadow: "0 0 0 1px rgba(99,102,241,0.3)",
              },
            },
          }}
        />
      </Box>

      {filteredResults.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            textAlign: "center",
            background: "rgba(17, 24, 39, 0.4)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: "20px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "rgba(255,255,255,0.7)" }}>
            📊 No results available
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Results will appear once students start voting!
          </Typography>
        </Paper>
      ) : (
        <>
          <Stack spacing={3}>
            {displayedResults.map((poll, index) => (
              <motion.div
                key={poll.pollId || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    background: "rgba(17, 24, 39, 0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center" }}>
                      <Chip
                        label="Results"
                        sx={{
                          background: "rgba(99, 102, 241, 0.2)",
                          color: "#6366f1",
                          fontWeight: 600,
                          height: 28,
                        }}
                      />
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                        Total Votes: {poll.totalVotes}
                      </Typography>
                    </Stack>

                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: "#fff" }}>
                      {poll.title}
                    </Typography>

                    {poll.results.map((opt) => {
                      const percentage =
                        poll.totalVotes === 0 ? 0 : (opt.voteCount / poll.totalVotes) * 100;
                      return (
                        <Box key={opt.optionId} mb={2}>
                          <Stack direction="row" spacing={2} sx={{ mb: 0.5, alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              sx={{ width: 120, color: "rgba(255,255,255,0.8)" }}
                            >
                              {opt.optionLabel}
                            </Typography>
                            <Box
                              sx={{
                                flex: 1,
                                background: "rgba(255,255,255,0.1)",
                                borderRadius: 2,
                                height: 12,
                                overflow: "hidden",
                              }}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                style={{
                                  height: "100%",
                                  background: `linear-gradient(90deg, #6366f1, #14b8a6)`,
                                  borderRadius: 8,
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ width: 80, textAlign: "right", color: "rgba(255,255,255,0.8)" }}
                            >
                              {percentage.toFixed(1)}%
                            </Typography>
                          </Stack>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                            {opt.voteCount} votes
                          </Typography>
                        </Box>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>

          {/* 📄 Pagination */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#fff",
                },
                "& .Mui-selected": {
                  backgroundColor: "#6366f1 !important",
                },
              }}
            />
          </Box>
        </>

      )};

    </Box>
  );
}

// Welcome Section for not connected users
function WelcomeSection({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "30px",
            background: "linear-gradient(135deg, #6366f1, #14b8a6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            mx: "auto",
            boxShadow: "0 0 60px rgba(99, 102, 241, 0.4)",
          }}
        >
          <Typography variant="h2">🎓</Typography>
        </Box>

        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            mb: 2,
            background: "linear-gradient(135deg, #6366f1, #14b8a6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to DecentraPoll
        </Typography>

        <Typography
          variant="h6"
          sx={{ mb: 4, color: "rgba(255,255,255,0.7)", maxWidth: 500, mx: "auto" }}
        >
          Connect your wallet to participate in decentralized voting and make your voice heard!
        </Typography>

        <Button
          variant="contained"
          onClick={onConnect}
          disabled={isConnecting}
          size="large"
          sx={{
            px: 6,
            py: 2,
            borderRadius: "50px",
            background: "linear-gradient(135deg, #6366f1, #14b8a6)",
            fontWeight: 700,
            fontSize: "1.1rem",
            boxShadow: "0 0 40px rgba(99, 102, 241, 0.5)",
            "&:hover": {
              background: "linear-gradient(135deg, #5858d6, #10a89f)",
              boxShadow: "0 0 60px rgba(99, 102, 241, 0.7)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: "linear-gradient(135deg, #6366f1, #14b8a6)",
              opacity: 0.7,
            },
            transition: "all 0.3s ease",
          }}
        >
          {isConnecting ? (
            <>
              <CircularProgress size={24} sx={{ color: "white", mr: 2 }} />
              Connecting & Binding Wallet...
            </>
          ) : (
            "🔐 Connect Wallet to Get Started"
          )}
        </Button>

        <Stack direction="row" spacing={4} sx={{ mt: 6, justifyContent: "center" }}>
          {[
            { icon: "🗳️", label: "Vote Securely" },
            { icon: "🔗", label: "Blockchain Verified" },
            { icon: "📊", label: "Real-time Results" },
          ].map((item) => (
            <Box key={item.label} sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {item.icon}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </motion.div>
    </Box>
  );
}

// Student Dashboard
export default function StudentDashboard() {
  const navigate = useNavigate();
  const { wallet, contract, connectWallet, isConnecting, isCheckingWallet } = useWallet();
  const { polls, loading } = usePollsApi(contract);
  const { voteHistory } = useVoteHistory(wallet);

  const [activeTab, setActiveTab] = useState("active-polls");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Pass both contract and signer to useVote hook
  const { vote } = useVote(contract);

  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleProfileSettings = () => {
    handleProfileClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    handleProfileClose();

    // Clear wallet in localStorage
    localStorage.removeItem("wallet");

    // Redirect to home page
    navigate("/");
  };

  if (isCheckingWallet) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Header Skeleton */}
        <Skeleton variant="text" width="40%" height={50} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={30} sx={{ mb: 3 }} />

        {/* Wallet Chip Skeleton */}
        <Skeleton
          variant="rounded"
          width={260}
          height={40}
          sx={{ mb: 4, borderRadius: "20px" }}
        />

        {/* Tabs and Section Title */}
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />

        {/* Poll Cards Skeleton */}
        {[1, 2, 3].map((item) => (
          <Box
            key={item}
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <Skeleton variant="text" width="50%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />

            {/* Options buttons */}
            {[1, 2, 3].map((btn) => (
              <Skeleton
                key={btn}
                variant="rounded"
                height={40}
                sx={{ mb: 1, borderRadius: "10px" }}
              />
            ))}
          </Box>
        ))}
      </Container>
    );
  }

  // Loading Contract (only when wallet is connected)
  if (wallet && !contract) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 20% 20%, #1e293b 0%, #0b1120 45%, #020617 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box textAlign="center">
          <CircularProgress sx={{ color: "#6366f1" }} />
          <Typography variant="h6" sx={{ mt: 3, color: "rgba(255,255,255,0.8)" }}>
            Loading Blockchain...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, #1e293b 0%, #0b1120 45%, #020617 100%)",
        color: "white",
      }}
    >
      <DashboardNavbar
        wallet={wallet}
        onConnect={connectWallet}
        isConnecting={isConnecting}
        onProfileClick={handleProfileClick}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleProfileClose}
        sx={{
          "& .MuiPaper-root": {
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            borderRadius: "15px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Connected Wallet
          </Typography>
          <Typography variant="body2" sx={{ color: "#fff", fontFamily: "monospace" }}>
            {wallet?.substring(0, 6)}...{wallet?.substring(wallet.length - 4)}
          </Typography>
        </Box>
        <MenuItem onClick={handleProfileSettings} sx={{ px: 3, py: 1.5 }}>
          <Typography variant="body2">⚙️ Profile Settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ px: 3, py: 1.5, color: "#ef4444" }}>
          <Typography variant="body2">🚪 Logout</Typography>
        </MenuItem>
      </Menu>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Show welcome section if wallet not connected */}
        {!wallet ? (
          <WelcomeSection onConnect={connectWallet} isConnecting={isConnecting} />
        ) : (
          <>
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                🎓 Welcome back, Student!
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
                Manage your votes and track poll results
              </Typography>
            </motion.div>

            {/* Connected wallet indicator */}
            <Chip
              label={`✅ Wallet Connected: ${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`}
              sx={{
                background: "rgba(20, 184, 166, 0.2)",
                color: "#14b8a6",
                fontWeight: 600,
                mb: 1.5,
              }}
            />

            {/* Section Content */}
            <Box sx={{ mt: 5 }}>
              <AnimatePresence mode="wait">
                {activeTab === "active-polls" && (
                  <motion.div
                    key="active-polls"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                      📊 Active Polls
                    </Typography>
                    <ActivePollsSection polls={polls} vote={vote} contract={contract} loading={loading} />
                  </motion.div>
                )}

                {activeTab === "my-votes" && (
                  <motion.div
                    key="my-votes"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                      🗳️ My Votes
                    </Typography>
                    <MyVotesSection voteHistory={voteHistory} wallet={wallet} />
                  </motion.div>
                )}

                {activeTab === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                      📈 Results
                    </Typography>
                    <ResultsSection loading={loading} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
