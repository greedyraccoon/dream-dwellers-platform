import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { blogApi } from "@/lib/api";
import type { BlogResponse } from "@/lib/types";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Dream Estate" },
      { name: "description", content: "Market notes, buying guides, and property insights from the Dream Estate advisory team." },
      { property: "og:title", content: "Blog — Dream Estate" },
      { property: "og:description", content: "Market notes, buying guides, and property insights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogList,
});

const FALLBACK = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

function BlogList() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    blogApi.list()
      .then(data => { if (alive) setBlogs(data); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Journal</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">Notes from the market.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Guides, data, and hard-won lessons from the people who close deals every week.
        </p>

        {loading ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-72 animate-pulse rounded-xl border border-border bg-muted/40" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="mt-16 text-muted-foreground">No posts published yet.</p>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map(b => (
              <Link
                key={b.slug}
                to="/blog/$slug"
                params={{ slug: b.slug }}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={b.coverImageUrl || FALLBACK}
                    alt={b.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                  />
                </div>
                <div className="p-5">
                  {b.createdAt && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  )}
                  <h2 className="mt-2 text-lg font-semibold leading-snug group-hover:text-primary">{b.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
