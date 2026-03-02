"use server";

import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/server/backend";
import { clearUser, setUser } from "@/lib/server/session";

function deriveUserIdFromToken(accessToken: string) {
  const m = accessToken.match(/fake-token-for-([a-f0-9]{24})$/i);
  return m?.[1] ?? "";
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const res = await backendFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    redirect("/signin?error=invalid");
  }

  const data = (await res.json()) as { accessToken?: string };
  const accessToken = String(data?.accessToken ?? "");
  const userId = deriveUserIdFromToken(accessToken);
  if (!accessToken || !userId) {
    redirect("/signin?error=invalid");
  }

  await setUser({ email, userId, accessToken });
  redirect("/feed");
}

export async function signOutAction() {
  await clearUser();
  redirect("/signin");
}

