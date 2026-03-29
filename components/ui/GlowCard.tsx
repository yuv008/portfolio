"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  return (
    <motion.div
      className={`glow-card p-6 ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
