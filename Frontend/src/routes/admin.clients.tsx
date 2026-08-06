import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { clientApi } from "@/lib/api";
import type { ClientRequest, ClientResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/admin/clients")({
  component: ClientsAdmin,
});

const empty: ClientRequest = { name: "", email: "", phone: "", budget: 0, preferences: "" };

function ClientsAdmin() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["clients"], queryFn: clientApi.list });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientRequest>(empty);

  function openCreate() { setEditingId(null); setForm(empty); setOpen(true); }
  function openEdit(c: ClientResponse) {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone, budget: c.budget, preferences: c.preferences });
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId != null) { await clientApi.update(editingId, form); toast.success("Client updated"); }
      else { await clientApi.create(form); toast.success("Client added"); }
      qc.invalidateQueries({ queryKey: ["clients"] });
      setOpen(false); setEditingId(null); setForm(empty);
    } catch { toast.error("Failed to save client."); }
  }

  async function onDelete(c: ClientResponse) {
    if (!window.confirm(`Delete client “${c.name}”? This cannot be undone.`)) return;
    try {
      await clientApi.remove(c.id);
      toast.success("Client deleted");
      qc.invalidateQueries({ queryKey: ["clients"] });
    } catch { toast.error("Failed to delete client."); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
          <p className="mt-1 text-muted-foreground">{items.length} active leads in your book.</p>
        </div>
        <Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" /> Add client</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId != null ? "Edit client" : "New client"}</DialogTitle></DialogHeader>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div><Label>Name</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Email</Label><Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Phone</Label><Input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1.5" /></div>
            </div>
            <div><Label>Budget (₹)</Label><Input required type="number" value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} className="mt-1.5" /></div>
            <div><Label>Preferences</Label><Textarea rows={3} value={form.preferences} onChange={e => setForm({ ...form, preferences: e.target.value })} className="mt-1.5" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">{editingId != null ? "Save changes" : "Save client"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead>Preferences</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.email}</TableCell>
                <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                <TableCell className="text-right font-medium">{formatINR(c.budget)}</TableCell>
                <TableCell className="max-w-[280px] truncate text-muted-foreground">{c.preferences}</TableCell>
                <TableCell>{c.agentName}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" aria-label="Edit client" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" aria-label="Delete client" onClick={() => onDelete(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
