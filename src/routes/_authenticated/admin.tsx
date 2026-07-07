import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LogOut, Plus, Trash2, Save, X } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useRecommendations, type Reco } from "@/hooks/use-recommendations";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Admin — Recommendations" }],
  }),
  component: AdminPage,
});

type Draft = {
  id?: string;
  date: string;
  name: string;
  entry: string;
  sl: string;
  tp: string;
  price_today: string;
  diff_pct: string;
  high_pct: string;
  low_pct: string;
  status: string;
  exit_date: string;
  days: string;
  profit_on_capital: string;
  mtm: string;
};

const empty: Draft = {
  date: new Date().toISOString().slice(0, 10),
  name: "",
  entry: "",
  sl: "",
  tp: "",
  price_today: "",
  diff_pct: "",
  high_pct: "",
  low_pct: "",
  status: "NEW",
  exit_date: "",
  days: "",
  profit_on_capital: "",
  mtm: "",
};

function fromReco(r: Reco): Draft {
  const s = (n: number | null | undefined) => (n == null ? "" : String(n));
  return {
    id: r.id,
    date: r.date,
    name: r.name,
    entry: String(r.entry),
    sl: String(r.sl),
    tp: String(r.tp),
    price_today: s(r.priceToday),
    diff_pct: s(r.diffPct),
    high_pct: s(r.highPct),
    low_pct: s(r.lowPct),
    status: r.status,
    exit_date: r.exitDate ?? "",
    days: s(r.days),
    profit_on_capital: s(r.profitOnCapital),
    mtm: s(r.mtm),
  };
}

function toPayload(d: Draft) {
  const num = (s: string) => (s.trim() === "" ? null : Number(s));
  const int = (s: string) => (s.trim() === "" ? null : Number.parseInt(s, 10));
  const str = (s: string) => (s.trim() === "" ? null : s);
  return {
    date: d.date,
    name: d.name.trim().toUpperCase(),
    entry: Number(d.entry),
    sl: Number(d.sl),
    tp: Number(d.tp),
    price_today: num(d.price_today),
    diff_pct: num(d.diff_pct),
    high_pct: num(d.high_pct),
    low_pct: num(d.low_pct),
    status: d.status.trim().toUpperCase() || "NEW",
    exit_date: str(d.exit_date),
    days: int(d.days),
    profit_on_capital: num(d.profit_on_capital),
    mtm: num(d.mtm),
  };
}

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { data: recos, loading, refetch } = useRecommendations();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => recos.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase())),
    [recos, q],
  );

  async function onSignOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/" });
  }

  async function onSave() {
    if (!editing) return;
    setBusy(true);
    setErr(null);
    try {
      const payload = toPayload(editing);
      if (!payload.name || !payload.date || Number.isNaN(payload.entry)) {
        throw new Error("Name, date and entry are required");
      }
      if (editing.id) {
        const { error } = await supabase
          .from("recommendations")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("recommendations").insert(payload);
        if (error) throw error;
      }
      setEditing(null);
      await refetch();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this recommendation?")) return;
    const { error } = await supabase.from("recommendations").delete().eq("id", id);
    if (error) alert(error.message);
    else await refetch();
  }

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-sm text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-normal">Not an admin</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You are signed in as <span className="text-foreground">{user?.email}</span>, but this
            account does not have admin access. The first account created on this site becomes the
            admin — please sign in with that account.
          </p>
          <button
            onClick={onSignOut}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/50"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-primary">Admin</div>
            <h1 className="mt-2 font-display text-4xl font-normal sm:text-5xl">Recommendations sheet</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as {user?.email}. Changes save to the live database and show up on the site instantly.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing({ ...empty })}
              className="bg-gradient-brand inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Plus className="h-4 w-4" /> New pick
            </button>
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-secondary/50"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by stock name"
            className="w-full max-w-sm rounded-lg border border-border bg-card/60 px-3 py-2.5 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-2xl border border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60 shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Stock</th>
                    <th className="px-3 py-3 text-right">Entry</th>
                    <th className="px-3 py-3 text-right">SL</th>
                    <th className="px-3 py-3 text-right">TP</th>
                    <th className="px-3 py-3 text-right">CMP</th>
                    <th className="px-3 py-3 text-right">Diff %</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t border-border/70 hover:bg-secondary/40">
                      <td className="px-3 py-2 text-muted-foreground">{r.date}</td>
                      <td className="px-3 py-2 font-semibold">{r.name}</td>
                      <td className="px-3 py-2 text-right">{r.entry}</td>
                      <td className="px-3 py-2 text-right">{r.sl}</td>
                      <td className="px-3 py-2 text-right">{r.tp}</td>
                      <td className="px-3 py-2 text-right">{r.priceToday ?? "—"}</td>
                      <td className={`px-3 py-2 text-right ${r.diffPct == null ? "text-muted-foreground" : r.diffPct >= 0 ? "text-success" : "text-destructive"}`}>
                        {r.diffPct == null ? "—" : `${r.diffPct >= 0 ? "+" : ""}${r.diffPct.toFixed(2)}%`}
                      </td>
                      <td className="px-3 py-2">{r.status}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => setEditing(fromReco(r))}
                            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary/60"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => r.id && onDelete(r.id)}
                            className="rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-sm text-muted-foreground">No rows.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-normal">
                {editing.id ? "Edit pick" : "New pick"}
              </h2>
              <button onClick={() => setEditing(null)} className="rounded-md p-2 hover:bg-secondary/50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label="Date" type="date" value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} />
              <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Field label="Status" value={editing.status} onChange={(v) => setEditing({ ...editing, status: v })} />
              <Field label="Entry" type="number" value={editing.entry} onChange={(v) => setEditing({ ...editing, entry: v })} />
              <Field label="Stop-loss" type="number" value={editing.sl} onChange={(v) => setEditing({ ...editing, sl: v })} />
              <Field label="Target" type="number" value={editing.tp} onChange={(v) => setEditing({ ...editing, tp: v })} />
              <Field label="Price today" type="number" value={editing.price_today} onChange={(v) => setEditing({ ...editing, price_today: v })} />
              <Field label="Diff %" type="number" value={editing.diff_pct} onChange={(v) => setEditing({ ...editing, diff_pct: v })} />
              <Field label="High %" type="number" value={editing.high_pct} onChange={(v) => setEditing({ ...editing, high_pct: v })} />
              <Field label="Low %" type="number" value={editing.low_pct} onChange={(v) => setEditing({ ...editing, low_pct: v })} />
              <Field label="Exit date" type="date" value={editing.exit_date} onChange={(v) => setEditing({ ...editing, exit_date: v })} />
              <Field label="Days" type="number" value={editing.days} onChange={(v) => setEditing({ ...editing, days: v })} />
              <Field label="Profit on capital" type="number" value={editing.profit_on_capital} onChange={(v) => setEditing({ ...editing, profit_on_capital: v })} />
              <Field label="MTM" type="number" value={editing.mtm} onChange={(v) => setEditing({ ...editing, mtm: v })} />
            </div>
            {err && <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/50">Cancel</button>
              <button
                onClick={onSave}
                disabled={busy}
                className="bg-gradient-brand inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
              >
                <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
