import { createFileRoute } from "@tanstack/react-router";
import { Home, Key, LineChart, Search, Handshake, Camera } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Dream Estate" },
      { name: "description", content: "Buyer representation, listing marketing, luxury rentals, and full concierge services from Dream Estate." },
      { property: "og:title", content: "Services — Dream Estate" },
      { property: "og:description", content: "Buyer representation, listing marketing, luxury rentals, and concierge services." },
    ],
  }),
  component: Services,
});

const services = [
  { icon: Search, title: "Buyer representation", body: "Curated property tours, negotiation, and inspection choreography — start to signature." },
  { icon: Home, title: "Listing marketing", body: "Editorial-grade staging, storytelling, and global syndication that moves premium homes fast." },
  { icon: Key, title: "Luxury rentals", body: "Long and short-term leasing with vetted tenants and end-to-end owner management." },
  { icon: Camera, title: "Content & staging", body: "In-house cinematographers and stylists produce assets that outperform on every channel." },
  { icon: LineChart, title: "Market intelligence", body: "Quarterly briefings on micro-markets, price trends, and off-market opportunities." },
  { icon: Handshake, title: "Concierge close", body: "Legal, finance, and relocation partners orchestrated by a single point of contact." },
];

function Services() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">What we do</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">Full-spectrum real estate, orchestrated with care.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">Six specialist practices, one dedicated advisor. Whether you're buying, selling, leasing, or watching the market — Dream Estate has you covered.</p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, body }) => (
            <div key={title} className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="grid h-11 w-11 place-items-center rounded-lg brand-gradient text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
