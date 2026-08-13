import { CarFront, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { FareTicker } from "./FareTicker";
import type { Driver } from "@/lib/data";
import { formatNaira } from "@/lib/utils";

export function DriverCard({
  driver,
  lowestFare,
  isLowest,
  timeLabel,
  onPick,
  disabled = false,
  actionLabel = "Pick this ride",
  rank,
}: {
  driver: Driver;
  lowestFare: number;
  isLowest: boolean;
  timeLabel: string;
  onPick: () => void;
  disabled?: boolean;
  actionLabel?: string;
  rank?: number;
}) {
  const diff = driver.fare - lowestFare;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`rounded-card border p-4 sm:p-5 bg-white transition-colors duration-150 ${isLowest ? "border-gold shadow-elevated" : "border-cardBorder shadow-soft"}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <Avatar src={driver.avatar} alt={driver.name} size={48} online />
            {rank && <span className="absolute -top-2 -left-2 h-5 min-w-5 px-1 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">#{rank}</span>}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-navy">{driver.name}</p>
              <span className="flex items-center gap-0.5 text-xs text-navy/70"><Star size={12} className="fill-gold text-gold" /> {driver.rating}</span>
              {isLowest && <Badge variant="gold">BEST VALUE</Badge>}
            </div>
            <p className="text-xs text-navy/50 truncate">{driver.trips.toLocaleString()} trips · {driver.yearsOnBidRide} {driver.yearsOnBidRide === 1 ? "year" : "years"} on BidRide</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-navy/60">
              <span className="inline-flex items-center gap-1"><MapPin size={11} /> {driver.etaMinutes} min away</span>
              <span className="inline-flex items-center gap-1"><CarFront size={11} /> {driver.vehicle}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-center gap-1">
          <FareTicker amount={driver.fare} highlight={isLowest} />
          <p className={`text-xs ${isLowest ? "text-success" : "text-navy/50"}`}>{isLowest ? "↓ Lowest so far" : `${formatNaira(diff)} higher`}</p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:w-32 w-full">
          <Button variant={isLowest ? "primary" : "secondary"} onClick={onPick} disabled={disabled} className="w-full sm:w-auto">
            {actionLabel}
          </Button>
          <span className="text-[11px] text-navy/40 whitespace-nowrap">{timeLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}
