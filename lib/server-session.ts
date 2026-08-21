import { verifySessionToken, AUTH_CONSTANTS } from "@/lib/auth";
import { getUserById, type PublicUser } from "@/lib/users-store";
import type { NextRequest } from "next/server";

export async function getRequestUser(request: NextRequest): Promise<PublicUser | null> {
  const token = request.cookies.get(AUTH_CONSTANTS.SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) return null;
  const user = await getUserById(session.userId);
  return user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  } : null;
}
