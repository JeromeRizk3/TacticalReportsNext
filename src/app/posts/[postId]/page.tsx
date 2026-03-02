import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShellServer } from "@/components/AppShellServer";
import { getLastReport, getUser } from "@/lib/server/session";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function PostDetailsPage({ params }: { params: { postId: string } }) {
  // Next.js 16 may provide `params` as a Promise.
  const p = await Promise.resolve(params as { postId: string } | Promise<{ postId: string }>);
  const postId = String(p?.postId ?? "").trim();

  const user = await getUser();
  if (!user) redirect("/signin");

  // No report details API yet — do not fetch by ID.
  // Use last clicked report metadata when available, otherwise fall back to generic placeholders.
  const last = await getLastReport();
  const post =
    last && last._id === postId
      ? last
      : {
          _id: postId,
          title: postId ? `Report ${postId}` : "Report",
          category: "—",
          published_at: new Date().toISOString(),
          score: 0,
          reason: "Details are not fetched yet.",
        };

  const reportTitle =
    typeof post.title === "string" && post.title.trim().length
      ? post.title.trim()
      : postId
        ? `Report ${postId}`
        : "Report";

  return (
    <AppShellServer activePath="/feed">
      <section className="panel">
        <div className="details__top">
          <Link className="btn btn--ghost" href="/feed">
            ← Back
          </Link>
          <div className="chips">
            <span className="chip">{post.category}</span>
            <span className="chip">{formatDate(post.published_at)}</span>
            <span className="chip">Score: {post.score}</span>
          </div>
        </div>

        <h1 className="h1" style={{ marginTop: 14 }}>
          Post Details
        </h1>
        <p className="muted" style={{ fontWeight: 750 }}>
          {reportTitle}
        </p>

        <div className="prose">
          <p className="lead">Details</p>
          <p>This is the details page of this report.</p>
          <p>You can replace this with real content once you add a report details endpoint.</p>
        </div>

        <div className="details__bottom">
          <Link className="btn btn--ghost" href="/feed">
            Back to feed
          </Link>
        </div>

      </section>
    </AppShellServer>
  );
}

