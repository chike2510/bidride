"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CarFront, Check, Clock3, MapPin, Navigation, ShieldCheck, Wifi, X } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FUPRE_CAMPUS } from "@/lib/campus";
import {
  loadDriverState,
  saveDriverState,
  subscribeToDriverState,
  submitDriverBid,
  type DriverRequest,
  type DriverState,
} from "@/lib/driver-store";
import { formatDistance } from "@/lib/geo";
import { formatNaira } from "@/lib/utils";
import { useCurrentUser } from "@/lib/use-current-user";

function DriverConsoleContent() {
  const openMobileMenu = useMobileMenu();
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();
  const [state, setState] = useState<DriverState | null>(null);
  const stateRef = useRef<DriverState | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<DriverRequest | null>(null);
  const [fare, setFare] = useState(800);
  const [eta, setEta] = useState(4);
  const [now, setNow] = useState(Date.now());
  const [notice, setNotice] = useState("");
  const [locationBusy, setLocationBusy] = useState(false);

  useEffect(() => {
    if (!userLoading && user && user.role !== "driver") router.replace("/dashboard");
  }, [router, user, userLoading]);

  useEffect(() => {
    const initialState = loadDriverState();
    stateRef.current = initialState;
    setState(initialState);
    const syncRequests = async () => {
      try {
        const response = await fetch("/api/drivers/requests", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        setState((previous) => previous ? { ...previous, requests: data.requests ?? [] } : previous);
      } catch {
        // Preserve the last known request list during network interruptions.
      }
    };
    void syncRequests();
    const poll = window.setInterval(syncRequests, 3000);
    const unsubscribe = subscribeToDriverState(setState);
    return () => {
      window.clearInterval(poll);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const snapshot = stateRef.current;
    if (!snapshot || snapshot.availability.status !== "available" || !navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        const current = stateRef.current;
        if (!current) return;
        const availability = {
          ...current.availability,
          status: "available" as const,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: Math.round(position.coords.accuracy),
          lastSeenAt: Date.now(),
        };
        const nextState = { ...current, availability };
        stateRef.current = nextState;
        saveDriverState(nextState);
        void fetch("/api/drivers/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campusId: FUPRE_CAMPUS.id, latitude: availability.latitude, longitude: availability.longitude, accuracyMeters: availability.accuracyMeters, status: "available" }),
        });
      },
      () => setNotice("Location updates paused. Check browser location permission."),
      { enableHighAccuracy: true, maximumAge: 15_000, timeout: 10_000 }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [state?.availability.status]);

  const openRequests = useMemo(
    () => state?.requests.filter((request) => request.status !== "expired") ?? [],
    [state]
  );

  function updateAvailability(nextStatus: "offline" | "available") {
    if (!state) return;

    if (nextStatus === "offline") {
      const next = {
        ...state,
        availability: {
          ...state.availability,
          status: "offline" as const,
          lastSeenAt: Date.now(),
        },
      };
      saveDriverState(next);
      void fetch("/api/drivers/availability", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ campusId: FUPRE_CAMPUS.id, latitude: next.availability.latitude, longitude: next.availability.longitude, accuracyMeters: next.availability.accuracyMeters, status: "offline" }) });
      setNotice("You are now offline and will not receive new campus requests.");
      return;
    }

    setLocationBusy(true);
    if (!navigator.geolocation) {
      const next = {
        ...state,
        availability: {
          ...state.availability,
          status: "available" as const,
          lastSeenAt: Date.now(),
        },
      };
      saveDriverState(next);
      setNotice("Location is unavailable in this browser. FUPRE demo location is being used.");
      setLocationBusy(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const availability = {
          ...state.availability,
          status: "available" as const,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: Math.round(position.coords.accuracy),
          lastSeenAt: Date.now(),
        };
        saveDriverState({ ...state, availability });
        void fetch("/api/drivers/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campusId: FUPRE_CAMPUS.id, latitude: availability.latitude, longitude: availability.longitude, accuracyMeters: availability.accuracyMeters, status: "available" }),
        });
        setNotice("You are available for nearby FUPRE requests.");
        setLocationBusy(false);
      },
      () => {
        saveDriverState({
          ...state,
          availability: {
            ...state.availability,
            status: "available",
            latitude: FUPRE_CAMPUS.centerLat,
            longitude: FUPRE_CAMPUS.centerLng,
            accuracyMeters: 100,
            lastSeenAt: Date.now(),
          },
        });
        setNotice("Location permission was not granted. Using the FUPRE demo location.");
        setLocationBusy(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 }
    );
  }

  function openBidSheet(request: DriverRequest) {
    setSelectedRequest(request);
    setFare(Math.round((request.suggestedFareLow + request.suggestedFareHigh) / 2));
    setEta(Math.max(2, Math.ceil(request.pickupDistanceKm * 4)));
    setNotice("");
  }

  async function sendBid() {
    if (!selectedRequest) return;
    if (!state || state.availability.status !== "available") {
      setNotice("Go available before submitting a bid.");
      return;
    }
    if (fare < 300 || fare > 5000) {
      setNotice("Enter a fare between ₦300 and ₦5,000.");
      return;
    }
    try {
      const response = await fetch(`/api/rides/${selectedRequest.id}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fare, etaMinutes: eta, distanceKm: selectedRequest.pickupDistanceKm }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice(data.error ?? "Unable to submit this bid.");
        return;
      }
      submitDriverBid(selectedRequest.id, fare, eta);
      setSelectedRequest(null);
      setNotice("Your bid was sent to the rider.");
    } catch {
      setNotice("Could not reach the ride service. Try again.");
    }
  }

  if (!state) {
    return (
      <main className="flex-1 px-5 sm:px-8 py-8">
        <Card className="p-8 text-center text-sm text-navy/50">Loading driver console…</Card>
      </main>
    );
  }

  return (
    <>
      <TopBar
        onMenuClick={openMobileMenu}
        title="Driver Console"
        subtitle="FUPRE campus requests"
      />

      <main className="flex-1 px-5 sm:px-8 py-6 space-y-5">
        <section className="rounded-card bg-navy text-white p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold mb-2">
              FUPRE campus network
            </p>
            <h2 className="font-display text-2xl font-bold">Ready to earn around campus?</h2>
            <p className="text-white/60 text-sm mt-1 max-w-xl">
              Share your availability and receive ride requests from nearby FUPRE riders.
            </p>
          </div>
          <Button
            size="lg"
            variant={state.availability.status === "available" ? "secondary" : "primary"}
            className={state.availability.status === "available" ? "bg-white/10 text-white border-white/20" : ""}
            onClick={() => updateAvailability(state.availability.status === "available" ? "offline" : "available")}
            disabled={locationBusy}
          >
            <Wifi size={16} />
            {locationBusy ? "Checking location…" : state.availability.status === "available" ? "Go offline" : "Go available"}
          </Button>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-success mb-2"><span className="h-2 w-2 rounded-full bg-success" /><span className="text-xs font-semibold uppercase tracking-wide">Status</span></div>
            <p className="font-display text-xl font-bold capitalize">{state.availability.status}</p>
            <p className="text-xs text-navy/50 mt-1">Only available drivers receive requests.</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-gold mb-2"><MapPin size={15} /><span className="text-xs font-semibold uppercase tracking-wide">Campus radius</span></div>
            <p className="font-display text-xl font-bold">{FUPRE_CAMPUS.radiusKm} km</p>
            <p className="text-xs text-navy/50 mt-1">FUPRE Effurun service area.</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-navy/50 mb-2"><Navigation size={15} /><span className="text-xs font-semibold uppercase tracking-wide">Location</span></div>
            <p className="font-display text-xl font-bold">{state.availability.accuracyMeters} m</p>
            <p className="text-xs text-navy/50 mt-1">Last update {state.availability.lastSeenAt ? new Date(state.availability.lastSeenAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "not yet"}.</p>
          </Card>
        </div>

        {notice && <p className="text-sm text-success" role="status">{notice}</p>}

        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">Incoming requests</p>
              <h2 className="font-display text-xl font-bold">Nearby FUPRE rides</h2>
            </div>
            <span className="text-sm text-navy/50">{openRequests.length} requests</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {openRequests.map((request) => {
              const secondsLeft = Math.max(0, Math.ceil((request.expiresAt - now) / 1000));
              const bid = state.bids.find((item) => item.requestId === request.id);

              return (
                <Card key={request.id} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold">{request.pickup} → {request.destination}</p>
                      <p className="text-xs text-navy/50 mt-1">{formatDistance(request.pickupDistanceKm)} away · {request.passengers} passenger{request.passengers === 1 ? "" : "s"}</p>
                    </div>
                    <span className={`rounded-badge px-2.5 py-1 text-xs font-semibold ${secondsLeft < 15 ? "bg-urgency/10 text-urgency" : "bg-gold/10 text-navy"}`}>
                      <Clock3 size={12} className="inline mr-1" /> {secondsLeft}s
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-input bg-bg p-3 mb-4 text-center">
                    <div><p className="text-[11px] text-navy/50">Trip distance</p><p className="font-mono font-semibold text-sm">{formatDistance(request.tripDistanceKm)}</p></div>
                    <div><p className="text-[11px] text-navy/50">Suggested</p><p className="font-mono font-semibold text-sm">{formatNaira(request.suggestedFareLow)}+</p></div>
                    <div><p className="text-[11px] text-navy/50">Preference</p><p className="font-semibold text-xs truncate">{request.preferences[0] ?? "Standard"}</p></div>
                  </div>

                  {bid ? (
                    <div className="flex items-center justify-between rounded-input border border-success/20 bg-success/5 px-3.5 py-3 text-sm">
                      <span className="flex items-center gap-2 text-success font-medium"><Check size={15} /> Bid submitted</span>
                      <span className="font-mono font-bold">{formatNaira(bid.fare)} · {bid.etaMinutes} min</span>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => openBidSheet(request)} disabled={state.availability.status !== "available" || secondsLeft === 0}>
                      <CarFront size={16} /> Review and bid
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        <Card className="p-5 border-gold/20 bg-gold/5">
          <div className="flex items-start gap-3">
            <ShieldCheck size={19} className="text-gold mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">FUPRE safety reminder</p>
              <p className="text-xs text-navy/60 mt-1">Only accept requests you can complete safely. Never share private rider information outside the active trip.</p>
            </div>
          </div>
        </Card>
      </main>

      {selectedRequest && (
        <div className="fixed inset-0 z-[60] bg-navy/45 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Submit bid">
          <Card className="w-full max-w-md p-6 relative">
            <button type="button" onClick={() => setSelectedRequest(null)} className="absolute right-4 top-4 h-9 w-9 rounded-full flex items-center justify-center hover:bg-bg" aria-label="Close bid form"><X size={17} /></button>
            <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold mb-2">Submit a bid</p>
            <h2 className="font-display text-xl font-bold mb-1">{selectedRequest.pickup} → {selectedRequest.destination}</h2>
            <p className="text-sm text-navy/50 mb-5">Suggested range: {formatNaira(selectedRequest.suggestedFareLow)} – {formatNaira(selectedRequest.suggestedFareHigh)}</p>
            <label className="block text-sm font-medium mb-4">Your fare<input type="number" min={300} max={5000} value={fare} onChange={(event) => setFare(Number(event.target.value))} className="mt-1.5 w-full h-12 rounded-input border border-cardBorder px-4 font-mono focus:outline-none focus:ring-2 focus:ring-gold" /></label>
            <label className="block text-sm font-medium mb-5">Estimated arrival time<input type="number" min={1} max={30} value={eta} onChange={(event) => setEta(Number(event.target.value))} className="mt-1.5 w-full h-12 rounded-input border border-cardBorder px-4 font-mono focus:outline-none focus:ring-2 focus:ring-gold" /></label>
            <Button size="lg" className="w-full" onClick={sendBid}>Send bid →</Button>
          </Card>
        </div>
      )}
    </>
  );
}

export default function DriverPage() {
  return <AppShell><DriverConsoleContent /></AppShell>;
}
