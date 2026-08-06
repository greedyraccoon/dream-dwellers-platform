import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Home } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      signIn(res);
      toast.success(`Welcome back, ${res.name}`);
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-md brand-gradient text-primary-foreground"><Home className="h-4 w-4" /></span>
          Dream Estate
        </Link>
        <h1 className="mt-8 text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to the agent dashboard.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" /></div>
          <div><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1.5" /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
        </form>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/40 p-4">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Demo Access</div>
          <p className="mt-1 text-xs text-muted-foreground">Fill the form with a sample role, then press Sign in.</p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button" variant="outline" size="sm" className="flex-1"
              onClick={() => { setEmail("admin@dreamestate.com"); setPassword("admin123"); }}
            >
              Login as Admin
            </Button>
            <Button
              type="button" variant="outline" size="sm" className="flex-1"
              onClick={() => { setEmail("agent@dreamestate.com"); setPassword("agent123"); }}
            >
              Login as Agent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
