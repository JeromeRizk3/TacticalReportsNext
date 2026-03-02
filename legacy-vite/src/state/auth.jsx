import { createContext, useContext, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "xproj.auth.session.v1";

const DEMO_ACCOUNT = {
  email: "user@gmail.com",
  password: "123456",
  name: "User",
};

const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());

  const value = useMemo(() => {
    return {
      user,
      demoAccount: {
        email: DEMO_ACCOUNT.email,
        password: DEMO_ACCOUNT.password,
      },
      async signIn({ email, password }) {
        const ok =
          String(email).trim().toLowerCase() === DEMO_ACCOUNT.email &&
          String(password) === DEMO_ACCOUNT.password;

        if (!ok) {
          const err = new Error("Invalid email or password.");
          err.code = "INVALID_CREDENTIALS";
          throw err;
        }

        const session = { email: DEMO_ACCOUNT.email, name: DEMO_ACCOUNT.name };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        setUser(session);
        return session;
      },
      signOut() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>.");
  return ctx;
}
