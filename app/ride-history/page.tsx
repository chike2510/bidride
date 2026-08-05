"use client";

import { useState } from "react";
import { Car, CheckCircle2, Clock, Wallet, Download, ChevronRight, TrendingUp } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { formatNaira, cn } from "@/lib/utils";

const stats = [
  { icon: Car, label: "Total Rides", sub: "All time", value: "48", color: "text-navy bg-bg" },
  { icon: CheckCircle2, label: "Completed", sub: "87.5%", value: "42", color: "text-success bg-success/10" },
  { icon: Clock, label: "Cancelled", sub: "8.3%", value: "4", color: "text-gold bg-gold/10" },
  { icon: Wallet, label: "Total Spent", sub: "All time", value: "₦68,450", color: "text-navy/70 bg-navy/5" },
];

const rides = [
  { date: "May 19", year: "2025", time: "10:42 AM", from: "15 Admiralty Way, Lekki Phase 1", to: "Murtala Muhammed International Airport", driver: "David", rating: 4.8, vehicle: "Toyota Corolla", plate: "ABC 123 XY", distance: "14.6 km", duration: "28 min", fare: 1440, status: "Completed" as const },
  { date: "May 17", year: "2025", time: "7:15 PM", from: "Chevron, Lekki", to: "Victoria Island, Lagos", driver: "Ada", rating: 4.9, vehicle: "Toyota Camry", plate: "DEF 456 GH", distance: "8.2 km", duration: "22 min", fare: 980, status: "Completed" as const },
  { date: "May 15", year: "2025", time: "2:30 PM", from: "Ikoyi, Lagos", to: "Yaba, Lagos", driver: "Michael", rating: 4.7, vehicle: "Honda Accord", plate: "GHI 789 IJ", distance: "11.3 km", duration: "25 min", fare: 1260, status: "Completed" as const },
  { date: "May 14", year: "2025", time: "9:05 AM", from: "Lekki Phase 1", to: "Ajah, Lagos", driver: "Tunde", rating: 4.6, vehicle: "Toyota Corolla", plate: "JKL 321 KL", distance: "—", duration: "—", fare: 0, status: "Cancelled" as const },
  { date: "May 12", year: "2025", time: "6:40 PM", from: "Maryland, Lagos", to: "Surulere, Lagos", driver: "David", rating: 4.8, vehicle: "Toyota Corolla", plate: "ABC 123 XY", distance: "7.6 km", duration: "18 min", fare: 870, status: "Completed" as const },
];

const tabs = ["All Rides", "Completed", "Cancelled"];

function RideHistoryContent() {
  const openMobileMenu = useMobileMenu();
  const [activeTab, setActiveTab] = useState("All Rides");

  const filtered = rides.filter((r) => {
    if (activeTab === "All Rides") return true;
    if (activeTab === "Completed") return r.status === "Completed";
    return r.status === "Cancelled";
  });

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} title="Ride History" subtitle="View and manage your past trips" />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div>
          <div className="flex gap-6 border-b border-cardBorder mb-5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 text-sm font-medium border-b-2 -mb-px transition-colors min-h-[44px]",
                  activeTab === tab ? "border-gold text-navy" : "border-transparent text-navy/50 hover:text-navy"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stats.map((s) => (
              <Card key={s.label} className="p-4">
                <span className={cn("h-9 w-9 rounded-full flex items-center justify-center mb-2", s.color)}>
                  <s.icon size={16} />
                </span>
                <p className="font-mono font-bold text-lg">{s.value}</p>
                <p className="text-xs text-navy/50">{s.label}</p>
                <p className="text-[11px] text-navy/35">{s.sub}</p>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((ride, i) => (
              <Card key={i} className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-24 shrink-0">
                    <p className="text-sm font-semibold">
                      {ride.date} <span className="text-navy/40 font-normal">{ride.year}</span>
                    </p>
                    <p className="text-xs text-navy/50">{ride.time}</p>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-sm flex items-center gap-2 truncate">
                      <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" /> {ride.from}
                    </p>
                    <p className="text-sm flex items-center gap-2 truncate">
                      <span className="h-1.5 w-1.5 rounded-full bg-urgency shrink-0" /> {ride.to}
                    </p>
                    {ride.distance !== "—" && (
                      <p className="text-xs text-navy/40">
                        {ride.distance} · {ride.duration}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Avatar src={`/images/driver-${ride.driver.toLowerCase()}.png`} alt={ride.driver} size={36} />
                    <div>
                      <p className="text-sm font-medium">
                        {ride.driver} <span className="text-gold text-xs">★ {ride.rating}</span>
                      </p>
                      <p className="text-xs text-navy/50">{ride.vehicle}</p>
                      <p className="text-[11px] text-navy/35">{ride.plate}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <div>
                      <p className={cn("font-mono font-bold", ride.status === "Cancelled" ? "text-urgency line-through" : "text-navy")}>
                        {ride.status === "Cancelled" ? "₦0" : formatNaira(ride.fare)}
                      </p>
                      <p className={cn("text-xs", ride.status === "Completed" ? "text-success" : "text-urgency")}>
                        {ride.status}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-navy/30 hidden sm:block" />
                  </div>
                </div>

                {ride.status === "Completed" && (
                  <div className="flex justify-end mt-3 pt-3 border-t border-cardBorder">
                    <Button variant="secondary" className="text-xs px-3 h-9">
                      <Download size={13} /> Receipt
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="secondary">Load more rides ⌄</Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="flex flex-col gap-4 text-sm">
              {[
                { label: "Date range", value: "Last 30 days" },
                { label: "Ride status", value: "All Status" },
                { label: "Payment method", value: "All Methods" },
                { label: "Sort by", value: "Most recent" },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-navy/50 mb-1.5">{f.label}</p>
                  <button className="w-full rounded-input border border-cardBorder px-3.5 py-2.5 text-left flex items-center justify-between min-h-[44px]">
                    {f.value} <ChevronRight size={14} className="rotate-90 text-navy/40" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-success" />
              <p className="text-sm font-semibold">You&rsquo;ve saved {formatNaira(3450)}</p>
            </div>
            <p className="text-xs text-navy/50">by using BidRide compared to regular fares.</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold mb-1">Need help?</p>
            <p className="text-xs text-navy/50 mb-3">Visit our Help Center for support with your trips.</p>
            <Button variant="secondary" className="w-full">
              Go to Help Center →
            </Button>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function RideHistoryPage() {
  return (
    <AppShell>
      <RideHistoryContent />
    </AppShell>
  );
}
