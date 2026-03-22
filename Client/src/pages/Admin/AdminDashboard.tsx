import { motion } from "framer-motion";
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Tabs,
    Tab,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Chip,
    IconButton,
    Avatar,
    LinearProgress,
    Divider,
} from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUser from "../../store/userStore";
import AnimatedCounter from "../../components/AnimatedCounter";
import {
    Edit,
    Delete,
    CheckCircle,
    Cancel,
    AccountBalanceWallet,
    Logout,
    Person,
    HowToVote,
    PollOutlined,
    TrendingUp,
    Group,
    AdminPanelSettings,
    School,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";


//    ANIMATED BACKGROUND

const AnimatedOrbs = () => (
    <>
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                animate={{
                    y: [0, -60, 0],
                    x: [0, 30, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.45, 0.2],
                }}
                transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                }}
                style={{
                    position: "fixed",
                    width: 260 + i * 50,
                    height: 260 + i * 50,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${i % 2 === 0
                        ? "rgba(99,102,241,0.2)"
                        : "rgba(20,184,166,0.2)"
                        }, transparent 70%)`,
                    top: `${(i * 17) % 100}%`,
                    left: `${(i * 23) % 100}%`,
                    filter: "blur(80px)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />
        ))}
    </>
);

const AnimatedGridLines = () => (
    <div
        style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `
        linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)
      `,
            backgroundSize: "50px 50px",
            pointerEvents: "none",
            zIndex: 0,
        }}
    />
);


// STYLES & CONSTANTS  

const COLORS = [
    "#6366f1",
    "#14b8a6",
    "#f59e0b",
    "#ef4444",
    "#a78bfa",
    "#0ea5e9",
];

const textFieldSx = {
    "& .MuiInputBase-input": { color: "#f0f0f0", fontSize: "0.95rem" },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
    "& .MuiOutlinedInput-root": {
        borderRadius: "14px",
        "& fieldset": { borderColor: "rgba(99,102,241,0.25)" },
        "&:hover fieldset": { borderColor: "rgba(99,102,241,0.5)" },
        "&.Mui-focused fieldset": { borderColor: "#6366f1" },
    },
};

const cardSx = {
    p: 3,
    borderRadius: "24px",
    background: "rgba(17,24,39,0.6)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.15)",
    position: "relative",
    overflow: "hidden",
};


// CUSTOM TOOLTIP

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <Box
                sx={{
                    background: "rgba(17,24,39,0.95)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: "12px",
                    p: 2,
                    color: "white",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
            >
                <Typography
                    sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.85rem" }}
                >
                    {label}
                </Typography>
                {payload.map((pld: any) => (
                    <Typography
                        key={pld.dataKey}
                        sx={{ color: pld.color, fontSize: "0.85rem" }}
                    >
                        {pld.name}: {pld.value}
                    </Typography>
                ))}
            </Box>
        );
    }
    return null;
};


// STAT CARD COMPONENT

const StatCard = ({
    icon,
    value,
    label,
    gradient,
    suffix = "",
    animated = true,
}: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.4 }}
    >
        <Paper elevation={0} sx={{ ...cardSx }}>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: gradient,
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: "2.4rem",
                            fontWeight: 900,
                            background: gradient,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            lineHeight: 1.1,
                        }}
                    >
                        {animated ? (
                            <AnimatedCounter
                                end={String(value)}
                                duration={1.5}
                            />
                        ) : (
                            value
                        )}
                        {suffix}
                    </Typography>
                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.6)",
                            fontWeight: 500,
                            mt: 0.5,
                        }}
                    >
                        {label}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: "16px",
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        color: "#818cf8",
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </Paper>
    </motion.div>
);

// ADMIN DASHBOARD

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [tab, setTab] = useState(0);
    const [chartsReady, setChartsReady] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    /* STATE */
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [regNo, setRegNo] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [editingUser, setEditingUser] = useState<any>(null);

    const [polls, setPolls] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState("");
    const [duration, setDuration] = useState(86400);
    const [timeLeftMap, setTimeLeftMap] = useState<Record<string, ReturnType<typeof getTimeLeft>>>({});

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


    /* ADMIN CHECK */
    if (!user || user.role !== "ADMIN") {
        navigate("/dashboard");
        return null;
    }

    /* WALLET CONNECT */
    const connectWallet = async () => {
        try {
            if (!(window as any).ethereum) {
                toast.error(
                    "MetaMask is not installed. Please install MetaMask to connect wallet."
                    , {
                        position: "top-center",
                    });
                return;
            }
            const accounts = await (window as any).ethereum.request({
                method: "eth_requestAccounts",
            });
            setWalletAddress(accounts[0]);
            toast.success("Wallet connected successfully", {
                position: "top-center",
            });
        } catch (e: any) {
            toast.error(e.message || "Failed to connect wallet", {
                position: "top-center",
            });
        }
    };

    /* FETCH DATA */

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get("/api/admin/users");
            setUsers(
                Array.isArray(res.data)
                    ? res.data
                    : res.data.users || res.data.data || []
            );
        } catch (e) {
            toast.error("Failed to load users", {
                position: "top-center",
            });
            setUsers([]);
        }
    };

    const fetchPolls = async () => {
        try {
            const res = await axiosInstance.get("/api/polls/results");

            const fetchedPolls: any[] = res.data?.data || res.data || [];

            // Match existing poll structure 
            const normalizedPolls = fetchedPolls.map((p: any) => ({
                id: p.pollId,
                title: p.title,
                description: p.description,
                status: p.status,
                deadline: p.deadline,
                results: p.results,
                totalVotes: p.totalVotes || 0,
            }));

            setPolls(normalizedPolls);

            // Initialize timeLeft map
            const initialTimeLeft: Record<string, ReturnType<typeof getTimeLeft>> = {};
            normalizedPolls.forEach((p) => {
                initialTimeLeft[p.id] = getTimeLeft(p.deadline);
            });
            setTimeLeftMap(initialTimeLeft);
        } catch (e) {
            toast.error("Failed to load polls", {
                position: "top-center",
            });
            setPolls([]);
        }
    };


    useEffect(() => {
        fetchUsers();
        fetchPolls();
        const timer = setTimeout(() => setChartsReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeftMap((_prev) => {
                const updated: Record<string, ReturnType<typeof getTimeLeft>> = {};
                polls.forEach((p) => {
                    updated[p.id] = getTimeLeft(p.deadline);
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [polls]);


    // USER MANAGEMENT

    const handleCreateUser = async () => {
        if (!firstName || !lastName || !regNo || !password) {
            toast.error("Please fill all fields", {
                position: "top-center",
            });
            return;
        }
        await axiosInstance.post("/api/admin/user", { firstName, lastName, regNo, password, role });
        toast.success("User created successfully", {
            position: "top-center",
        });
        setRegNo("");
        setFirstName("");
        setLastName("");
        setPassword("");
        fetchUsers();
    };

    const handleResetWalletUser = async (id: number) => {
        await axiosInstance.patch(`/api/admin/users/${id}/reset-wallet`);
        toast.success("Wallet reset successfully", {
            position: "top-center",
        });
        fetchUsers();
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        await axiosInstance.put(`/api/admin/user/${editingUser.id}`, {
            regNo: editingUser.regNo,
            firstName: editingUser.firstName,
            lastName: editingUser.lastName,
            role: editingUser.role,
        });
        toast.success("User updated successfully", {
            position: "top-center",
        });
        setEditingUser(null);
        fetchUsers();
    };

    const filteredUsers = users.filter((u) =>
        u.regNo?.toLowerCase().includes(search.toLowerCase())
    );

    // POLL MANAGEMENT

    const handleCreatePoll = async () => {
        if (!title || !options) {
            toast.error("Please fill all fields", {
                position: "top-center",
            });
            return;
        }
        await axiosInstance.post("/api/polls/create", {
            title,
            description,
            options: options.split(",").map((o) => o.trim()),
            duration,
        });
        toast.success("Poll created successfully", {
            position: "top-center",
        });
        setTitle("");
        setDescription("");
        setOptions("");
        fetchPolls();
    };

    // const handleApprove = async (id: number) => {
    //     await axiosInstance.post(`/api/polls/${id}/approve`);
    //     toast.success("Poll approved", {
    //         position: "top-center",
    //     });
    //     fetchPolls();
    // };

    // const handleReject = async (id: number) => {
    //     await axiosInstance.post(`/api/polls/${id}/reject`);
    //     toast.success("Poll rejected",{
    //         position: "top-center",
    //     });
    //     fetchPolls();
    // };

    // Handle Logout

    const handleLogout = () => {

        // Clear wallet in localStorage
        localStorage.removeItem("wallet");

        // Redirect to admin login page
        navigate("/admin");
    };

    // Analytics Calculations

    const totalUsers = users.length;
    const totalPolls = polls.length;
    const activePolls = polls.filter((p) => p.status === "ACTIVE").length;

    // Use totalVotes field from each poll
    const totalVotes = polls.reduce((acc, p) => acc + (p.totalVotes || 0), 0);

    const participationRate =
        totalUsers > 0
            ? ((totalVotes / totalUsers) * 100).toFixed(1)
            : "0";

    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const studentCount = users.filter((u) => u.role === "STUDENT").length;

    // Bar chart data
    const pollStats = polls.map((p) => ({
        name: p.title.length > 18 ? p.title.substring(0, 18) + "…" : p.title,
        votes: p.totalVotes || 0,
    }));

    // Pie chart: vote distribution
    const pieData = polls
        .filter((p) => (p.totalVotes || 0) > 0)
        .map((p) => ({
            name: p.title.length > 14 ? p.title.substring(0, 14) + "…" : p.title,
            value: p.totalVotes || 0,
        }));

    // Poll status breakdown
    const statusData = [{ name: "Active", value: activePolls }].filter(
        (d) => d.value > 0
    );

    // User role breakdown
    const userRoleData = [
        { name: "Students", value: studentCount },
        { name: "Admins", value: adminCount },
    ].filter((d) => d.value > 0);

    // Top polls by votes
    const topPolls = [...polls]
        .sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))
        .slice(0, 5);


    // UI

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at 20% 20%, #1e293b 0%, #0b1120 45%, #020617 100%)",
                color: "white",
                position: "relative",
                overflowX: "hidden",
                fontFamily: "'Inter', system-ui, sans-serif",
                pb: 6,
            }}
        >
            <AnimatedOrbs />
            <AnimatedGridLines />

            {/* Header */}
            <Container
                maxWidth="xl"
                sx={{ pt: 4, pb: 3, position: "relative", zIndex: 1 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant="h3"
                            fontWeight={900}
                            sx={{
                                background:
                                    "linear-gradient(135deg, #6366f1 0%, #14b8a6 50%, #a78bfa 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontSize: { xs: "1.8rem", md: "2.5rem" },
                            }}
                        >
                            🛠 Admin Governance Panel
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={connectWallet}
                                    variant="outlined"
                                    startIcon={<AccountBalanceWallet />}
                                    sx={{
                                        borderRadius: "50px",
                                        borderColor: "rgba(99,102,241,0.4)",
                                        color: "rgba(255,255,255,0.85)",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            borderColor: "#6366f1",
                                            background: "rgba(99,102,241,0.1)",
                                        },
                                    }}
                                >
                                    {walletAddress
                                        ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                                        : "Connect Wallet"}
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={() => navigate("/AdminProfile")}
                                    variant="outlined"
                                    startIcon={<Person />}
                                    sx={{
                                        borderRadius: "50px",
                                        borderColor: "rgba(99,102,241,0.4)",
                                        color: "rgba(255,255,255,0.85)",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            borderColor: "#6366f1",
                                            background: "rgba(99,102,241,0.1)",
                                        },
                                    }}
                                >
                                    Profile
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={handleLogout}
                                    variant="outlined"
                                    startIcon={<Logout />}
                                    sx={{
                                        borderRadius: "50px",
                                        borderColor: "rgba(248,113,113,0.4)",
                                        color: "#f87171",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            borderColor: "#f87171",
                                            background: "rgba(248,113,113,0.1)",
                                        },
                                    }}
                                >
                                    Logout
                                </Button>
                            </motion.div>
                        </Box>
                    </Box>

                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        sx={{
                            "& .MuiTab-root": {
                                color: "rgba(255,255,255,0.5)",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "1rem",
                            },
                            "& .MuiTab-root.Mui-selected": {
                                color: "#14b8a6",
                            },
                            "& .MuiTabs-indicator": {
                                background:
                                    "linear-gradient(90deg, #6366f1, #14b8a6)",
                            },
                        }}
                    >
                        <Tab label="📊 Analytics" />
                        <Tab label="🗳️ Poll Management" />
                        <Tab label="👥 User Management" />
                    </Tabs>
                </motion.div>
            </Container>


            {/* ANALYTICS TAB */}

            {tab === 0 && (
                <Container
                    maxWidth="xl"
                    sx={{ position: "relative", zIndex: 1 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Top KPI Cards */}
                        <Grid container spacing={3} mb={4}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard
                                    icon={<Group />}
                                    value={totalUsers}
                                    label="Total Users"
                                    gradient="linear-gradient(135deg, #6366f1, #14b8a6)"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard
                                    icon={<PollOutlined />}
                                    value={totalPolls}
                                    label="Total Polls"
                                    gradient="linear-gradient(135deg, #14b8a6, #0ea5e9)"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard
                                    icon={<HowToVote />}
                                    value={totalVotes}
                                    label="Total Votes Cast"
                                    gradient="linear-gradient(135deg, #a78bfa, #6366f1)"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard
                                    icon={<TrendingUp />}
                                    value={participationRate}
                                    label="Participation Rate"
                                    suffix="%"
                                    animated={false}
                                    gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
                                />
                            </Grid>
                        </Grid>

                        {/* Secondary KPI Cards */}
                        <Grid container spacing={3} mb={4}>
                            {[
                                {
                                    label: "Active Polls",
                                    value: activePolls,
                                    color: "#14b8a6",
                                    bg: "rgba(20,184,166,0.1)",
                                    border: "rgba(20,184,166,0.25)",
                                },
                                {
                                    label: "Admin Users",
                                    value: adminCount,
                                    color: "#818cf8",
                                    bg: "rgba(99,102,241,0.1)",
                                    border: "rgba(99,102,241,0.25)",
                                },
                                {
                                    label: "Student Users",
                                    value: studentCount,
                                    color: "#0ea5e9",
                                    bg: "rgba(14,165,233,0.1)",
                                    border: "rgba(14,165,233,0.25)",
                                },
                                {
                                    label: "Avg Votes/Poll",
                                    value:
                                        totalPolls > 0
                                            ? (totalVotes / totalPolls).toFixed(1)
                                            : "0",
                                    color: "#a78bfa",
                                    bg: "rgba(167,139,250,0.1)",
                                    border: "rgba(167,139,250,0.25)",
                                },
                            ].map((item, i) => (
                                <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ y: -3 }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                borderRadius: "20px",
                                                background: item.bg,
                                                border: `1px solid ${item.border}`,
                                                textAlign: "center",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: "1.8rem",
                                                    fontWeight: 900,
                                                    color: item.color,
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {item.value}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: "rgba(255,255,255,0.55)",
                                                    fontSize: "0.75rem",
                                                    mt: 0.5,
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Charts Row 1 */}
                        <Grid container spacing={3} mb={3}>
                            {/* Bar Chart */}
                            <Grid size={{ xs: 12, lg: 8 }}>
                                <Paper elevation={0} sx={cardSx}>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            background:
                                                "linear-gradient(90deg, #6366f1, #14b8a6)",
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        gutterBottom
                                        sx={{ color: "rgba(255,255,255,0.9)" }}
                                    >
                                        📈 Poll Participation Overview
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "rgba(255,255,255,0.4)",
                                            fontSize: "0.8rem",
                                            mb: 2,
                                        }}
                                    >
                                        Number of votes per poll
                                    </Typography>
                                    <Box sx={{ width: "100%", height: 300 }}>
                                        {chartsReady && (
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <BarChart
                                                    data={pollStats}
                                                    margin={{
                                                        top: 5,
                                                        right: 20,
                                                        left: 0,
                                                        bottom: 40,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        stroke="rgba(99,102,241,0.1)"
                                                        strokeDasharray="3 3"
                                                    />
                                                    <XAxis
                                                        dataKey="name"
                                                        tick={{
                                                            fill: "rgba(255,255,255,0.5)",
                                                            fontSize: 11,
                                                        }}
                                                        angle={-35}
                                                        textAnchor="end"
                                                        interval={0}
                                                    />
                                                    <YAxis
                                                        tick={{
                                                            fill: "rgba(255,255,255,0.5)",
                                                            fontSize: 11,
                                                        }}
                                                    />
                                                    <Tooltip
                                                        content={
                                                            <CustomTooltip />
                                                        }
                                                    />
                                                    <Legend
                                                        wrapperStyle={{
                                                            color: "rgba(255,255,255,0.6)",
                                                            fontSize: "0.8rem",
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="votes"
                                                        name="Votes"
                                                        fill="url(#barGradient)"
                                                        radius={[8, 8, 0, 0]}
                                                    />
                                                    <defs>
                                                        <linearGradient
                                                            id="barGradient"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor="#6366f1"
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor="#14b8a6"
                                                            />
                                                        </linearGradient>
                                                    </defs>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Vote Distribution Pie */}
                            <Grid size={{ xs: 12, lg: 4 }}>
                                <Paper
                                    elevation={0}
                                    sx={{ ...cardSx, height: "100%" }}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            background:
                                                "linear-gradient(90deg, #a78bfa, #6366f1)",
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        gutterBottom
                                        sx={{ color: "rgba(255,255,255,0.9)" }}
                                    >
                                        🗳️ Vote Distribution
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "rgba(255,255,255,0.4)",
                                            fontSize: "0.8rem",
                                            mb: 2,
                                        }}
                                    >
                                        Votes share by poll
                                    </Typography>
                                    <Box sx={{ width: "100%", height: 300 }}>
                                        {chartsReady && (
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={
                                                            pieData.length > 0
                                                                ? pieData
                                                                : [
                                                                    {
                                                                        name: "No data",
                                                                        value: 1,
                                                                    },
                                                                ]
                                                        }
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={90}
                                                        innerRadius={40}
                                                        paddingAngle={3}
                                                    >
                                                        {(pieData.length > 0
                                                            ? pieData
                                                            : [
                                                                {
                                                                    name: "No data",
                                                                    value: 1,
                                                                },
                                                            ]
                                                        ).map((_, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    pieData.length ===
                                                                        0
                                                                        ? "rgba(99,102,241,0.2)"
                                                                        : COLORS[
                                                                        index %
                                                                        COLORS.length
                                                                        ]
                                                                }
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        content={
                                                            <CustomTooltip />
                                                        }
                                                    />
                                                    <Legend
                                                        wrapperStyle={{
                                                            color: "rgba(255,255,255,0.6)",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Charts Row 2 */}
                        <Grid container spacing={3} mb={3}>
                            {/* Poll Status Pie */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper elevation={0} sx={cardSx}>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            background:
                                                "linear-gradient(90deg, #14b8a6, #0ea5e9)",
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        gutterBottom
                                        sx={{ color: "rgba(255,255,255,0.9)" }}
                                    >
                                        📋 Poll Status Breakdown
                                    </Typography>
                                    <Box sx={{ width: "100%", height: 260 }}>
                                        {chartsReady && (
                                            <ResponsiveContainer
                                                width="100%"
                                                height={260}
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={
                                                            statusData.length > 0
                                                                ? statusData
                                                                : [
                                                                    {
                                                                        name: "No polls",
                                                                        value: 1,
                                                                    },
                                                                ]
                                                        }
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={80}
                                                        paddingAngle={4}
                                                        label={({
                                                            name,
                                                            value,
                                                        }) =>
                                                            `${name}: ${value}`
                                                        }
                                                        labelLine={false}
                                                    >
                                                        {(statusData.length > 0
                                                            ? statusData
                                                            : [
                                                                {
                                                                    name: "No polls",
                                                                    value: 1,
                                                                },
                                                            ]
                                                        ).map((_, index) => (
                                                            <Cell
                                                                key={index}
                                                                fill={
                                                                    [
                                                                        "#14b8a6",
                                                                        "#ef4444",
                                                                        "#f59e0b",
                                                                    ][index % 3]
                                                                }
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        content={
                                                            <CustomTooltip />
                                                        }
                                                    />
                                                    <Legend
                                                        wrapperStyle={{
                                                            color: "rgba(255,255,255,0.6)",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* User Role Pie */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper elevation={0} sx={cardSx}>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            background:
                                                "linear-gradient(90deg, #f59e0b, #ef4444)",
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        gutterBottom
                                        sx={{ color: "rgba(255,255,255,0.9)" }}
                                    >
                                        👤 User Role Distribution
                                    </Typography>
                                    <Box sx={{ width: "100%", height: 260 }}>
                                        {chartsReady && (
                                            <ResponsiveContainer
                                                width="100%"
                                                height={260}
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={
                                                            userRoleData.length > 0
                                                                ? userRoleData
                                                                : [
                                                                    {
                                                                        name: "No users",
                                                                        value: 1,
                                                                    },
                                                                ]
                                                        }
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={80}
                                                        paddingAngle={4}
                                                        label={({
                                                            name,
                                                            value,
                                                        }) =>
                                                            `${name}: ${value}`
                                                        }
                                                        labelLine={false}
                                                    >
                                                        {(userRoleData.length > 0
                                                            ? userRoleData
                                                            : [
                                                                {
                                                                    name: "No users",
                                                                    value: 1,
                                                                },
                                                            ]
                                                        ).map((_, index) => (
                                                            <Cell
                                                                key={index}
                                                                fill={
                                                                    [
                                                                        "#818cf8",
                                                                        "#0ea5e9",
                                                                    ][index % 2]
                                                                }
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        content={
                                                            <CustomTooltip />
                                                        }
                                                    />
                                                    <Legend
                                                        wrapperStyle={{
                                                            color: "rgba(255,255,255,0.6)",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Top Polls */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper
                                    elevation={0}
                                    sx={{ ...cardSx, height: "100%" }}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            background:
                                                "linear-gradient(90deg, #a78bfa, #f59e0b)",
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        gutterBottom
                                        sx={{ color: "rgba(255,255,255,0.9)" }}
                                    >
                                        🏆 Top Polls by Votes
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {topPolls.length === 0 ? (
                                            <Typography
                                                sx={{
                                                    color: "rgba(255,255,255,0.3)",
                                                    textAlign: "center",
                                                    mt: 4,
                                                }}
                                            >
                                                No polls yet
                                            </Typography>
                                        ) : (
                                            topPolls.map((poll, i) => (
                                                <Box
                                                    key={poll.id}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: "rgba(255,255,255,0.8)",
                                                                fontSize:
                                                                    "0.82rem",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {i + 1}.{" "}
                                                            {poll.title.length > 30
                                                                ? poll.title.substring(
                                                                    0,
                                                                    22
                                                                ) + "…"
                                                                : poll.title}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                color: COLORS[
                                                                    i %
                                                                    COLORS.length
                                                                ],
                                                                fontWeight: 700,
                                                                fontSize:
                                                                    "0.82rem",
                                                            }}
                                                        >
                                                            {poll.totalVotes || 0}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={
                                                            totalVotes > 0
                                                                ? ((poll.totalVotes ||
                                                                    0) /
                                                                    totalVotes) *
                                                                100
                                                                : 0
                                                        }
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 3,
                                                            background:
                                                                "rgba(255,255,255,0.08)",
                                                            "& .MuiLinearProgress-bar":
                                                            {
                                                                background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                                                                borderRadius: 3,
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            ))
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Container>
            )}


            {/* POLL MANAGEMENT TAB */}

            {tab === 1 && (
                <Container
                    maxWidth="xl"
                    sx={{ position: "relative", zIndex: 1 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Paper elevation={0} sx={cardSx}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3,
                                    background:
                                        "linear-gradient(90deg, #6366f1, #14b8a6)",
                                }}
                            />

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                gutterBottom
                                sx={{
                                    background:
                                        "linear-gradient(90deg, #6366f1, #14b8a6)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 3,
                                }}
                            >
                                🗳️ Create New Poll
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "1fr 1fr",
                                    },
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <TextField
                                    label="Poll Title"
                                    fullWidth
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    sx={textFieldSx}
                                />
                                <TextField
                                    label="Duration (seconds)"
                                    type="number"
                                    fullWidth
                                    value={duration}
                                    onChange={(e) =>
                                        setDuration(Number(e.target.value))
                                    }
                                    sx={textFieldSx}
                                    helperText={`≈ ${(duration / 3600).toFixed(1)} hours`}
                                    FormHelperTextProps={{
                                        sx: {
                                            color: "rgba(255,255,255,0.35)",
                                        },
                                    }}
                                />
                            </Box>

                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide context or instructions for voters..."
                                sx={{ ...textFieldSx, mb: 2 }}
                            />

                            <TextField
                                label="Options (comma separated)"
                                fullWidth
                                value={options}
                                onChange={(e) => setOptions(e.target.value)}
                                placeholder="e.g. Option A, Option B, Option C"
                                sx={{ ...textFieldSx, mb: 3 }}
                                helperText={
                                    options
                                        ? `Preview: ${options
                                            .split(",")
                                            .map((o) => o.trim())
                                            .filter(Boolean)
                                            .map((o, i) => `${i + 1}. ${o}`)
                                            .join("  •  ")}`
                                        : "Enter options separated by commas"
                                }
                                FormHelperTextProps={{
                                    sx: { color: "rgba(255,255,255,0.35)" },
                                }}
                            />

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleCreatePoll}
                                    disabled={!title || !options}
                                    sx={{
                                        background:
                                            "linear-gradient(135deg, #6366f1, #14b8a6)",
                                        borderRadius: "50px",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        py: 1.5,
                                        boxShadow:
                                            "0 0 40px rgba(99,102,241,0.3)",
                                    }}
                                >
                                    🗳️ Create New Poll
                                </Button>
                            </motion.div>

                            <Divider
                                sx={{
                                    my: 4,
                                    borderColor: "rgba(99,102,241,0.15)",
                                }}
                            />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                gutterBottom
                                sx={{
                                    color: "rgba(255,255,255,0.85)",
                                    mb: 2,
                                }}
                            >
                                All Polls ({polls.length})
                            </Typography>

                            <Box sx={{ overflowX: "auto" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Title
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Description
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Status
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Deadline
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Votes
                                            </TableCell>
                                            {/* <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Actions
                                            </TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {polls.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    sx={{
                                                        textAlign: "center",
                                                        color: "rgba(255,255,255,0.3)",
                                                        py: 4,
                                                    }}
                                                >
                                                    No polls found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            polls.map((poll) => (
                                                <TableRow
                                                    key={poll.id}
                                                    sx={{
                                                        "&:hover": {
                                                            background:
                                                                "rgba(99,102,241,0.05)",
                                                        },
                                                    }}
                                                >
                                                    <TableCell
                                                        sx={{
                                                            color: "rgba(255,255,255,0.85)",
                                                            fontWeight: 600,
                                                            maxWidth: 200,
                                                        }}
                                                    >
                                                        {poll.title}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            color: "rgba(255,255,255,0.5)",
                                                            fontSize: "0.82rem",
                                                            maxWidth: 220,
                                                        }}
                                                    >
                                                        {poll.description
                                                            ? poll.description
                                                                .length > 60
                                                                ? poll.description.substring(
                                                                    0,
                                                                    60
                                                                ) + "…"
                                                                : poll.description
                                                            : "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={poll.status}
                                                            size="small"
                                                            sx={{
                                                                background:
                                                                    poll.status ===
                                                                        "ACTIVE"
                                                                        ? "rgba(20,184,166,0.2)"
                                                                        : poll.status ===
                                                                            "PENDING"
                                                                            ? "rgba(245,158,11,0.2)"
                                                                            : "rgba(239,68,68,0.15)",
                                                                color:
                                                                    poll.status ===
                                                                        "ACTIVE"
                                                                        ? "#14b8a6"
                                                                        : poll.status ===
                                                                            "PENDING"
                                                                            ? "#f59e0b"
                                                                            : "#f87171",
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={
                                                                timeLeftMap[poll.id]
                                                                    ? `${timeLeftMap[poll.id]?.hours}h ${timeLeftMap[poll.id]?.minutes}m ${timeLeftMap[poll.id]?.seconds}s`
                                                                    : "Ended"
                                                            }
                                                            size="small"
                                                            sx={{
                                                                background:
                                                                    (poll.deadline ||
                                                                        0) > 0
                                                                        ? "rgba(20,184,166,0.15)"
                                                                        : "rgba(255,255,255,0.05)",
                                                                color:
                                                                    (poll.deadline ||
                                                                        0) > 0
                                                                        ? "#14b8a6"
                                                                        : "rgba(255,255,255,0.3)",
                                                                fontWeight: 600,
                                                                fontSize:
                                                                    "0.78rem",
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            color: "rgba(255,255,255,0.6)",
                                                        }}
                                                    >
                                                        <Chip
                                                            label={`${poll.totalVotes || 0} votes`}
                                                            size="small"
                                                            sx={{
                                                                background:
                                                                    (poll.totalVotes ||
                                                                        0) > 0
                                                                        ? "rgba(20,184,166,0.15)"
                                                                        : "rgba(255,255,255,0.05)",
                                                                color:
                                                                    (poll.totalVotes ||
                                                                        0) > 0
                                                                        ? "#14b8a6"
                                                                        : "rgba(255,255,255,0.3)",
                                                                fontWeight: 600,
                                                                fontSize:
                                                                    "0.78rem",
                                                            }}
                                                        />
                                                    </TableCell>
                                                    {/* <TableCell>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            {poll.status ===
                                                                "PENDING" && (
                                                                    <>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() =>
                                                                                handleApprove(
                                                                                    poll.id
                                                                                )
                                                                            }
                                                                            sx={{
                                                                                color: "#14b8a6",
                                                                            }}
                                                                            title="Approve"
                                                                        >
                                                                            <CheckCircle />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() =>
                                                                                handleReject(
                                                                                    poll.id
                                                                                )
                                                                            }
                                                                            sx={{
                                                                                color: "#f87171",
                                                                            }}
                                                                            title="Reject"
                                                                        >
                                                                            <Cancel />
                                                                        </IconButton>
                                                                    </>
                                                                )}
                                                        </Box>
                                                    </TableCell> */}
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Paper>
                    </motion.div>
                </Container>
            )}

            {/* USER MANAGEMENT TAB  */}
            {tab === 2 && (
                <Container
                    maxWidth="xl"
                    sx={{ position: "relative", zIndex: 1 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Paper elevation={0} sx={cardSx}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3,
                                    background:
                                        "linear-gradient(90deg, #6366f1, #14b8a6)",
                                }}
                            />

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                gutterBottom
                                sx={{
                                    background:
                                        "linear-gradient(90deg, #6366f1, #14b8a6)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 3,
                                }}
                            >
                                👥 Create New User
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "1fr 1fr 1fr",
                                    },
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <TextField
                                    label="FirstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    sx={textFieldSx}
                                />
                                <TextField
                                    label="LastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    sx={textFieldSx}
                                />
                                <TextField
                                    label="RegNo"
                                    value={regNo}
                                    onChange={(e) => setRegNo(e.target.value)}
                                    sx={textFieldSx}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    sx={textFieldSx}
                                />
                                <FormControl fullWidth>
                                    <InputLabel
                                        sx={{ color: "rgba(255,255,255,0.5)" }}
                                    >
                                        Role
                                    </InputLabel>
                                    <Select
                                        value={role}
                                        label="Role"
                                        onChange={(e) =>
                                            setRole(e.target.value)
                                        }
                                        sx={{
                                            borderRadius: "14px",
                                            "& .MuiSelect-select": {
                                                color: "#f0f0f0",
                                            },
                                            "& .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "rgba(99,102,241,0.25)",
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "rgba(99,102,241,0.5)",
                                            },
                                        }}
                                    >
                                        <MenuItem value="STUDENT">
                                            Student
                                        </MenuItem>
                                        <MenuItem value="ADMIN">Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleCreateUser}
                                    disabled={!firstName || !lastName || !regNo || !password}
                                    sx={{
                                        background:
                                            "linear-gradient(135deg, #6366f1, #14b8a6)",
                                        borderRadius: "50px",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        py: 1.5,
                                    }}
                                >
                                    ➕ Create New User
                                </Button>
                            </motion.div>

                            <Divider
                                sx={{
                                    my: 4,
                                    borderColor: "rgba(99,102,241,0.15)",
                                }}
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2,
                                    flexWrap: "wrap",
                                    gap: 2,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{ color: "rgba(255,255,255,0.85)" }}
                                >
                                    All Users ({users.length})
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Chip
                                        icon={<School sx={{ fontSize: 14 }} />}
                                        label={`${studentCount} Students`}
                                        size="small"
                                        sx={{
                                            background:
                                                "rgba(14,165,233,0.15)",
                                            color: "#0ea5e9",
                                            border: "1px solid rgba(14,165,233,0.3)",
                                        }}
                                    />
                                    <Chip
                                        icon={
                                            <AdminPanelSettings
                                                sx={{ fontSize: 14 }}
                                            />
                                        }
                                        label={`${adminCount} Admins`}
                                        size="small"
                                        sx={{
                                            background:
                                                "rgba(99,102,241,0.15)",
                                            color: "#818cf8",
                                            border: "1px solid rgba(99,102,241,0.3)",
                                        }}
                                    />
                                </Box>
                            </Box>

                            <TextField
                                label="🔍 Search by RegNo"
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ ...textFieldSx, mb: 3 }}
                                placeholder="Type to filter users..."
                            />

                            <Box sx={{ overflowX: "auto" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                #
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Avatar
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                First Name
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Last Name
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                RegNo
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Role
                                            </TableCell>


                                            <TableCell
                                                sx={{
                                                    color: "#818cf8",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    sx={{
                                                        textAlign: "center",
                                                        color: "rgba(255,255,255,0.3)",
                                                        py: 4,
                                                    }}
                                                >
                                                    {search
                                                        ? `No users matching "${search}"`
                                                        : "No users found"}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((u, index) => (
                                                <TableRow
                                                    key={u.id}
                                                    sx={{
                                                        "&:hover": {
                                                            background:
                                                                "rgba(99,102,241,0.05)",
                                                        },
                                                        transition:
                                                            "background 0.2s",
                                                    }}
                                                >
                                                    <TableCell
                                                        sx={{
                                                            color: "rgba(255,255,255,0.35)",
                                                            fontSize: "0.8rem",
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Avatar
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                background:
                                                                    u.role ===
                                                                        "ADMIN"
                                                                        ? "linear-gradient(135deg, #6366f1, #a78bfa)"
                                                                        : "linear-gradient(135deg, #14b8a6, #0ea5e9)",
                                                                fontSize:
                                                                    "0.85rem",
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {u.regNo
                                                                ? u.regNo
                                                                    .substring(
                                                                        0,
                                                                        2
                                                                    )
                                                                    .toUpperCase()
                                                                : "?"}
                                                        </Avatar>
                                                    </TableCell>

                                                    <TableCell
                                                        sx={{
                                                            color: "rgba(255,255,255,0.85)",
                                                        }}
                                                    >
                                                        {editingUser?.id ===
                                                            u.id ? (
                                                            <TextField
                                                                value={
                                                                    editingUser.firstName
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingUser(
                                                                        {
                                                                            ...editingUser,
                                                                            firstName: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                size="small"
                                                                sx={textFieldSx}
                                                            />
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    fontSize:
                                                                        "0.9rem",
                                                                }}
                                                            >
                                                                {u.firstName}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            color: "rgba(255,255,255,0.85)",
                                                        }}
                                                    >
                                                        {editingUser?.id ===
                                                            u.id ? (
                                                            <TextField
                                                                value={
                                                                    editingUser.lastName
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingUser(
                                                                        {
                                                                            ...editingUser,
                                                                            lastName: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                size="small"
                                                                sx={textFieldSx}
                                                            />
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    fontSize:
                                                                        "0.9rem",
                                                                }}
                                                            >
                                                                {u.lastName}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            color: "rgba(255,255,255,0.85)",
                                                        }}
                                                    >
                                                        {editingUser?.id ===
                                                            u.id ? (
                                                            <TextField
                                                                value={
                                                                    editingUser.regNo
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingUser(
                                                                        {
                                                                            ...editingUser,
                                                                            regNo: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                size="small"
                                                                sx={textFieldSx}
                                                            />
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    fontSize:
                                                                        "0.9rem",
                                                                }}
                                                            >
                                                                {u.regNo}
                                                            </Typography>
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {editingUser?.id ===
                                                            u.id ? (
                                                            <Select
                                                                value={
                                                                    editingUser.role
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingUser(
                                                                        {
                                                                            ...editingUser,
                                                                            role: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    color: "#f0f0f0",
                                                                    borderRadius:
                                                                        "10px",
                                                                    "& .MuiOutlinedInput-notchedOutline":
                                                                    {
                                                                        borderColor:
                                                                            "rgba(99,102,241,0.3)",
                                                                    },
                                                                }}
                                                            >
                                                                <MenuItem value="STUDENT">
                                                                    STUDENT
                                                                </MenuItem>
                                                                <MenuItem value="ADMIN">
                                                                    ADMIN
                                                                </MenuItem>
                                                            </Select>
                                                        ) : (
                                                            <Chip
                                                                label={u.role}
                                                                size="small"
                                                                icon={
                                                                    u.role ===
                                                                        "ADMIN" ? (
                                                                        <AdminPanelSettings
                                                                            sx={{
                                                                                fontSize:
                                                                                    "14px !important",
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <School
                                                                            sx={{
                                                                                fontSize:
                                                                                    "14px !important",
                                                                            }}
                                                                        />
                                                                    )
                                                                }
                                                                sx={{
                                                                    background:
                                                                        u.role ===
                                                                            "ADMIN"
                                                                            ? "rgba(99,102,241,0.2)"
                                                                            : "rgba(20,184,166,0.2)",
                                                                    color:
                                                                        u.role ===
                                                                            "ADMIN"
                                                                            ? "#818cf8"
                                                                            : "#14b8a6",
                                                                    fontWeight: 600,
                                                                    border:
                                                                        u.role ===
                                                                            "ADMIN"
                                                                            ? "1px solid rgba(99,102,241,0.3)"
                                                                            : "1px solid rgba(20,184,166,0.3)",
                                                                }}
                                                            />
                                                        )}
                                                    </TableCell>




                                                    <TableCell>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            {editingUser?.id ===
                                                                u.id ? (
                                                                <>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={
                                                                            handleUpdateUser
                                                                        }
                                                                        sx={{
                                                                            color: "#14b8a6",
                                                                        }}
                                                                        title="Save"
                                                                    >
                                                                        <CheckCircle />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() =>
                                                                            setEditingUser(
                                                                                null
                                                                            )
                                                                        }
                                                                        sx={{
                                                                            color: "rgba(255,255,255,0.4)",
                                                                        }}
                                                                        title="Cancel"
                                                                    >
                                                                        <Cancel />
                                                                    </IconButton>
                                                                </>
                                                            ) : (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        setEditingUser(
                                                                            u
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        color: "#f59e0b",
                                                                    }}
                                                                    title="Edit"
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            )}
                                                            <IconButton
                                                                size="small"
                                                                onClick={() =>
                                                                    handleResetWalletUser(
                                                                        u.id
                                                                    )
                                                                }
                                                                sx={{
                                                                    color: "#f87171",
                                                                }}
                                                                title="Delete"
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>

                            {filteredUsers.length > 0 && (
                                <Typography
                                    sx={{
                                        color: "rgba(255,255,255,0.3)",
                                        fontSize: "0.8rem",
                                        mt: 2,
                                        textAlign: "right",
                                    }}
                                >
                                    Showing {filteredUsers.length} of{" "}
                                    {users.length} users
                                </Typography>
                            )}
                        </Paper>
                    </motion.div>
                </Container>
            )}
        </Box>
    );
}