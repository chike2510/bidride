"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CarFront, Check, ChevronRight, MessageCircle, Phone, Share2, ShieldCheck, Siren, Star } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { getRideDriver, loadRide, saveRide, type StoredRide } from "@/lib/ride-store";
import { formatNaira } from "@/lib/utils";

function RideConfirmedContent() {
  const openMobileMenu = useMobileMenu();
  const router = useRouter();
  const [ride, setRide] = useState<StoredRide | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setRide(loadRide());
  }, []);

  const driver = getRideDriver(ride);

  async function shareTrip() {
    if (!ride || !driver) return;
    const shareText = `BidRide trip with ${driver.name}: ${ride.pickup} to ${ride.destination}`;
    try {
      if (navigator.share) await navigator.share({ title: "My BidRide trip", text: shareText });
      else await navigator.clipboard.writeText(shareText);
      setNotice("Trip details ready to share.");
    } catch {
      setNotice("Sharing was cancelled.");
    }
  }

  function cancelRide() {
    if (!ride) return;
    const updated = { ...ride, status: "CANCELLED" as const };
    saveRide(updated);
    setRide(updated);
    setNotice("Ride cancelled. No driver will be dispatched.");
  }

  if (!ride || !driver) {
    return (
      <main className="flex-1 px-5 sm:px-8 py-8"><Card className="p-8 text-center max-w-xl mx-auto"><p className="text-sm text-navy/50 mb-4">No active ride was found.</p><Button onClick={() => router.push("/request-ride")}>Request a ride</Button></Card></main>
    );
  }

  const fare = ride.finalFare ?? driver.fare;
  const cancelled = ride.status === "CANCELLED";

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} title={cancelled ? "Ride Cancelled" : "Ride Confirmed"} subtitle={cancelled ? "You can start a new request anytime" : "Your driver is on the way"} />
      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-4">
          <Card className="p-6 sm:p-8 text-center">
            <span className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 animate-fade-slide-in ${cancelled ? "bg-urgency" : "bg-success"}`}><Check size={30} className="text-white" strokeWidth={3} /></span>
            <h2 className="font-display text-2xl font-bold mb-1">{cancelled ? "Your ride was cancelled" : "You’re all set!"}</h2>
            <p className="text-sm text-navy/50 mb-6">{cancelled ? "No payment has been captured for this ride." : `${driver.name} accepted your ride request at ${formatNaira(fare)}.`}</p>

            {!cancelled && (
              <>
                <div className="flex items-center gap-4 rounded-input border border-cardBorder p-4 text-left mb-4">
                  <Avatar src={driver.avatar} alt={driver.name} size={56} online />
                  <div className="flex-1 min-w-0"><p className="font-semibold">{driver.name}</p><span className="flex items-center gap-1 text-xs text-navy/60"><Star size={12} className="fill-gold text-gold" /> {driver.rating} · {driver.trips.toLocaleString()} trips</span><span className="inline-flex mt-1.5 rounded-badge bg-success/10 text-success text-[11px] font-semibold px-2 py-0.5">Verified driver</span></div>
                  <div className="h-14 w-20 shrink-0 hidden sm:flex items-center justify-center rounded-input bg-bg"><CarFront size={34} className="text-navy/60" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-left text-sm mb-6"><p className="text-navy/50">Vehicle</p><p className="text-right font-medium">{driver.vehicle} · {driver.vehicleColor}</p></div>
                <div className="rounded-input bg-success/5 border border-success/20 p-4 flex items-center justify-between mb-5"><div className="text-left"><p className="text-xs text-navy/50">Arriving in</p><p className="font-mono text-2xl font-bold text-success">{driver.etaMinutes} min</p><p className="text-xs text-navy/40">({driver.distanceKm} km away)</p></div><div className="h-16 w-16 rounded-full overflow-hidden"><Image src="/images/route-placeholder.svg" alt="Route preview" width={64} height={64} className="h-full w-full object-cover" /></div></div>
                <div className="grid grid-cols-2 gap-3 mb-3"><Button variant="secondary" className="w-full" onClick={() => setNotice("Calling is protected and will connect you without revealing your number.")}><Phone size={16} /> Call driver</Button><Button variant="secondary" className="w-full" onClick={() => setNotice("Messaging will open when the driver is close to pickup.")}><MessageCircle size={16} /> Message</Button></div>
                <Button variant="success" size="lg" className="w-full mb-2" onClick={() => router.push("/live-tracking")}>Track ride →</Button>
                <Button variant="danger" size="lg" className="w-full" onClick={cancelRide}>Cancel ride</Button>
              </>
            )}
            {notice && <p className="mt-4 text-sm text-navy/60" role="status">{notice}</p>}
          </Card>

          <p className="flex items-center justify-center gap-2 text-xs text-navy/50 text-center"><ShieldCheck size={14} className="text-success" /> Your safety matters to us. Driver identity and vehicle details are visible before pickup.</p>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-3 h-52 relative overflow-hidden"><div className="absolute inset-3 rounded-input overflow-hidden"><Image src="/images/route-placeholder.svg" alt="Route map" fill className="object-cover" /></div></Card>
          <Card className="p-5"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Trip details</h3><span className="text-sm font-mono font-semibold">{formatNaira(fare)}</span></div><div className="flex flex-col gap-2 mb-4"><p className="text-sm flex items-start gap-2"><span className="h-2 w-2 rounded-full bg-success shrink-0 mt-2" /> {ride.pickup}</p><p className="text-sm flex items-start gap-2"><span className="h-2 w-2 rounded-full bg-urgency shrink-0 mt-2" /> {ride.destination}</p></div><div className="flex items-center justify-between text-sm pt-3 border-t border-cardBorder"><span className="text-navy/50">Passengers / type</span><span className="font-medium">{ride.passengers} · {ride.rideType}</span></div></Card>
          <Card className="p-5"><div className="flex items-start gap-3 mb-4"><span className="h-9 w-9 rounded-full bg-success/10 flex items-center justify-center shrink-0"><ShieldCheck size={16} className="text-success" /></span><div><p className="font-semibold text-sm">Safety first</p><p className="text-xs text-navy/50">Keep someone you trust informed about your trip.</p></div><ChevronRight size={16} className="text-navy/30 ml-auto shrink-0" /></div><div className="grid grid-cols-3 gap-2"><button type="button" onClick={shareTrip} className="flex flex-col items-center gap-1.5 rounded-input border border-cardBorder py-3 text-xs font-medium hover:bg-bg transition-colors min-h-[44px]"><Share2 size={16} /> Share trip</button><button type="button" onClick={() => setNotice("Emergency support is available from the BidRide Safety team.")} className="flex flex-col items-center gap-1.5 rounded-input border border-urgency/30 text-urgency py-3 text-xs font-medium hover:bg-urgency/5 transition-colors min-h-[44px]"><Siren size={16} /> Emergency</button><button type="button" onClick={() => setNotice("Keep your pickup spot well lit and verify the vehicle before entering.")} className="flex flex-col items-center gap-1.5 rounded-input border border-cardBorder py-3 text-xs font-medium hover:bg-bg transition-colors min-h-[44px]"><ShieldCheck size={16} /> Safety tips</button></div></Card>
        </div>
      </main>
    </>
  );
}

export default function RideConfirmedPage() {
  return <AppShell><RideConfirmedContent /></AppShell>;
}
