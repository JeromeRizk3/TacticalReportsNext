"use client";

import React from "react";
import Link from "next/link";

type FeedItem = {
  _id: string;
  title: string;
  category: string;
  published_at: string;
  score: number;
  reason: string;
  image_url?: string | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function PublishedContentClient({
  initialItems,
  purchasedIds,
  search,
  selectedCats,
  debug,
  backendPath,
  currentFeedUrl,
  pageSize = 5,
  createPurchaseAction,
  trackClickAndGoAction,
}: {
  initialItems: FeedItem[];
  purchasedIds: string[];
  search: string;
  selectedCats: string[];
  debug: boolean;
  backendPath: string;
  currentFeedUrl: string;
  pageSize?: number;
  createPurchaseAction: (formData: FormData) => void | Promise<void>;
  trackClickAndGoAction: (formData: FormData) => void | Promise<void>;
}) {
  const purchasedSet = React.useMemo(() => new Set(purchasedIds), [purchasedIds]);
  const [items, setItems] = React.useState<FeedItem[]>(initialItems);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(initialItems.length >= pageSize);
  const [error, setError] = React.useState<string | null>(null);

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const nextPageRef = React.useRef<number>(2);

  const activeChips = selectedCats.length ? selectedCats : [];
  const priceCredits = 45;

  React.useEffect(() => {
    // Reset pagination when the server-rendered first page changes
    setItems(initialItems);
    setHasMore(initialItems.length >= pageSize);
    setError(null);
    setLoading(false);
    nextPageRef.current = 2;
  }, [initialItems, pageSize]);

  const fetchMore = React.useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    const page = nextPageRef.current;

    try {
      const qs = new URLSearchParams();
      if (search) qs.set("search", search);
      for (const c of selectedCats) qs.append("category", c);
      qs.set("limit", String(pageSize));
      qs.set("page", String(page));
      if (debug) qs.set("debug", "1");

      const res = await fetch(`/api/posts?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load more (${res.status})`);
      const json = (await res.json()) as { items?: FeedItem[] };
      const next = Array.isArray(json.items) ? json.items : [];

      setItems((prev) => {
        const seen = new Set(prev.map((x) => x._id));
        const deduped = next.filter((x) => !seen.has(x._id));
        return prev.concat(deduped);
      });
      nextPageRef.current = page + 1;
      if (next.length < pageSize) setHasMore(false);
      if (next.length === 0) setHasMore(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load more");
    } finally {
      setLoading(false);
    }
  }, [debug, hasMore, loading, pageSize, search, selectedCats]);

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    if (!hasMore) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) fetchMore();
      },
      { rootMargin: "600px 0px 600px 0px", threshold: 0.01 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchMore, hasMore]);

  return (
    <>
      <div className="results__header">
        <div>
          <h2 className="h2">Published Content</h2>
          <div className="muted">
            Showing: <strong>{items.length}</strong>
          </div>
        </div>
        <div className="chips">
          {activeChips.map((c) => (
            <Link
              key={c}
              className="chip chip--button"
              title="Remove filter"
              scroll={false}
              href={{
                pathname: "/feed",
                query: {
                  ...(search ? { search } : {}),
                  category: selectedCats.filter((x) => x !== c),
                  ...(debug ? { debug: "1" } : {}),
                },
              }}
            >
              {c} <span aria-hidden="true">×</span>
            </Link>
          ))}
        </div>
      </div>

      {debug ? (
        <div className="alert" style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Debug</div>
          <div className="muted" style={{ wordBreak: "break-word" }}>
            Backend request: <code>{backendPath}</code>
          </div>
          <div className="muted">
            Returned items (initial): <strong>{initialItems.length}</strong>
          </div>
        </div>
      ) : null}

      <div className="list">
        {items.map((post) => {
          const locked = post.score === 0;
          const isPurchased = purchasedSet.has(post._id);
          return (
            <article key={post._id} className={`row ${locked && !isPurchased ? "row--locked" : ""}`}>
              <div className="row__top">
                <div className="row__title">{post.title}</div>
                <div className="row__date">{formatDate(post.published_at)}</div>
              </div>

              <div className="row__meta">
                <span className="chip">{post.category}</span>
                <span className="chip">Score: {post.score}</span>
                {locked && !isPurchased ? <span className="chip">{priceCredits} credits</span> : null}
                {locked && isPurchased ? <span className="chip">Purchased</span> : null}
              </div>

              {post.image_url ? (
                <div className="row__media">
                  <img className="row__image" src={post.image_url} alt="" loading="lazy" decoding="async" />
                </div>
              ) : null}

              <p className="row__excerpt">{post.reason}</p>

              <div className="row__actions">
                {locked && !isPurchased ? (
                  <form action={createPurchaseAction}>
                    <input type="hidden" name="report_id" value={post._id} />
                    <input type="hidden" name="return_to" value={currentFeedUrl} />
                    <input type="hidden" name="report_title" value={post.title} />
                    <input type="hidden" name="report_category" value={post.category} />
                    <input type="hidden" name="report_published_at" value={post.published_at} />
                    <input type="hidden" name="report_score" value={String(post.score)} />
                    <input type="hidden" name="report_reason" value={post.reason} />
                    <button className="btn btn--primary" type="submit">
                      Purchase ({priceCredits})
                    </button>
                  </form>
                ) : (
                  <form action={trackClickAndGoAction}>
                    <input type="hidden" name="report_id" value={post._id} />
                    <input type="hidden" name="campaign_type" value="feed" />
                    <input type="hidden" name="report_title" value={post.title} />
                    <input type="hidden" name="report_category" value={post.category} />
                    <input type="hidden" name="report_published_at" value={post.published_at} />
                    <input type="hidden" name="report_score" value={String(post.score)} />
                    <input type="hidden" name="report_reason" value={post.reason} />
                    <button className="btn btn--primary" type="submit">
                      View details
                    </button>
                  </form>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="infinite">
        {error ? <div className="alert alert--warn">{error}</div> : null}
        {loading ? <div className="infinite__status muted">Loading more…</div> : null}
        {!hasMore && !loading ? <div className="infinite__status muted">You’re all caught up.</div> : null}
        <div ref={sentinelRef} className="infinite__sentinel" />
      </div>
    </>
  );
}

