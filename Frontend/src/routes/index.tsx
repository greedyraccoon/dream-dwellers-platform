import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, MapPin, ShieldCheck, Sparkles, Star, ArrowRight } from "lucide-react";
import { propertyApi } from "@/lib/api";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROPERTY_TYPES, propertyTypeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

const testimonials = [
  { name: "Isabella M.", role: "Bought in Mumbai", quote: "Dream Estate found us a home that felt tailor-made. Every detail was handled." },
  { name: "David & Chloe", role: "Sold in Bengaluru", quote: "Sold above asking in 11 days. The marketing photography was on another level." },
  { name: "Rahul K.", role: "Rented in Gurugram", quote: "White-glove service from the first call. I never once felt like a transaction." },
];

type Intent = "any" | "buy" | "rent";

function Home() {
  const { data: properties = [] } = useQuery({ queryKey: ["properties"], queryFn: propertyApi.list });
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("any");
  const [intent, setIntent] = useState<Intent>("any");

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (q && !`${p.title} ${p.location}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (type !== "any" && p.type !== type) return false;
      if (intent === "buy" && p.status.toUpperCase() !== "AVAILABLE") return false;
      if (intent === "rent" && p.status.toUpperCase() !== "RENTED") return false;
      return true;
    });
  }, [properties, q, type, intent]);

  const types = Array.from(new Set(properties.map(p => p.type)));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Concierge real estate since 2012
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            The address of your <span className="text-primary">next chapter</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Dream Estate curates extraordinary homes across India — matched to the life you're planning next.
          </p>

          {/* Search */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-4 shadow-xl md:p-6">
            {/* Buy/Rent toggle */}
            <div className="mb-4 inline-flex rounded-lg border border-border bg-muted p-1">
              {(["any", "buy", "rent"] as Intent[]).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setIntent(v)}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-sm font-medium capitalize transition",
                    intent === v ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v === "any" ? "All" : v}
                </button>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_200px_auto]">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={e => setQ(e.target.value)} placeholder="City, neighborhood, or property" className="pl-9 h-11" />
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any type</SelectItem>
                  {PROPERTY_TYPES.filter(t => types.length === 0 || types.includes(t.value)).map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                  {types.filter(t => !PROPERTY_TYPES.some(pt => pt.value === t)).map(t => (
                    <SelectItem key={t} value={t}>{propertyTypeLabel(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="lg" className="h-11 gap-2"><Search className="h-4 w-4" /> Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">Featured properties</h2>
            <p className="mt-2 text-muted-foreground">{filtered.length} homes matching your search</p>
          </div>
          <Link to="/services" className="hidden text-sm font-medium text-primary hover:underline md:inline-flex">
            Explore services <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">No properties match those filters.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(p => <PropertyCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      {/* Trust */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verified listings", body: "Every property is personally vetted by a Dream Estate agent before it reaches you." },
            { icon: Sparkles, title: "Concierge close", body: "From inspections to key handover, we run the choreography so you don't have to." },
            { icon: Star, title: "5★ service", body: "Consistently rated the top boutique agency across our operating regions." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-semibold md:text-4xl">What clients say</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">Stories from the families and founders we've placed.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map(t => (
            <figure key={t.name} className="rounded-xl border border-border bg-card p-6">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-foreground">"{t.quote}"</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-medium">{t.name}</span>
                <span className="text-muted-foreground"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
