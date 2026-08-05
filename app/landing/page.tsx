"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, ClipboardList, Car, ShieldCheck, Lock, Headphones } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { drivers } from "@/lib/data";
import { formatNaira } from "@/lib/utils";

const steps = [
  { icon: MapPin, num: 1, title: "Request", body: "Enter your destination and request a ride." },
  { icon: Users, num: 2, title: "Drivers bid", body: "Nearby drivers place their bids in real time." },
  { icon: ClipboardList, num: 3, title: "Pick your ride", body: "Compare bids, choose the best ride for you." },
  { icon: Car, num: 4, title: "Go", body: "Track your driver and enjoy a safe, reliable trip." },
];

const trustBadges = [
  { icon: ShieldCheck, title: "Verified drivers", sub: "Background checked" },
  { icon: Lock, title: "Secure payments", sub: "Your money is safe" },
  { icon: Headphones, title: "24/7 support", sub: "We're here for you" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative bg-navy text-white px-6 sm:px-12 pt-8 pb-16 lg:pb-24 flex flex-col">
          <nav className="flex items-center justify-between mb-16 lg:mb-24">
            <span className="font-display text-xl font-bold">
              <span className="text-white">Bid</span>
              <span className="text-gold">Ride</span>
            </span>
            <Link href="/login" className="hidden lg:block">
              <Button variant="secondary" className="bg-transparent text-white border-white/20 hover:bg-white/5">
                Log in
              </Button>
            </Link>
          </nav>

          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.1] mb-5">
            The ride app where drivers <span className="text-gold">compete</span> for your fare.
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-md">
            You request. Drivers bid. You pick the best ride for you.
          </p>
          <Link href="/request-ride">
            <Button size="lg" className="w-fit mb-4">
              Request a Ride →
            </Button>
          </Link>
          <p className="flex items-center gap-2 text-sm text-white/50">
            <ShieldCheck size={15} className="text-success" /> Safe rides. Verified drivers. You&rsquo;re in control.
          </p>
        </div>

        <div className="relative bg-bg min-h-[420px] lg:min-h-0 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            <Image src="/images/landing-hero.png" alt="BidRide car on the road" fill className="object-cover" />
          </div>

          <div className="absolute top-8 right-4 sm:right-10 flex flex-col gap-3 w-64">
            {drivers.slice(0, 3).map((d, i) => (
              <div
                key={d.id}
                className={`rounded-card bg-white shadow-elevated p-4 ${i === 0 ? "border-2 border-gold" : "border border-cardBorder"}`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <Avatar src={d.avatar} alt={d.name} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">
                      {d.name} <span className="text-gold text-xs">★ {d.rating}</span>
                    </p>
                  </div>
                  {i === 0 && (
                    <span className="rounded-badge bg-gold text-navy text-[10px] font-bold px-2 py-0.5">
                      LOWEST BID
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold">{formatNaira(d.fare)}</span>
                  <span className="text-xs text-navy/40">{d.etaMinutes} min away</span>
                  <button className="rounded-btn bg-gold text-navy text-xs font-semibold px-3 py-1.5 min-h-[32px]">
                    Pick
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="px-6 sm:px-12 py-16">
        <h2 className="text-center font-display text-2xl sm:text-3xl font-bold mb-12">How BidRide works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <span className="mx-auto h-16 w-16 rounded-full bg-white shadow-soft flex items-center justify-center mb-4 relative">
                <s.icon size={22} className="text-navy" />
                <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gold text-navy text-xs font-bold flex items-center justify-center">
                  {s.num}
                </span>
              </span>
              <p className="font-semibold mb-1">{s.title}</p>
              <p className="text-sm text-navy/50 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-navy/40 mt-16 mb-8">Trusted by riders across Nigeria</p>
        <div className="flex flex-wrap justify-center gap-10">
          {trustBadges.map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <b.icon size={17} className="text-success" />
              </span>
              <div>
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="text-xs text-navy/50">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
