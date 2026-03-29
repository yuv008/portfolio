"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface MetricCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function MetricCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.5,
}: MetricCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const steps = 60;
    const stepDuration = (duration * 1000) / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (current >= steps) {
        clearInterval(timer);
        setDisplay(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span
      ref={ref}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      className="text-[var(--accent)] font-bold"
    >
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
