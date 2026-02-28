import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  end: string;
  duration?: number;
}

const AnimatedCounter = ({ end, duration = 2.5 }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Parse suffix and numeric part
    const match = end.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplay(end);
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const startTime = performance.now();
    const totalMs = duration * 1000;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(`${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, end, duration]);

  return <span ref={ref}>{display}</span>;
};

export default AnimatedCounter;
