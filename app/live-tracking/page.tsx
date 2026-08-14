"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Locate, MapPin as MapPinIcon, MessageCircle, MessageSquare, Package, Phone, Share2 } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { FupreLeafletMap } from "@/components/FupreLeafletMap";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { getRideDriver, loadRide, saveRide, type StoredRide } from "@/lib/ride-store";
import { formatNaira, cn } from "@/lib/utils";
import { FUPRE_CAMPUS } from "@/lib/campus";

const progressSteps = [
  { key: "onTheWay", label: "On the way", icon: Car },
  { key: "arriving", label: "Arriving", icon: MessageSquare },
  { key: "pickup", label: "Pick up", icon: Package },
  { key: "dropoff", label: "Drop off", icon: MapPinIcon },
];

function LiveTrackingContent() {
  const openMobileMenu = useMobileMenu();
  const router = useRouter();
  const [ride, setRide] = useState<StoredRide | null>(null);
  const [secondsAway, setSecondsAway] = useState(0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const current = loadRide();
    setRide(current);
    const driver = getRideDriver(current);
    setSecondsAway((driver?.etaMinutes ?? 3) * 60);
  }, []);

  useEffect(() => {
    if (secondsAway <= 0) return;
    const timer = window.setInterval(() => setSecondsAway((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [secondsAway]);

  const driver = getRideDriver(ride);
  const minutesAway = Math.ceil(secondsAway / 60);
  const progressIndex = secondsAway <= 0 ? 2 : secondsAway <= 60 ? 1 : 0;
  const arrivalTime = useMemo(() => new Date(Date.now() + secondsAway * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), [secondsAway]);
  const pickupPoint = ride?.pickupCoords ?? { latitude: FUPRE_CAMPUS.centerLat, longitude: FUPRE_CAMPUS.centerLng };
  const destinationPoint = ride?.destinationCoords ?? { latitude: FUPRE_CAMPUS.centerLat - 0.002, longitude: FUPRE_CAMPUS.centerLng + 0.001 };
  const driverPoint = { latitude: pickupPoint.latitude + Math.min(0.002, secondsAway / 120000), longitude: pickupPoint.longitude + Math.min(0.002, secondsAway / 120000) };

  async function shareTrip() {
    if (!ride || !driver) return;
    const text = `BidRide trip with ${driver.name}: ${ride.pickup} to ${ride.destination}`;
    try {
      if (navigator.share) await navigator.share({ title: "My BidRide trip", text });
      else await navigator.clipboard.writeText(text);
      setNotice("Trip details are ready to share.");
    } catch {
      setNotice("Sharing was cancelled.");
    }
  }

  function cancelRide() {
    if (!ride) return;
    const updated = { ...ride, status: "CANCELLED" as const };
    saveRide(updated);
    setRide(updated);
    setNotice("Ride cancelled. Start a new request when you’re ready.");
  }

  if (!ride || !driver) {
    return <main className="flex-1 px-5 sm:px-8 py-8"><Card className="p-8 text-center max-w-xl mx-auto"><p className="text-sm text-navy/50 mb-4">Your active ride is not available.</p><Button onClick={() => router.push("/request-ride")}>Request a ride</Button></Card></main>;
  }

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} title="Live Tracking" subtitle={secondsAway > 0 ? "Your driver is on the way" : "Your driver has arrived"} />
      <main className="flex-1 flex flex-col">
        <div className="relative flex-1 min-h-[320px] overflow-hidden">
          <FupreLeafletMap pickup={pickupPoint} destination={destinationPoint} driver={driverPoint} followDriver={secondsAway > 0} className="absolute inset-0 min-h-0 rounded-none" />
          <div className="absolute top-4 left-4 flex flex-col gap-2"><button type="button" onClick={() => setNotice("The map is centered on your active route.")} className="h-11 w-11 bg-white rounded-input shadow-soft flex items-center justify-center" aria-label="Center on driver"><Car size={16} /></button></div>
          <div className="absolute top-4 right-4 flex flex-col gap-2"><button type="button" onClick={() => setNotice("Use the Satellite button on the map to view FUPRE from above.")} className="h-11 w-11 bg-white rounded-input shadow-soft flex items-center justify-center" aria-label="Map layers"><Locate size={16} /></button></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-input shadow-elevated px-4 py-2.5 text-center"><p className="text-xs text-navy/50">{secondsAway > 0 ? "Arriving in" : "Driver arrived"}</p><p className="text-success font-semibold text-sm">{secondsAway > 0 ? `${minutesAway} min` : "Now"} {secondsAway > 0 && <span className="text-navy/40 font-normal">({(secondsAway / 60 * 0.4).toFixed(1)} km)</span>}</p></div>
        </div>

        <Card className="mx-5 sm:mx-8 -mt-6 relative z-10 p-5 sm:p-6"><div className="flex flex-col sm:flex-row sm:items-center gap-5"><div className="flex items-center gap-3 flex-1"><Avatar src={driver.avatar} alt={driver.name} size={56} online /><div><p className="font-semibold">{driver.name}</p><p className="text-xs text-navy/50">{driver.trips.toLocaleString()} trips · {driver.vehicle}</p><span className="inline-flex mt-1 rounded-badge bg-success/10 text-success text-[11px] font-semibold px-2 py-0.5">Verified driver</span></div></div><div className="text-center"><p className="text-xs text-navy/50">{secondsAway > 0 ? "Arriving in" : "At pickup"}</p><p className="font-mono text-2xl font-bold text-success">{secondsAway > 0 ? `${minutesAway} min` : "Now"}</p><p className="text-xs text-navy/40">Updated just now</p></div><div className="flex sm:hidden md:flex items-center gap-1">{progressSteps.map((step, index) => <div key={step.key} className="flex items-center"><div className="flex flex-col items-center gap-1.5"><span className={cn("h-9 w-9 rounded-full flex items-center justify-center", index <= progressIndex ? "bg-success text-white" : "bg-bg text-navy/40")}><step.icon size={14} /></span><span className="text-[10px] text-navy/50 whitespace-nowrap">{step.label}</span></div>{index < progressSteps.length - 1 && <span className="w-6 h-px bg-cardBorder mx-1 mb-4" />}</div>)}</div><div className="grid grid-cols-3 sm:flex sm:flex-col gap-2 w-full sm:w-40"><Button variant="secondary" size="md" className="w-full" onClick={() => setNotice("Calling is protected and keeps your number private.")}><Phone size={15} /><span className="hidden sm:inline">Call driver</span></Button><Button variant="secondary" size="md" className="w-full" onClick={() => setNotice("Messaging will be available when the driver is close to pickup.")}><MessageCircle size={15} /><span className="hidden sm:inline">Message</span></Button><Button variant="danger" size="md" className="w-full" onClick={cancelRide}><span className="hidden sm:inline">Cancel ride</span><span className="sm:hidden">Cancel</span></Button></div></div>{notice && <p className="mt-4 text-sm text-navy/60" role="status">{notice}</p>}</Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-5 sm:px-8 py-6"><Card className="p-5"><p className="text-xs text-navy/50 mb-1">Estimated arrival</p><p className="font-mono text-lg font-bold">{arrivalTime}</p></Card><Card className="p-5"><p className="text-xs text-navy/50 mb-1">Distance to pickup</p><p className="font-mono text-lg font-bold">{secondsAway > 0 ? `${(secondsAway / 60 * 0.4).toFixed(1)} km` : "At pickup"}</p></Card><Card className="p-5 flex items-center justify-between"><div><p className="text-xs text-navy/50 mb-1">Trip fare</p><p className="font-mono text-lg font-bold">{formatNaira(ride.finalFare ?? driver.fare)}</p></div><span className="rounded-badge bg-gold/10 text-gold text-[11px] font-semibold px-2.5 py-1 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> Locked fare</span></Card></div>
        <div className="px-5 sm:px-8 pb-6 flex items-center justify-between gap-3"><p className="text-xs text-navy/50 flex items-center gap-2"><Share2 size={14} className="text-gold" /> Share your trip with someone you trust.</p><button type="button" onClick={shareTrip} className="text-sm text-gold font-semibold hover:underline">Share trip</button></div>
      </main>
    </>
  );
}

export default function LiveTrackingPage() {
  return <AppShell><LiveTrackingContent /></AppShell>;
}
