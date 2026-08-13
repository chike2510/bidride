import { FUPRE_CAMPUS } from "@/lib/campus";

export const DRIVER_STORAGE_KEY = "bidride-driver-state";
export const DRIVER_CHANGE_EVENT = "bidride:driver-change";

export type DriverAvailabilityStatus = "offline" | "available" | "busy";

export type DriverAvailability = {
  driverId: string;
  campusId: string;
  status: DriverAvailabilityStatus;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  lastSeenAt: number;
};

export type DriverRequest = {
  id: string;
  pickup: string;
  destination: string;
  pickupDistanceKm: number;
  tripDistanceKm: number;
  suggestedFareLow: number;
  suggestedFareHigh: number;
  passengers: number;
  preferences: string[];
  expiresAt: number;
  status: "open" | "bid-submitted" | "expired";
};

export type DriverBid = {
  requestId: string;
  driverId: string;
  fare: number;
  etaMinutes: number;
  submittedAt: number;
};

export type DriverState = {
  availability: DriverAvailability;
  requests: DriverRequest[];
  bids: DriverBid[];
};

const defaultState: DriverState = {
  availability: {
    driverId: "demo-driver",
    campusId: FUPRE_CAMPUS.id,
    status: "offline",
    latitude: FUPRE_CAMPUS.centerLat,
    longitude: FUPRE_CAMPUS.centerLng,
    accuracyMeters: 25,
    lastSeenAt: 0,
  },
  requests: [
    {
      id: "fupre-request-001",
      pickup: "FUPRE Main Gate",
      destination: "Student Hostels",
      pickupDistanceKm: 0.7,
      tripDistanceKm: 2.1,
      suggestedFareLow: 700,
      suggestedFareHigh: 950,
      passengers: 1,
      preferences: ["Female driver"],
      expiresAt: Date.now() + 58_000,
      status: "open",
    },
    {
      id: "fupre-request-002",
      pickup: "College of Science",
      destination: "College of Engineering and Technology",
      pickupDistanceKm: 1.2,
      tripDistanceKm: 1.7,
      suggestedFareLow: 650,
      suggestedFareHigh: 900,
      passengers: 2,
      preferences: [],
      expiresAt: Date.now() + 86_000,
      status: "open",
    },
  ],
  bids: [],
};

function cloneDefaultState(): DriverState {
  return JSON.parse(JSON.stringify(defaultState)) as DriverState;
}

export function loadDriverState(): DriverState {
  if (typeof window === "undefined") return cloneDefaultState();

  try {
    const raw = window.localStorage.getItem(DRIVER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DriverState) : cloneDefaultState();
  } catch {
    return cloneDefaultState();
  }
}

export function saveDriverState(state: DriverState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DRIVER_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(DRIVER_CHANGE_EVENT, { detail: state }));
}

export function updateDriverState(
  updater: (state: DriverState) => DriverState
) {
  const next = updater(loadDriverState());
  saveDriverState(next);
  return next;
}

export function subscribeToDriverState(onChange: (state: DriverState) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange(loadDriverState());
  window.addEventListener(DRIVER_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(DRIVER_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function submitDriverBid(requestId: string, fare: number, etaMinutes: number) {
  return updateDriverState((state) => ({
    ...state,
    requests: state.requests.map((request) =>
      request.id === requestId ? { ...request, status: "bid-submitted" } : request
    ),
    bids: [
      ...state.bids.filter((bid) => bid.requestId !== requestId),
      {
        requestId,
        driverId: state.availability.driverId,
        fare,
        etaMinutes,
        submittedAt: Date.now(),
      },
    ],
  }));
}
