import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dream Estate" },
      { name: "description", content: "Get in touch with Dream Estate. Phone, email, and office locations." },
      { property: "og:title", content: "Contact Dream Estate" },
      { property: "og:description", content: "Reach our advisors by phone, email, or drop into a local office." },
    ],
  }),
  component: Contact,
});

// E.164-ish / Indian mobile: 10 digits with optional +country code, spaces/dashes allowed.
const MOBILE_PATTERN = "^\\+?[0-9\\s-]{10,15}$";

function Contact() {
  const [sending, setSending] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Say hello</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight md:text-6xl">Let's talk about your next move.</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">A Dream Estate advisor typically responds within one business hour.</p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-5">
            {[
              { icon: Phone, label: "Phone", value: "+91 22 5555 0142" },
              { icon: Mail, label: "Email", value: "hello@dreamEstate.co" },
              { icon: MapPin, label: "Flagship office", value: "410 Marine Drive, Mumbai" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="mt-0.5 font-medium">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSending(true);
              setTimeout(() => { setSending(false); toast.success("Message sent — we'll be in touch shortly."); (e.target as HTMLFormElement).reset(); }, 600);
            }}
            className="space-y-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="n">Name</Label><Input id="n" required className="mt-1.5" /></div>
              <div><Label htmlFor="e">Email</Label><Input id="e" type="email" required className="mt-1.5" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="mob">Mobile number</Label>
                <Input
                  id="mob"
                  type="tel"
                  required
                  pattern={MOBILE_PATTERN}
                  placeholder="+91 98200 15142"
                  title="Enter a valid mobile number (10–15 digits, may start with +)"
                  className="mt-1.5"
                />
              </div>
              <div><Label htmlFor="s">Subject</Label><Input id="s" required className="mt-1.5" /></div>
            </div>
            <div><Label htmlFor="m">Message</Label><Textarea id="m" rows={5} required className="mt-1.5" /></div>
            <Button type="submit" disabled={sending} className="w-full sm:w-auto">{sending ? "Sending…" : "Send message"}</Button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
