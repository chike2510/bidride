"use client";

import { useRouter } from "next/navigation";
import { Star, Tag, Clock, MapPin, Car, ShieldCheck, CheckCircle2, Calendar, BarChart3, Lock } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { drivers, trip } from "@/lib/data";
import { formatNaira, cn } from "@/lib/utils";

const rows = [
  { key: "fare", label: "Fare (Live bid)", icon: Tag },
  { key: "eta", label: "ETA", icon: Clock },
  { key: "distance", label: "Distance", icon: MapPin },
  { key: "vehicle", label: "Vehicle", icon: Car },
  { key: "condition", label: "Vehicle condition", icon: ShieldCheck },
  { key: "acceptance", label: "Acceptance rate", icon: CheckCircle2 },
  { key: "years", label: "Years on BidRide", icon: Calendar },
  { key: "trips", label: "Total trips", icon: BarChart3 },
] as const;

const compareData = [
  { driverId: "david", tag: "BEST VALUE", tagVariant: "success" as const, condition: "Excellent", acceptance: "98%" },
  { driverId: "ada", tag: "CLOSEST", tagVariant: "gold" as const, condition: "Excellent", acceptance: "96%" },
  { driverId: "michael", tag: null, condition: "Good", acceptance: "94%" },
];

function CompareDriversContent() {
  const openMobileMenu = useMobileMenu();
  const router = useRouter();
  const lowestFare = Math.min(...drivers.map((d) => d.fare));

  return (
    <>
      <TopBar
        onMenuClick={openMobileMenu}
        backHref="/live-bidding"
        title="Compare Drivers"
        subtitle="Choose the ride that's best for you"
      />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div>
          <h2 className="font-display text-xl font-bold mb-1">Compare drivers</h2>
          <p className="text-sm text-navy/50 mb-5">All drivers are verified and background checked.</p>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-cardBorder">
                    <th className="text-left font-medium text-navy/50 px-5 py-4 w-40">Best for</th>
                    {compareData.map((c) => {
                      const driver = drivers.find((d) => d.id === c.driverId)!;
                      return (
                        <th key={c.driverId} className="px-5 py-4 text-center align-top">
                          {c.tag && (
                            <Badge variant={c.tagVariant} className="mb-2">
                              {c.tag}
                            </Badge>
                          )}
                          <Avatar src={driver.avatar} alt={driver.name} size={56} online className="mx-auto mb-2" />
                          <p className="font-semibold">{driver.name}</p>
                          <p className="flex items-center justify-center gap-1 text-xs text-navy/60">
                            <Star size={11} className="fill-gold text-gold" /> {driver.rating}
                          </p>
                          <p className="text-xs text-navy/40">{driver.trips.toLocaleString()} trips</p>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-b border-cardBorder last:border-0">
                      <td className="px-5 py-4 text-navy/50 flex items-center gap-2">
                        <row.icon size={14} /> {row.label}
                      </td>
                      {compareData.map((c) => {
                        const driver = drivers.find((d) => d.id === c.driverId)!;
                        const diff = driver.fare - lowestFare;
                        return (
                          <td key={c.driverId} className="px-5 py-4 text-center">
                            {row.key === "fare" && (
                              <div>
                                <p className="font-mono font-bold text-lg">{formatNaira(driver.fare)}</p>
                                <p className={cn("text-xs", diff === 0 ? "text-success" : "text-navy/40")}>
                                  {diff === 0 ? "↓ Lowest so far" : `₦${diff} higher`}
                                </p>
                              </div>
                            )}
                            {row.key === "eta" && (
                              <span className="text-success font-medium">{driver.etaMinutes} min away</span>
                            )}
                            {row.key === "distance" && <span>{driver.distanceKm} km</span>}
                            {row.key === "vehicle" && (
                              <span>
                                {driver.vehicle}
                                <br />
                                {driver.vehicleColor}
                              </span>
                            )}
                            {row.key === "condition" && (
                              <span
                                className={c.condition === "Excellent" ? "text-success font-medium" : "text-gold font-medium"}
                              >
                                {c.condition}
                              </span>
                            )}
                            {row.key === "acceptance" && <span>{c.acceptance}</span>}
                            {row.key === "years" && (
                              <span>
                                {driver.yearsOnBidRide} {driver.yearsOnBidRide === 1 ? "year" : "years"}
                              </span>
                            )}
                            {row.key === "trips" && <span>{driver.trips.toLocaleString()}</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td className="px-5 py-5" />
                    {compareData.map((c) => (
                      <td key={c.driverId} className="px-5 py-5 text-center">
                        <Button
                          variant={c.tag === "BEST VALUE" ? "primary" : "secondary"}
                          onClick={() => router.push("/ride-confirmed")}
                          className="w-full"
                        >
                          Pick this ride →
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <p className="flex items-center justify-center gap-2 text-xs text-navy/50 mt-4">
            <Lock size={12} /> Your payment is safe and secure.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Trip details</h3>
              <button className="text-sm text-gold font-medium hover:underline">Edit</button>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <p className="text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success shrink-0" /> {trip.pickup}
              </p>
              <p className="text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-urgency shrink-0" /> {trip.destination}
              </p>
            </div>
            <div className="pt-3 border-t border-cardBorder">
              <p className="text-xs text-navy/50 mb-1">Estimated range</p>
              <p className="font-mono text-xl font-bold">
                {formatNaira(trip.fareRangeLow)} – {formatNaira(trip.fareRangeHigh)}
              </p>
              <p className="text-xs text-navy/40 mt-1">Final fare shown after you pick a driver.</p>
              <span className="inline-flex mt-3 rounded-badge bg-success/10 text-success text-xs font-semibold px-2.5 py-1">
                42s left to choose
              </span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">Tips</h3>
            <div className="flex flex-col gap-4 text-sm text-navy/70">
              <p>Lower fares may arrive anytime before time runs out.</p>
              <p>All drivers are verified and background checked.</p>
              <p>Pick the best value, not just the lowest price.</p>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function CompareDriversPage() {
  return (
    <AppShell>
      <CompareDriversContent />
    </AppShell>
  );
}
