import { motion } from "framer-motion";
import { type ReactNode, useState } from "react";

const GlitchText = ({ children }: { children: ReactNode }) => {
  const [glitching, setGlitching] = useState(false);

  const triggerGlitch = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 500);
  };

  return (
    <motion.div
      onHoverStart={triggerGlitch}
      style={{ position: "relative", display: "inline-block", cursor: "default" }}
      animate={
        glitching
          ? {
              x: [0, -4, 4, -2, 2, 0],
              skewX: [0, -2, 2, -1, 0],
            }
          : {}
      }
      transition={{ duration: 0.4 }}
    >
      {children}
      {glitching && (
        <>
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.6,
              clipPath: "inset(30% 0 50% 0)",
              transform: "translateX(-4px)",
              filter: "hue-rotate(90deg)",
              pointerEvents: "none",
            }}
            animate={{ x: [-4, 4, -2, 0] }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.5,
              clipPath: "inset(60% 0 20% 0)",
              transform: "translateX(4px)",
              filter: "hue-rotate(-90deg)",
              pointerEvents: "none",
            }}
            animate={{ x: [4, -4, 2, 0] }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default GlitchText;
