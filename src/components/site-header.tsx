import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/growth-street-logo.png.asset.json";

const nav = [
  { to: "/", label: "Home" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/about", label: "About" },
  { to: "/disclaimer", label: "Disclaimer" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={logoAsset.url} alt="The Growth Street" className="h-10 w-10 shrink-0 rounded-lg object-cover sm:h-11 sm:w-11" />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-base font-normal sm:text-lg">
              The Growth Street
            </div>
            <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
              Research · Strategy
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/the_growth_street/"
            target="_blank"
            rel="noreferrer noopener"
            className="bg-gradient-brand ml-2 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            Follow on Instagram
          </a>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-md border border-border p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                {n.label}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/the_growth_street/"
              target="_blank"
              rel="noreferrer noopener"
              className="bg-gradient-brand mt-2 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Follow on Instagram
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
