import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSessionToken, AUTH_CONSTANTS } from "@/lib/auth";
import { getUserByEmail, toPublicUser } from "@/lib/users-store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const token = createSessionToken(user.id);
  const res = NextResponse.json({ user: toPublicUser(user) }, { status: 200 });
  res.cookies.set(AUTH_CONSTANTS.SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: AUTH_CONSTANTS.SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
}
