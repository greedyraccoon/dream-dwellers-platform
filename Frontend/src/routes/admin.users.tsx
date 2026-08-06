import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { userApi, authApi } from "@/lib/api";
import type { RegisterRequest, UserResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/users")({
  component: UsersAdmin,
});

const empty: RegisterRequest = { name: "", email: "", password: "", role: "AGENT" };

function UsersAdmin() {
  const qc = useQueryClient();
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: userApi.list });
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<RegisterRequest>(empty);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.register(form);
      toast.success("User registered");
      qc.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
      setForm(empty);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to register user.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(u: UserResponse) {
    if (!window.confirm(`Are you sure you want to remove ${u.name}?`)) return;
    try {
      await userApi.remove(u.id);
      toast.success("User removed");
      qc.invalidateQueries({ queryKey: ["users"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-muted-foreground">{users.length} system users.</p>
        </div>
        <Button className="gap-2" onClick={() => { setForm(empty); setOpen(true); }}>
          <Plus className="h-4 w-4" /> Register New User
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Register new user</DialogTitle></DialogHeader>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div><Label>Name</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Email</Label><Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Password</Label><Input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="mt-1.5" /></div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="AGENT">AGENT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create user"}</Button>
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
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell><Badge variant="secondary">{u.role}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon" aria-label="Delete user" onClick={() => onDelete(u)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
