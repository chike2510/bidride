"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Download, MessageCircle, Phone, Star } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import {
  createDemoRide,
  getRideDriver,
  loadRide,
  saveRide,
  type StoredRide,
} from "@/lib/ride-store";
import { trip as defaultTrip } from "@/lib/data";
import { formatNaira, cn } from "@/lib/utils";

const compliments = ["Great driving", "Clean car", "Friendly", "Safe ride", "On time"];
const tipOptions = [0, 100, 200, 300];

function RideCompleteContent() {
  const openMobileMenu = useMobileMenu();
  const router = useRouter();
  const [ride, setRide] = useState<StoredRide | null>(null);
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(200);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const current = loadRide() ?? createDemoRide();
    setRide(current);
  }, []);

  const driver = getRideDriver(ride);

  if (!ride || !driver) {
    return (
      <main className="flex-1 px-5 sm:px-8 py-8">
        <Card className="p-8 text-center">
          <p className="text-sm text-navy/50">Loading your receipt…</p>
        </Card>
      </main>
    );
  }

  const fare = ride.finalFare ?? driver.fare;
  const total = fare + tip;

  function submitFeedback() {
    const currentRide = ride;

    if (!currentRide) return;

    const updated: StoredRide = {
      ...currentRide,
      status: "RATED",
      rating,
      comment,
      tip,
    };

    saveRide(updated);
    setRide(updated);
    setNotice("Thanks — your feedback has been saved.");
  }

  function downloadReceipt() {
    const receipt = [
      "BidRide receipt",
      `Driver: ${driver.name}`,
      `Route: ${ride.pickup} → ${ride.destination}`,
      `Fare: ${formatNaira(fare)}`,
      `Tip: ${formatNaira(tip)}`,
      `Total: ${formatNaira(total)}`,
      `Rating: ${rating}/5`,
      comment ? `Comment: ${comment}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bidride-receipt-${ride.id.slice(0, 8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Receipt downloaded.");
  }

  return (
    <>
      <TopBar
        onMenuClick={openMobileMenu}
        title="Ride Complete"
        subtitle="Thanks for riding with BidRide!"
      />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 sm:p-8 text-center relative overflow-hidden">
          <span className="absolute top-6 left-8 h-2 w-2 rounded-full bg-gold/60" />
          <span className="absolute top-10 right-10 h-1.5 w-1.5 rounded-full bg-success/60" />
          <span className="mx-auto h-16 w-16 rounded-full bg-success flex items-center justify-center mb-4 animate-fade-slide-in">
            <Check size={30} className="text-white" strokeWidth={3} />
          </span>
          <h2 className="font-display text-2xl font-bold mb-1">Thank you!</h2>
          <p className="text-sm text-navy/50 mb-6">
            Your ride was completed successfully.
          </p>

          <div className="rounded-input bg-success/5 border border-success/20 p-5 mb-5">
            <p className="text-xs text-navy/50 mb-1">Total paid</p>
            <p className="font-mono text-3xl font-bold text-navy">
              {formatNaira(total)}
            </p>
            <span className="inline-flex mt-2 rounded-badge bg-success/10 text-success text-xs font-semibold px-2.5 py-1">
              Receipt ready
            </span>
          </div>

          <div className="flex items-center gap-3 text-left">
            <Avatar src={driver.avatar} alt={driver.name} size={48} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{driver.name}</p>
              <p className="text-xs text-navy/50 flex items-center gap-1">
                <Star size={11} className="fill-gold text-gold" />
                {driver.rating} · {driver.vehicle.split(" (")[0]} ({driver.vehicleColor})
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNotice("Calling is protected and keeps your number private.")}
              className="h-10 w-10 rounded-full border border-cardBorder flex items-center justify-center"
              aria-label="Call driver"
            >
              <Phone size={15} />
            </button>
            <button
              type="button"
              onClick={() => setNotice("Messaging history is available from your ride record.")}
              className="h-10 w-10 rounded-full border border-cardBorder flex items-center justify-center"
              aria-label="Message driver"
            >
              <MessageCircle size={15} />
            </button>
          </div>

          {notice && (
            <p className="mt-4 text-sm text-navy/60" role="status">
              {notice}
            </p>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-1">Trip summary</h3>
            <div className="flex flex-col gap-2 my-4">
              <p className="text-sm flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-success shrink-0 mt-2" />
                {ride.pickup}
              </p>
              <p className="text-sm flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-urgency shrink-0 mt-2" />
                {ride.destination}
              </p>
            </div>
            <div className="relative h-40 rounded-input overflow-hidden mb-4">
              <Image
                src="/images/route-placeholder.svg"
                alt="Trip route"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 text-center gap-2 pt-3 border-t border-cardBorder">
              <div>
                <p className="text-xs text-navy/50">Distance</p>
                <p className="font-mono font-semibold">{defaultTrip.distanceKm} km</p>
              </div>
              <div>
                <p className="text-xs text-navy/50">Duration</p>
                <p className="font-mono font-semibold">{defaultTrip.durationMin} min</p>
              </div>
              <div>
                <p className="text-xs text-navy/50">Completed</p>
                <p className="font-mono font-semibold">
                  {new Date().toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-1">Rate your ride</h3>
          <p className="text-sm text-navy/50 mb-4">
            Your rating helps riders and drivers make better choices.
          </p>
          <div className="flex gap-2 mb-3" role="radiogroup" aria-label="Ride rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setRating(value)}
                aria-label={`Rate ${value} stars`}
                aria-pressed={value === rating}
              >
                <Star
                  size={30}
                  className={cn(
                    value <= rating ? "fill-gold text-gold" : "text-cardBorder"
                  )}
                />
              </button>
            ))}
          </div>
          {rating >= 4 && (
            <p className="text-sm text-success mb-4">
              Thanks for the positive feedback.
            </p>
          )}

          <p className="text-sm font-medium text-navy/70 mb-2">
            Add a compliment <span className="font-normal text-navy/40">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {compliments.map((item) => {
              const active = selectedCompliments.includes(item);

              return (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    setSelectedCompliments((current) =>
                      active
                        ? current.filter((value) => value !== item)
                        : [...current, item]
                    )
                  }
                  aria-pressed={active}
                  className={cn(
                    "rounded-input border px-3.5 py-2 text-sm min-h-[44px] transition-colors",
                    active
                      ? "bg-gold/10 border-gold text-navy"
                      : "border-cardBorder text-navy/70 hover:bg-bg"
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <textarea
            maxLength={150}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment…"
            className="w-full rounded-input border border-cardBorder p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Ride feedback comment"
          />
          <p className="text-right text-xs text-navy/40 mt-1">
            {comment.length}/150
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-1">Leave a tip for {driver.name}</h3>
          <p className="text-sm text-navy/50 mb-4">
            100% of your tip goes to your driver.
          </p>

          <div className="grid grid-cols-4 gap-2 mb-5">
            {tipOptions.map((amount) => (
              <button
                type="button"
                key={amount}
                onClick={() => setTip(amount)}
                aria-pressed={tip === amount}
                className={cn(
                  "rounded-input border py-3 text-sm font-medium min-h-[44px] transition-colors",
                  tip === amount
                    ? "bg-gold/10 border-gold text-navy"
                    : "border-cardBorder text-navy/70 hover:bg-bg"
                )}
              >
                {amount === 0 ? "No tip" : formatNaira(amount)}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-navy/50">Trip fare</span>
              <span className="font-mono">{formatNaira(fare)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/50">Tip</span>
              <span className="font-mono">{formatNaira(tip)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-cardBorder">
              <span>Total</span>
              <span className="font-mono">{formatNaira(total)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-6">
            <span className="text-navy/50">Payment method</span>
            <span className="flex items-center gap-1.5 font-medium">
              BidRide Wallet <Check size={14} className="text-success" />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={downloadReceipt}
            >
              <Download size={16} /> Download receipt
            </Button>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                submitFeedback();
                router.push("/ride-history");
              }}
            >
              Save &amp; finish →
            </Button>
          </div>
        </Card>
      </main>
    </>
  );
}

export default function RideCompletePage() {
  return (
    <AppShell>
      <RideCompleteContent />
    </AppShell>
  );
}
