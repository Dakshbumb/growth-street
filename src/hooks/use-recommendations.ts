import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Reco = {
  id?: string;
  date: string;
  name: string;
  entry: number;
  sl: number;
  tp: number;
  priceToday: number | null;
  diffPct: number | null;
  highPct: number | null;
  lowPct: number | null;
  status: string;
  exitDate: string | null;
  days: number | null;
  profitOnCapital: number | null;
  mtm: number | null;
};

type Row = {
  id: string;
  date: string;
  name: string;
  entry: number;
  sl: number;
  tp: number;
  price_today: number | null;
  diff_pct: number | null;
  high_pct: number | null;
  low_pct: number | null;
  status: string;
  exit_date: string | null;
  days: number | null;
  profit_on_capital: number | null;
  mtm: number | null;
};

export function rowToReco(r: Row): Reco {
  return {
    id: r.id,
    date: r.date,
    name: r.name,
    entry: Number(r.entry),
    sl: Number(r.sl),
    tp: Number(r.tp),
    priceToday: r.price_today == null ? null : Number(r.price_today),
    diffPct: r.diff_pct == null ? null : Number(r.diff_pct),
    highPct: r.high_pct == null ? null : Number(r.high_pct),
    lowPct: r.low_pct == null ? null : Number(r.low_pct),
    status: r.status,
    exitDate: r.exit_date,
    days: r.days,
    profitOnCapital: r.profit_on_capital == null ? null : Number(r.profit_on_capital),
    mtm: r.mtm == null ? null : Number(r.mtm),
  };
}

export function useRecommendations() {
  const [data, setData] = useState<Reco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows, error } = await supabase
      .from("recommendations")
      .select("*")
      .order("date", { ascending: false });
    if (error) {
      setError(error.message);
      setData([]);
    } else {
      setError(null);
      setData((rows as Row[]).map(rowToReco));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const channel = supabase
      .channel("recommendations-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "recommendations" },
        () => {
          void load();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load]);

  return { data, loading, error, refetch: load };
}
