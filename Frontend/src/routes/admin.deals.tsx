import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { dealApi, propertyApi, clientApi } from "@/lib/api";
import type { DealRequest, DealResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/admin/deals")({
  component: DealsAdmin,
});

const empty: DealRequest = { propertyId: 0, clientId: 0, finalPrice: 0, status: "Pending" };

function DealsAdmin() {
  const qc = useQueryClient();
  const { data: deals = [] } = useQuery({ queryKey: ["deals"], queryFn: dealApi.list });
  const { data: properties = [] } = useQuery({ queryKey: ["properties"], queryFn: propertyApi.list });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: clientApi.list });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DealRequest>(empty);

  function openCreate() { setEditingId(null); setForm(empty); setOpen(true); }
  function openEdit(d: DealResponse) {
    setEditingId(d.id);
    setForm({
      propertyId: properties.find(p => p.title === d.propertyTitle)?.id ?? 0,
      clientId: clients.find(c => c.name === d.clientName)?.id ?? 0,
      finalPrice: d.finalPrice,
      status: d.status,
    });
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId != null) { await dealApi.update(editingId, form); toast.success("Deal updated"); }
      else { await dealApi.create(form); toast.success("Deal booked"); }
      qc.invalidateQueries({ queryKey: ["deals"] });
      setOpen(false); setEditingId(null); setForm(empty);
    } catch { toast.error("Failed to save deal."); }
  }

  async function onDelete(d: DealResponse) {
    if (!window.confirm(`Delete the deal for “${d.propertyTitle}”? This cannot be undone.`)) return;
    try {
      await dealApi.remove(d.id);
      toast.success("Deal deleted");
      qc.invalidateQueries({ queryKey: ["deals"] });
    } catch { toast.error("Failed to delete deal."); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Deals</h1>
          <p className="mt-1 text-muted-foreground">{deals.length} transactions on the books.</p>
        </div>
        <Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" /> Book deal</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId != null ? "Edit deal" : "New deal"}</DialogTitle></DialogHeader>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <Label>Property</Label>
              <Select value={form.propertyId ? String(form.propertyId) : ""} onValueChange={v => setForm({ ...form, propertyId: Number(v) })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>{properties.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Client</Label>
              <Select value={form.clientId ? String(form.clientId) : ""} onValueChange={v => setForm({ ...form, clientId: Number(v) })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{clients.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Final price (₹)</Label><Input required type="number" value={form.finalPrice} onChange={e => setForm({ ...form, finalPrice: Number(e.target.value) })} className="mt-1.5" /></div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Negotiating">Negotiating</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">{editingId != null ? "Save changes" : "Save deal"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Final price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map(d => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.propertyTitle}</TableCell>
                <TableCell>{d.clientName}</TableCell>
                <TableCell className="text-muted-foreground">{d.agentName}</TableCell>
                <TableCell className="text-right font-medium">{formatINR(d.finalPrice)}</TableCell>
                <TableCell><Badge variant={d.status.toLowerCase() === "closed" ? "default" : "secondary"}>{d.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" aria-label="Edit deal" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" aria-label="Delete deal" onClick={() => onDelete(d)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
