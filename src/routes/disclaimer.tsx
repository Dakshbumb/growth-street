import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — The Growth Street" },
      {
        name: "description",
        content:
          "The Growth Street is not a SEBI-registered investment advisor. Read the full disclaimer regarding stock recommendations and educational content.",
      },
      { property: "og:title", content: "Disclaimer — The Growth Street" },
      { property: "og:description", content: "Not SEBI-registered. Content is educational and not investment advice." },
    ],
  }),
  component: Disclaimer,
});

function Disclaimer() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</div>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Disclaimer</h1>

        <div className="mt-8 space-y-6 text-muted-foreground">
          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-5 text-foreground">
            <div className="font-display text-lg font-bold text-warning">
              The Growth Street is NOT a SEBI‑registered investment advisor.
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              All information, recommendations and analysis provided on this website, on
              our Instagram account (@the_growth_street), or through any other channel are
              shared strictly for educational and informational purposes.
            </p>
          </div>

          <Block title="No investment advice">
            Nothing on this website constitutes investment, financial, legal or tax
            advice. The content should not be relied upon as the sole basis for any
            investment decision. Please consult a qualified, SEBI‑registered financial
            advisor before acting on any information shared here.
          </Block>

          <Block title="Market risk">
            Investments in the securities market are subject to market risks. Past
            performance is not indicative of future results. Stock prices can fluctuate
            significantly and you may lose part or all of your invested capital.
          </Block>

          <Block title="Track record">
            The recommendations listed on this website reflect ideas historically shared
            via our Instagram handle, with entry, stop‑loss and target levels set at the
            time of the call. Prices, returns and status are updated periodically and may
            not reflect real‑time market data.
          </Block>

          <Block title="No liability">
            The Growth Street and its founders shall not be liable for any loss, damage,
            or expense of any nature arising directly or indirectly from the use of, or
            reliance upon, any information shared on this platform.
          </Block>

          <Block title="Do your own research">
            Every reader is strongly advised to conduct their own due diligence and, where
            appropriate, seek independent professional advice before making any investment
            decision.
          </Block>
        </div>
      </section>
    </SiteLayout>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-card">
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
