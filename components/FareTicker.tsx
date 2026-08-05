"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Renders a fare as individually-boxed, rolling digits in IBM Plex Mono —
 * matching the Live Bidding "odometer" fare ticker from the reference.
 */
export function FareTicker({
  amount,
  highlight = false,
  size = "md",
}: {
  amount: number;
  highlight?: boolean;
  size?: "sm" | "md";
}) {
  const digits = amount.toString().split("");
  const boxSize = size === "md" ? "h-11 w-8 text-lg" : "h-9 w-7 text-base";

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={cn("font-mono font-semibold text-navy/70", size === "md" ? "text-lg" : "text-base")}>
        ₦
      </span>
      <div className={cn("inline-flex gap-0.5 rounded-input p-0.5", highlight && "animate-gold-pulse")}>
        {digits.map((digit, i) => (
          <div
            key={`${i}-${digits.length}`}
            className={cn(
              "relative overflow-hidden flex items-center justify-center rounded-[6px] font-mono font-bold",
              boxSize,
              highlight ? "bg-gold/15 text-gold" : "bg-bg text-navy"
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={digit}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
