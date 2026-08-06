import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { blogApi, mediaApi } from "@/lib/api";
import type { BlogRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/site/RichTextEditor";

export const Route = createFileRoute("/admin/blogs/new")({
  component: BlogsAdmin,
});

const empty: BlogRequest = { title: "", slug: "", content: "", coverImageUrl: "" };

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function BlogsAdmin() {
  const [form, setForm] = useState<BlogRequest>(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await mediaApi.upload(file);
      setForm(f => ({ ...f, coverImageUrl: url }));
      toast.success("Cover image uploaded");
    } catch {
      toast.error("Image upload failed — is the backend running?");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      await blogApi.create(form);
      toast.success("Blog published");
      setForm(empty);
      setSlugTouched(false);
    } catch {
      toast.error("Could not publish — check the backend connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Create blog</h1>
        <p className="mt-1 text-sm text-muted-foreground">Write and publish articles for the public journal.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-xl border border-border bg-card p-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={e => {
                const title = e.target.value;
                setForm(f => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
              }}
              placeholder="Buying your first home in India"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={e => { setSlugTouched(true); setForm(f => ({ ...f, slug: slugify(e.target.value) })); }}
              placeholder="buying-your-first-home"
            />
            <p className="text-xs text-muted-foreground">Public URL: /blog/{form.slug || "your-slug"}</p>
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor value={form.content} onChange={content => setForm(f => ({ ...f, content }))} />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Cover image</Label>
          {form.coverImageUrl ? (
            <div className="relative overflow-hidden rounded-lg border border-border">
              <img src={form.coverImageUrl} alt="Cover preview" className="aspect-[16/10] w-full object-cover" />
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, coverImageUrl: "" }))}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/90 text-foreground shadow"
                aria-label="Remove cover image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground hover:bg-muted/50">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
              {uploading ? "Uploading…" : "Choose an image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
          )}
          {form.coverImageUrl && (
            <p className="break-all text-xs text-muted-foreground">{form.coverImageUrl}</p>
          )}
          <Button type="submit" className="w-full" disabled={saving || uploading}>
            {saving ? "Publishing…" : "Publish blog"}
          </Button>
        </div>
      </form>

    </div>
  );
}
