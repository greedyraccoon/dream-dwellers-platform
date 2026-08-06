import type { PropertyResponse, ClientResponse, DealResponse } from "./types";

export const mockProperties: PropertyResponse[] = [
  { id: 1, title: "Azure Bay Penthouse", type: "FURNISHED", status: "AVAILABLE", price: 24500000, location: "Bandra West, Mumbai", agentName: "Sofia Reyes", imageUrls: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"], bedrooms: 4, bathrooms: 4, area: 3800, description: "Panoramic sea views from a private rooftop terrace with infinity pool, chef's kitchen and dedicated staff quarters." },
  { id: 2, title: "Willow Creek Estate", type: "READY_TO_MOVEIN", status: "AVAILABLE", price: 18750000, location: "Jubilee Hills, Hyderabad", agentName: "Marcus Chen", imageUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200"], bedrooms: 5, bathrooms: 5, area: 5200, description: "Contemporary estate wrapped in teak and glass, with landscaped gardens and a lap pool." },
  { id: 3, title: "The Meridian Loft", type: "FURNISHED", status: "RENTED", price: 185000, location: "Indiranagar, Bengaluru", agentName: "Priya Anand", imageUrls: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"], bedrooms: 2, bathrooms: 2, area: 1650, description: "Sun-drenched loft with 14ft ceilings, exposed brickwork and a private balcony." },
  { id: 4, title: "Coral Ridge Villa", type: "UNFURNISHED", status: "AVAILABLE", price: 32000000, location: "Assagao, Goa", agentName: "Sofia Reyes", imageUrls: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"], bedrooms: 6, bathrooms: 6, area: 6400, description: "Cliffside villa with private beach access, cabana bar and outdoor cinema deck." },
  { id: 5, title: "Emerald Park Residence", type: "READY_TO_MOVEIN", status: "AVAILABLE", price: 9850000, location: "Koregaon Park, Pune", agentName: "Marcus Chen", imageUrls: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200"], bedrooms: 3, bathrooms: 3, area: 2100, description: "Corner unit overlooking the park with floor-to-ceiling windows and a private terrace." },
  { id: 6, title: "Sunset Boulevard Home", type: "FURNISHED", status: "RENTED", price: 240000, location: "DLF Phase 3, Gurugram", agentName: "Priya Anand", imageUrls: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200"], bedrooms: 4, bathrooms: 4, area: 3400, description: "Mid-century modern gem with pool, cabana and skyline views." },
  { id: 7, title: "Skyline Enclave", type: "UNDER_CONSTRUCTION", status: "AVAILABLE", price: 6500000, location: "Powai, Mumbai", agentName: "Sofia Reyes", imageUrls: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200"], bedrooms: 3, bathrooms: 2, area: 1450, description: "Pre-launch tower residence with lake views, handover in Q3 2026." },
  { id: 8, title: "Heritage Bungalow", type: "EMPTY", status: "AVAILABLE", price: 42000000, location: "Alipore, Kolkata", agentName: "Priya Anand", imageUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"], bedrooms: 6, bathrooms: 5, area: 7200, description: "Restored colonial bungalow on a leafy Alipore lane with original teak floors." },
];

export const mockClients: ClientResponse[] = [
  { id: 1, name: "Elena Whitmore", email: "elena@wht.co", phone: "+91 98200 15142", budget: 25000000, preferences: "Sea-facing, 4+ bedrooms", agentName: "Sofia Reyes" },
  { id: 2, name: "Jonah Park", email: "jonah.park@mail.com", phone: "+91 98111 20198", budget: 12000000, preferences: "Downtown loft, high ceilings", agentName: "Priya Anand" },
  { id: 3, name: "Amelia Cross", email: "amelia@crosslab.io", phone: "+91 99000 45173", budget: 34000000, preferences: "Modern villa, ocean view", agentName: "Marcus Chen" },
];

export const mockDeals: DealResponse[] = [
  { id: 1, propertyTitle: "Azure Bay Penthouse", clientName: "Elena Whitmore", agentName: "Sofia Reyes", finalPrice: 23800000, status: "Closed" },
  { id: 2, propertyTitle: "The Meridian Loft", clientName: "Jonah Park", agentName: "Priya Anand", finalPrice: 185000, status: "Pending" },
  { id: 3, propertyTitle: "Coral Ridge Villa", clientName: "Amelia Cross", agentName: "Marcus Chen", finalPrice: 31500000, status: "Negotiating" },
];
