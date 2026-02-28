import { Box } from "@mui/material";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback, useEffect, useState } from "react";

const Background = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <Particles
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          particles: {
            number: { value: 70 },
            size: { value: 2 },
            move: { speed: 0.6 },
            opacity: { value: 0.3 },
            links: {
              enable: true,
              opacity: 0.2,
            },
          },
        }}
        style={{
          position: "absolute",
          zIndex: 0,
        }}
      />

      {/* Mouse Glow */}
      <Box
        sx={{
          position: "fixed",
          top: mouse.y - 150,
          left: mouse.x - 150,
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </>
  );
};

export default Background;