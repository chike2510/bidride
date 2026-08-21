import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/server-session";
import { getDriverAvailability, getServerRide } from "@/lib/ride-server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await context.params;
  const ride = await getServerRide(id);
  if (!ride || (ride.riderId !== user.id && ride.acceptedDriverId !== user.id)) return NextResponse.json({ error: "Ride not found." }, { status: 404 });
  if (!ride.acceptedDriverId) return NextResponse.json({ location: null }, { headers: { "Cache-Control": "private, no-store" } });
  const location = await getDriverAvailability(ride.acceptedDriverId);
  return NextResponse.json({ location }, { headers: { "Cache-Control": "private, no-store" } });
}
