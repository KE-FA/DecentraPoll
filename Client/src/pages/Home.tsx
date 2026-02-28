import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BlockchainCube from "../components/BlockchainCube";
import AnimatedCounter from "../components/AnimatedCounter";
import GlitchText from "../components/GlitchText";
import { useRef } from "react";

const MotionBox = motion.create(Box);

const stats = [
  { value: "250+", label: "Active Polls" },
  { value: "15K+", label: "Student Votes Cast" },
  { value: "100%", label: "Tamper-Proof Results" },
];

const features = [
  {
    icon: "🔐",
    title: "Anonymous Voting",
    description: "Students vote completely anonymously. No one can trace votes back to individuals.",
  },
  {
    icon: "👨‍💼",
    title: "Admin Poll Creation",
    description: "Administrators create polls with multiple choice options. Students select their preferred answers.",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    description: "Real-time vote counting and live results dashboard for poll creators and participants.",
  },
  {
    icon: "🎯",
    title: "Tamper-Proof",
    description: "All votes recorded on blockchain. Results cannot be altered or manipulated once submitted.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, #1e293b 0%, #0b1120 45%, #020617 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <AnimatedOrbs />
      <AnimatedGridLines />

      {/* HERO SECTION */}
      <Container maxWidth="xl" sx={{ pt: { xs: 16, md: 22 }, pb: { xs: 12, md: 18 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 6, md: 10 },
          }}
        >
          <Box sx={{ flex: 1, maxWidth: { md: "50%" } }}>
            <MotionBox
              style={{ y, opacity, scale }}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Box
                  sx={{
                    display: "inline-block",
                    px: 3,
                    py: 1,
                    borderRadius: "50px",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    background: "rgba(99, 102, 241, 0.1)",
                    mb: 4,
                  }}
                >
                  <Typography sx={{ fontSize: "0.9rem", color: "#14b8a6", fontWeight: 600 }}>
                    🎓 Decentralized Student Polling
                  </Typography>
                </Box>
              </motion.div>

              {/* Main Title */}
              <GlitchText>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: "3rem", sm: "4rem", md: "5.5rem" },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    background: "linear-gradient(135deg, #6366f1 0%, #14b8a6 50%, #6366f1 100%)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "gradient 4s ease infinite",
                    "@keyframes gradient": {
                      "0%": { backgroundPosition: "0% 50%" },
                      "50%": { backgroundPosition: "100% 50%" },
                      "100%": { backgroundPosition: "0% 50%" },
                    },
                  }}
                >
                  DecentraPoll
                </Typography>
              </GlitchText>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Typography
                  sx={{
                    mt: 4,
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    lineHeight: 1.7,
                    color: "rgba(255, 255, 255, 0.8)",
                    maxWidth: "600px",
                  }}
                >
                  Admins create polls with close-ended options.{" "}
                  <Box
                    component="span"
                    sx={{
                      background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 700,
                    }}
                  >
                    Students vote anonymously. Results secured on blockchain.
                  </Box>
                </Typography>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mt: 6 }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/login")}
                      sx={{
                        borderRadius: "50px",
                        px: 6,
                        py: 2.5,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                        boxShadow: "0 0 60px rgba(99, 102, 241, 0.6), 0 10px 30px rgba(0, 0, 0, 0.3)",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                          transition: "left 0.5s",
                        },
                        "&:hover::before": {
                          left: "100%",
                        },
                      }}
                    >
                      Launch App →
                    </Button>
                  </motion.div>

                  
                </Stack>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <Stack direction="row" spacing={4} sx={{ mt: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "#14b8a6",
                        boxShadow: "0 0 10px #14b8a6",
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                          "0%, 100%": { opacity: 1 },
                          "50%": { opacity: 0.5 },
                        },
                      }}
                    />
                    <Typography sx={{ fontSize: "0.9rem", opacity: 0.7 }}>
                      Live on Mainnet
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.9rem", opacity: 0.7 }}>
                    👨‍💻 Developed by KeDevs
                  </Typography>
                </Stack>
              </motion.div>
            </MotionBox>
          </Box>

          {/* 3D SECTION */}
          <Box sx={{ flex: 1, maxWidth: { md: "50%" } }}>
            <MotionBox
              initial={{ scale: 0.6, opacity: 0, rotateY: -30 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]) }}
            >
              <BlockchainCube />
            </MotionBox>
          </Box>
        </Box>
      </Container>

      {/* STATS SECTION */}
      <Container maxWidth="lg" sx={{ pb: 20 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 5,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {stats.map((stat, i) => (
            <Box key={i} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(33.333% - 40px)" }, minWidth: "250px" }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
              >
                <MotionBox
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    sx={{
                      p: 6,
                      borderRadius: "35px",
                      background: "linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(15, 23, 42, 0.8))",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                      },
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight="bold"
                      sx={{
                        background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 2,
                      }}
                    >
                      <AnimatedCounter end={stat.value} duration={2.5} />
                    </Typography>
                    <Typography sx={{ opacity: 0.7, fontSize: "1.1rem", fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </MotionBox>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>

      {/* FEATURES SECTION */}
      <Container maxWidth="lg" sx={{ pb: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            textAlign="center"
            sx={{
              mb: 8,
              background: "linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            How DecentraPoll Works
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {features.map((feature, i) => (
            <Box key={i} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <MotionBox
                  whileHover={{ scale: 1.03, boxShadow: "0 30px 80px rgba(99, 102, 241, 0.3)" }}
                  transition={{ duration: 0.3 }}
                  sx={{ height: "100%" }}
                >
                  <Paper
                    sx={{
                      p: 5,
                      borderRadius: "25px",
                      background: "rgba(17, 24, 39, 0.6)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(99, 102, 241, 0.15)",
                      height: "100%",
                    }}
                  >
                    <Typography sx={{ fontSize: "3rem", mb: 2 }}>{feature.icon}</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, color: "#6366f1" }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ opacity: 0.7, lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </Paper>
                </MotionBox>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Get Started Button */}
      <Container maxWidth="md" sx={{ pb: 20 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            sx={{
              p: 8,
              borderRadius: "40px",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(20, 184, 166, 0.2))",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                position: "absolute",
                inset: -50,
                background: "radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                Ready to participate in polls?
              </Typography>
              <Typography sx={{ mb: 5, opacity: 0.8, fontSize: "1.1rem" }}>
                Join thousands of students voting on campus polls with complete anonymity and transparency
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    borderRadius: "50px",
                    px: 8,
                    py: 3,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    background: "#fff",
                    color: "#020617",
                    "&:hover": {
                      background: "#f1f5f9",
                    },
                  }}
                >
                  Get Started Now
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

const AnimatedOrbs = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -60, 0],
          x: [0, 30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5,
        }}
        style={{
          position: "absolute",
          width: 300 + i * 50,
          height: 300 + i * 50,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${
            i % 2 === 0 ? "rgba(99, 102, 241, 0.3)" : "rgba(20, 184, 166, 0.3)"
          }, transparent 70%)`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    ))}
  </>
);

const AnimatedGridLines = () => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      backgroundImage: `
        linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: "50px 50px",
      pointerEvents: "none",
      zIndex: 0,
    }}
  />
);

export default Home;
