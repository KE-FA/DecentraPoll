import { motion } from "framer-motion";
import { Box } from "@mui/material";

const BlockchainCube = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
        perspective: "1000px",
      }}
    >
      <motion.div
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: "250px",
          height: "250px",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: "250px",
              height: "250px",
              border: "2px solid rgba(99, 102, 241, 0.5)",
              background: "rgba(99, 102, 241, 0.1)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#6366f1",
              transform:
                i === 0
                  ? "rotateY(0deg) translateZ(125px)"
                  : i === 1
                  ? "rotateY(90deg) translateZ(125px)"
                  : i === 2
                  ? "rotateY(180deg) translateZ(125px)"
                  : i === 3
                  ? "rotateY(-90deg) translateZ(125px)"
                  : i === 4
                  ? "rotateX(90deg) translateZ(125px)"
                  : "rotateX(-90deg) translateZ(125px)",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
            }}
          >
            {i === 0 ? "⛓️" : i === 1 ? "🔒" : i === 2 ? "✓" : i === 3 ? "⚡" : i === 4 ? "🗳️" : "♦️"}
          </Box>
        ))}
      </motion.div>
    </Box>
  );
};

export default BlockchainCube;
