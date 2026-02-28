import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  end: string;
  duration?: number;
}

const AnimatedCounter = ({ end, duration = 2 }: AnimatedCounterProps) => {
  const [count, setCount] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    // Extract number from string
    const match = end.match(/(\d+\.?\d*)/);
    if (!match) {
      setCount(end);
      return;
    }

    const target = parseFloat(match[1]);
    const suffix = end.replace(match[1], "");
    const isDecimal = end.includes(".");
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      
      if (step >= steps) {
        setCount(end);
        clearInterval(timer);
      } else {
        const value = isDecimal ? current.toFixed(1) : Math.floor(current);
        setCount(value + suffix);
      }
    }, (duration * 1000) / steps);

    return () => clearInterval(timer);
  }, [end, duration, isInView]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {count}
    </motion.span>
  );
};

export default AnimatedCounter;
