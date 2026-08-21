import { NextRequest, NextResponse } from "next/server";
import { acceptServerBid } from "@/lib/ride-server";
import { getRequestUser } from "@/lib/server-session";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getRequestUser(request);
  if (!user || user.role !== "rider") return NextResponse.json({ error: "Rider authentication required." }, { status: 403 });
  const { id } = await context.params;
  const { bidId } = await request.json();
  const ride = await acceptServerBid(id, user.id, String(bidId));
  if (!ride) return NextResponse.json({ error: "That bid is no longer available." }, { status: 409 });
  return NextResponse.json({ ride }, { headers: { "Cache-Control": "private, no-store" } });
}
