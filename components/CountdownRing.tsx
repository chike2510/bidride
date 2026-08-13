"use client";

import { useEffect, useState } from "react";

export function CountdownRing({
  totalSeconds,
  secondsLeft,
  size = 88,
}: {
  totalSeconds: number;
  secondsLeft?: number;
  size?: number;
}) {
  const [internalRemaining, setInternalRemaining] = useState(totalSeconds);
  const remaining = secondsLeft ?? internalRemaining;

  useEffect(() => {
    if (secondsLeft !== undefined || internalRemaining <= 0) return;
    const timer = window.setTimeout(() => setInternalRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft, internalRemaining]);

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, remaining / totalSeconds));
  const offset = circumference * (1 - progress);
  const mm = Math.floor(remaining / 60);
  const ss = (remaining % 60).toString().padStart(2, "0");

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-label={`${mm} minutes ${ss} seconds remaining`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8E8E8" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={remaining < 10 ? "#E85D4C" : "#F0A202"}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 200ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono font-bold text-lg ${remaining < 10 ? "text-urgency" : "text-navy"}`}>{mm}:{ss}</span>
        <span className="text-[10px] text-navy/50">Time left</span>
      </div>
    </div>
  );
}
