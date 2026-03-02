import { Link, useSearchParams } from "react-router-dom";
import { POSTS } from "../data/posts.js";
import { useEntitlements } from "../state/entitlements.jsx";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function NewsletterPage() {
  const { creditsBalance, isPostUnlocked, unlockPost, addCredits } =
    useEntitlements();

  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const selectedCats = searchParams
    .getAll("cat")
    .map((s) => String(s).trim())
    .filter(Boolean);

  const categories = Array.from(new Set(POSTS.map((p) => p.category))).sort(
    (a, b) => a.localeCompare(b),
  );

  const filtered = POSTS.filter((p) => {
    const matchesQ =
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(q.toLowerCase()) ||
      (p.tags ?? []).some((t) =>
        String(t).toLowerCase().includes(q.toLowerCase()),
      );
    const matchesCat =
      !selectedCats.length || selectedCats.includes(p.category);
    return matchesQ && matchesCat;
  })
    .slice()
    .sort((a, b) => {
      const ta = new Date(a.publishedAt).getTime();
      const tb = new Date(b.publishedAt).getTime();
      if (tb !== ta) return tb - ta;
      return a.title.localeCompare(b.title);
    });

  const activeChips = selectedCats.length ? selectedCats : [];

  return (
    <div className="layout">
      <aside className="sidebar">
        <section className="panel panel--tight">
          <h2 className="h2">Credits</h2>
          <div className="credits">
            <div className="credits__row">
              <span className="muted">Balance</span>
              <span className="credits__value">{creditsBalance}</span>
            </div>
            <div className="credits__actions">
              <button
                className="btn btn--primary"
                onClick={() => addCredits(25)}
              >
                Buy 25 credits
              </button>
              <button className="btn btn--ghost" onClick={() => addCredits(60)}>
                Buy 60 credits
              </button>
            </div>
          </div>
        </section>

        <section className="panel panel--tight">
          <div className="panel__top">
            <div>
              <h2 className="h2">Filters</h2>
              <p className="muted">Filter by category and search.</p>
            </div>
            <div className="panel__actions"></div>
          </div>

          <label className="field">
            <span className="field__label">Search</span>
            <input
              className="input"
              value={q}
              placeholder="Search posts…"
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                const v = e.target.value;
                if (v) next.set("q", v);
                else next.delete("q");
                setSearchParams(next, { replace: true });
              }}
            />
          </label>

          <div className="filters__section">
            <div className="filters__title">Categories</div>
            <div className="filters__list">
              {categories.map((cat) => {
                const checked = selectedCats.includes(cat);
                return (
                  <label key={cat} className="check">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const nextSet = new Set(selectedCats);
                        if (nextSet.has(cat)) nextSet.delete(cat);
                        else nextSet.add(cat);
                        const next = new URLSearchParams(searchParams);
                        next.delete("cat");
                        for (const c of Array.from(nextSet))
                          next.append("cat", c);
                        setSearchParams(next, { replace: true });
                      }}
                    />
                    <span className="check__label">{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {(q.length > 0 || selectedCats.length > 0) && (
            <button
              className="btn btn--ghost"
              onClick={() => setSearchParams({}, { replace: true })}
            >
              Clear filters
            </button>
          )}
        </section>
      </aside>

      <section className="panel results">
        <div className="results__header">
          <div>
            <h2 className="h2">Published Content</h2>
            <div className="muted">
              Total Results: <strong>{filtered.length}</strong>
            </div>
          </div>
          <div className="chips">
            {activeChips.map((c) => (
              <button
                key={c}
                className="chip chip--button"
                onClick={() => {
                  const nextSet = new Set(selectedCats);
                  nextSet.delete(c);
                  const next = new URLSearchParams(searchParams);
                  next.delete("cat");
                  for (const v of Array.from(nextSet)) next.append("cat", v);
                  setSearchParams(next, { replace: true });
                }}
                title="Remove filter"
              >
                {c} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        </div>

        <div className="list">
          {filtered.map((post) => {
            const unlocked = isPostUnlocked(post.id);
            const cost = post.creditsCost ?? 0;
            const canUnlock = !unlocked && creditsBalance >= cost;
            return (
              <article
                key={post.id}
                className={`row ${unlocked ? "" : "row--locked"}`}
              >
                <div className="row__top">
                  <div className="row__title">
                    {!unlocked ? (
                      <span className="row__lock" aria-hidden="true">
                        🔒
                      </span>
                    ) : null}
                    {post.title}
                  </div>
                  <div className="row__date">
                    {formatDate(post.publishedAt)}
                  </div>
                </div>

                <div className="row__meta">
                  <span className="chip chip--soft">{post.category}</span>
                  {!unlocked ? (
                    <span className="chip chip--soft">{cost} credits</span>
                  ) : (
                    <span className="chip chip--soft">Unlocked</span>
                  )}
                </div>

                <p className="row__excerpt">{post.excerpt}</p>

                <div className="row__actions">
                  {unlocked ? (
                    <Link className="btn btn--primary" to={`/posts/${post.id}`}>
                      View details
                    </Link>
                  ) : (
                    <>
                      <button
                        className="btn btn--primary"
                        disabled={!canUnlock}
                        onClick={() => unlockPost({ postId: post.id, cost })}
                      >
                        Unlock ({cost})
                      </button>
                      <Link className="btn btn--ghost" to={`/posts/${post.id}`}>
                        Preview
                      </Link>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
