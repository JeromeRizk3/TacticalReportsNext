# Tactical Reports – Demo App

This repository contains a **demo implementation of a tactical‑reports website**.  
It’s built as a showcase of a modern Next.js/React stack with a few “real‑world” touches:

- authenticated feed of reports
- filtering, searching and infinite scroll
- purchase & tracking flows
- lightweight server‑side session management with signed cookies
- proxying to a remote backend API
- a small legacy Vite/React version for comparison

---

## 🚀 Getting started

```bash
# install dependencies
npm install

# development server
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000) by default.

Use one of the demo accounts on the **Sign in** page (all passwords are `demo123`):

```text
demo@example.com
demo2@example.com
…
```

---

## 🧱 Architecture overview

### Next.js 13 / “app” router

The project uses the app directory with a mixture of **server and client components**.

- `src/app/layout.tsx` defines global layout and CSS imports.
- `src/app/page.tsx` simply redirects to `/feed` or `/signin` based on the session.

### Routing & API

- `/signin` – sign‑in form backed by a server action (`src/app/actions/auth.ts`).
- `/feed` – main feed page; renders `FeedClient` (a server component) which fetches items
  from the backend and then hydrates child client components.
- `/posts/[postId]` – details page (not shown above but part of the demo).
- `src/app/api/*` contains minimal API routes that proxy to the backend and expose
  the current user.

### Server helpers

`src/lib/server/*` contains shared server‑only utilities:

- `backend.ts` – simple wrapper around `fetch()` that points at
  `BACKEND_BASE_URL` and disables caching.
- `session.ts` – cookie‑based session store. Payloads are base64‑url‑encoded
  and HMAC‑signed; cookies track the user, last viewed report, purchased IDs,
  and a “skip detail-click” flag. All session logic lives here and is consumed
  by pages and actions.

### Actions

Server actions (the `use server` modules) handle form submissions without an API round‑trip:

- `auth.ts` – logs in via `/auth/login` on the backend, writes the cookie, and
  redirects.
- `reports.ts` – purchase and click‑tracking actions, which call the backend,
  update cookies, and perform client navigation.

### Client components

A few interactive widgets:

- `SearchBox` – controlled input that updates the URL with debounce.
- `MissionSlides` – hero carousel.
- `PublishedContentClient` – infinite scrolling list with filter chips,
  “purchase” and “view details” buttons.

#### Feed flow

`FeedClient` (server component) handles:

1. fetching the first page of items from the backend with filters/search,
2. computing category list (unfiltered) for the sidebar,
3. maintaining `debug` mode, constructing URLs/qs,
4. rendering the layout via `AppShellServer`, then passing props to
   `PublishedContentClient`.

Infinite scrolling is driven by an `IntersectionObserver` that hits
`/api/posts` (a proxy) to fetch more items.

---

## 💡 Code insights

| Module                                                        | Purpose / Notes                                                                              |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `AppShellServer.tsx`                                          | Top bar, nav links, user info, and sign‑out form. Pure server component reading the session. |
| `session.ts`                                                  | Tiny lightweight HMAC signing used instead of JWTs. Cookie helpers expose typed APIs.        |
| `backendFetch`                                                | Central spot to point at the live demo backend; makes it easy to switch to a local mock.     |
| Server actions (`signInAction`, `createPurchaseAction`, etc.) | Demonstrate redirecting from an action and updating cookies.                                 |
| `PublishedContentClient`                                      | Example of client‑side state (loading, error, hasMore)                                       |
| plus forms that invoke server actions.                        |
| API routes                                                    | Serve as “edge” for client fetches; they re‑use `getUser()` and                              |
| forward query parameters to the backend.                      |

---

## 🧾 Legacy code

The `legacy-vite/` folder contains an earlier version of the UI built with
Vite and plain React. It offers simple components and static data
(`src/legacy-vite/data/*`). This folder is kept for reference and comparison
but is not used by the current Next.js app.

---

## 🛠️ Tools & tech

- **Next.js 13** (App Router, server components, streaming)
- **TypeScript** throughout
- **React** client logic with hooks
- **CSS modules** (global stylesheet only)
- Cookie-based server sessions with `crypto` (no external dependencies)
- Backend hosted on Railway (configured via `BACKEND_BASE_URL`)

---

## 📌 Notes & future ideas

- The demo backend is read‑only; purchases are stored in a cookie only.
- Authentication is mocked – tokens are faked and derive a user ID with a
  regex.
- The UI focuses on UX (filters, infinite loading, debug mode) rather than
  production‑grade styling.
- It would be straightforward to extend with SSR/ISR, add tests, or implement
  the details pages and subscription flows.

---

Feel free to explore the code, spin up your own backend, or adapt this
template for other content‑heavy applications.  
Happy hacking! 🧑‍💻
