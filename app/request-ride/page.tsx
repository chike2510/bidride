"use client";

import Image from "next/image";
import { MapPin, ArrowUpDown, Plus, X, Users, Car, User, Briefcase, PawPrint, TrendingUp, Home, Plane, ShoppingBag, Star, ShieldCheck } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { trip } from "@/lib/data";
import { formatNaira } from "@/lib/utils";

const popularDestinations = [
  { icon: Home, label: "Home", address: "15 Admiralty Way, Lekki Phase 1" },
  { icon: Briefcase, label: "Office", address: "27B Bishop Aboyade Cole St, VI" },
  { icon: Plane, label: "Airport", address: "Murtala Muhammed International Airport" },
  { icon: ShoppingBag, label: "Shoprite", address: "Circle Mall, Jakande, Lekki" },
];

const preferences = [
  { icon: User, label: "Female driver" },
  { icon: Briefcase, label: "Extra luggage" },
  { icon: PawPrint, label: "Pet friendly" },
];

function RequestRideContent() {
  const openMobileMenu = useMobileMenu();

  return (
    <>
      <TopBar
        onMenuClick={openMobileMenu}
        backHref="/dashboard"
        title="Request a Ride"
        subtitle="Drivers will bid for your ride"
      />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        <div className="flex flex-col gap-4">
          <Card className="p-6">
            <h2 className="font-display text-xl font-bold mb-5">Where are you going?</h2>

            <div className="rounded-input border border-cardBorder overflow-hidden mb-3">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cardBorder">
                <span className="h-2 w-2 rounded-full bg-success shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-navy/50">Pickup location</p>
                  <p className="text-sm font-medium">{trip.pickup}</p>
                </div>
                <MapPin size={16} className="text-navy/40" />
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5 relative">
                <span className="h-2 w-2 rounded-full bg-urgency shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-navy/50">Destination</p>
                  <p className="text-sm font-medium">{trip.destination}</p>
                </div>
                <button
                  className="h-9 w-9 rounded-full border border-cardBorder flex items-center justify-center hover:bg-bg transition-colors shrink-0"
                  aria-label="Swap"
                >
                  <ArrowUpDown size={14} />
                </button>
                <button
                  className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-bg transition-colors shrink-0"
                  aria-label="Clear destination"
                >
                  <X size={14} className="text-navy/40" />
                </button>
              </div>
            </div>

            <button className="w-full rounded-input bg-bg py-3 text-sm font-medium text-navy/70 flex items-center justify-center gap-2 mb-5 hover:bg-cardBorder/40 transition-colors min-h-[44px]">
              <Plus size={15} /> Add stop
            </button>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-input border border-cardBorder px-4 py-3 flex items-center gap-3">
                <Users size={16} className="text-navy/50" />
                <div>
                  <p className="text-xs text-navy/50">Passengers</p>
                  <p className="text-sm font-medium">1</p>
                </div>
              </div>
              <div className="rounded-input border border-cardBorder px-4 py-3 flex items-center gap-3">
                <Car size={16} className="text-navy/50" />
                <div>
                  <p className="text-xs text-navy/50">Ride type</p>
                  <p className="text-sm font-medium">Any</p>
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-navy/70 mb-2.5">Preferences (optional)</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {preferences.map((pref) => (
                <button
                  key={pref.label}
                  className="flex items-center gap-2 rounded-input border border-cardBorder px-3.5 py-2.5 text-sm text-navy/70 hover:bg-bg transition-colors min-h-[44px]"
                >
                  <pref.icon size={14} />
                  {pref.label}
                </button>
              ))}
            </div>

            <div className="rounded-input bg-navy/[0.03] border border-navy/[0.06] p-4 flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs text-navy/50 flex items-center gap-1">Estimated fare range</p>
                <p className="font-mono text-2xl font-bold mt-0.5">
                  {formatNaira(trip.fareRangeLow)} – {formatNaira(trip.fareRangeHigh)}
                </p>
                <p className="text-xs text-navy/40 mt-1">Final fare shown after you pick a driver</p>
              </div>
              <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
                <span className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  <TrendingUp size={16} className="text-gold" />
                </span>
                <p className="text-[10px] text-navy/40 text-center leading-tight">
                  Prices update
                  <br />
                  in real time
                </p>
              </div>
            </div>

            <a href="/live-bidding">
              <Button size="lg" className="w-full justify-between">
                Request Bids
                <span aria-hidden>→</span>
              </Button>
            </a>
          </Card>

          <p className="flex items-center justify-center gap-2 text-xs text-navy/50 text-center">
            <ShieldCheck size={14} className="text-success" />
            Your ride is protected with BidRide Safety — all drivers are verified and background checked.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-3 h-64 relative overflow-hidden">
            <div className="absolute inset-3 rounded-input overflow-hidden">
              <Image src="/images/route-placeholder.png" alt="Route map" fill className="object-cover" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Popular destinations</h3>
              <button className="text-sm text-gold font-medium hover:underline">See all</button>
            </div>
            <div className="flex flex-col divide-y divide-cardBorder">
              {popularDestinations.map((d) => (
                <div key={d.label} className="flex items-center gap-3 py-3">
                  <span className="h-10 w-10 rounded-full bg-bg flex items-center justify-center shrink-0">
                    <d.icon size={16} className="text-navy/60" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{d.label}</p>
                    <p className="text-xs text-navy/50 truncate">{d.address}</p>
                  </div>
                  <Star size={16} className="text-navy/30 shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function RequestRidePage() {
  return (
    <AppShell>
      <RequestRideContent />
    </AppShell>
  );
}
