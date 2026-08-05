"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Tag, ShieldCheck, Clock, ChevronDown } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CountdownRing } from "@/components/CountdownRing";
import { DriverCard } from "@/components/DriverCard";
import { drivers as initialDrivers, trip } from "@/lib/data";
import { formatNaira } from "@/lib/utils";

const tips = [
  { icon: Tag, text: "Lower fares may arrive anytime before time runs out." },
  { icon: ShieldCheck, text: "All drivers are verified and background checked." },
  { icon: Clock, text: "Pick the best value, not just the lowest price." },
];

function LiveBiddingContent() {
  const openMobileMenu = useMobileMenu();
  const router = useRouter();
  const [drivers, setDrivers] = useState(initialDrivers);
  const [timeLabels] = useState(["Just now", "1 min ago", "2 min ago", "3 min ago"]);

  const sorted = [...drivers].sort((a, b) => a.fare - b.fare);
  const lowestFare = sorted[0].fare;

  // Simulate a lower bid arriving after a few seconds, matching the
  // "gold pulse when a cheaper bid appears" spec.
  useEffect(() => {
    const t = setTimeout(() => {
      setDrivers((prev) =>
        prev.map((d) => (d.id === "david" ? { ...d, fare: d.fare - 40 } : d))
      );
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <TopBar
        onMenuClick={openMobileMenu}
        backHref="/request-ride"
        title="Live Bidding"
        subtitle="Drivers are placing bids for your ride"
      />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-5">
          <Card className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <h2 className="font-semibold text-navy mb-1">Requesting drivers…</h2>
              <p className="text-sm text-navy/50 mb-3">Bids arrive in real time</p>
              <div className="inline-block rounded-input bg-bg px-3.5 py-2 font-mono text-sm">
                Estimated range: {formatNaira(trip.fareRangeLow)} – {formatNaira(trip.fareRangeHigh)}
              </div>
            </div>
            <CountdownRing totalSeconds={42} />
            <div className="w-full sm:w-auto sm:text-right">
              <p className="text-xs text-navy/50 mb-1">Trip details</p>
              <p className="text-sm flex items-center gap-1.5 sm:justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                {trip.pickup}
              </p>
              <p className="text-sm flex items-center gap-1.5 sm:justify-end mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-urgency shrink-0" />
                {trip.destination}
              </p>
            </div>
          </Card>

          <p className="text-center text-sm text-navy/50">
            Bids keep coming in. You&rsquo;ll be notified of the best ones.
          </p>

          <div className="flex flex-col gap-4">
            {sorted.map((driver, i) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                lowestFare={lowestFare}
                isLowest={i === 0}
                timeLabel={timeLabels[i] ?? "3 min ago"}
                onPick={() => router.push("/ride-confirmed")}
              />
            ))}
          </div>

          <button className="flex items-center justify-center gap-1 text-sm text-navy/50 py-2 hover:text-navy transition-colors">
            <ChevronDown size={14} /> More bids may arrive…
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Tips</h3>
            <div className="flex flex-col gap-4">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <tip.icon size={14} className="text-gold" />
                  </span>
                  <p className="text-sm text-navy/70 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-success/5 border-success/20">
            <p className="text-sm font-semibold text-success mb-1.5">Best value tip</p>
            <p className="text-sm text-navy/70 leading-relaxed mb-2">
              Ada is 1 min away with a 4.9 rating. Worth ₦80 more for a faster pickup.
            </p>
            <span className="inline-flex rounded-badge bg-success/10 text-success text-xs font-semibold px-2.5 py-1">
              GREAT VALUE
            </span>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function LiveBiddingPage() {
  return (
    <AppShell>
      <LiveBiddingContent />
    </AppShell>
  );
}
