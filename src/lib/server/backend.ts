import "server-only";

export const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL || "https://tacticalreports-production.up.railway.app";

export async function backendFetch(path: string, init?: RequestInit) {
  const url = `${BACKEND_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "User-Agent": "tacticalreports-nextjs",
    },
    cache: "no-store",
  });
}

