import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Stack,
  Alert,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import useUser from "../store/userStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, School, Lock } from "@mui/icons-material";

import axios from "axios";

interface LoginDetails {
  regNo: string;
  password: string;
}

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

const Login: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  const { mutate: login, isPending } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (loginDetails: LoginDetails) => {
      const response = await axiosInstance.post(
        "/api/auth/login",
        loginDetails,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.role === "STUDENT") {
        setUser(data);

        toast("Login successfully", {
          position: "top-center",
          style: {
            backgroundColor: "#4caf50",
            color: "#fff",
          },
        });

        navigate("/dashboard");
      } else {
        setError("Access denied");
      }
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Something went wrong");
      }
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    login({ regNo, password });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, #1e293b 0%, #0b1120 45%, #020617 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated Background Orbs */}
      <AnimatedOrbs />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            position: "absolute",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#6366f1",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: "0 0 10px #6366f1",
          }}
        />
      ))}

      <Container maxWidth="sm">
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Title */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 900,
                  background: "linear-gradient(90deg,#6366f1,#14b8a6,#6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                DecentraPoll
              </Typography>
            </motion.div>
            <Typography sx={{ opacity: 0.7, fontSize: "1.1rem" }}>
              🎓 Student Login Portal
            </Typography>
          </Box>

          {/* Login Card */}
          <MotionPaper
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            sx={{
              p: 5,
              borderRadius: "30px",
              background: "rgba(17, 24, 39, 0.7)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(99, 102, 241, 0.2)",
            }}
          >
            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                {/* Registration Number Field */}
                <Box>
                  <Typography sx={{ mb: 1, fontSize: "0.9rem", opacity: 0.8, color:"white" }}>
                    Registration Number
                  </Typography>
                  <TextField
                    fullWidth
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <School sx={{ color: "#6366f1" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                        borderRadius: "15px",
                        color: "white",
                        "& fieldset": {
                          borderColor: "rgba(99, 102, 241, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(99, 102, 241, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#6366f1",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "white",
                      },
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box>
                  <Typography sx={{ mb: 1, fontSize: "0.9rem", opacity: 0.8, color:"white" }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "#6366f1" }} />
                        </InputAdornment>
                      ),
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                        borderRadius: "15px",
                        color: "white",
                        "& fieldset": {
                          borderColor: "rgba(99, 102, 241, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(99, 102, 241, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#6366f1",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "white",
                      },
                    }}
                  />
                </Box>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert severity="error" sx={{ borderRadius: "12px" }}>
                      {error}
                    </Alert>
                  </motion.div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  // loading={isPending}
                  sx={{
                    borderRadius: "15px",
                    py: 1.8,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                    boxShadow: "0 0 30px rgba(99,102,241,0.5)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 0 50px rgba(99,102,241,0.8)",
                      transform: "translateY(-2px)",
                    },
                    "&:disabled": {
                      background: "rgba(99,102,241,0.3)",
                    },
                  }}
                >
                  {isPending ? "Logging in..." : "Login to Dashboard"}
                </Button>

                {/* Back to Home */}
                <Button
                  onClick={() => navigate("/")}
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "none",
                    "&:hover": {
                      color: "#6366f1",
                      background: "transparent",
                    },
                  }}
                >
                  ← Back to Home
                </Button>
              </Stack>
            </form>
          </MotionPaper>

          {/* Additional Info */}
          <Box sx={{ textAlign: "center", mt: 3, opacity: 0.5 }}>
            <Typography variant="body2">
              🔒 Your credentials are encrypted and secure
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

// Animated Background Orbs
const AnimatedOrbs = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6 + i,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            i % 2 === 0
              ? "radial-gradient(circle, rgba(99,102,241,0.3), transparent)"
              : "radial-gradient(circle, rgba(20,184,166,0.3), transparent)",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
    ))}
  </>
);

export default Login;
