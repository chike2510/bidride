"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Star, Phone, MessageCircle, Download } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { drivers, trip } from "@/lib/data";
import { formatNaira, cn } from "@/lib/utils";

const compliments = ["Great driving", "Clean car", "Friendly", "Safe ride", "On time"];
const tipOptions = [100, 200, 300];

function RideCompleteContent() {
  const openMobileMenu = useMobileMenu();
  const driver = drivers[0];
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(200);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([]);

  const fare = driver.fare;
  const total = fare + tip;

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} title="Ride Complete" subtitle="Thanks for riding with BidRide!" />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Subtle confetti accent, not overdone */}
          <span className="absolute top-6 left-8 h-2 w-2 rounded-full bg-gold/60" />
          <span className="absolute top-10 right-10 h-1.5 w-1.5 rounded-full bg-success/60" />
          <span className="absolute top-16 left-16 h-1.5 w-3 rotate-45 bg-urgency/50" />

          <span className="mx-auto h-16 w-16 rounded-full bg-success flex items-center justify-center mb-4 animate-fade-slide-in">
            <Check size={30} className="text-white" strokeWidth={3} />
          </span>
          <h2 className="font-display text-2xl font-bold mb-1">Thank you!</h2>
          <p className="text-sm text-navy/50 mb-6">Your ride was completed successfully.</p>

          <div className="rounded-input bg-success/5 border border-success/20 p-5 mb-5">
            <p className="text-xs text-navy/50 mb-1">Total Paid</p>
            <p className="font-mono text-3xl font-bold text-navy">{formatNaira(total)}</p>
            <span className="inline-flex mt-2 rounded-badge bg-success/10 text-success text-xs font-semibold px-2.5 py-1">
              Paid with Wallet
            </span>
          </div>

          <div className="flex items-center gap-3 text-left">
            <Avatar src={driver.avatar} alt={driver.name} size={48} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{driver.name}</p>
              <p className="text-xs text-navy/50 flex items-center gap-1">
                <Star size={11} className="fill-gold text-gold" /> {driver.rating} · {driver.vehicle.split(" (")[0]} ({driver.vehicleColor})
              </p>
            </div>
            <button className="h-10 w-10 rounded-full border border-cardBorder flex items-center justify-center">
              <Phone size={15} />
            </button>
            <button className="h-10 w-10 rounded-full border border-cardBorder flex items-center justify-center">
              <MessageCircle size={15} />
            </button>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-1">Trip Summary</h3>
            <div className="flex flex-col gap-2 my-4">
              <p className="text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success shrink-0" /> {trip.pickup}
              </p>
              <p className="text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-urgency shrink-0" /> {trip.destination}
              </p>
            </div>
            <div className="relative h-40 rounded-input overflow-hidden mb-4">
              <Image src="/images/route-placeholder.png" alt="Trip route" fill className="object-cover" />
            </div>
            <div className="grid grid-cols-3 text-center gap-2 pt-3 border-t border-cardBorder">
              <div>
                <p className="text-xs text-navy/50">Distance</p>
                <p className="font-mono font-semibold">{trip.distanceKm} km</p>
              </div>
              <div>
                <p className="text-xs text-navy/50">Duration</p>
                <p className="font-mono font-semibold">{trip.durationMin} min</p>
              </div>
              <div>
                <p className="text-xs text-navy/50">Completed at</p>
                <p className="font-mono font-semibold">10:42 AM</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-1">Rate your ride</h3>
          <p className="text-sm text-navy/50 mb-4">How was your experience?</p>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`Rate ${n} stars`}>
                <Star
                  size={30}
                  className={cn(n <= rating ? "fill-gold text-gold" : "text-cardBorder")}
                />
              </button>
            ))}
          </div>
          {rating === 5 && <p className="text-sm text-success mb-4">Awesome! Thanks for your feedback.</p>}

          <p className="text-sm font-medium text-navy/70 mb-2">Add a compliment (optional)</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {compliments.map((c) => {
              const active = selectedCompliments.includes(c);
              return (
                <button
                  key={c}
                  onClick={() =>
                    setSelectedCompliments((prev) =>
                      active ? prev.filter((x) => x !== c) : [...prev, c]
                    )
                  }
                  className={cn(
                    "rounded-input border px-3.5 py-2 text-sm min-h-[44px] transition-colors",
                    active ? "bg-gold/10 border-gold text-navy" : "border-cardBorder text-navy/70 hover:bg-bg"
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <textarea
            maxLength={150}
            placeholder="Write a comment…"
            className="w-full rounded-input border border-cardBorder p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <p className="text-right text-xs text-navy/40 mt-1">0/150</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-1">Leave a tip for {driver.name}</h3>
          <p className="text-sm text-navy/50 mb-4">100% of your tip goes to your driver.</p>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {tipOptions.map((amt) => (
              <button
                key={amt}
                onClick={() => setTip(amt)}
                className={cn(
                  "rounded-input border py-3 text-sm font-medium min-h-[44px] transition-colors",
                  tip === amt ? "bg-gold/10 border-gold text-navy" : "border-cardBorder text-navy/70 hover:bg-bg"
                )}
              >
                {formatNaira(amt)}
              </button>
            ))}
            <button
              onClick={() => setTip(0)}
              className={cn(
                "rounded-input border py-3 text-sm font-medium min-h-[44px] transition-colors",
                tip === 0 ? "bg-gold/10 border-gold text-navy" : "border-cardBorder text-navy/70 hover:bg-bg"
              )}
            >
              Other
            </button>
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
            <span className="text-navy/50">Payment Method</span>
            <span className="flex items-center gap-1.5 font-medium">
              BidRide Wallet {formatNaira(total)} <Check size={14} className="text-success" />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="secondary" size="lg" className="w-full">
              <Download size={16} /> Download Receipt
            </Button>
            <Button size="lg" className="w-full">
              Done →
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
