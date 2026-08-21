"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  Briefcase,
  Car,
  Home,
  MapPin,
  Navigation,
  PawPrint,
  Plane,
  Plus,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { FupreLeafletMap } from "@/components/FupreLeafletMap";
import { Button } from "@/components/ui/Button";
import { createRide, saveRide } from "@/lib/ride-store";
import { trip } from "@/lib/data";
import { FUPRE_CAMPUS, FUPRE_PLACES } from "@/lib/campus";
import { haversineKm } from "@/lib/geo";
import { formatNaira } from "@/lib/utils";

const placeIcons = { gate: MapPin, hostel: Home, faculty: Briefcase, library: Plane, hall: ShieldCheck, landmark: Car } as const;
const popularDestinations = FUPRE_PLACES.map((place) => ({
  icon: placeIcons[place.category],
  label: place.name.replace("FUPRE ", ""),
  address: place.name,
  coords: { latitude: place.latitude, longitude: place.longitude },
}));

const preferences = [
  { icon: User, label: "Female driver" },
  { icon: Briefcase, label: "Extra luggage" },
  { icon: PawPrint, label: "Pet friendly" },
];

const rideTypes = [
  { value: "Any", label: "Any vehicle", detail: "Best availability" },
  { value: "Comfort", label: "Comfort", detail: "Newer, roomier cars" },
  { value: "XL", label: "XL", detail: "Up to 6 passengers" },
];

function RequestRideContent() {
  const openMobileMenu = useMobileMenu();
  const router = useRouter();
  const [pickup, setPickup] = useState(trip.pickup);
  const [destination, setDestination] = useState(trip.destination);
  const [pickupCoords, setPickupCoords] = useState<
  { latitude: number; longitude: number } | undefined
>(() => popularDestinations[0]?.coords);

const [destinationCoords, setDestinationCoords] = useState<
  { latitude: number; longitude: number } | undefined
>(() => {
  const hostels = FUPRE_PLACES.find((place) => place.id === "fupre-hostels");

  return hostels
    ? { latitude: hostels.latitude, longitude: hostels.longitude }
    : popularDestinations[1]?.coords;
});

  const [passengers, setPassengers] = useState(1);
  const [rideType, setRideType] = useState("Any");
  const [stops, setStops] = useState<string[]>([]);
  const [newStop, setNewStop] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  const estimate = useMemo(() => {
    const typeAdjustment = rideType === "XL" ? 250 : rideType === "Comfort" ? 120 : 0;
    const stopAdjustment = stops.length * 150;
    const passengerAdjustment = Math.max(0, passengers - 1) * 80;
    return {
      low: trip.fareRangeLow + typeAdjustment + stopAdjustment + passengerAdjustment,
      high: trip.fareRangeHigh + typeAdjustment + stopAdjustment + passengerAdjustment,
    };
  }, [passengers, rideType, stops.length]);

  function togglePreference(label: string) {
    setSelectedPreferences((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
  }

  function addStop() {
    const value = newStop.trim();
    if (!value || stops.length >= 3) return;
    setStops((current) => [...current, value]);
    setNewStop("");
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not available in this browser.");
      return;
    }

    setLocationStatus("Checking that you are within the FUPRE campus area…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const distanceFromCampus = haversineKm(point, {
          latitude: FUPRE_CAMPUS.centerLat,
          longitude: FUPRE_CAMPUS.centerLng,
        });

        if (distanceFromCampus > FUPRE_CAMPUS.radiusKm) {
          setLocationStatus("You appear to be outside the FUPRE campus service area.");
          return;
        }

        setPickup("Current location on FUPRE campus");
        setPickupCoords(point);
        setLocationStatus("Location confirmed inside the FUPRE campus service area.");
      },
      () => setLocationStatus("Location permission was not granted. Choose a campus place instead."),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 }
    );
  }

  async function submitRequest() {
    const cleanPickup = pickup.trim();
    const cleanDestination = destination.trim();
    if (!cleanPickup || !cleanDestination) {
      setError("Add both a pickup location and destination to continue.");
      return;
    }
    if (cleanPickup.toLowerCase() === cleanDestination.toLowerCase()) {
      setError("Pickup and destination should be different locations.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: cleanPickup,
          destination: cleanDestination,
          campusId: FUPRE_CAMPUS.id,
          pickupCoords,
          destinationCoords,
          passengers,
          rideType,
          stops,
          preferences: selectedPreferences,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to create this ride. Please try again.");
        return;
      }
      saveRide(data.ride);
      router.push(`/live-bidding?rideId=${data.ride.id}`);
    } catch {
      setError("Could not reach the ride service. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <Card className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold mb-1">Step 1 of 2</p>
                <h2 className="font-display text-xl font-bold">Where are you going?</h2>
              </div>
              <span className="hidden sm:inline-flex rounded-badge bg-success/10 text-success text-xs font-semibold px-2.5 py-1">
                Protected request
              </span>
            </div>

            <div className="rounded-input border border-cardBorder overflow-hidden mb-3">
              <label className="flex items-center gap-3 px-4 py-3.5 border-b border-cardBorder">
                <span className="h-2.5 w-2.5 rounded-full bg-success shrink-0" />
                <span className="flex-1">
                  <span className="block text-xs text-navy/50">Pickup location</span>
                  <input
                    value={pickup}
                    onChange={(event) => setPickup(event.target.value)}
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-navy/30"
                    placeholder="Where should we pick you up?"
                    aria-label="Pickup location"
                  />
                </span>
                <MapPin size={16} className="text-navy/40" aria-hidden />
              </label>
              <label className="flex items-center gap-3 px-4 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-urgency shrink-0" />
                <span className="flex-1">
                  <span className="block text-xs text-navy/50">Destination</span>
                  <input
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-navy/30"
                    placeholder="Where are you going?"
                    aria-label="Destination"
                  />
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPickup(destination);
                    setDestination(pickup);
                    setPickupCoords(destinationCoords);
                    setDestinationCoords(pickupCoords);
                  }}
                  className="h-9 w-9 rounded-full border border-cardBorder flex items-center justify-center hover:bg-bg transition-colors shrink-0"
                  aria-label="Swap pickup and destination"
                >
                  <ArrowUpDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDestination("");
                    setDestinationCoords(undefined);
                  }}
                  className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-bg transition-colors shrink-0"
                  aria-label="Clear destination"
                >
                  <X size={14} className="text-navy/40" />
                </button>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-5">
              <button type="button" onClick={useCurrentLocation} className="inline-flex items-center justify-center gap-2 rounded-input border border-gold/40 bg-gold/5 px-3.5 py-2.5 text-sm font-medium hover:bg-gold/10 min-h-[44px]">
                <Navigation size={15} className="text-gold" /> Use my current FUPRE location
              </button>
              <span className="text-xs text-navy/45">Campus-only requests help keep matching reliable.</span>
            </div>
            {locationStatus && (
              <div className="rounded-input bg-bg px-3.5 py-3 mb-4 text-xs text-navy/60" role="status">
                <p>{locationStatus}</p>
                {(locationStatus.toLowerCase().includes("permission") || locationStatus.toLowerCase().includes("unavailable")) && (
                  <button type="button" onClick={useCurrentLocation} className="mt-2 text-gold font-semibold hover:underline">Try location again</button>
                )}
              </div>
            )}

            <div className="flex gap-2 mb-5">
              <input
                value={newStop}
                onChange={(event) => setNewStop(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addStop();
                }}
                className="min-w-0 flex-1 rounded-input border border-cardBorder px-4 py-3 text-sm outline-none focus:border-gold"
                placeholder={stops.length ? "Add another stop" : "Optional stop"}
                aria-label="Optional stop"
              />
              <Button variant="secondary" onClick={addStop} disabled={!newStop.trim() || stops.length >= 3}>
                <Plus size={15} /> Add stop
              </Button>
            </div>
            {stops.length > 0 && (
              <div className="flex flex-col gap-2 mb-5" aria-label="Added stops">
                {stops.map((stop, index) => (
                  <div key={`${stop}-${index}`} className="flex items-center gap-3 rounded-input bg-bg px-3.5 py-2.5 text-sm">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                    <span className="flex-1 truncate">Stop {index + 1}: {stop}</span>
                    <button
                      type="button"
                      onClick={() => setStops((current) => current.filter((_, stopIndex) => stopIndex !== index))}
                      className="text-navy/40 hover:text-urgency"
                      aria-label={`Remove stop ${index + 1}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="rounded-input border border-cardBorder px-4 py-3 flex items-center gap-3">
                <Users size={16} className="text-navy/50" aria-hidden />
                <div className="flex-1">
                  <p className="text-xs text-navy/50">Passengers</p>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setPassengers((value) => Math.max(1, value - 1))} className="h-7 w-7 rounded-full border border-cardBorder" aria-label="Remove passenger">−</button>
                    <span className="text-sm font-semibold" aria-live="polite">{passengers}</span>
                    <button type="button" onClick={() => setPassengers((value) => Math.min(6, value + 1))} className="h-7 w-7 rounded-full border border-cardBorder" aria-label="Add passenger">+</button>
                  </div>
                </div>
              </div>
              <label className="rounded-input border border-cardBorder px-4 py-3 flex items-center gap-3">
                <Car size={16} className="text-navy/50" aria-hidden />
                <span className="flex-1">
                  <span className="block text-xs text-navy/50">Ride type</span>
                  <select value={rideType} onChange={(event) => setRideType(event.target.value)} className="w-full bg-transparent text-sm font-medium outline-none">
                    {rideTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </span>
              </label>
            </div>

            <p className="text-sm font-medium text-navy/70 mb-2.5">Preferences <span className="font-normal text-navy/40">(optional)</span></p>
            <div className="flex flex-wrap gap-2 mb-5">
              {preferences.map((pref) => {
                const selected = selectedPreferences.includes(pref.label);
                return (
                  <button
                    type="button"
                    key={pref.label}
                    onClick={() => togglePreference(pref.label)}
                    aria-pressed={selected}
                    className={`flex items-center gap-2 rounded-input border px-3.5 py-2.5 text-sm transition-colors min-h-[44px] ${selected ? "border-gold bg-gold/10 text-navy" : "border-cardBorder text-navy/70 hover:bg-bg"}`}
                  >
                    <pref.icon size={14} />
                    {pref.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-input bg-navy/[0.03] border border-navy/[0.06] p-4 flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs text-navy/50 flex items-center gap-1">Estimated fare range</p>
                <p className="font-mono text-2xl font-bold mt-0.5">
                  {formatNaira(estimate.low)} – {formatNaira(estimate.high)}
                </p>
                <p className="text-xs text-navy/40 mt-1">Final fare is set when you accept a driver bid.</p>
              </div>
              <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
                <span className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  <TrendingUp size={16} className="text-gold" />
                </span>
                <p className="text-[10px] text-navy/40 text-center leading-tight">Prices update<br />in real time</p>
              </div>
            </div>

            {error && <p className="text-sm text-urgency mb-3" role="alert">{error}</p>}
            <Button size="lg" className="w-full justify-between sticky bottom-3 z-10" onClick={submitRequest} disabled={isSubmitting}>
              {isSubmitting ? "Opening bidding…" : "Request bids"}
              <span aria-hidden>→</span>
            </Button>
          </Card>

          <p className="flex items-center justify-center gap-2 text-xs text-navy/50 text-center">
            <ShieldCheck size={14} className="text-success" />
            Your ride is protected with BidRide Safety — verified drivers and clear pricing.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-3 h-64 relative overflow-hidden">
            <div className="absolute inset-3 rounded-input overflow-hidden">
              <FupreLeafletMap pickup={pickupCoords} destination={destinationCoords} className="h-full" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">FUPRE places</h3>
              <span className="text-xs text-navy/40">Tap to use</span>
            </div>
            <div className="flex flex-col divide-y divide-cardBorder">
              {popularDestinations.map((destinationOption) => (
                <button
                  type="button"
                  key={destinationOption.label}
                  onClick={() => {
                    setDestination(destinationOption.address);
                    setDestinationCoords(destinationOption.coords);
                  }}
                  className="flex items-center gap-3 py-3 text-left hover:bg-bg/60 transition-colors rounded-input px-1"
                >
                  <span className="h-10 w-10 rounded-full bg-bg flex items-center justify-center shrink-0">
                    <destinationOption.icon size={16} className="text-navy/60" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{destinationOption.label}</span>
                    <span className="block text-xs text-navy/50 truncate">{destinationOption.address}</span>
                  </span>
                  <Star size={16} className="text-navy/30 shrink-0" aria-hidden />
                </button>
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
