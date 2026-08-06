import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { blogApi } from "@/lib/api";
import type { BlogResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/blogs/")({
  component: BlogListAdmin,
});

function BlogListAdmin() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);

  function loadBlogs() {
    setLoading(true);
    blogApi.list()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }
  useEffect(loadBlogs, []);

  async function handleDelete(b: BlogResponse) {
    if (!window.confirm(`Delete “${b.title}”? This cannot be undone.`)) return;
    try {
      await blogApi.remove(b.id);
      toast.success("Blog deleted");
      loadBlogs();
    } catch {
      toast.error("Could not delete — check the backend connection.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">All blogs</h1>
          <p className="mt-1 text-muted-foreground">{blogs.length} published articles.</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/blogs/new"><Plus className="h-4 w-4" /> Create blog</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map(b => (
              <TableRow key={b.id}>
                <TableCell>
                  {b.coverImageUrl
                    ? <img src={b.coverImageUrl} alt="" className="h-12 w-20 rounded object-cover" />
                    : <div className="h-12 w-20 rounded bg-muted" />}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{b.title}</div>
                  <div className="text-xs text-muted-foreground">/blog/{b.slug}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="icon" aria-label="View post">
                      <Link to="/blog/$slug" params={{ slug: b.slug }}><ExternalLink className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Delete post" onClick={() => handleDelete(b)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && blogs.length === 0 && (
              <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No posts yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
