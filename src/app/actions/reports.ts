"use server";

import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/server/backend";
import {
  addPurchasedReportId,
  getUser,
  setLastReport,
  setSkipDetailClick,
} from "@/lib/server/session";

export async function createPurchaseAction(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/signin");

  const reportId = String(formData.get("report_id") ?? "").trim();
  const returnTo = String(formData.get("return_to") ?? "/feed").trim() || "/feed";
  if (!reportId) redirect(returnTo);

  const title = String(formData.get("report_title") ?? "").trim();
  const category = String(formData.get("report_category") ?? "").trim();
  const published_at = String(formData.get("report_published_at") ?? "").trim();
  const score = Number(formData.get("report_score") ?? 0);
  const reason = String(formData.get("report_reason") ?? "").trim();

  const res = await backendFetch("/purchases", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: user.userId, report_id: reportId }),
  });

  if (res.ok) {
    await addPurchasedReportId(reportId);
    if (title && category && published_at) {
      await setLastReport({
        _id: reportId,
        title,
        category,
        published_at,
        score: Number.isFinite(score) ? score : 0,
        reason,
      });
    }
  }

  redirect(returnTo);
}

export async function trackClickAndGoAction(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/signin");

  const reportId = String(formData.get("report_id") ?? "").trim();
  const campaignType = String(formData.get("campaign_type") ?? "feed").trim() || "feed";
  if (!reportId) redirect("/feed");

  const title = String(formData.get("report_title") ?? "").trim();
  const category = String(formData.get("report_category") ?? "").trim();
  const published_at = String(formData.get("report_published_at") ?? "").trim();
  const score = Number(formData.get("report_score") ?? 0);
  const reason = String(formData.get("report_reason") ?? "").trim();

  await backendFetch("/campaign-interactions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user.userId,
      report_id: reportId,
      campaign_type: campaignType,
      action: "click",
    }),
  });

  // Ensure details page can render even if feed paging changes.
  if (title && category && published_at) {
    await setLastReport({
      _id: reportId,
      title,
      category,
      published_at,
      score: Number.isFinite(score) ? score : 0,
      reason,
    });
  }
  // Avoid double-counting when details page loads right after this action.
  await setSkipDetailClick(reportId);

  redirect(`/posts/${encodeURIComponent(reportId)}`);
}

