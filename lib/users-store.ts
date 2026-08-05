import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

/**
 * ⚠️ PRODUCTION WARNING
 * This reads/writes `data/users.json` on disk. That works fine for local dev
 * (`npm run dev`) but WILL NOT persist on Vercel — serverless functions there
 * have a read-only filesystem outside `/tmp`, so every deploy (and often every
 * cold start) resets your users.
 *
 * To go to production, swap the four functions below for calls to a real
 * database. Supabase is the least-friction option (free Postgres + a JS
 * client, works great with Next.js on Vercel). Nothing outside this file
 * needs to change — every route imports from here, not from fs directly.
 */

const DB_PATH = path.join(process.cwd(), "data", "users.json");

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

function readAll(): User[] {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

function writeAll(users: User[]) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export function getUserByEmail(email: string): User | undefined {
  return readAll().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return readAll().find((u) => u.id === id);
}

export function createUser(input: { name: string; email: string; passwordHash: string; role: UserRole }): User {
  const users = readAll();
  const user: User = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    role: input.role,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeAll(users);
  return user;
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
