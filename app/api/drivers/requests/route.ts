import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/server-session";
import { getOpenCampusRides } from "@/lib/ride-server";
import { FUPRE_CAMPUS } from "@/lib/campus";

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user || user.role !== "driver") return NextResponse.json({ error: "Driver authentication required." }, { status: 403 });
  try {
    const rides = await getOpenCampusRides(FUPRE_CAMPUS.id);
    return NextResponse.json({ requests: rides.map((ride) => ({
      id: ride.id,
      pickup: ride.pickup,
      destination: ride.destination,
      pickupDistanceKm: 1,
      tripDistanceKm: 2,
      suggestedFareLow: ride.estimatedFareLow,
      suggestedFareHigh: ride.estimatedFareHigh,
      passengers: ride.passengers,
      preferences: ride.preferences,
      expiresAt: ride.bidDeadline,
      status: "open" as const,
    })) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const status = error instanceof Error && error.message === "RIDE_STORE_NOT_CONFIGURED" ? 503 : 500;
    return NextResponse.json({ error: status === 503 ? "Ride storage is not configured." : "Unable to load requests." }, { status });
  }
}
