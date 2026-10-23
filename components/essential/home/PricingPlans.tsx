"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "./_shared";
import { PLANS, YEARLY_SAVING, formatPrice, type PlanId } from "@/lib/plans";

/**
 * The plan cards and billing toggle, with no section chrome of its own.
 *
 * This used to live inside `PricingSection`, heading included, which meant the
 * /pricing page rendered its own hero and then a second heading saying the
 * same thing two hundred pixels below it. Owning only the cards lets each page
 * supply the framing that suits it.
 */

/** Where each card's button goes; the plans themselves live in lib/plans. */
const CTA: Record<PlanId, { label: string; href: string }> = {
  free: { label: "Start free", href: "/signup" },
  pro: { label: "Choose Pro", href: "/signup?plan=pro" },
  team: { label: "Choose Team", href: "/signup?plan=team" },
};

export function PricingPlans({ className }: { className?: string }) {
  const [yearly, setYearly] = useState(false);

  return (
    <div className={className}>
      <div className="flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="inline-flex rounded-full border bg-background p-1"
        >
          {[
            { label: "Monthly", value: false },
            { label: "Yearly", value: true },
          ].map((option) => (
            <button
              key={option.label}
              role="radio"
              aria-checked={yearly === option.value}
              onClick={() => setYearly(option.value)}
              className={cn(
                "rounded-full px-5 py-1.5 text-sm font-medium transition-all",
                yearly === option.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
              {option.value && (
                <span
                  className={cn(
                    "ms-1.5 text-[11px]",
                    yearly ? "opacity-70" : "text-muted-foreground",
                  )}
                >
                  &minus;{YEARLY_SAVING}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-14 grid items-stretch gap-5 @3xl:grid-cols-3">
        {PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.06} className="h-full">
            {/* The featured plan is the page's one inverted surface: the accent plate with its text reversed, raised a little above its neighbors. Nothing else on the page is filled, so it reads first. */}
            <div
              className={cn(
                "relative flex h-full flex-col rounded-[var(--radius-surface)] border p-7",
                plan.featured ? "border-transparent bg-accent text-on-accent shadow-modal @3xl:-my-4 @3xl:h-[calc(100%+2rem)] @3xl:py-11" : "border-line bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
                {plan.featured && <span className="rounded-full bg-on-accent/15 px-2.5 py-0.5 text-xs font-medium">Most popular</span>}
              </div>
              <p className={cn("mt-1 text-sm", plan.featured ? "text-on-accent/70" : "text-muted-foreground")}>{plan.tagline}</p>

              <div className="mt-7 flex items-baseline gap-1.5">
                <span className="text-[2.5rem] font-semibold leading-none tracking-[-0.03em]">{formatPrice(yearly ? plan.yearly / 12 : plan.monthly)}</span>
                {plan.monthly > 0 && <span className={cn("text-sm", plan.featured ? "text-on-accent/70" : "text-muted-foreground")}>/month</span>}
              </div>
              <p className={cn("mt-2 h-4 text-xs", plan.featured ? "text-on-accent/70" : "text-muted-foreground")}>
                {plan.monthly === 0 ? "Free forever" : yearly ? `Billed ${formatPrice(plan.yearly)} yearly` : "Billed monthly"}
              </p>

              {plan.featured ? (
                <Link
                  href={CTA[plan.id].href}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-[var(--radius)] bg-background text-[15px] font-medium text-foreground transition-colors hover:bg-background/90"
                >
                  {CTA[plan.id].label}
                </Link>
              ) : (
                <Button asChild size="lg" className="mt-6 w-full" variant="outline">
                  <Link href={CTA[plan.id].href}>{CTA[plan.id].label}</Link>
                </Button>
              )}

              <ul className={cn("mt-7 space-y-3 border-t pt-7", plan.featured ? "border-on-accent/15" : "border-line")}>
                {plan.highlights.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm">
                    <Check className={cn("mt-0.5 size-4 shrink-0", plan.featured ? "text-on-accent" : "text-foreground/40")} aria-hidden />
                    <span className={plan.featured ? "text-on-accent/85" : "text-muted-foreground"}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Or run the whole thing yourself.{" "}
        <Link
          href="/docs/self-hosting"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Self-hosting is free and always will be
        </Link>
        .
      </p>
    </div>
  );
}
