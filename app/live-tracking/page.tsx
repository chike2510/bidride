"use client";

import Image from "next/image";
import { Phone, MessageCircle, Car, MessageSquare, Package, MapPin as MapPinIcon, Layers, Plus, Minus, Locate, Share2 } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { drivers, trip } from "@/lib/data";
import { formatNaira, cn } from "@/lib/utils";

const progressSteps = [
  { key: "onTheWay", label: "On the way", icon: Car, active: true },
  { key: "arriving", label: "Arriving", icon: MessageSquare, active: false },
  { key: "pickup", label: "Pick up", icon: Package, active: false },
  { key: "dropoff", label: "Drop off", icon: MapPinIcon, active: false },
];

function LiveTrackingContent() {
  const openMobileMenu = useMobileMenu();
  const driver = drivers[0];

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} title="Live Tracking" subtitle="Your driver is on the way" />

      <main className="flex-1 flex flex-col">
        <div className="relative flex-1 min-h-[320px]">
          <Image src="/images/route-placeholder.png" alt="Live map" fill className="object-cover" />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {[Car, Layers].map((Icon, i) => (
              <button
                key={i}
                className="h-11 w-11 bg-white rounded-input shadow-soft flex items-center justify-center"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {[Plus, Minus, Locate].map((Icon, i) => (
              <button
                key={i}
                className="h-11 w-11 bg-white rounded-input shadow-soft flex items-center justify-center"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-input shadow-elevated px-4 py-2.5 text-center">
            <p className="text-xs text-navy/50">Arriving in</p>
            <p className="text-success font-semibold text-sm">
              {driver.etaMinutes} min <span className="text-navy/40 font-normal">({driver.distanceKm} km)</span>
            </p>
          </div>
        </div>

        <Card className="mx-5 sm:mx-8 -mt-6 relative z-10 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-3 flex-1">
              <Avatar src={driver.avatar} alt={driver.name} size={56} online />
              <div>
                <p className="font-semibold">{driver.name}</p>
                <p className="text-xs text-navy/50">{driver.trips.toLocaleString()} trips</p>
                <span className="inline-flex mt-1 rounded-badge bg-success/10 text-success text-[11px] font-semibold px-2 py-0.5">
                  Verified Driver
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-navy/50">Arriving in</p>
              <p className="font-mono text-2xl font-bold text-success">{driver.etaMinutes} min</p>
              <p className="text-xs text-navy/40">({driver.distanceKm} km away)</p>
            </div>

            <div className="flex sm:hidden md:flex items-center gap-1">
              {progressSteps.map((step, i) => (
                <div key={step.key} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center",
                        step.active ? "bg-success text-white" : "bg-bg text-navy/40"
                      )}
                    >
                      <step.icon size={14} />
                    </span>
                    <span className="text-[10px] text-navy/50 whitespace-nowrap">{step.label}</span>
                  </div>
                  {i < progressSteps.length - 1 && <span className="w-6 h-px bg-cardBorder mx-1 mb-4" />}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2 w-full sm:w-40">
              <Button variant="secondary" size="md" className="w-full">
                <Phone size={15} />
                <span className="hidden sm:inline">Call Driver</span>
              </Button>
              <Button variant="secondary" size="md" className="w-full">
                <MessageCircle size={15} />
                <span className="hidden sm:inline">Message</span>
              </Button>
              <Button variant="danger" size="md" className="w-full">
                <span className="hidden sm:inline">Cancel Ride</span>
                <span className="sm:hidden">Cancel</span>
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-5 sm:px-8 py-6">
          <Card className="p-5">
            <p className="text-xs text-navy/50 mb-1">Estimated arrival</p>
            <p className="font-mono text-lg font-bold">10:42 AM</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-navy/50 mb-1">Distance to pickup</p>
            <p className="font-mono text-lg font-bold">{driver.distanceKm} km</p>
          </Card>
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-navy/50 mb-1">Trip fare (estimated)</p>
              <p className="font-mono text-lg font-bold">{formatNaira(driver.fare)}</p>
            </div>
            <span className="rounded-badge bg-gold/10 text-gold text-[11px] font-semibold px-2.5 py-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Live fare
            </span>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function LiveTrackingPage() {
  return (
    <AppShell>
      <LiveTrackingContent />
    </AppShell>
  );
}
