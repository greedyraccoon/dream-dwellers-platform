import type { BlogResponse } from "./types";

export const mockBlogs: BlogResponse[] = [
  {
    id: 1,
    title: "Buying your first home in India: a 2026 checklist",
    slug: "first-home-checklist-2026",
    coverImageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    content:
      "<p>Buying your first home is equal parts thrilling and terrifying. Here's the short version of what actually matters.</p><h2>1. Get your paperwork ready</h2><p>Keep three years of ITR, salary slips, and bank statements handy — lenders ask for them every single time.</p><h2>2. Budget beyond the sticker price</h2><p>Stamp duty, registration, GST on under-construction units, and interiors can add 12–18% to the headline price.</p><h2>3. Verify the title</h2><p>Ask for the encumbrance certificate, approved plan, and occupancy certificate before you pay any token amount.</p>",
    createdAt: "2026-05-12T09:00:00Z",
  },
  {
    id: 2,
    title: "Rent vs. buy: what the numbers say this year",
    slug: "rent-vs-buy-2026",
    coverImageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    content:
      "<p>Rental yields in most metros sit between 2.5% and 3.5%, while home loan rates hover near 8.5%.</p><p>That gap means renting is often cheaper month-to-month — but ownership still wins when you plan to stay put for seven years or more, thanks to principal build-up and appreciation.</p>",
    createdAt: "2026-04-02T09:00:00Z",
  },
  {
    id: 3,
    title: "Five upgrades that actually raise resale value",
    slug: "upgrades-that-raise-resale-value",
    coverImageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    content:
      "<p>Not every renovation pays you back. These five reliably do:</p><ul><li>Modular kitchen with quality hardware</li><li>Waterproofing and fresh exterior paint</li><li>Modern electrical load and wiring</li><li>Bathroom fittings and lighting</li><li>Covered parking</li></ul>",
    createdAt: "2026-02-18T09:00:00Z",
  },
];
