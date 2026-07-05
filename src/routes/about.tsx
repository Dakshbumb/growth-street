import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, ShieldCheck, Users, LineChart } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About The Growth Street — Equity Ideas & Portfolio Guidance" },
      {
        name: "description",
        content:
          "The Growth Street is an independent equity research desk sharing stock ideas and guiding portfolios for 30+ millennial investors in India.",
      },
      { property: "og:title", content: "About The Growth Street" },
      { property: "og:description", content: "Independent equity research and portfolio guidance for young Indian investors." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About</div>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
          Independent research for a <span className="text-gradient-brand">new generation</span> of investors.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          The Growth Street was started with a simple belief — Indian millennials deserve
          honest, research‑backed equity ideas without the noise of typical tip channels.
          We share every idea publicly on Instagram, and log the outcome here, so anyone
          can judge our work on merit.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Stat icon={Users} k="30+" v="Millennial portfolios personally guided" />
          <Stat icon={LineChart} k="Transparent" v="Every recommendation tracked publicly" />
          <Stat icon={ShieldCheck} k="Risk‑first" v="Every call has an entry, SL and target" />
          <Stat icon={Instagram} k="Community" v="Ideas shared live on @the_growth_street" />
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-card/60 p-6 shadow-card sm:p-8">
          <h2 className="font-display text-2xl font-bold">How we work</h2>
          <ol className="mt-4 space-y-4 text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">1. Research.</span> We screen
              opportunities across large, mid and small caps using fundamentals, technicals
              and sector trends.
            </li>
            <li>
              <span className="font-semibold text-foreground">2. Structure.</span> Each idea
              is issued with a clear entry price, stop‑loss and target — never open‑ended.
            </li>
            <li>
              <span className="font-semibold text-foreground">3. Share.</span> Recommendations
              go out on Instagram and are logged on this website in real time.
            </li>
            <li>
              <span className="font-semibold text-foreground">4. Review.</span> Every call is
              tracked to closure so you can see wins, losses and open positions.
            </li>
          </ol>
        </div>

        <div className="mt-14 rounded-2xl border border-warning/30 bg-warning/5 p-6 text-sm text-muted-foreground">
          <div className="font-semibold text-warning">Important</div>
          <p className="mt-2">
            The Growth Street is <strong>not registered with SEBI</strong> as an investment
            advisor. All content is shared for educational and informational purposes only
            and should not be construed as investment advice.{" "}
            <Link to="/disclaimer" className="underline hover:text-foreground">Read the full disclaimer →</Link>
          </p>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <Link to="/recommendations" className="bg-gradient-brand inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
            See track record
          </Link>
          <a
            href="https://www.instagram.com/the_growth_street/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/70 px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <Instagram className="h-4 w-4" /> Follow on Instagram
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}

function Stat({ icon: Icon, k, v }: { icon: React.ComponentType<{ className?: string }>; k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-card">
      <div className="bg-gradient-brand inline-flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 font-display text-2xl font-extrabold text-gradient-brand">{k}</div>
      <div className="text-sm text-muted-foreground">{v}</div>
    </div>
  );
}
