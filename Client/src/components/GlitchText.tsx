import { motion } from "framer-motion";
import { Box } from "@mui/material";

interface GlitchTextProps {
  children: React.ReactNode;
}

const GlitchText = ({ children }: GlitchTextProps) => {
  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 2 }}
      >
        {children}
      </motion.div>
      
      {/* Glitch layers */}
      <motion.div
        animate={{
          opacity: [0, 0.7, 0],
          x: [-2, 2, -2],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 5,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          color: "#6366f1",
          mixBlendMode: "screen",
        }}
      >
        {children}
      </motion.div>
      
      <motion.div
        animate={{
          opacity: [0, 0.7, 0],
          x: [2, -2, 2],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 5,
          delay: 0.1,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          color: "#14b8a6",
          mixBlendMode: "screen",
        }}
      >
        {children}
      </motion.div>
    </Box>
  );
};

export default GlitchText;
