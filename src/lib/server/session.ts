import "server-only";

import crypto from "crypto";
import { cookies } from "next/headers";

export type UserSession = {
  email: string;
  userId: string;
  accessToken: string;
};

const AUTH_COOKIE = "tactical.auth";
const LAST_REPORT_COOKIE = "tactical.last_report";
const SKIP_DETAIL_CLICK_COOKIE = "tactical.skip_detail_click";
const PURCHASES_COOKIE = "tactical.purchases";

export type LastReport = {
  _id: string;
  title: string;
  category: string;
  published_at: string;
  score: number;
  reason: string;
};

function secret() {
  return process.env.COOKIE_SECRET || "dev-only-cookie-secret";
}

function sign(payloadB64: string) {
  return crypto.createHmac("sha256", secret()).update(payloadB64).digest("base64url");
}

function encode(obj: unknown) {
  const payload = Buffer.from(JSON.stringify(obj), "utf8").toString("base64url");
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

function decode<T>(value: string | undefined): T | null {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  if (sign(payload) !== sig) return null;
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export async function getUser(): Promise<UserSession | null> {
  const jar = await cookies();
  return decode<UserSession>(jar.get(AUTH_COOKIE)?.value || undefined);
}

export async function setUser(user: UserSession) {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, encode(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearUser() {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function setLastReport(report: LastReport) {
  const jar = await cookies();
  jar.set(LAST_REPORT_COOKIE, encode(report), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });
}

export async function getLastReport(): Promise<LastReport | null> {
  const jar = await cookies();
  return decode<LastReport>(jar.get(LAST_REPORT_COOKIE)?.value || undefined);
}

export async function setSkipDetailClick(reportId: string) {
  const jar = await cookies();
  jar.set(SKIP_DETAIL_CLICK_COOKIE, encode({ reportId, at: Date.now() }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60, // 1 minute is plenty
  });
}

export async function shouldSkipDetailClick(reportId: string): Promise<boolean> {
  const jar = await cookies();
  const value = jar.get(SKIP_DETAIL_CLICK_COOKIE)?.value;
  if (!value) return false;
  const parsed = decode<{ reportId?: string; at?: number }>(value);
  return parsed?.reportId === reportId;
}

export async function getPurchasedReportIds(): Promise<string[]> {
  const jar = await cookies();
  const parsed = decode<{ reportIds?: string[] }>(jar.get(PURCHASES_COOKIE)?.value || undefined);
  const ids = Array.isArray(parsed?.reportIds) ? parsed!.reportIds : [];
  return ids.map(String);
}

export async function addPurchasedReportId(reportId: string) {
  const jar = await cookies();
  const existing = decode<{ reportIds?: string[] }>(jar.get(PURCHASES_COOKIE)?.value || undefined);
  const ids = new Set<string>(Array.isArray(existing?.reportIds) ? existing!.reportIds.map(String) : []);
  ids.add(reportId);
  jar.set(PURCHASES_COOKIE, encode({ reportIds: Array.from(ids) }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

