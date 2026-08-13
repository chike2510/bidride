import {
  drivers as defaultDrivers,
  type Driver,
  trip as defaultTrip,
} from "@/lib/data";


export const RIDE_STORAGE_KEY = "bidride-active-ride";
export const RIDE_CHANGE_EVENT = "bidride:ride-change";

export type RideStatus =
  | "BIDDING_OPEN"
  | "DRIVER_ASSIGNED"
  | "DRIVER_EN_ROUTE"
  | "DRIVER_ARRIVED"
  | "RIDE_IN_PROGRESS"
  | "RIDE_COMPLETED"
  | "RATED"
  | "CANCELLED";

export type RideRequestInput = {
  pickup: string;
  destination: string;
  passengers: number;
  rideType: string;
  stops: string[];
  preferences: string[];
};

export type StoredBid = Driver & {
  receivedAt: number;
};

export type StoredRide = RideRequestInput & {
  id: string;
  status: RideStatus;
  createdAt: number;
  bidDeadline: number;
  estimatedFareLow: number;
  estimatedFareHigh: number;
  bids: StoredBid[];
  acceptedDriverId?: string;
  finalFare?: number;
  rating?: number;
  comment?: string;
  tip?: number;
};

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ride-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneBid(driver: Driver, receivedAt: number): StoredBid {
  return { ...driver, receivedAt };
}

export function createRide(input: RideRequestInput): StoredRide {
  const now = Date.now();
  const fareAdjustment = input.rideType === "XL" ? 250 : input.rideType === "Comfort" ? 120 : 0;
  return {
    ...input,
    id: makeId(),
    status: "BIDDING_OPEN",
    createdAt: now,
    bidDeadline: now + 42_000,
    estimatedFareLow: defaultTrip.fareRangeLow + fareAdjustment,
    estimatedFareHigh: defaultTrip.fareRangeHigh + fareAdjustment,
    bids: defaultDrivers.map((driver, index) => cloneBid(driver, now - index * 60_000)),
  };
}

export function createDemoRide(): StoredRide {
  return createRide({
    pickup: defaultTrip.pickup,
    destination: defaultTrip.destination,
    passengers: 1,
    rideType: "Any",
    stops: [],
    preferences: [],
  });
}

export function loadRide(): StoredRide | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RIDE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredRide) : null;
  } catch {
    return null;
  }
}

export function saveRide(ride: StoredRide) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RIDE_STORAGE_KEY, JSON.stringify(ride));
  window.dispatchEvent(new CustomEvent(RIDE_CHANGE_EVENT, { detail: ride }));
}

export function updateRide(updater: (ride: StoredRide) => StoredRide): StoredRide | null {
  const current = loadRide();
  if (!current) return null;
  const next = updater(current);
  saveRide(next);
  return next;
}

export function subscribeToRide(onChange: (ride: StoredRide | null) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange(loadRide());
  window.addEventListener(RIDE_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(RIDE_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getRideDriver(ride: StoredRide | null): StoredBid | null {
  if (!ride) return null;
  const driverId = ride.acceptedDriverId ?? ride.bids[0]?.id;
  return ride.bids.find((bid) => bid.id === driverId) ?? ride.bids[0] ?? null;
}

export function addDemoBid(ride: StoredRide): StoredRide {
  const existing = ride.bids.find((bid) => bid.id === "david");
  if (!existing) return ride;
  const hasUpdatedDavid = ride.bids.some((bid) => bid.id === "david" && bid.fare < 1240);
  if (hasUpdatedDavid) return ride;
  return {
    ...ride,
    bids: ride.bids.map((bid) =>
      bid.id === "david" ? { ...bid, fare: bid.fare - 40, receivedAt: Date.now() } : bid
    ),
  };
}
