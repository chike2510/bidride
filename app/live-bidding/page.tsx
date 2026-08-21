"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin, ShieldCheck, Tag, TrendingUp } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CountdownRing } from "@/components/CountdownRing";
import { DriverCard } from "@/components/DriverCard";
import {
  loadRide,
  saveRide,
  type StoredRide,
} from "@/lib/ride-store";
import { formatNaira } from "@/lib/utils";

const tips = [
  { icon: Tag, text: "Lower fares may arrive before the timer ends." },
  { icon: ShieldCheck, text: "Every bid shows the driver, vehicle, ETA, and rating." },
  { icon: Clock, text: "Choose the best trade-off, not only the lowest price." },
];

type SortMode = "value" | "price" | "eta" | "rating";

function relativeTime(receivedAt: number) {
  const seconds = Math.max(0, Math.round((Date.now() - receivedAt) / 1000));
  if (seconds < 45) return "Just now";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} min ago`;
}

function LiveBiddingContent() {
  const openMobileMenu = useMobileMenu();
  const router = useRouter();
  const [ride, setRide] = useState<StoredRide | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [sortMode, setSortMode] = useState<SortMode>("value");
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const current = loadRide();
    if (!current) {
      setError("No active ride was found. Please create a new request.");
      return;
    }
    setRide(current);
    const poll = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/rides/${current.id}/bids`, { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        setRide((previous) => previous ? { ...previous, bids: data.bids ?? [] } : previous);
      } catch {
        // Keep the last known bids visible during a temporary network interruption.
      }
    }, 2500);
    return () => window.clearInterval(poll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const secondsLeft = ride ? Math.max(0, Math.ceil((ride.bidDeadline - now) / 1000)) : 42;
  const sorted = useMemo(() => {
    if (!ride) return [];
    return [...ride.bids].sort((a, b) => {
      if (sortMode === "eta") return a.etaMinutes - b.etaMinutes;
      if (sortMode === "rating") return b.rating - a.rating;
      if (sortMode === "price") return a.fare - b.fare;
      return a.fare + a.etaMinutes * 35 - (b.fare + b.etaMinutes * 35);
    });
  }, [ride, sortMode]);
  const lowestFare = sorted.length ? Math.min(...sorted.map((driver) => driver.fare)) : 0;
  const bestValue = sorted[0];

  async function selectBid(driverId: string) {
    if (!ride) return;
    if (secondsLeft <= 0) {
      setError("The bidding window has closed. Start a new request to receive fresh bids.");
      return;
    }
    setError("");
    setSelectingId(driverId);
    try {
      const response = await fetch(`/api/rides/${ride.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidId: driverId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "That bid is no longer available.");
        return;
      }
      saveRide(data.ride);
      router.push(`/ride-confirmed?rideId=${data.ride.id}`);
    } catch {
      setError("Could not accept the bid. Check your connection and try again.");
    } finally {
      setSelectingId(null);
    }
  }

  if (!ride) {
    return (
      <main className="flex-1 px-5 sm:px-8 py-8">
        <Card className="p-8 text-center max-w-xl mx-auto">
          <p className="text-sm text-navy/50">Preparing your secure bidding room…</p>
        </Card>
      </main>
    );
  }

  return (
    <>
      <TopBar
        onMenuClick={openMobileMenu}
        backHref="/request-ride"
        title="Live Bidding"
        subtitle="Compare offers before you choose"
      />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-5">
          <Card className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className={`h-2 w-2 rounded-full ${secondsLeft > 0 ? "bg-success animate-pulse" : "bg-urgency"}`} />
                <h2 className="font-semibold text-navy">{secondsLeft > 0 ? "Bidding is open" : "Bidding has closed"}</h2>
              </div>
              <p className="text-sm text-navy/50 mb-3">Offers are ranked by the trade-off you choose.</p>
              <div className="inline-flex rounded-input bg-bg px-3.5 py-2 font-mono text-sm">
                Estimated range: {formatNaira(ride.estimatedFareLow)} – {formatNaira(ride.estimatedFareHigh)}
              </div>
            </div>
            <CountdownRing totalSeconds={42} secondsLeft={secondsLeft} />
            <div className="w-full sm:w-auto sm:text-right">
              <p className="text-xs text-navy/50 mb-1">Trip details</p>
              <p className="text-sm flex items-start gap-1.5 sm:justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0 mt-2" />
                <span className="max-w-[260px]">{ride.pickup}</span>
              </p>
              <p className="text-sm flex items-start gap-1.5 sm:justify-end mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-urgency shrink-0 mt-2" />
                <span className="max-w-[260px]">{ride.destination}</span>
              </p>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-navy/50">{ride.bids.length} verified drivers are considering your request.</p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-navy/50">Sort by</span>
              <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="rounded-input border border-cardBorder bg-white px-3 py-2 outline-none focus:border-gold">
                <option value="value">Best value</option>
                <option value="price">Lowest fare</option>
                <option value="eta">Fastest pickup</option>
                <option value="rating">Highest rating</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-4">
            {sorted.map((driver, index) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                lowestFare={lowestFare}
                isLowest={driver.id === bestValue?.id}
                timeLabel={relativeTime(driver.receivedAt)}
                onPick={() => selectBid(driver.id)}
                disabled={Boolean(selectingId) || secondsLeft <= 0}
                actionLabel={selectingId === driver.id ? "Accepting…" : "Pick this ride"}
                rank={index + 1}
              />
            ))}
          </div>

          {error && <p className="text-sm text-urgency" role="alert">{error}</p>}
          <p className="text-center text-xs text-navy/40 flex items-center justify-center gap-1"><MapPin size={13} /> Bids are retrieved from the secured BidRide ride service and refreshed automatically while the bidding window is open.</p>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-3">How to choose</h3>
            <div className="flex flex-col gap-4">
              {tips.map((tip) => (
                <div key={tip.text} className="flex items-start gap-3">
                  <span className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0"><tip.icon size={14} className="text-gold" /></span>
                  <p className="text-sm text-navy/70 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </Card>

          {bestValue && (
            <Card className="p-5 bg-success/5 border-success/20">
              <div className="flex items-center gap-2 mb-1.5"><TrendingUp size={15} className="text-success" /><p className="text-sm font-semibold text-success">Best value right now</p></div>
              <p className="text-sm text-navy/70 leading-relaxed mb-2">{bestValue.name} is {bestValue.etaMinutes} min away at {formatNaira(bestValue.fare)}, with a {bestValue.rating} rating.</p>
              <span className="inline-flex rounded-badge bg-success/10 text-success text-xs font-semibold px-2.5 py-1">CALCULATED FROM PRICE + ETA</span>
            </Card>
          )}

          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-navy/40 font-semibold mb-2">Your control</p>
            <p className="text-sm text-navy/70 leading-relaxed">You see the fare before accepting. There is no automatic assignment while the bidding window is open.</p>
            <Button variant="ghost" className="mt-3 w-full" onClick={() => router.push("/request-ride")}>Edit request</Button>
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
