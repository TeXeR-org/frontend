import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Minus } from "@/components/icons";
import { PricingPlans } from "@/components/essential/home/PricingPlans";
import { FAQSection } from "@/components/essential/home/FAQSection";
import { Reveal } from "@/components/essential/home/_shared";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { COMPARISON } from "@/lib/plans";
import { SitePageHeader } from "@/components/essential/layout/SitePageHeader";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Unlimited projects and collaborators on every plan, free included. Pay only for AI and heavy conversion. Self-hosting is free forever.",
};

/** The rows come from lib/plans, which mirrors what the API enforces. */
const ROWS = COMPARISON;

function Cell({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="mx-auto h-4 w-4 text-foreground" aria-label="Included" />;
  if (value === false)
    return (
      <Minus
        className="mx-auto h-4 w-4 text-muted-foreground/25"
        aria-label="Not included"
      />
    );
  return <span className="text-sm font-medium text-muted-foreground">{value}</span>;
}

export default function PricingPage() {
  return (
    <div>
      <SitePageHeader title="Pricing" description="Unlimited projects and collaborators on every plan, free included. Pay only for AI and heavy conversion." className="pb-0 @min-[40rem]:pb-0" />
      <section>
        <div className="container pb-20 @min-[40rem]:pb-24">
          <PricingPlans className="mt-14" />
        </div>
      </section>

      {/* Feature comparison */}
      <section className="py-24 @min-[40rem]:py-28">
        <div className="container">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-[-0.02em] text-pretty @min-[40rem]:text-4xl">
                Every limit, in one table
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                These are the numbers the API enforces. Anything not listed
                here has no limit.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Feature and limit comparison across the Free, Pro, and Team
                  plans
                </caption>
                <thead>
                  <tr className="border-b bg-surface/30">
                    <th
                      scope="col"
                      className="px-5 py-4 text-start text-sm font-semibold text-muted-foreground"
                    >
                      Feature
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground"
                    >
                      Free
                    </th>
                    <th
                      scope="col"
                      className="bg-foreground/[0.04] px-4 py-4 text-center text-sm font-semibold text-foreground"
                    >
                      Pro
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground"
                    >
                      Team
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b transition-colors last:border-0 hover:bg-surface/20"
                    >
                      <th
                        scope="row"
                        className="px-5 py-3.5 text-start text-sm font-medium"
                      >
                        {row.feature}
                      </th>
                      <td className="px-4 py-3.5 text-center">
                        <Cell value={row.free} />
                      </td>
                      <td className="bg-foreground/[0.04] px-4 py-3.5 text-center">
                        <Cell value={row.pro} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Cell value={row.team} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <FAQSection />

      {/* CTA */}
      <section className="py-24 @min-[40rem]:py-28">
        <div className="container">
          <div className="rounded-2xl border bg-surface/30 px-8 py-14 text-center @3xl:px-16">
            <h2 className="mx-auto max-w-5xl text-3xl font-semibold tracking-[-0.02em] text-pretty @min-[40rem]:text-4xl">
              Not sure which plan is right?
            </h2>
            <p className="mx-auto mt-4 max-w-5xl text-lg text-muted-foreground text-pretty">
              Start on Free and upgrade whenever you hit a limit. Or ask us and
              we will tell you which one you actually need.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 @min-[40rem]:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get started free
                  <ArrowRight className="ms-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
              >
                <Link href={siteConfig.contact.sales}>Contact sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
