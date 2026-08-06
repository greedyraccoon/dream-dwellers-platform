export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-display text-lg text-foreground">Dream Estate</p>
            <p>Curated homes. Concierge service. Since 2012.</p>
          </div>
          <p>© {new Date().getFullYear()} Dream Estate Realty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
