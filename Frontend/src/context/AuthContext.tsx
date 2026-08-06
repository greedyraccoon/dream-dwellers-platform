import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { tokenStore } from "@/lib/api";
import type { AuthenticationResponse } from "@/lib/types";

interface AuthUser { userId: number; name: string; role: string }
interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (res: AuthenticationResponse) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USER_KEY = "dd_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const t = tokenStore.get();
    const u = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null;
    if (t) setToken(t);
    if (u) { try { setUser(JSON.parse(u)); } catch { /* noop */ } }
  }, []);

  const signIn = (res: AuthenticationResponse) => {
    tokenStore.set(res.token);
    const u = { userId: res.userId, name: res.name, role: res.role };
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(res.token);
    setUser(u);
  };

  const signOut = () => {
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
