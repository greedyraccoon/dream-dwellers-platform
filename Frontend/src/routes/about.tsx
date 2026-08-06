import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dream Estate" },
      { name: "description", content: "Dream Estate is a boutique real estate agency curating extraordinary homes since 2012." },
      { property: "og:title", content: "About Dream Estate" },
      { property: "og:description", content: "A boutique agency curating extraordinary homes since 2012." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Our story</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight md:text-6xl">A boutique agency built around the client, not the transaction.</h1>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000" alt="Dream Estate office" className="aspect-[4/5] rounded-xl object-cover" />
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>Dream Estate was founded in 2012 by three former architects who believed home-buying deserved better craft. A decade later we're a team of 42 across five cities — but we still work the way we did on day one: one advisor per client, no handoffs, no shortcuts.</p>
            <p>We represent buyers, sellers, and long-term investors across the United States and select international markets. Our practice spans everything from a first pied-à-terre to a multi-generational estate.</p>
            <p>What binds us is a shared standard: we only bring you a home we'd be proud to live in ourselves.</p>
          </div>
        </div>

        <div className="mt-20 grid gap-6 rounded-2xl border border-border bg-secondary/40 p-8 md:grid-cols-4">
          {[
            ["12+", "Years in market"],
            ["$1.4B", "Sold in 2025"],
            ["4.9★", "Client rating"],
            ["42", "Advisors"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-4xl text-primary">{n}</div>
              <div className="mt-1 text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
