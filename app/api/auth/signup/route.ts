import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createSessionToken, AUTH_CONSTANTS } from "@/lib/auth";
import { createUser, getUserByEmail, toPublicUser, type UserRole } from "@/lib/users-store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role: UserRole = body?.role === "driver" ? "driver" : "rider";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  try {
    if (await getUserByEmail(email)) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409, headers: { "Cache-Control": "private, no-store" } });
    }

    const user = await createUser({ name, email, passwordHash: hashPassword(password), role });
    const token = createSessionToken(user.id);

  const res = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  res.cookies.set(AUTH_CONSTANTS.SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: AUTH_CONSTANTS.SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  res.headers.set("Cache-Control", "private, no-store");
  return res;
  } catch (error) {
    if (error instanceof Error && error.message === "REDIS_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Account storage is not configured. Add the Upstash Redis variables in Vercel." }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
    }
    return NextResponse.json({ error: "Unable to create your account right now." }, { status: 500, headers: { "Cache-Control": "private, no-store" } });
  }
}
