"use client";

import Link from "next/link";
import { Sun, Sunrise, Moon, MapPin, ArrowUpDown, Users, Car, Star, Tag, ShieldCheck, Clock, Home, Briefcase, Plane } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FupreLeafletMap } from "@/components/FupreLeafletMap";
import { recentPlaces } from "@/lib/data";
import { useCurrentUser } from "@/lib/use-current-user";
import { FUPRE_CAMPUS } from "@/lib/campus";

const placeIcons = { home: Home, briefcase: Briefcase, plane: Plane };

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { line: "Good morning,", icon: <Sunrise size={20} className="text-gold" /> };
  if (hour < 18) return { line: "Good afternoon,", icon: <Sun size={20} className="text-gold" /> };
  return { line: "Good evening,", icon: <Moon size={20} className="text-gold" /> };
}

function DashboardContent() {
  const openMobileMenu = useMobileMenu();
  const { user } = useCurrentUser();
  const greeting = timeGreeting();

  return (
    <>
      <TopBar
        onMenuClick={openMobileMenu}
        greeting={{
          icon: greeting.icon,
          name: user?.name ?? "there",
          line: greeting.line,
        }}
      />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        <div className="flex flex-col gap-6">
          <Card className="p-4 border-gold/20 bg-gold/5">
            <div className="flex items-start gap-3">
              <span className="h-10 w-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0"><MapPin size={17} className="text-gold" /></span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.16em] text-gold font-semibold">Campus mode</p>
                <p className="font-semibold text-sm mt-1">{FUPRE_CAMPUS.shortName} campus rides</p>
                <p className="text-xs text-navy/55 mt-1">Pickup and bidding are focused around FUPRE Effurun landmarks.</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-xl font-bold mb-1">Where are you going on campus?</h2>
            <p className="text-sm text-navy/50 mb-5">Nearby FUPRE drivers will bid for your ride</p>

            <div className="rounded-input border border-cardBorder overflow-hidden mb-4">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cardBorder">
                <span className="h-2 w-2 rounded-full bg-success shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-navy/50">Pickup location</p>
                  <p className="text-sm font-medium">Current location</p>
                </div>
                <MapPin size={16} className="text-navy/40" />
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5 relative">
                <span className="h-2 w-2 rounded-full bg-urgency shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-navy/50">Destination</p>
                  <p className="text-sm text-navy/40">Where to?</p>
                </div>
                <button
                  className="h-9 w-9 rounded-full border border-cardBorder flex items-center justify-center hover:bg-bg transition-colors"
                  aria-label="Swap pickup and destination"
                >
                  <ArrowUpDown size={14} />
                </button>
              </div>
            </div>

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

            <Link href="/request-ride">
              <Button size="lg" className="w-full justify-between">
                Request Ride
                <span aria-hidden>→</span>
              </Button>
            </Link>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold">Recent Places</h3>
              <Link href="/saved-places" className="text-sm text-gold font-medium hover:underline">
                View all
              </Link>
            </div>
            <Card className="divide-y divide-cardBorder">
              {recentPlaces.map((place) => {
                const Icon = placeIcons[place.icon];
                return (
                  <div key={place.id} className="flex items-center gap-3 px-5 py-4">
                    <span className="h-10 w-10 rounded-full bg-bg flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-navy/60" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{place.label}</p>
                      <p className="text-xs text-navy/50 truncate">{place.address}</p>
                    </div>
                    <Star size={16} className="text-navy/30" />
                  </div>
                );
              })}
            </Card>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold mb-3">Ride smarter with BidRide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Tag, title: "Save more", body: "Drivers compete to offer you the best fares." },
                { icon: ShieldCheck, title: "Ride safe", body: "All drivers are verified and background checked." },
                { icon: Clock, title: "Real-time bids", body: "Watch fares drop live and pick the best ride." },
              ].map((f) => (
                <Card key={f.title} hoverLift className="p-5">
                  <span className="h-10 w-10 rounded-input bg-gold/10 flex items-center justify-center mb-3">
                    <f.icon size={18} className="text-gold" />
                  </span>
                  <p className="font-semibold text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-navy/50 leading-relaxed">{f.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card className="p-3 h-72 lg:h-full relative overflow-hidden">
          <div className="absolute inset-3 rounded-input overflow-hidden">
            <FupreLeafletMap className="h-full" />
          </div>
        </Card>
      </main>
    </>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
