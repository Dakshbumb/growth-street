import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/growth-street-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoAsset.url} alt="The Growth Street" className="h-10 w-10 rounded-lg" />
              <div className="font-display text-lg font-extrabold">
                The <span className="text-gradient-brand">Growth Street</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Actionable equity ideas and disciplined portfolio guidance for a new generation of Indian investors.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Explore</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/recommendations" className="hover:text-foreground">Recommendations</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Connect</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://www.instagram.com/the_growth_street/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground"
                >
                  @the_growth_street
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 rounded-xl border border-warning/30 bg-warning/5 p-4 text-xs text-muted-foreground">
          <span className="font-semibold text-warning">Disclaimer:</span> The Growth Street is <strong>not a SEBI‑registered</strong> investment advisor. All content and stock ideas shared here are for educational and informational purposes only and do not constitute investment advice. Please consult a qualified advisor and do your own research before investing.
        </div>
        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} The Growth Street. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
