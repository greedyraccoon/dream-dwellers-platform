import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Building2, Users, Handshake, LogOut, Home, Newspaper, PenSquare, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/deals", label: "Deals", icon: Handshake },
  { to: "/admin/blogs", label: "All Blogs", icon: Newspaper },
  { to: "/admin/blogs/new", label: "Create Blog", icon: PenSquare },
  { to: "/admin/users", label: "Users", icon: ShieldCheck, adminOnly: true },
] as const;

function AdminLayout() {
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });

  useEffect(() => {
    // hydrate wait — if still no token after mount, bounce to /login
    const t = setTimeout(() => {
      if (!localStorage.getItem("token")) navigate({ to: "/login" });
    }, 50);
    return () => clearTimeout(t);
  }, [navigate]);

  if (!isAuthenticated && typeof window !== "undefined" && !localStorage.getItem("token")) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-md brand-gradient text-primary-foreground"><Home className="h-4 w-4" /></span>
          Dream Estate
        </Link>
        <nav className="flex-1 space-y-1">
          {nav.filter(n => !("adminOnly" in n && n.adminOnly) || user?.role?.toUpperCase().includes("ADMIN")).map(n => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border pt-4">
          <div className="px-3 pb-3 text-sm">
            <div className="font-medium">{user?.name ?? "Agent"}</div>
            <div className="text-xs text-muted-foreground">{user?.role ?? "ADMIN"}</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { signOut(); navigate({ to: "/login" }); }} className="w-full gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="border-b border-border bg-background/60 px-6 py-4 backdrop-blur md:px-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Dream Estate · Admin</div>
        </div>
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
