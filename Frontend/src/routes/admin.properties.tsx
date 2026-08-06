import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import { propertyApi } from "@/lib/api";
import type { PropertyRequest, PropertyResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PROPERTY_TYPES, PROPERTY_STATUSES, formatINR, propertyTypeLabel } from "@/lib/format";
import { FALLBACK_IMAGE, primaryImage } from "@/components/site/PropertyCard";

export const Route = createFileRoute("/admin/properties")({
  component: PropertiesAdmin,
});

const empty: PropertyRequest = {
  title: "", description: "", type: "FURNISHED", status: "AVAILABLE",
  price: 0, location: "", bedrooms: 0, bathrooms: 0, area: 0,
};

interface NewImage { file: File; url: string }

function PropertiesAdmin() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["properties"], queryFn: propertyApi.list });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PropertyResponse | null>(null);
  const [form, setForm] = useState<PropertyRequest>(empty);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [saving, setSaving] = useState(false);

  function resetImages() {
    newImages.forEach(n => URL.revokeObjectURL(n.url));
    setNewImages([]);
    setExistingUrls([]);
  }

  function openCreate() {
    setEditing(null);
    setForm(empty);
    resetImages();
    setOpen(true);
  }
  function openEdit(p: PropertyResponse) {
    setEditing(p);
    setForm({
      title: p.title, description: p.description ?? "", type: p.type, status: p.status,
      price: p.price, location: p.location, bedrooms: p.bedrooms, bathrooms: p.bathrooms, area: p.area,
    });
    resetImages();
    setExistingUrls(p.imageUrls ?? []);
    setOpen(true);
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const next = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setNewImages(prev => [...prev, ...next]);
    e.target.value = "";
  }
  function removeNewImage(i: number) {
    setNewImages(prev => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
  }
  function removeExistingUrl(i: number) {
    setExistingUrls(prev => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = editing
        ? await propertyApi.update(editing.id, form)
        : await propertyApi.create(form);
      if (newImages.length > 0) {
        try {
          await propertyApi.uploadImages(saved.id, newImages.map(n => n.file));
        } catch {
          toast.error("Property saved, but image upload failed.");
        }
      }
      toast.success(editing ? "Property updated" : "Property created");
      qc.invalidateQueries({ queryKey: ["properties"] });
      setOpen(false);
      resetImages();
    } catch {
      toast.error("Save failed — check backend connection.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number) {
    try { await propertyApi.remove(id); toast.success("Property deleted"); qc.invalidateQueries({ queryKey: ["properties"] }); }
    catch { toast.error("Delete failed."); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Properties</h1>
          <p className="mt-1 text-muted-foreground">{items.length} listings in your portfolio.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetImages(); }}>
          <DialogTrigger asChild><Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add property</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit property" : "New property"}</DialogTitle></DialogHeader>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Title</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5" /></div>
              <div className="sm:col-span-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1.5" /></div>

              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROPERTY_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div><Label>Price (₹)</Label><Input required type="number" min={0} value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="mt-1.5" /></div>
              <div><Label>Location</Label><Input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Bedrooms</Label><Input required type="number" min={0} value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: Number(e.target.value) })} className="mt-1.5" /></div>
              <div><Label>Bathrooms</Label><Input required type="number" min={0} value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: Number(e.target.value) })} className="mt-1.5" /></div>
              <div className="sm:col-span-2"><Label>Area (Sq Ft)</Label><Input required type="number" min={0} value={form.area} onChange={e => setForm({ ...form, area: Number(e.target.value) })} className="mt-1.5" /></div>

              <div className="sm:col-span-2">
                <Label>Images</Label>
                <div className="mt-1.5 rounded-lg border border-dashed border-border p-4">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-accent">
                    <Upload className="h-4 w-4" />
                    Choose images
                    <input type="file" accept="image/*" multiple className="hidden" onChange={onPickFiles} />
                  </label>
                  {(existingUrls.length + newImages.length) > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {existingUrls.map((url, i) => (
                        <div key={`ex-${i}`} className="group relative aspect-square overflow-hidden rounded-md border border-border">
                          <img src={url} alt="" className="h-full w-full object-cover" />
                          <button type="button" onClick={() => removeExistingUrl(i)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow group-hover:opacity-100">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      {newImages.map((n, i) => (
                        <div key={`new-${i}`} className="group relative aspect-square overflow-hidden rounded-md border border-primary/50">
                          <img src={n.url} alt="" className="h-full w-full object-cover" />
                          <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">NEW</span>
                          <button type="button" onClick={() => removeNewImage(i)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow group-hover:opacity-100">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">Select multiple images. New files upload after the property is saved.</p>
                </div>
              </div>

              <DialogFooter className="sm:col-span-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Create property"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Beds</TableHead>
              <TableHead>Baths</TableHead>
              <TableHead>Area</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(p => (
              <TableRow key={p.id}>
                <TableCell className="flex items-center gap-3">
                  <img
                    src={primaryImage(p)}
                    alt=""
                    className="h-10 w-14 rounded object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
                  />
                  <div>
                    <div className="font-medium">{p.title}</div>
                  </div>
                </TableCell>
                <TableCell>{propertyTypeLabel(p.type)}</TableCell>
                <TableCell><Badge variant="secondary">{p.status}</Badge></TableCell>
                <TableCell>{p.location}</TableCell>
                <TableCell className="text-right font-medium">{formatINR(p.price)}</TableCell>
                <TableCell>{p.bedrooms}</TableCell>
                <TableCell>{p.bathrooms}</TableCell>
                <TableCell>{p.area.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete property?</AlertDialogTitle>
                          <AlertDialogDescription>This removes "{p.title}" from your listings. This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(p.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
