import { Link } from "@tanstack/react-router";
import { Home, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { isAuthenticated, signOut, user } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-md brand-gradient text-primary-foreground">
            <Home className="h-4 w-4" />
          </span>
          Dream Estate
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" /> {user?.name ?? "Dashboard"}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          )}
        </div>
      </div>
    </header>
  );
}
