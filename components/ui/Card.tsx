"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  hoverLift?: boolean;
}

export function Card({ className, hoverLift = false, children, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={hoverLift ? { y: -4 } : undefined}
      className={cn(
        "bg-white rounded-card border border-cardBorder shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
