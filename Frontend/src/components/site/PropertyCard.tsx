import { Link } from "@tanstack/react-router";
import { Bath, Bed, MapPin, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PropertyResponse } from "@/lib/types";
import { formatPropertyPrice, propertyTypeLabel } from "@/lib/format";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200";

export function primaryImage(p: Pick<PropertyResponse, "imageUrls">): string {
  return p.imageUrls?.[0] || FALLBACK_IMAGE;
}

export function PropertyCard({ p }: { p: PropertyResponse }) {
  return (
    <Link
      to="/property/$id"
      params={{ id: String(p.id) }}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={primaryImage(p)}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground hover:bg-background">
          {p.status}
        </Badge>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight">{p.title}</h3>
          <span className="whitespace-nowrap text-sm font-semibold text-primary">
            {formatPropertyPrice(p.price, p.status)}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {p.location}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {p.bedrooms} Beds</span>
          <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {p.bathrooms} Baths</span>
          <span className="flex items-center gap-1"><Ruler className="h-3.5 w-3.5" /> {p.area.toLocaleString("en-IN")} Sq Ft</span>
          <span className="ml-auto">{propertyTypeLabel(p.type)}</span>
        </div>
      </div>
    </Link>
  );
}
