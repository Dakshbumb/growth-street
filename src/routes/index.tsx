import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, ShieldCheck, LineChart, Users, Instagram, Target, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import logoAsset from "@/assets/growth-street-logo.png.asset.json";
import recos from "@/data/recommendations.json";

export const Route = createFileRoute("/")({
  component: Index,
});

type Reco = (typeof recos)[number];

function computeStats(rows: Reco[]) {
  const total = rows.length;
  const closed = rows.filter((r) => r.status === "TP" || r.status === "SL");
  const wins = rows.filter((r) => r.status === "TP").length;
  const winRate = closed.length ? (wins / closed.length) * 100 : 0;
  const returns = rows.map((r) => r.diffPct).filter((n): n is number => n != null);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
  const best = rows.reduce<Reco | null>((acc, r) => (!acc || (r.diffPct ?? -Infinity) > (acc.diffPct ?? -Infinity) ? r : acc), null);
  return { total, wins, winRate, avgReturn, best };
}

function Index() {
  const stats = computeStats(recos as Reco[]);
  const recent = [...(recos as Reco[])].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")).slice(-4).reverse();

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-brand-soft blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 md:pt-24 lg:grid-cols-[1.15fr_1fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Trusted by 30+ millennial investors
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              Smarter <span className="text-gradient-brand">stock ideas</span>.<br />
              Disciplined portfolios.
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              The Growth Street shares research‑backed equity recommendations and manages
              portfolios for a growing community of young Indian investors — with a fully
              transparent, publicly tracked record.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/recommendations"
                className="bg-gradient-brand inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                View live track record <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://www.instagram.com/the_growth_street/"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/70 px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                <Instagram className="h-4 w-4" /> @the_growth_street
              </a>
            </div>

            {/* stats row */}
            <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Investors guided", value: "30+" },
                { label: "Recommendations", value: `${stats.total}` },
                { label: "Win rate", value: `${stats.winRate.toFixed(0)}%` },
                { label: "Avg. return", value: `${stats.avgReturn.toFixed(1)}%` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card/60 p-4 shadow-card">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                    <span className="text-gradient-brand">{s.value}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero card */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-brand-soft blur-2xl" />
            <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-card backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={logoAsset.url} alt="The Growth Street" className="h-12 w-12 rounded-xl" />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Latest picks</div>
                    <div className="font-display text-lg font-bold">This week on the desk</div>
                  </div>
                </div>
                <Link to="/recommendations" className="hidden text-xs font-semibold text-primary hover:underline sm:inline">
                  See all →
                </Link>
              </div>
              <ul className="mt-5 divide-y divide-border">
                {recent.map((r) => {
                  const diff = r.diffPct;
                  const pending = diff == null;
                  const positive = !pending && diff >= 0;
                  return (
                    <li key={`${r.date}-${r.name}`} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-foreground">{r.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Entry ₹{r.entry?.toFixed(2)} · TP ₹{r.tp?.toFixed(2)}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {pending ? (
                          <div className="text-sm font-bold text-muted-foreground">Pending</div>
                        ) : (
                          <div className={"text-sm font-bold " + (positive ? "text-success" : "text-destructive")}>
                            {positive ? "+" : ""}
                            {diff!.toFixed(2)}%
                          </div>
                        )}
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.status ?? "NEW"}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Link
                to="/recommendations"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/70 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Explore the full sheet <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Built for the next generation of investors
          </h2>
          <p className="mt-4 text-muted-foreground">
            We combine bottom‑up equity research with strict risk discipline — every idea
            comes with an entry, stop‑loss and target, tracked publicly.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: "Research‑backed picks",
              desc: "Ideas across large, mid and small caps with a clear investment thesis and defined risk‑reward.",
            },
            {
              icon: ShieldCheck,
              title: "Risk‑first framework",
              desc: "Every recommendation is issued with a stop‑loss and target, and monitored to closure.",
            },
            {
              icon: LineChart,
              title: "Transparent track record",
              desc: "Our full recommendation log is public — wins, losses and open positions, on one page.",
            },
            {
              icon: Users,
              title: "30+ portfolios managed",
              desc: "Personalised guidance for young professionals building their first serious equity book.",
            },
            {
              icon: Target,
              title: "Actionable, not noisy",
              desc: "Focused ideas delivered on Instagram — no chatter, no channel spam, just conviction calls.",
            },
            {
              icon: Sparkles,
              title: "Community first",
              desc: "Grow alongside a community of millennial investors learning the markets together.",
            },
          ].map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card/60 p-6 shadow-card transition hover:border-primary/40">
              <div className="bg-gradient-brand inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BEST CALL BAND */}
      {stats.best && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-brand-soft p-8 sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Highlight from the track record
                </div>
                <h3 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
                  <span className="text-gradient-brand">{stats.best.name}</span> —{" "}
                  <span>+{stats.best.diffPct?.toFixed(1)}%</span>
                </h3>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  Recommended at ₹{stats.best.entry?.toFixed(2)} with a target of ₹
                  {stats.best.tp?.toFixed(2)} — one of many closed conviction calls from the
                  desk. Full log available on the recommendations page.
                </p>
                <div className="mt-6">
                  <Link
                    to="/recommendations"
                    className="bg-gradient-brand inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
                  >
                    Open recommendations sheet <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-card">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Field k="Entry" v={`₹${stats.best.entry?.toFixed(2)}`} />
                  <Field k="Target" v={`₹${stats.best.tp?.toFixed(2)}`} />
                  <Field k="Stop‑loss" v={`₹${stats.best.sl?.toFixed(2)}`} />
                  <Field k="Status" v={stats.best.status ?? "—"} />
                  <Field k="Days to TP" v={stats.best.days ? `${stats.best.days}` : "—"} />
                  <Field k="Return" v={`+${stats.best.diffPct?.toFixed(2)}%`} accent />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card/60 p-8 text-center shadow-card sm:p-14">
          <h3 className="font-display text-3xl font-extrabold sm:text-4xl">
            Follow the desk. See every call as it happens.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            All recommendations are shared publicly on Instagram and logged here in
            real time. Join 30+ investors already following along.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://www.instagram.com/the_growth_street/"
              target="_blank"
              rel="noreferrer noopener"
              className="bg-gradient-brand inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Instagram className="h-4 w-4" /> Follow @the_growth_street
            </a>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/70 px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              View recommendations
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ k, v, accent = false }: { k: string; v: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={"mt-1 font-display text-lg font-extrabold " + (accent ? "text-gradient-brand" : "text-foreground")}>{v}</div>
    </div>
  );
}
