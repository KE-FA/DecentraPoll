import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import {
  HowToVote,
  CheckCircle,
  PendingActions,
  TrendingUp,
} from "@mui/icons-material";

const MotionPaper = motion.create(Paper);
const MotionBox = motion.create(Box);

interface Poll {
  id: number;
  title: string;
  category: string;
  status: "active" | "completed";
  endDate: string;
  totalVotes: number;
  hasVoted: boolean;
  options: { label: string; votes: number; percentage: number }[];
}

// Mock data - replace with actual API calls
const mockPolls: Poll[] = [
  {
    id: 1,
    title: "Should the library hours be extended to 24/7?",
    category: "Campus Facilities",
    status: "active",
    endDate: "2024-12-31",
    totalVotes: 1247,
    hasVoted: false,
    options: [
      { label: "Yes, extend to 24/7", votes: 856, percentage: 68.6 },
      { label: "No, keep current hours", votes: 391, percentage: 31.4 },
    ],
  },
  {
    id: 2,
    title: "Preferred time for club meetings?",
    category: "Student Activities",
    status: "active",
    endDate: "2024-12-28",
    totalVotes: 892,
    hasVoted: true,
    options: [
      { label: "Weekday Evenings", votes: 445, percentage: 49.9 },
      { label: "Weekend Mornings", votes: 267, percentage: 29.9 },
      { label: "Weekend Afternoons", votes: 180, percentage: 20.2 },
    ],
  },
  {
    id: 3,
    title: "New cafeteria menu options?",
    category: "Dining Services",
    status: "active",
    endDate: "2024-12-30",
    totalVotes: 2103,
    hasVoted: false,
    options: [
      { label: "More vegetarian options", votes: 945, percentage: 44.9 },
      { label: "International cuisine", votes: 672, percentage: 32.0 },
      { label: "Healthy meal plans", votes: 486, percentage: 23.1 },
    ],
  },
  {
    id: 4,
    title: "Should we have more outdoor study spaces?",
    category: "Campus Facilities",
    status: "completed",
    endDate: "2024-12-15",
    totalVotes: 1567,
    hasVoted: true,
    options: [
      { label: "Yes, definitely needed", votes: 1254, percentage: 80.0 },
      { label: "No, current spaces sufficient", votes: 313, percentage: 20.0 },
    ],
  },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [regno, setRegno] = useState("");
  const [polls] = useState<Poll[]>(mockPolls);

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem("isAuthenticated");
    const userRegno = localStorage.getItem("userRegno");

    if (!isAuth) {
      navigate("/login");
      return;
    }

    if (userRegno) {
      setRegno(userRegno);
    }
  }, [navigate]);

  const stats = [
    {
      icon: <HowToVote sx={{ fontSize: 40 }} />,
      value: polls.length.toString(),
      label: "Active Polls",
      color: "#6366f1",
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      value: polls.filter((p) => p.hasVoted).length.toString(),
      label: "Votes Cast",
      color: "#14b8a6",
    },
    {
      icon: <PendingActions sx={{ fontSize: 40 }} />,
      value: polls.filter((p) => !p.hasVoted && p.status === "active").length.toString(),
      label: "Pending",
      color: "#f59e0b",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      value: "85%",
      label: "Participation Rate",
      color: "#10b981",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, #1e293b 0%, #0b1120 45%, #020617 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <DashboardNavbar />

      {/* Animated Background */}
      <AnimatedOrbs />

      <Container maxWidth="xl" sx={{ pt: 12, pb: 8 }}>
        {/* Welcome Section */}
        <MotionBox
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          sx={{ mb: 6 }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Welcome back, {regno}! 👋
          </Typography>
          <Typography sx={{ opacity: 0.7, fontSize: "1.1rem" }}>
            Participate in campus polls and make your voice heard
          </Typography>
        </MotionBox>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 6,
          }}
        >
          {stats.map((stat, i) => (
            <MotionPaper
              key={i}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              sx={{
                p: 3,
                borderRadius: "20px",
                background: "rgba(17, 24, 39, 0.6)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${stat.color}40`,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <Box sx={{ color: stat.color, mb: 2 }}>{stat.icon}</Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography sx={{ opacity: 0.7 }}>{stat.label}</Typography>
            </MotionPaper>
          ))}
        </Box>

        {/* Polls Section */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          📊 Available Polls
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {polls.map((poll, i) => (
            <MotionPaper
              key={poll.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              sx={{
                p: 4,
                borderRadius: "25px",
                background: "rgba(17, 24, 39, 0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              {/* Poll Header */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 2 }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {poll.title}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={poll.category}
                      size="small"
                      sx={{
                        background: "rgba(99, 102, 241, 0.2)",
                        color: "#6366f1",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                      }}
                    />
                    <Chip
                      label={poll.status === "active" ? "Active" : "Ended"}
                      size="small"
                      sx={{
                        background:
                          poll.status === "active"
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(107, 114, 128, 0.2)",
                        color: poll.status === "active" ? "#10b981" : "#6b7280",
                        border: `1px solid ${
                          poll.status === "active"
                            ? "rgba(16, 185, 129, 0.3)"
                            : "rgba(107, 114, 128, 0.3)"
                        }`,
                      }}
                    />
                    {poll.hasVoted && (
                      <Chip
                        label="✓ Voted"
                        size="small"
                        sx={{
                          background: "rgba(20, 184, 166, 0.2)",
                          color: "#14b8a6",
                          border: "1px solid rgba(20, 184, 166, 0.3)",
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>

              {/* Poll Options */}
              <Box sx={{ mb: 3 }}>
                {poll.options.map((option, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {option.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ color: "#6366f1" }}
                      >
                        {option.percentage}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={option.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        background: "rgba(99, 102, 241, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Poll Footer */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                  {poll.totalVotes} votes · Ends {poll.endDate}
                </Typography>
                {!poll.hasVoted && poll.status === "active" && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: "12px",
                      px: 3,
                      background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                      fontWeight: "bold",
                      "&:hover": {
                        boxShadow: "0 0 20px rgba(99,102,241,0.6)",
                      },
                    }}
                  >
                    Vote Now
                  </Button>
                )}
              </Stack>
            </MotionPaper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

// Animated Background Orbs
const AnimatedOrbs = () => (
  <>
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            i % 2 === 0
              ? "radial-gradient(circle, rgba(99,102,241,0.2), transparent)"
              : "radial-gradient(circle, rgba(20,184,166,0.2), transparent)",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    ))}
  </>
);

export default StudentDashboard;
