import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShellServer } from "@/components/AppShellServer";
import { createPurchaseAction, trackClickAndGoAction } from "@/app/actions/reports";
import { backendFetch } from "@/lib/server/backend";
import { getPurchasedReportIds, getUser } from "@/lib/server/session";
import { SearchBox } from "./SearchBox";
import { MissionSlides } from "./MissionSlides";
import { PublishedContentClient } from "./PublishedContentClient";

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

type FeedItem = {
  _id: string;
  title: string;
  category: string;
  published_at: string;
  score: number;
  reason: string;
  image_url?: string | null;
};

export async function FeedClient({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
}) {
  // Next.js 16 may provide `searchParams` as a Promise.
  const sp = await Promise.resolve(searchParams);
  const user = await getUser();
  if (!user) redirect("/signin");
  const purchasedIds = await getPurchasedReportIds();

  const debug =
    (typeof sp.debug === "string" && sp.debug === "1") ||
    (Array.isArray(sp.debug) && sp.debug.includes("1")) ||
    process.env.DEBUG_FEED === "true";

  const search =
    typeof sp.search === "string"
      ? sp.search.trim()
      : typeof sp.q === "string"
        ? sp.q.trim()
        : "";

  const filterRaw = sp.category ?? sp.filter ?? sp.cat;
  const selectedCats = Array.isArray(filterRaw)
    ? filterRaw.map((s) => String(s).trim()).filter(Boolean)
    : typeof filterRaw === "string"
      ? [String(filterRaw).trim()].filter(Boolean)
      : [];

  const currentFeedUrl = (() => {
    const url = new URLSearchParams();
    if (search) url.set("search", search);
    for (const c of selectedCats) url.append("category", c);
    if (debug) url.set("debug", "1");
    const qs = url.toString();
    return qs ? `/feed?${qs}` : "/feed";
  })();

  const pageSize = 5;
  const qs = new URLSearchParams();
  qs.set("userId", user.userId);
  if (search) qs.set("search", search);
  for (const c of selectedCats) qs.append("category", c);
  qs.set("limit", String(pageSize));
  qs.set("page", "1");

  const backendPath = `/feed?${qs.toString()}`;
  const feedRes = await backendFetch(`/feed?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  if (!feedRes.ok) redirect("/signin");
  const feedJson = (await feedRes.json()) as { items?: FeedItem[] };
  const initialItems = Array.isArray(feedJson.items) ? feedJson.items : [];

  // Categories should be computed from an unfiltered set so users can add more categories.
  const categories = await (async () => {
    const q2 = new URLSearchParams();
    q2.set("userId", user.userId);
    if (search) q2.set("search", search);
    q2.set("limit", "200");
    q2.set("page", "1");
    const res = await backendFetch(`/feed?${q2.toString()}`, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
    if (!res.ok) return uniqSorted(initialItems.map((p) => p.category));
    const json = (await res.json()) as { items?: FeedItem[] };
    const all = Array.isArray(json.items) ? json.items : [];
    return uniqSorted(all.map((p) => p.category));
  })();

  if (debug) {
    console.log("[feed] request", { backendPath });
    console.log("[feed] response sample", {
      count: initialItems.length,
      first: initialItems[0],
    });
  }

  const activeChips = selectedCats.length ? selectedCats : [];

  return (
    <AppShellServer activePath="/feed">
        <div className="fullBleed heroWrap">
          <div className="heroWrap__inner">
            <MissionSlides intervalMs={5000} />
          </div>
        </div>

        <div className="layout">
          <aside className="sidebar">
            <section className="panel panel--tight panel--blueShade">
              <div className="panel__top">
                <div>
                  <h2 className="h2">Filters</h2>
                  <p className="muted">Filter by category and search.</p>
                </div>
                <div className="panel__actions" />
              </div>

              <div className="field">
                <span className="field__label">Search</span>
                <SearchBox initialValue={search} placeholder="Search posts…" />
              </div>

              <div className="filters__section">
                <div className="filters__title">Categories</div>
                <div className="filters__list">
                  {categories.map((cat) => {
                    const checked = selectedCats.includes(cat);
                    const nextFilters = checked
                      ? selectedCats.filter((c) => c !== cat)
                      : [...selectedCats, cat];
                    return (
                      <Link
                        key={cat}
                        className="check"
                        scroll={false}
                        href={{
                          pathname: "/feed",
                          query: {
                            ...(search ? { search } : {}),
                            ...(nextFilters.length ? { category: nextFilters } : {}),
                            ...(debug ? { debug: "1" } : {}),
                          },
                        }}
                        aria-label={checked ? `Remove ${cat}` : `Add ${cat}`}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            display: "grid",
                            placeItems: "center",
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            border: `1px solid var(--surface-border)`,
                            background: checked
                              ? "linear-gradient(135deg, var(--primary), var(--primary-2))"
                              : "var(--surface)",
                          }}
                        />
                        <span className="check__label">{cat}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {(search.length > 0 || selectedCats.length > 0) && (
                <div className="filters__footer">
                  <Link
                    className="btn btn--ghost filters__clear"
                    scroll={false}
                    href={debug ? { pathname: "/feed", query: { debug: "1" } } : "/feed"}
                  >
                    Clear filters
                  </Link>
                </div>
              )}
            </section>
          </aside>

          <div className="maincol">
            <section className="panel results panel--blueShade">
              <PublishedContentClient
                key={`q=${search}|cats=${selectedCats.join(",")}|debug=${debug ? "1" : "0"}`}
                initialItems={initialItems}
                purchasedIds={purchasedIds}
                search={search}
                selectedCats={selectedCats}
                debug={debug}
                backendPath={backendPath}
                currentFeedUrl={currentFeedUrl}
                pageSize={pageSize}
                createPurchaseAction={createPurchaseAction}
                trackClickAndGoAction={trackClickAndGoAction}
              />
            </section>
          </div>
        </div>
    </AppShellServer>
  );
}

