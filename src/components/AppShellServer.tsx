import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { getUser } from "@/lib/server/session";
import { Footer } from "@/components/Footer";

function NavItem({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link className={`nav__link ${active ? "active" : ""}`} href={href}>
      {children}
    </Link>
  );
}

function NavLabel({ children }: { children: React.ReactNode }) {
  return <span className="nav__link nav__link--static">{children}</span>;
}

export async function AppShellServer({
  activePath,
  children,
}: {
  activePath: string;
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand" role="banner">
            <div className="brand__logo" aria-hidden="true">
              TC
            </div>
            <div className="brand__text">
              <div className="brand__name">Tactical Reports</div>
              <div className="brand__meta">
                Signed in as <strong>{user?.email ?? "—"}</strong>
              </div>
            </div>
          </div>

          <nav className="nav">
            <NavLabel>About Us</NavLabel>
            <NavLabel>Products</NavLabel>
            <NavLabel>Pricing</NavLabel>
            <NavLabel>Topics</NavLabel>
            <NavLabel>Contact Us</NavLabel>

            <NavItem href="/feed" active={activePath === "/feed"}>
              Published Content
            </NavItem>

            <form action={signOutAction}>
              <button className="btn btn--ghost" type="submit">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="content">{children}</main>

      <Footer />
    </div>
  );
}

