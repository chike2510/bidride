import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET ?? (process.env.NODE_ENV === "production" ? "" : "bidride-dev-secret-change-me");
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be configured in production.");
}
const SESSION_COOKIE = "bidride_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// ---------- Password hashing (scrypt, salted) ----------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(hash, "hex");
  if (derived.length !== storedBuf.length) return false;
  return timingSafeEqual(derived, storedBuf);
}

// ---------- Signed session tokens (HMAC, no external JWT lib) ----------

type SessionPayload = { userId: string; iat: number };

function sign(data: string): string {
  return createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
}

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = { userId, iat: Date.now() };
  const json = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(json);
  return `${json}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [json, signature] = token.split(".");
  if (!json || !signature) return null;
  const expected = sign(json);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(json, "base64url").toString()) as SessionPayload;
    if (typeof payload.userId !== "string" || !Number.isFinite(payload.iat)) return null;
    const ageSeconds = (Date.now() - payload.iat) / 1000;
    if (ageSeconds < 0 || ageSeconds > SESSION_MAX_AGE_SECONDS) return null;
    return payload;
  } catch {
    return null;
  }
}

export const AUTH_CONSTANTS = { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS };
