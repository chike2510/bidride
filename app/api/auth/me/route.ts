import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_CONSTANTS } from "@/lib/auth";
import { getUserById, toPublicUser } from "@/lib/users-store";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_CONSTANTS.SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  const user = await getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user: toPublicUser(user) }, { status: 200 });
}
