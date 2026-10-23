import Link from "next/link";
import type { Metadata } from "next";
import {
  LegalPage,
  LegalSection,
  LegalList,
} from "@/components/essential/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The terms governing use of the TeXeR hosted service, including accounts, content ownership, billing, and self-hosting.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="2 April 2026"
      intro="These terms cover the hosted service at texer.org. The TeXeR source code is separately licensed under the MIT licence, and running it yourself is governed by that licence rather than by this agreement."
    >
      <LegalSection n={1} title="Who these terms are between">
        <p>
          &ldquo;TeXeR&rdquo;, &ldquo;we&rdquo; and &ldquo;us&rdquo; refer to
          the operator of the hosted service at texer.org.
          &ldquo;You&rdquo; refers to the individual or organisation using it.
          By creating an account you agree to these terms. If you are agreeing
          on behalf of an employer or institution, you confirm you are
          authorised to do so.
        </p>
        <p>
          If you do not agree, you can still use the software: clone the
          repository and self-host it. Nothing in this agreement restricts your
          rights under the MIT licence.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Accounts and sign-in">
        <p>
          Accounts are identified by email address. We do not use passwords:
          signing in sends a one-time code to your email, so control of that
          inbox is control of the account. Keep it secure, and enable
          two-factor authentication in settings if you want a second factor.
        </p>
        <p>
          You are responsible for activity carried out under your account. Tell
          us at{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:contact@texer.org"
          >
            contact@texer.org
          </a>{" "}
          if you believe it has been accessed without your permission. You can
          revoke every active session at any time from your settings.
        </p>
        <p>
          You must be old enough to form a binding contract where you live. The
          service is not directed at children.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Your content stays yours">
        <p>
          You keep all rights to the documents, images, PDFs, and LaTeX source
          you put into TeXeR. We claim no ownership of it.
        </p>
        <p>
          To operate the service we need a narrow, practical licence: permission
          to store your content, transmit it, compile it, render previews of it,
          create the automatic version history described in these terms, and
          pass it to the sub-processors listed in the{" "}
          <Link className="underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>{" "}
          where a feature requires it. That licence exists only to run the
          service for you, lasts only as long as you keep the content on the
          platform, and ends when you delete it.
        </p>
        <p className="font-medium text-foreground">
          We do not use your content to train machine-learning models, and we do
          not sell it or share it for advertising.
        </p>
        <p>
          If you share a project or make it publicly accessible, you are
          granting access to whoever you share it with. Consider what a link
          exposes before you create one.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Acceptable use">
        <p>You agree not to use the hosted service to:</p>
        <LegalList
          items={[
            "Upload content you do not have the right to upload, or that infringes someone else's copyright.",
            "Break the law, or help someone else break it.",
            "Probe, scan, or attack the infrastructure, or try to reach accounts and data that are not yours.",
            "Circumvent usage limits, rate limits, or billing, including by registering accounts in bulk to multiply the free tier.",
            "Resell the hosted service as your own product. Self-hosting under the MIT licence is a different matter and is expressly permitted.",
            "Automate the interface in a way that degrades it for other users. Use the API instead; it exists for this.",
          ]}
        />
        <p>
          We may suspend an account that is causing damage or operating well
          outside its plan limits. Where circumstances allow we will warn you
          first and explain what needs to change.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Plans, billing, and cancellation">
        <p>
          The free tier is free indefinitely and needs no card. Paid plans are
          billed in advance through Stripe, monthly or annually depending on the
          period you choose. We never see or store your full card details.
        </p>
        <p>
          Cancelling stops the next renewal. Your paid features stay available
          until the end of the period you have already paid for, after which the
          account reverts to the free tier. It is not deleted, though usage
          limits then apply.
        </p>
        <p>
          Refunds are covered separately in the{" "}
          <Link className="underline underline-offset-4" href="/refunds">
            Refund Policy
          </Link>
          .
        </p>
        <p>
          We may change prices. Existing subscribers get at least 30 days&rsquo;
          notice by email before a change affects them, and can cancel before it
          takes effect. Prices exclude VAT, GST, or sales tax unless stated;
          where we are required to collect them they are added at checkout.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Usage limits and fair use">
        <p>
          Each plan includes a monthly allowance of image conversions and PDF
          pages, shown on the{" "}
          <Link className="underline underline-offset-4" href="/pricing">
            pricing page
          </Link>{" "}
          and tracked live on your statistics page. Allowances reset at the
          start of each calendar month and do not roll over.
        </p>
        <p>
          Plans described as &ldquo;unlimited&rdquo; are subject to fair use: we
          may contact you about consumption far beyond ordinary individual or
          team usage, or that looks automated.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Availability, and what we do not promise">
        <p>
          We work to keep the service running, but it is provided on an
          &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We do not
          offer a contractual uptime guarantee, and we may take the service down
          for maintenance, ideally with notice.
        </p>
        <p>
          Two limitations are worth stating plainly, because they are the ones
          that actually affect people:
        </p>
        <LegalList
          items={[
            "Automatic conversion is not perfect. Recognition of handwriting and PDFs is a best effort, and the output needs checking before you rely on it. Do not submit generated LaTeX to a journal or an examiner without reading it.",
            "Version history is a convenience, not a backup. Snapshots are retained for 30 days and then deleted automatically. Keep your own copies of anything you cannot afford to lose. The ZIP export exists for exactly this.",
          ]}
        />
      </LegalSection>

      <LegalSection n={8} title="Limitation of liability">
        <p>
          To the fullest extent the law allows, we are not liable for indirect,
          incidental, special, or consequential losses, or for lost profits,
          revenue, data, or goodwill, arising from your use of the service.
        </p>
        <p>
          Where liability cannot be excluded, our total liability for any claim
          is limited to the greater of the amount you paid us in the twelve
          months before the claim arose, or 50 USD.
        </p>
        <p>
          Nothing here excludes liability that cannot lawfully be excluded,
          including for fraud, or for death or personal injury caused by
          negligence. If you are a consumer, your statutory rights are
          unaffected by anything in this agreement.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Ending the agreement">
        <p>
          You can delete your account from settings at any time. Deletion
          closes the account at once and erases your projects, documents,
          uploads, and profile from the live service 30 days later; see the{" "}
          <Link className="underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>{" "}
          for how long copies persist in backups and security logs. Export your
          work first, because deletion cannot be undone.
        </p>
        <p>
          We may terminate an account for a serious or repeated breach of these
          terms. If we do, and you have paid for a period you have not used, we
          will refund the unused portion unless the breach was fraud or abuse.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Changes to these terms">
        <p>
          We may update these terms. For material changes we will email
          registered users at least 30 days before they take effect, and update
          the date at the top of this page. Continuing to use the service after
          that means you accept the revised terms; if you do not, cancel and, if
          a paid period remains, contact us for a pro-rata refund.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Governing law and contact">
        <p>
          These terms are governed by the laws of the jurisdiction in which the
          service operator is established, without regard to conflict-of-laws
          rules. If you are a consumer, you keep the protection of the mandatory
          laws of your country of residence.
        </p>
        <p>
          Questions about this agreement:{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:contact@texer.org"
          >
            contact@texer.org
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
