import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type GateSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env.ADMIN_SESSION_SECRET!,
    name: "bh-admin",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function equalsConstantTime(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

export async function tryLogin(username: string, password: string): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) throw new Error("Admin-uppgifter saknas");
  const userOk = equalsConstantTime(username ?? "", expectedUser);
  const passOk = equalsConstantTime(password ?? "", expectedPass);
  if (!userOk || !passOk) return false;
  const session = await useSession<GateSession>(sessionConfig());
  await session.update({ admin: true });
  return true;
}

export async function clearAdminSession() {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
}

export async function isAdmin(): Promise<boolean> {
  const session = await useSession<GateSession>(sessionConfig());
  return Boolean(session.data.admin);
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
