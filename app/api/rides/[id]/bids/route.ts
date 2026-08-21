import { NextRequest, NextResponse } from "next/server";
import { addServerBid, getServerRide } from "@/lib/ride-server";
import { getRequestUser } from "@/lib/server-session";
import { drivers } from "@/lib/data";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await context.params;
  const ride = await getServerRide(id);
  if (!ride || (ride.riderId !== user.id && user.role !== "driver")) return NextResponse.json({ error: "Ride not found." }, { status: 404 });
  return NextResponse.json({ bids: ride.bids }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getRequestUser(request);
  if (!user || user.role !== "driver") return NextResponse.json({ error: "Driver authentication required." }, { status: 403 });
  const { id } = await context.params;
  const body = await request.json();
  const driver = drivers.find((item) => item.id === user.id) ?? drivers[0];
  const bid = { id: `${user.id}-${id}`, driverId: user.id, driverName: user.name, name: user.name, avatar: driver.avatar, rating: driver.rating, trips: driver.trips, vehicle: driver.vehicle, vehicleColor: driver.vehicleColor, vehicleImage: driver.vehicleImage, fare: Number(body.fare), etaMinutes: Number(body.etaMinutes), distanceKm: Number(body.distanceKm ?? 1), verified: true, receivedAt: Date.now() };
  if (!Number.isFinite(bid.fare) || bid.fare < 300 || bid.fare > 5000) return NextResponse.json({ error: "Enter a fare between ₦300 and ₦5,000." }, { status: 400 });
  const ride = await addServerBid(id, bid);
  if (!ride) return NextResponse.json({ error: "This bidding window is closed." }, { status: 409 });
  return NextResponse.json({ ride, bid }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
