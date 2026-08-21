import { randomUUID } from "crypto";
import { getRedis } from "@/lib/redis";
import type { Driver } from "@/lib/data";

export type ServerRideStatus = "BIDDING_OPEN" | "DRIVER_ASSIGNED" | "DRIVER_EN_ROUTE" | "DRIVER_ARRIVED" | "RIDE_IN_PROGRESS" | "RIDE_COMPLETED" | "RATED" | "CANCELLED";
export type ServerPoint = { latitude: number; longitude: number };
export type ServerBid = {
  id: string;
  driverId: string;
  driverName: string;
  name: string;
  avatar: string;
  rating: number;
  trips: number;
  vehicle: string;
  vehicleColor: string;
  vehicleImage: string;
  fare: number;
  etaMinutes: number;
  distanceKm: number;
  verified: boolean;
  receivedAt: number;
};
export type ServerRide = {
  id: string;
  riderId: string;
  campusId?: string;
  pickup: string;
  destination: string;
  pickupCoords?: ServerPoint;
  destinationCoords?: ServerPoint;
  passengers: number;
  rideType: string;
  stops: string[];
  preferences: string[];
  status: ServerRideStatus;
  createdAt: number;
  bidDeadline: number;
  estimatedFareLow: number;
  estimatedFareHigh: number;
  bids: ServerBid[];
  acceptedDriverId?: string;
  finalFare?: number;
  updatedAt: number;
};

const rideKey = (id: string) => `bidride:ride:${id}`;
const riderRideKey = (riderId: string) => `bidride:rider-active:${riderId}`;
const campusRidesKey = (campusId: string) => `bidride:campus-rides:${campusId}`;
const driverAvailabilityKey = (driverId: string) => `bidride:driver-availability:${driverId}`;

function json<T>(value: T) {
  return JSON.stringify(value);
}

function parse<T>(value: unknown): T | null {
  if (!value) return null;
  if (typeof value === "string") {
    try { return JSON.parse(value) as T; } catch { return null; }
  }
  return value as T;
}

function estimatedFare(rideType: string) {
  const adjustment = rideType === "XL" ? 250 : rideType === "Comfort" ? 120 : 0;
  return { low: 700 + adjustment, high: 1200 + adjustment };
}

export async function createServerRide(input: Omit<ServerRide, "id" | "status" | "createdAt" | "bidDeadline" | "estimatedFareLow" | "estimatedFareHigh" | "bids" | "updatedAt">) {
  const redis = getRedis();
  if (!redis) throw new Error("RIDE_STORE_NOT_CONFIGURED");
  const now = Date.now();
  const fare = estimatedFare(input.rideType);
  const ride: ServerRide = {
    ...input,
    id: randomUUID(),
    status: "BIDDING_OPEN",
    createdAt: now,
    updatedAt: now,
    bidDeadline: now + 42_000,
    estimatedFareLow: fare.low,
    estimatedFareHigh: fare.high,
    bids: [],
  };
  await redis.set(rideKey(ride.id), json(ride), { ex: 60 * 60 * 24 });
  await redis.set(riderRideKey(ride.riderId), ride.id, { ex: 60 * 60 * 24 });
  if (ride.campusId) await redis.lpush(campusRidesKey(ride.campusId), ride.id);
  return ride;
}

export async function getServerRide(id: string) {
  const redis = getRedis();
  if (!redis) throw new Error("RIDE_STORE_NOT_CONFIGURED");
  return parse<ServerRide>(await redis.get(rideKey(id)));
}

export async function getActiveRiderRide(riderId: string) {
  const redis = getRedis();
  if (!redis) throw new Error("RIDE_STORE_NOT_CONFIGURED");
  const id = await redis.get<string>(riderRideKey(riderId));
  return id ? getServerRide(id) : null;
}

export async function addServerBid(rideId: string, bid: ServerBid) {
  const ride = await getServerRide(rideId);
  if (!ride || ride.status !== "BIDDING_OPEN" || ride.bidDeadline < Date.now()) return null;
  const next: ServerRide = {
    ...ride,
    bids: [...ride.bids.filter((item) => item.driverId !== bid.driverId), bid],
    updatedAt: Date.now(),
  };
  const redis = getRedis();
  if (!redis) throw new Error("RIDE_STORE_NOT_CONFIGURED");
  await redis.set(rideKey(rideId), json(next), { ex: 60 * 60 * 24 });
  return next;
}

export async function acceptServerBid(rideId: string, riderId: string, bidId: string) {
  const ride = await getServerRide(rideId);
  if (!ride || ride.riderId !== riderId || ride.status !== "BIDDING_OPEN") return null;
  const bid = ride.bids.find((item) => item.id === bidId || item.driverId === bidId);
  if (!bid) return null;
  const next: ServerRide = { ...ride, status: "DRIVER_ASSIGNED", acceptedDriverId: bid.driverId, finalFare: bid.fare, updatedAt: Date.now() };
  const redis = getRedis();
  if (!redis) throw new Error("RIDE_STORE_NOT_CONFIGURED");
  await redis.set(rideKey(rideId), json(next), { ex: 60 * 60 * 24 });
  return next;
}

export async function setDriverAvailability(driverId: string, input: { campusId: string; status: "offline" | "available" | "busy"; latitude: number; longitude: number; accuracyMeters?: number }) {
  const redis = getRedis();
  if (!redis) throw new Error("RIDE_STORE_NOT_CONFIGURED");
  const value = { ...input, driverId, lastSeenAt: Date.now() };
  await redis.set(driverAvailabilityKey(driverId), json(value), { ex: 90 });
  return value;
}

export async function getDriverAvailability(driverId: string) {
  const redis = getRedis();
  if (!redis) throw new Error("RIDE_STORE_NOT_CONFIGURED");
  return parse<{ driverId: string; campusId: string; status: string; latitude: number; longitude: number; accuracyMeters?: number; lastSeenAt: number }>(await redis.get(driverAvailabilityKey(driverId)));
}

export async function getOpenCampusRides(campusId: string) {
  const redis = getRedis();
  if (!redis) throw new Error("RIDE_STORE_NOT_CONFIGURED");
  const ids = await redis.lrange<string>(campusRidesKey(campusId), 0, 50);
  const rides = await Promise.all(ids.map((id) => getServerRide(id)));
  return rides.filter((ride): ride is ServerRide => Boolean(ride && ride.status === "BIDDING_OPEN" && ride.bidDeadline > Date.now()));
}

export async function getAvailableDrivers(campusId: string) {
  const redis = getRedis();
  if (!redis) throw new Error("RIDE_STORE_NOT_CONFIGURED");
  const keys = await redis.keys("bidride:driver-availability:*");
  const values = await Promise.all(keys.map((key) => redis.get<string>(key)));
  return values.map((value) => parse<{ driverId: string; campusId: string; status: string; latitude: number; longitude: number; accuracyMeters?: number; lastSeenAt: number }>(value)).filter((value) => value && value.campusId === campusId && value.status === "available") as Array<{ driverId: string; campusId: string; status: string; latitude: number; longitude: number; accuracyMeters?: number; lastSeenAt: number }>;
}
