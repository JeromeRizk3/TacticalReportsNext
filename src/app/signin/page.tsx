import { redirect } from "next/navigation";
import { signInAction } from "@/app/actions/auth";
import { getUser } from "@/lib/server/session";
import { Footer } from "@/components/Footer";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const user = await getUser();
  if (user) redirect("/feed");

  const showError = searchParams?.error === "invalid";

  return (
    <>
      <div className="center">
        <div className="card">
          <div style={{ marginBottom: 10 }}>
            <h1 className="h1">Sign in</h1>
            <p className="muted">
              Use one of the demo accounts to enter Tactical Reports.
            </p>
          </div>

          <form className="form" action={signInAction}>
            <label className="field">
              <span className="field__label">Email</span>
              <input
                className="input"
                name="email"
                defaultValue="demo@example.com"
                autoComplete="username"
              />
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <input
                className="input"
                name="password"
                type="password"
                defaultValue="demo123"
                autoComplete="current-password"
              />
            </label>

            {showError ? (
              <div className="alert alert--error">Invalid email or password.</div>
            ) : null}

            <button className="btn btn--primary" type="submit">
              Sign in
            </button>

            <div className="hint">
              Demo credentials (all use password <code>demo123</code>):
              <div style={{ marginTop: 6, display: "grid", gap: 4 }}>
                <div>
                  <code>demo@example.com</code>
                </div>
                <div>
                  <code>demo2@example.com</code>
                </div>
                <div>
                  <code>demo3@example.com</code>
                </div>
                <div>
                  <code>demo4@example.com</code>
                </div>
                <div>
                  <code>demo5@example.com</code>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
