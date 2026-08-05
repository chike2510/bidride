import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";

/**
 * User storage backed by Upstash Redis (Vercel's current recommended KV
 * store — the old "Vercel KV" product was sunset and migrated to Upstash
 * under the Vercel Marketplace).
 *
 * SETUP REQUIRED before this works on your deployment:
 * 1. Vercel dashboard → your project → Storage tab → Create Database → Redis
 *    (Upstash). This provisions a free-tier Redis instance and automatically
 *    adds the KV_REST_API_URL / KV_REST_API_TOKEN env vars to your project.
 * 2. Redeploy after connecting it (env vars only apply on new deployments).
 * 3. For local dev, run `vercel env pull .env.local` once linked, or copy
 *    those two values into `.env.local` yourself.
 *
 * Without step 1, `Redis.fromEnv()` below throws at request time and every
 * signup/login will fail — that's what was happening with the plain-JSON-file
 * version of this file on Vercel (read-only filesystem outside /tmp).
 */

const redis = Redis.fromEnv();

const userKey = (id: string) => `bidride:user:${id}`;
const emailIndexKey = (email: string) => `bidride:email:${email.toLowerCase()}`;

export type UserRole = "rider" | "driver";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash">;

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const id = await redis.get<string>(emailIndexKey(email));
  if (!id) return undefined;
  return getUserById(id);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const user = await redis.get<User>(userKey(id));
  return user ?? undefined;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}): Promise<User> {
  const user: User = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    role: input.role,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };
  // Write the record and the email→id index together.
  await Promise.all([
    redis.set(userKey(user.id), user),
    redis.set(emailIndexKey(user.email), user.id),
  ]);
  return user;
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
