"use client";

import Image from "next/image";
import { Check, Phone, MessageCircle, Share2, Siren, ShieldCheck, ChevronRight, Star } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { drivers, trip } from "@/lib/data";
import { formatNaira } from "@/lib/utils";

function RideConfirmedContent() {
  const openMobileMenu = useMobileMenu();
  const driver = drivers[0];

  return (
    <>
      <TopBar
        onMenuClick={openMobileMenu}
        title="Ride Confirmed"
        subtitle="Your driver is on the way"
      />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-4">
          <Card className="p-6 sm:p-8 text-center">
            <span className="mx-auto h-16 w-16 rounded-full bg-success flex items-center justify-center mb-4 animate-fade-slide-in">
              <Check size={30} className="text-white" strokeWidth={3} />
            </span>
            <h2 className="font-display text-2xl font-bold mb-1">You&rsquo;re all set!</h2>
            <p className="text-sm text-navy/50 mb-6">{driver.name} has accepted your ride request.</p>

            <div className="flex items-center gap-4 rounded-input border border-cardBorder p-4 text-left mb-4">
              <Avatar src={driver.avatar} alt={driver.name} size={56} online />
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{driver.name}</p>
                <span className="flex items-center gap-1 text-xs text-navy/60">
                  <Star size={12} className="fill-gold text-gold" /> {driver.rating}
                </span>
                <span className="inline-flex mt-1.5 rounded-badge bg-success/10 text-success text-[11px] font-semibold px-2 py-0.5">
                  Verified driver
                </span>
              </div>
              <div className="relative h-14 w-20 shrink-0 hidden sm:block">
                <Image src={driver.vehicleImage} alt={driver.vehicle} fill className="object-contain" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left text-sm mb-6">
              <p className="text-navy/50">Vehicle</p>
              <p className="text-right font-medium">
                {driver.vehicle} · {driver.vehicleColor}
              </p>
            </div>

            <div className="rounded-input bg-success/5 border border-success/20 p-4 flex items-center justify-between mb-5">
              <div className="text-left">
                <p className="text-xs text-navy/50">Arriving in</p>
                <p className="font-mono text-2xl font-bold text-success">{driver.etaMinutes} min</p>
                <p className="text-xs text-navy/40">({driver.distanceKm} km away)</p>
              </div>
              <div className="relative h-16 w-16">
                <Image src="/images/route-placeholder.png" alt="" fill className="object-cover rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <Button variant="secondary" className="w-full">
                <Phone size={16} /> Call Driver
              </Button>
              <Button variant="secondary" className="w-full">
                <MessageCircle size={16} /> Message
              </Button>
            </div>
            <a href="/live-tracking">
              <Button variant="success" size="lg" className="w-full mb-2">
                Track Ride →
              </Button>
            </a>
            <Button variant="danger" size="lg" className="w-full">
              Cancel Ride
            </Button>
          </Card>

          <p className="flex items-center justify-center gap-2 text-xs text-navy/50 text-center">
            <ShieldCheck size={14} className="text-success" />
            Your safety matters to us. <span className="text-gold font-medium">Learn more</span> about our safety standards.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-3 h-52 relative overflow-hidden">
            <div className="absolute inset-3 rounded-input overflow-hidden">
              <Image src="/images/route-placeholder.png" alt="Route map" fill className="object-cover" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Trip details</h3>
              <button className="text-sm text-gold font-medium hover:underline flex items-center">
                View <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <p className="text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success shrink-0" /> {trip.pickup}
              </p>
              <p className="text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-urgency shrink-0" /> {trip.destination}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm pt-3 border-t border-cardBorder">
              <span className="text-navy/50">Estimated range</span>
              <span className="font-mono font-semibold">
                {formatNaira(trip.fareRangeLow)} – {formatNaira(trip.fareRangeHigh)}
              </span>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="h-9 w-9 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} className="text-success" />
              </span>
              <div>
                <p className="font-semibold text-sm">Safety first</p>
                <p className="text-xs text-navy/50">All drivers are verified and background checked.</p>
              </div>
              <ChevronRight size={16} className="text-navy/30 ml-auto shrink-0" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-1.5 rounded-input border border-cardBorder py-3 text-xs font-medium hover:bg-bg transition-colors min-h-[44px]">
                <Share2 size={16} /> Share trip
              </button>
              <button className="flex flex-col items-center gap-1.5 rounded-input border border-urgency/30 text-urgency py-3 text-xs font-medium hover:bg-urgency/5 transition-colors min-h-[44px]">
                <Siren size={16} /> Emergency
              </button>
              <button className="flex flex-col items-center gap-1.5 rounded-input border border-cardBorder py-3 text-xs font-medium hover:bg-bg transition-colors min-h-[44px]">
                <ShieldCheck size={16} /> Safety tips
              </button>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function RideConfirmedPage() {
  return (
    <AppShell>
      <RideConfirmedContent />
    </AppShell>
  );
}
