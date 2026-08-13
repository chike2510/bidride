"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Calendar, Car, CheckCircle2, Clock, Lock, MapPin, ShieldCheck, Star, Tag } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { createDemoRide, loadRide, saveRide, type StoredRide } from "@/lib/ride-store";
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

function CompareDriversContent() {
  const openMobileMenu = useMobileMenu();
  const router = useRouter();
  const [ride, setRide] = useState<StoredRide | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const current = loadRide() ?? createDemoRide();
    setRide(current);
    saveRide(current);
  }, []);

  const drivers = ride?.bids.slice(0, 3) ?? [];
  const lowestFare = useMemo(() => Math.min(...drivers.map((driver) => driver.fare)), [drivers]);

  function pick(driverId: string) {
    if (!ride) return;
    const driver = ride.bids.find((item) => item.id === driverId);
    if (!driver) return;
    const updated = { ...ride, status: "DRIVER_ASSIGNED" as const, acceptedDriverId: driver.id, finalFare: driver.fare };
    saveRide(updated);
    router.push(`/ride-confirmed?rideId=${updated.id}`);
  }

  if (!ride) return <main className="flex-1 px-5 sm:px-8 py-8"><Card className="p-8 text-center"><p className="text-sm text-navy/50">Preparing comparison…</p></Card></main>;

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} backHref="/live-bidding" title="Compare Drivers" subtitle="Choose the ride that fits you best" />
      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6"><div><h2 className="font-display text-xl font-bold mb-1">Compare offers</h2><p className="text-sm text-navy/50 mb-5">Compare price, pickup speed, and driver trust signals side by side.</p><Card className="p-0 overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead><tr className="border-b border-cardBorder"><th className="text-left font-medium text-navy/50 px-5 py-4 w-40">Best for</th>{drivers.map((driver, index) => <th key={driver.id} className="px-5 py-4 text-center align-top">{index === 0 && <Badge variant="success" className="mb-2">BEST VALUE</Badge>}<Avatar src={driver.avatar} alt={driver.name} size={56} online className="mx-auto mb-2" /><p className="font-semibold">{driver.name}</p><p className="flex items-center justify-center gap-1 text-xs text-navy/60"><Star size={11} className="fill-gold text-gold" /> {driver.rating}</p><p className="text-xs text-navy/40">{driver.trips.toLocaleString()} trips</p></th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.key} className="border-b border-cardBorder last:border-0"><td className="px-5 py-4 text-navy/50 flex items-center gap-2"><row.icon size={14} /> {row.label}</td>{drivers.map((driver) => { const diff = driver.fare - lowestFare; return <td key={driver.id} className="px-5 py-4 text-center">{row.key === "fare" && <div><p className="font-mono font-bold text-lg">{formatNaira(driver.fare)}</p><p className={cn("text-xs", diff === 0 ? "text-success" : "text-navy/40")}>{diff === 0 ? "↓ Lowest so far" : `${formatNaira(diff)} higher`}</p></div>}{row.key === "eta" && <span className="text-success font-medium">{driver.etaMinutes} min away</span>}{row.key === "distance" && <span>{driver.distanceKm} km</span>}{row.key === "vehicle" && <span>{driver.vehicle}<br />{driver.vehicleColor}</span>}{row.key === "condition" && <span className="text-success font-medium">Excellent</span>}{row.key === "acceptance" && <span>{98 - driver.etaMinutes}%</span>}{row.key === "years" && <span>{driver.yearsOnBidRide} {driver.yearsOnBidRide === 1 ? "year" : "years"}</span>}{row.key === "trips" && <span>{driver.trips.toLocaleString()}</span>}</td>; })}</tr>)}<tr><td className="px-5 py-5" />{drivers.map((driver, index) => <td key={driver.id} className="px-5 py-5 text-center"><Button variant={index === 0 ? "primary" : "secondary"} onClick={() => pick(driver.id)} className="w-full">Pick this ride →</Button></td>)}</tr></tbody></table></div></Card><p className="flex items-center justify-center gap-2 text-xs text-navy/50 mt-4"><Lock size={12} /> The fare is shown before you accept.</p></div><div className="flex flex-col gap-4"><Card className="p-5"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Trip details</h3><button type="button" onClick={() => router.push("/request-ride")} className="text-sm text-gold font-medium hover:underline">Edit</button></div><div className="flex flex-col gap-2 mb-4"><p className="text-sm flex items-start gap-2"><span className="h-2 w-2 rounded-full bg-success shrink-0 mt-2" /> {ride.pickup}</p><p className="text-sm flex items-start gap-2"><span className="h-2 w-2 rounded-full bg-urgency shrink-0 mt-2" /> {ride.destination}</p></div><div className="pt-3 border-t border-cardBorder"><p className="text-xs text-navy/50 mb-1">Estimated range</p><p className="font-mono text-xl font-bold">{formatNaira(ride.estimatedFareLow)} – {formatNaira(ride.estimatedFareHigh)}</p><span className="inline-flex mt-3 rounded-badge bg-success/10 text-success text-xs font-semibold px-2.5 py-1">{Math.max(0, Math.ceil((ride.bidDeadline - Date.now()) / 1000))}s left to choose</span></div></Card><Card className="p-5"><h3 className="font-semibold mb-3">Decision support</h3><div className="flex flex-col gap-4 text-sm text-navy/70"><p>Lower fares may arrive before the timer ends.</p><p>All drivers show verified profile and vehicle details.</p><p>Use the live bidding view for the latest offer order.</p></div>{notice && <p className="mt-3 text-sm text-success" role="status">{notice}</p>}</Card></div></main>
    </>
  );
}

export default function CompareDriversPage() { return <AppShell><CompareDriversContent /></AppShell>; }
