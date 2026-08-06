import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Dream Estate" },
      { name: "description", content: "Answers to common questions about buying, renting, home loans, documentation, and fees with Dream Estate." },
      { property: "og:title", content: "FAQ — Dream Estate" },
      { property: "og:description", content: "Common questions about buying, renting, loans, and paperwork answered." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Faq,
});

const faqs = [
  {
    q: "How much do I need for a down payment?",
    a: "Most lenders in India finance 75–90% of the property value, so plan for a down payment of 10–25%. Remember to budget separately for stamp duty, registration, and GST on under-construction homes — these typically add another 7–12%.",
  },
  {
    q: "Which documents should I verify before booking a property?",
    a: "Ask for the title deed, encumbrance certificate, approved building plan, RERA registration number, and — for ready homes — the occupancy certificate. Our advisors run this check for every listing before it goes live.",
  },
  {
    q: "How long does a typical purchase take to close?",
    a: "From offer to registration, expect 30–60 days for a ready home and longer for under-construction units. Home loan sanction is usually the longest step, so start the paperwork early.",
  },
  {
    q: "What fees does Dream Estate charge?",
    a: "Buyers pay nothing for property discovery and site visits. Sellers and landlords pay a transparent success fee agreed upfront in writing — there are no hidden marketing or listing charges.",
  },
  {
    q: "Do you help with rentals and tenant management?",
    a: "Yes. We handle tenant screening, rent agreements, deposit handling, and ongoing property management for owners who prefer a hands-off arrangement.",
  },
];

function Faq() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <section className="mx-auto w-full max-w-3xl px-6 py-20">
        <div className="grid h-11 w-11 place-items-center rounded-lg brand-gradient text-primary-foreground">
          <HelpCircle className="h-5 w-5" />
        </div>
        <p className="mt-6 text-sm font-medium uppercase tracking-widest text-primary">Good to know</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight md:text-6xl">Frequently asked questions</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          The things buyers, sellers, and tenants ask us most. Still stuck? Our advisors are a message away.
        </p>

        <Accordion type="single" collapsible className="mt-12 w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <Footer />
    </div>
  );
}
