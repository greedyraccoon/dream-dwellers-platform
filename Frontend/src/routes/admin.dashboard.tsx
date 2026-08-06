import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, Handshake, Users, IndianRupee, TrendingUp } from "lucide-react";
import { propertyApi, clientApi, dealApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import { FALLBACK_IMAGE, primaryImage } from "@/components/site/PropertyCard";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data: properties = [] } = useQuery({ queryKey: ["properties"], queryFn: propertyApi.list });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: clientApi.list });
  const { data: deals = [] } = useQuery({ queryKey: ["deals"], queryFn: dealApi.list });

  const activeDeals = deals.filter(d => d.status.toLowerCase() !== "closed").length;
  const revenue = deals.filter(d => d.status.toLowerCase() === "closed").reduce((s, d) => s + d.finalPrice, 0);

  const stats = [
    { icon: Building2, label: "Total properties", value: properties.length, hint: "Across all statuses" },
    { icon: Handshake, label: "Active deals", value: activeDeals, hint: "In pipeline" },
    { icon: Users, label: "Clients", value: clients.length, hint: "Active leads" },
    { icon: IndianRupee, label: "Closed revenue", value: formatINR(revenue), hint: "Lifetime" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-muted-foreground">A live snapshot of your book of business.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl">{s.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Recent deals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {deals.slice(0, 5).map(d => (
              <div key={d.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{d.propertyTitle}</div>
                  <div className="text-xs text-muted-foreground">{d.clientName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatINR(d.finalPrice)}</div>
                  <Badge variant="secondary" className="mt-1 text-xs">{d.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Latest listings</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {properties.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                <img
                  src={primaryImage(p)}
                  alt=""
                  className="h-12 w-16 rounded object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
                />
                <div className="flex-1">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.location}</div>
                </div>
                <div className="text-sm font-medium text-primary">{formatINR(p.price)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
