import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { blogApi } from "@/lib/api";
import { sanitizeHtml } from "@/lib/sanitize";
import type { BlogResponse } from "@/lib/types";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Article — Dream Estate" },
      { name: "description", content: "Read the latest property insights and buying guides from the Dream Estate advisory team." },
      { property: "og:title", content: "Article — Dream Estate" },
      { property: "og:description", content: "Property insights and buying guides from Dream Estate." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogDetail,
});

const FALLBACK = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80";

function BlogDetail() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const [blog, setBlog] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    blogApi.getBySlug(slug)
      .then(data => { if (alive) setBlog(data); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [slug]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <article className="mx-auto w-full max-w-3xl px-6 py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        {loading ? (
          <div className="mt-8 space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="aspect-[16/9] animate-pulse rounded-xl bg-muted" />
          </div>
        ) : !blog ? (
          <p className="mt-10 text-muted-foreground">This post could not be found.</p>
        ) : (
          <>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">{blog.title}</h1>
            {blog.createdAt && (
              <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}
            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-muted">
              <img
                src={blog.coverImageUrl || FALLBACK}
                alt={blog.title}
                className="aspect-[16/9] w-full object-cover"
                onError={e => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
              />
            </div>
            <div
              className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:ml-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
            />
          </>
        )}
      </article>
      <Footer />
    </div>
  );
}
