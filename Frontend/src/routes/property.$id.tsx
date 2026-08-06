import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Bath, Bed, ChevronLeft, ChevronRight, MapPin, Ruler, User, X } from "lucide-react";
import { propertyApi } from "@/lib/api";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPropertyPrice, propertyTypeLabel } from "@/lib/format";
import { FALLBACK_IMAGE } from "@/components/site/PropertyCard";

export const Route = createFileRoute("/property/$id")({
  component: PropertyDetail,
});

function PropertyDetail() {
  const { id } = useParams({ from: "/property/$id" });
  const propertyId = Number(id);
  const { data: p, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertyApi.get(propertyId),
  });

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => { setActive(0); }, [propertyId]);

  if (isLoading || !p) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="mx-auto w-full max-w-6xl px-6 py-20 text-muted-foreground">Loading property…</div>
        <Footer />
      </div>
    );
  }

  const images = p.imageUrls?.length ? p.imageUrls : [FALLBACK_IMAGE];
  const go = (dir: 1 | -1) => setActive((i) => (i + dir + images.length) % images.length);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        {/* Gallery */}
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="relative aspect-[16/9] bg-muted">
            <img
              src={images[active]}
              alt={`${p.title} — image ${active + 1}`}
              className="h-full w-full cursor-zoom-in object-cover"
              onClick={() => setLightbox(true)}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground shadow hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground shadow hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium">
                  {active + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`aspect-[4/3] overflow-hidden rounded-lg border-2 transition ${i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }} />
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{propertyTypeLabel(p.type)}</Badge>
              <Badge>{p.status}</Badge>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{p.title}</h1>
            <p className="mt-2 flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {p.location}</p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Bed, label: "Bedrooms", value: p.bedrooms },
                { icon: Bath, label: "Bathrooms", value: p.bathrooms },
                { icon: Ruler, label: "Area", value: `${p.area.toLocaleString("en-IN")} sqft` },
                { icon: User, label: "Agent", value: p.agentName },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4">
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="mt-1 font-medium">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold">About this home</h2>
              <p className="mt-3 whitespace-pre-line break-words text-base leading-relaxed text-muted-foreground">
                {p.description ?? "A signature Dream Estate listing. Contact your advisor for the full brochure, floor plans, and private viewing schedule."}
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
            <div className="text-sm text-muted-foreground">{p.status}</div>
            <div className="mt-1 font-display text-4xl text-primary">{formatPropertyPrice(p.price, p.status)}</div>
            <div className="mt-6 space-y-3">
              <Button className="w-full">Book a viewing</Button>
              <Button variant="outline" className="w-full">Request brochure</Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">Listed by {p.agentName} · Dream Estate</p>
          </aside>
        </div>
      </section>
      <Footer />

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <img src={images[active]} alt="" className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => { e.stopPropagation(); go(1); }}
                className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
