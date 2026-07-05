import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import recos from "@/data/recommendations.json";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Live Stock Recommendations Track Record — The Growth Street" },
      {
        name: "description",
        content:
          "Public log of every stock recommendation issued by The Growth Street — entries, stop-losses, targets, and realised returns.",
      },
      { property: "og:title", content: "Recommendations Track Record — The Growth Street" },
      {
        property: "og:description",
        content: "Transparent, publicly tracked stock recommendations with entry, SL, TP and returns.",
      },
    ],
  }),
  component: RecoPage,
});

type Reco = (typeof recos)[number];
type StatusFilter = "ALL" | "TP" | "SL" | "HOLD";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtNum(n: number | null, d = 2) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function StatusPill({ status }: { status: string | null }) {
  const s = (status ?? "NEW").toUpperCase();
  const map: Record<string, string> = {
    TP: "bg-success/15 text-success border-success/30",
    SL: "bg-destructive/15 text-destructive border-destructive/30",
    HOLD: "bg-warning/15 text-warning border-warning/30",
    NEW: "bg-primary/15 text-primary border-primary/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[s] ?? "border-border text-muted-foreground"}`}>
      {s || "—"}
    </span>
  );
}

function RecoPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const rows = useMemo(() => {
    const all = [...(recos as Reco[])].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    return all.filter((r) => {
      if (status !== "ALL" && (r.status ?? "").toUpperCase() !== status) return false;
      if (q && !r.name?.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, status]);

  const totals = useMemo(() => {
    const list = recos as Reco[];
    const tp = list.filter((r) => r.status === "TP").length;
    const sl = list.filter((r) => r.status === "SL").length;
    const hold = list.filter((r) => r.status === "HOLD").length;
    const closed = tp + sl;
    const winRate = closed ? (tp / closed) * 100 : 0;
    const avg = list.reduce((a, b) => a + (b.diffPct ?? 0), 0) / (list.length || 1);
    return { total: list.length, tp, sl, hold, winRate, avg };
  }, []);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live track record</div>
            <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
              Stock <span className="text-gradient-brand">Recommendations</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Every idea shared on Instagram, logged here with the original entry, stop‑loss,
              target and current status. Nothing hidden.
            </p>
          </div>
          <a
            href="https://www.instagram.com/the_growth_street/"
            target="_blank"
            rel="noreferrer noopener"
            className="bg-gradient-brand inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            View on Instagram <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* summary cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <SummaryCard label="Total ideas" value={`${totals.total}`} />
          <SummaryCard label="Targets hit" value={`${totals.tp}`} tone="success" />
          <SummaryCard label="Stop-loss hit" value={`${totals.sl}`} tone="destructive" />
          <SummaryCard label="Open / Hold" value={`${totals.hold}`} tone="warning" />
          <SummaryCard label="Win rate (closed)" value={`${totals.winRate.toFixed(0)}%`} tone="brand" />
        </div>

        {/* controls */}
        <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search stock (e.g. DIVISLAB)"
              className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["ALL", "TP", "SL", "HOLD"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={
                  "rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition " +
                  (status === s
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-border bg-card/60 text-muted-foreground hover:text-foreground")
                }
              >
                {s === "ALL" ? "All" : s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TABLE — desktop */}
      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-card/60 shadow-card md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <Th>Date</Th>
                  <Th>Stock</Th>
                  <Th align="right">Entry</Th>
                  <Th align="right">Stop-loss</Th>
                  <Th align="right">Target</Th>
                  <Th align="right">CMP / Exit</Th>
                  <Th align="right">Return %</Th>
                  <Th>Status</Th>
                  <Th align="right">Days</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const diff = r.diffPct ?? 0;
                  const positive = diff >= 0;
                  return (
                    <tr key={`${r.date}-${r.name}`} className="border-t border-border/70 hover:bg-secondary/40">
                      <Td className="whitespace-nowrap text-muted-foreground">{fmtDate(r.date)}</Td>
                      <Td className="font-semibold text-foreground">{r.name}</Td>
                      <Td align="right">₹{fmtNum(r.entry)}</Td>
                      <Td align="right" className="text-muted-foreground">₹{fmtNum(r.sl)}</Td>
                      <Td align="right" className="text-muted-foreground">₹{fmtNum(r.tp)}</Td>
                      <Td align="right">₹{fmtNum(r.priceToday)}</Td>
                      <Td align="right">
                        <span className={"inline-flex items-center gap-1 font-bold " + (positive ? "text-success" : "text-destructive")}>
                          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                          {positive ? "+" : ""}{fmtNum(diff)}%
                        </span>
                      </Td>
                      <Td><StatusPill status={r.status} /></Td>
                      <Td align="right" className="text-muted-foreground">{r.days ?? <Minus className="inline h-3 w-3" />}</Td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-sm text-muted-foreground">
                      No recommendations match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards — mobile */}
        <div className="grid gap-3 md:hidden">
          {rows.map((r) => {
            const diff = r.diffPct ?? 0;
            const positive = diff >= 0;
            return (
              <div key={`${r.date}-${r.name}`} className="rounded-2xl border border-border bg-card/70 p-4 shadow-card">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-display text-lg font-extrabold text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{fmtDate(r.date)}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className={"text-base font-bold " + (positive ? "text-success" : "text-destructive")}>
                      {positive ? "+" : ""}{fmtNum(diff)}%
                    </div>
                    <div className="mt-1"><StatusPill status={r.status} /></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <MobileField k="Entry" v={`₹${fmtNum(r.entry)}`} />
                  <MobileField k="SL" v={`₹${fmtNum(r.sl)}`} />
                  <MobileField k="Target" v={`₹${fmtNum(r.tp)}`} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>CMP / Exit: <span className="text-foreground">₹{fmtNum(r.priceToday)}</span></span>
                  {r.days != null && <span>{r.days} days</span>}
                </div>
              </div>
            );
          })}
          {rows.length === 0 && (
            <div className="rounded-2xl border border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
              No recommendations match your filter.
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Data is maintained internally and updated regularly. All figures are indicative and not investment advice.
        </p>
      </section>
    </SiteLayout>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return <th className={`px-4 py-3 font-semibold ${align === "right" ? "text-right" : "text-left"}`}>{children}</th>;
}
function Td({ children, align = "left", className = "" }: { children: React.ReactNode; align?: "left" | "right"; className?: string }) {
  return <td className={`px-4 py-3 ${align === "right" ? "text-right" : "text-left"} ${className}`}>{children}</td>;
}
function MobileField({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{v}</div>
    </div>
  );
}

function SummaryCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "destructive" | "warning" | "brand" }) {
  const toneCls: Record<string, string> = {
    default: "text-foreground",
    success: "text-success",
    destructive: "text-destructive",
    warning: "text-warning",
    brand: "text-gradient-brand",
  };
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-card">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl font-extrabold ${toneCls[tone]}`}>{value}</div>
    </div>
  );
}
