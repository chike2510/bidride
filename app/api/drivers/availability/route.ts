import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/server-session";
import { setDriverAvailability } from "@/lib/ride-server";

export async function POST(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user || user.role !== "driver") return NextResponse.json({ error: "Driver authentication required." }, { status: 403 });
  const body = await request.json();
  const availability = await setDriverAvailability(user.id, body);
  return NextResponse.json({ availability }, { headers: { "Cache-Control": "private, no-store" } });
}
