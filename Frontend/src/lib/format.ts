// Indian Rupee formatting helpers.
const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatINR(n: number): string {
  if (!Number.isFinite(n)) return "₹0";
  const abs = Math.abs(n);
  if (abs >= 1_00_00_000) {
    const v = n / 1_00_00_000;
    return `₹${v.toFixed(2).replace(/\.?0+$/, "")} Cr`;
  }
  if (abs >= 1_00_000) {
    const v = n / 1_00_000;
    return `₹${v.toFixed(2).replace(/\.?0+$/, "")} L`;
  }
  return `₹${inr.format(n)}`;
}

export function formatPropertyPrice(price: number, status: string): string {
  const s = (status || "").toUpperCase();
  return s === "RENTED" ? `${formatINR(price)}/mo` : formatINR(price);
}

export const PROPERTY_TYPES: { value: string; label: string }[] = [
  { value: "FURNISHED", label: "Furnished" },
  { value: "UNFURNISHED", label: "Unfurnished" },
  { value: "EMPTY", label: "Empty" },
  { value: "READY_TO_MOVEIN", label: "Ready to Move In" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
];

export const PROPERTY_STATUSES: { value: string; label: string }[] = [
  { value: "AVAILABLE", label: "Available" },
  { value: "SOLD", label: "Sold" },
  { value: "RENTED", label: "Rented" },
];

export function propertyTypeLabel(v: string): string {
  return PROPERTY_TYPES.find(t => t.value === v)?.label ?? v;
}
