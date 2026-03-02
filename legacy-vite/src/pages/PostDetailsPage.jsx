import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { POSTS_BY_ID } from "../data/posts.js";
import { useEntitlements } from "../state/entitlements.jsx";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostDetailsPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { isPostUnlocked, unlockPost, creditsBalance, addCredits } =
    useEntitlements();

  const post = useMemo(() => {
    return postId ? POSTS_BY_ID[postId] : null;
  }, [postId]);

  const unlocked = post ? isPostUnlocked(post.id) : false;
  const cost = post?.creditsCost ?? 0;

  if (!post) {
    return (
      <div className="panel">
        <h2 className="h2">Post not found</h2>
        <p className="muted">That post ID doesn’t exist in the demo dataset.</p>
        <Link className="btn btn--ghost" to="/newsletter">
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="details__top">
          <button className="btn btn--ghost" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="chips">
            <span className="chip chip--soft">{post.category}</span>
            <span className="chip chip--soft">
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>

        <h1 className="h1">{post.title}</h1>
        <p className="muted">Unlock this post to read the full details.</p>

        {!unlocked ? (
          <div className="alert alert--warn">
            <div className="paywall">
              <div>
                <div className="paywall__title">Locked summary</div>
                <div className="muted">
                  This post costs <strong>{cost}</strong> credits to unlock.
                </div>
                <div className="muted">
                  Your balance: <strong>{creditsBalance}</strong>
                </div>
              </div>
              <div className="paywall__actions">
                <button
                  className="btn btn--primary"
                  disabled={creditsBalance < cost}
                  onClick={() => unlockPost({ postId: post.id, cost })}
                >
                  Unlock now ({cost})
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() => addCredits(60)}
                >
                  Buy 60 credits
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="prose">
          <p className="lead">{post.excerpt}</p>
          {unlocked ? <p>{post.content}</p> : null}
        </div>

        <div className="details__bottom">
          <Link className="btn btn--primary" to="/newsletter">
            Back to feed
          </Link>
        </div>
      </section>
    </div>
  );
}
