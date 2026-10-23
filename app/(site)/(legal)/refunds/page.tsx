import Link from "next/link";
import type { Metadata } from "next";
import {
  LegalPage,
  LegalSection,
  LegalList,
} from "@/components/essential/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund policy",
  description:
    "When TeXeR issues refunds, how cancellation works, and how to request one.",
};

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="2 April 2026"
      intro="There is a free tier precisely so you can evaluate TeXeR without paying. If you paid anyway and it was not right, we would rather refund you than argue about it."
    >
      <LegalSection n={1} title="Cancelling versus refunding">
        <p>
          These are different things, and conflating them is where most billing
          confusion starts.
        </p>
        <p>
          <span className="font-medium text-foreground">Cancelling</span> stops
          the next renewal. Your paid features remain available until the end of
          the period you have already paid for, then the account drops to the
          free tier. Nothing is deleted. You can do this yourself in billing
          settings and it takes effect immediately.
        </p>
        <p>
          <span className="font-medium text-foreground">A refund</span> returns
          money already charged. Cancelling does not automatically trigger one,
          because you keep access for the remainder of the period.
        </p>
      </LegalSection>

      <LegalSection n={2} title="The 14-day guarantee">
        <p>
          If you are within 14 days of your first payment on a plan, email us
          and we will refund it in full. You do not need to justify the request.
        </p>
        <p>
          This applies to the first payment on a given plan. It is not intended
          to cover a subscription used for months and then refunded on the
          anniversary charge.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Beyond 14 days">
        <p>Outside that window we refund in these situations:</p>
        <LegalList
          items={[
            "A sustained outage or defect that stopped you using what you paid for: pro-rata for the affected period, or in full if it covered most of it.",
            "A charge you did not authorise, or a duplicate charge.",
            "A renewal you did not intend, reported within 14 days of the charge, where the plan has gone essentially unused since. Annual renewals in particular: tell us and we will sort it out.",
            "We terminate your account for a reason other than fraud or abuse. The unused portion comes back automatically.",
          ]}
        />
        <p>
          Outside those cases we generally do not refund a period that has
          already been used, since the service was available throughout it. If
          your circumstances are unusual, ask anyway. This is a policy, not an
          algorithm, and a person reads every request.
        </p>
      </LegalSection>

      <LegalSection n={4} title="What we do not refund">
        <LegalList
          items={[
            "Monthly allowances already consumed. Conversions and PDF pages cost us money at the point of use, so a month whose quota is spent is not refundable on that basis alone.",
            "Accounts terminated for fraud, abuse, or a serious breach of the Terms of Service.",
            "The free tier, which has never been charged for.",
            "Self-hosting, which is free under the MIT licence and involves no payment to us.",
          ]}
        />
      </LegalSection>

      <LegalSection n={5} title="How to request one">
        <p>
          Email{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:billing@texer.org"
          >
            billing@texer.org
          </a>{" "}
          from the address on the account, with the invoice number or
          approximate charge date. A sentence on what went wrong helps us fix
          it, but it is not a condition of the refund.
        </p>
        <p>
          We respond within 2 business days. Approved refunds are issued to the
          original payment method through Stripe and typically appear within 5
          to 10 business days, depending on your bank. That last stretch is out
          of our hands.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Statutory rights">
        <p>
          Nothing here reduces rights you have by law. Consumers in the UK, EU,
          and other jurisdictions may have a statutory right to cancel a
          distance contract within a cooling-off period, and rights where a
          service is not as described. Those rights apply in addition to this
          policy, and where they are more generous, they win.
        </p>
        <p>
          See also the{" "}
          <Link className="underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className="underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
