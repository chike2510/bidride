import { NextRequest, NextResponse } from "next/server";
import { createServerRide } from "@/lib/ride-server";
import { getRequestUser } from "@/lib/server-session";

export async function POST(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  if (user.role !== "rider") return NextResponse.json({ error: "Only riders can create rides." }, { status: 403 });
  try {
    const body = await request.json();
    if (!body.pickup || !body.destination || !body.campusId) return NextResponse.json({ error: "Pickup, destination, and campus are required." }, { status: 400 });
    const ride = await createServerRide({ ...body, riderId: user.id });
    return NextResponse.json({ ride }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof Error && error.message === "RIDE_STORE_NOT_CONFIGURED" ? "Ride storage is not configured." : "Unable to create ride.";
    return NextResponse.json({ error: message }, { status: message.includes("storage") ? 503 : 500 });
  }
}
