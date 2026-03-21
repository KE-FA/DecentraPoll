import { motion } from "framer-motion";
import {
    Box,
    Typography,
    Stack,
    TextField,
    Button,
    Paper,
    Grid,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUser from "../../store/userStore";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface PasswordDetails {
    currentPassword: string;
    newPassword: string;
}

/* Animated background elements */
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
                    background: `radial-gradient(circle, ${i % 2 === 0 ? "rgba(99,102,241,0.2)" : "rgba(20,184,166,0.2)"
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

function Profile() {
    const { user, logoutUser } = useUser();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    /* Password mutation */
    const updatePasswordMutation = useMutation({
        mutationKey: ["update-password"],
        mutationFn: async (details: PasswordDetails) => {
            const res = await axiosInstance.patch("/api/auth/password", details);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Password updated", {
                    position: "top-center",
                    style: {
                        background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                        color: "#fff",
                        fontWeight: 600,
                    },
                });
                setCurrentPassword("");
                setNewPassword("");
                setPasswordError("");
            } else {
                setPasswordError("Current password is incorrect");
            }
        },
        onError: () => {
            setPasswordError("Something went wrong updating the password");
        },
    });

    function handleUpdatePassword() {
        if (currentPassword.trim() === "" || newPassword.trim() === "") {
            setPasswordError("Please fill in both password fields");
            return;
        }
        updatePasswordMutation.mutate({ currentPassword, newPassword });
    }

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at 20% 20%, #1e293b 0%, #0b1120 45%, #020617 100%)",
                color: "white",
                position: "relative",
                overflowX: "hidden",
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >
            <AnimatedOrbs />
            <AnimatedGridLines />

            {/* Back Icon */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                style={{ position: "absolute", top: 25, left: 24, zIndex: 2, cursor: "pointer" }}
                onClick={() => navigate(-1)}
            >
                <motion.span
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        fontSize: "1.8rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                        display: "inline-block",
                        lineHeight: 1,
                    }}
                >
                    ←
                </motion.span>
            </motion.div>

            <Box
                component="section"
                px={{ xs: 2, md: 4 }}
                py={8}
                mt={2}
                mb={5}
                maxWidth="md"
                mx="auto"
                sx={{ position: "relative", zIndex: 1 }}
            >
                {/* Page title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h3"
                        fontWeight={900}
                        gutterBottom
                        textAlign="center"
                        sx={{
                            background: "linear-gradient(135deg, #6366f1 0%, #14b8a6 50%, #a78bfa 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1,
                        }}
                    >
                        My Profile
                    </Typography>
                    <Typography
                        textAlign="center"
                        sx={{ color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", mb: 6 }}
                    >
                        Manage your account settings
                    </Typography>
                </motion.div>

                <Grid container spacing={4} justifyContent="center">
                    <Grid size={{ xs: 12, md: 10, lg: 8 }}>
                        <Stack spacing={4}>
                            {/* User Info Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.8 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        borderRadius: "24px",
                                        background: "rgba(17,24,39,0.6)",
                                        backdropFilter: "blur(20px)",
                                        border: "1px solid rgba(99,102,241,0.15)",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                                        }}
                                    />

                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        fontWeight={700}
                                        sx={{
                                            background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            textAlign: "center",
                                            mb: 3,
                                        }}
                                    >
                                        Account Information
                                    </Typography>

                                    <Stack spacing={2}>
                                        {/* Name */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                p: 2.5,
                                                borderRadius: "16px",
                                                background: "rgba(15,23,42,0.7)",
                                                border: "1px solid rgba(99,102,241,0.1)",
                                            }}
                                        >
                                            <span style={{ fontSize: "1.4rem" }}>👤</span>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        color: "rgba(255,255,255,0.4)",
                                                        fontWeight: 600,
                                                        letterSpacing: "0.08em",
                                                        textTransform: "uppercase",
                                                    }}
                                                >
                                                    Full Name
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: "rgba(255,255,255,0.85)",
                                                        fontWeight: 600,
                                                        fontSize: "1rem",
                                                    }}
                                                >
                                                    {((user as any).firstName && (user as any).lastName)
                                                        ? `${(user as any).firstName} ${(user as any).lastName}`

                                                        : "—"}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Registration Number */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                p: 2.5,
                                                borderRadius: "16px",
                                                background: "rgba(15,23,42,0.7)",
                                                border: "1px solid rgba(99,102,241,0.1)",
                                            }}
                                        >
                                            <span style={{ fontSize: "1.4rem" }}>🎓</span>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        color: "rgba(255,255,255,0.4)",
                                                        fontWeight: 600,
                                                        letterSpacing: "0.08em",
                                                        textTransform: "uppercase",
                                                    }}
                                                >
                                                    Registration Number
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: "rgba(255,255,255,0.85)",
                                                        fontWeight: 600,
                                                        fontSize: "1rem",
                                                    }}
                                                >
                                                    {(user as any).regNo || "—"}
                                                </Typography>
                                            </Box>
                                        </Box>

                                    </Stack>
                                </Paper>
                            </motion.div>

                            {/* Change Password Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        borderRadius: "24px",
                                        background: "rgba(17,24,39,0.6)",
                                        backdropFilter: "blur(20px)",
                                        border: "1px solid rgba(99,102,241,0.15)",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                                        }}
                                    />

                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        fontWeight={700}
                                        sx={{
                                            background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            textAlign: "center",
                                            mb: 3,
                                        }}
                                    >
                                        🔐 Change Password
                                    </Typography>

                                    <Stack spacing={2.5}>
                                        <TextField
                                            label="Current Password"
                                            variant="outlined"
                                            type={showPassword ? "text" : "password"}
                                            fullWidth
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            sx={textFieldSx}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            sx={{ color: "rgba(255,255,255,0.5)" }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <TextField
                                            label="New Password"
                                            variant="outlined"
                                            type={showPassword ? "text" : "password"}
                                            fullWidth
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            sx={textFieldSx}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            sx={{ color: "rgba(255,255,255,0.5)" }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        {passwordError && (
                                            <Typography
                                                sx={{
                                                    color: "#f87171",
                                                    fontSize: "0.9rem",
                                                    fontWeight: 500,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {passwordError}
                                            </Typography>
                                        )}

                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Button
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                onClick={handleUpdatePassword}
                                                disabled={updatePasswordMutation.isPending}
                                                sx={{
                                                    background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                                                    borderRadius: "50px",
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    fontSize: "1rem",
                                                    py: 1.5,
                                                    boxShadow:
                                                        "0 0 40px rgba(99,102,241,0.3), 0 8px 24px rgba(0,0,0,0.3)",
                                                    "&:hover": {
                                                        background: "linear-gradient(135deg, #4f46e5, #0d9488)",
                                                    },
                                                }}
                                            >
                                                {updatePasswordMutation.isPending
                                                    ? "Updating…"
                                                    : "Update Password"}
                                            </Button>
                                        </motion.div>
                                    </Stack>
                                </Paper>
                            </motion.div>

                            {/* Logout */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.8 }}
                                style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
                            >
                                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                                    <Button
                                        onClick={logoutUser}
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderRadius: "50px",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            px: 5,
                                            py: 1.5,
                                            fontSize: "1rem",
                                            borderColor: "rgba(248,113,113,0.5)",
                                            color: "#f87171",
                                            "&:hover": {
                                                borderColor: "#f87171",
                                                background: "rgba(248,113,113,0.08)",
                                            },
                                        }}
                                    >
                                        Log Out
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default Profile;