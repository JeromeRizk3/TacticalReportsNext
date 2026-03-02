import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend";
import { getUser } from "@/lib/server/session";

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const search = (url.searchParams.get("search") ?? "").trim();
  const limitRaw = (url.searchParams.get("limit") ?? "").trim();
  const pageRaw = (url.searchParams.get("page") ?? "").trim();
  const limitNum = Number(limitRaw);
  const pageNum = Number(pageRaw);
  const limit =
    Number.isFinite(limitNum) && limitNum > 0 ? Math.max(1, Math.min(50, Math.floor(limitNum))) : null;
  const page = Number.isFinite(pageNum) && pageNum > 0 ? Math.max(1, Math.floor(pageNum)) : null;
  const categories = url.searchParams
    .getAll("category")
    .map((s) => String(s).trim())
    .filter(Boolean);

  const qs = new URLSearchParams();
  qs.set("userId", user.userId);
  if (search) qs.set("search", search);
  for (const c of categories) qs.append("category", c);
  if (limit) qs.set("limit", String(limit));
  if (page) qs.set("page", String(page));

  const res = await backendFetch(`/feed?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

