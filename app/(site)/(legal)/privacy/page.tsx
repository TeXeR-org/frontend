import Link from "next/link";
import type { Metadata } from "next";
import {
  LegalPage,
  LegalSection,
  LegalList,
} from "@/components/essential/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What data TeXeR collects, which sub-processors it uses, how long it is kept, and how to export or delete it.",
};

/** The real third parties data reaches. Keep in step with the backend. */
const SUBPROCESSORS = [
  {
    name: "Stripe",
    purpose: "Subscription billing and card processing",
    data: "Email, billing address, card details (held by Stripe, never by us), invoice history",
  },
  {
    name: "Resend",
    purpose: "Transactional email: sign-in codes, invitations, receipts",
    data: "Email address, message contents",
  },
  {
    name: "S3-compatible object storage",
    purpose: "Storing uploads, compiled PDFs, and generated thumbnails",
    data: "Files you upload and documents you compile",
  },
  {
    name: "Axya (ai.axya.org)",
    purpose:
      "Our research AI service: converting images and PDFs to LaTeX, and transcribing dictation, only for requests you start",
    data: "The image, PDF, or audio clip in that request",
  },
  {
    name: "OpenAI and Anthropic",
    purpose: "The editor's AI assistant, only for messages you send it",
    data: "Your message and the project files sent with it",
  },
  {
    name: "doi.org and arXiv",
    purpose: "Turning a DOI or arXiv ID you enter into a bibliography entry",
    data: "The identifier you looked up, nothing about you",
  },
  {
    name: "GitHub",
    purpose: "Syncing a project with a repository, only if you link one",
    data: "The project's files, sent with the access token you provided",
  },
  {
    name: "Umami (self-hosted)",
    purpose: "Aggregate page analytics on the marketing site",
    data: "Page path, referrer, country, device type. No cookies, no cross-site identifier",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="9 November 2026"
      intro="This describes the hosted service at texer.org. If you self-host TeXeR, none of this applies. No data reaches us at all, and you become the controller of everything your instance stores."
    >
      <LegalSection n={1} title="The short version">
        <LegalList
          items={[
            "We collect the minimum needed to run an account: your email address, whatever profile details you choose to add, and the content you upload.",
            "There are no passwords to leak, because we do not use them. Sign-in is a one-time code sent to your email.",
            "Your documents are never used to train machine-learning models, ours or anyone else's.",
            "We do not sell personal data, and we run no advertising or cross-site tracking.",
            "You can export everything as JSON, or delete the account outright, from your settings, without emailing anyone.",
          ]}
        />
      </LegalSection>

      <LegalSection n={2} title="What we collect">
        <p className="font-medium text-foreground">Account data</p>
        <p>
          Your email address, which is how the account is identified. A display
          name, and optionally a bio, affiliation, location, and avatar if you
          choose to fill them in. None of the optional fields are required to
          use the service.
        </p>

        <p className="font-medium text-foreground">Content</p>
        <p>
          Projects, LaTeX source, uploaded images and PDFs, compiled output, and
          the documents you create, along with the comments, suggested changes,
          and chat messages you and your collaborators write in a project. This
          is stored so we can give it back to you. Comments and chat are visible
          to everyone the project is shared with and are deleted with the
          project.
        </p>

        <p className="font-medium text-foreground">GitHub</p>
        <p>
          If you link a project to a GitHub repository, we store the repository
          name and the access token you give us, encrypted, and use the token
          only for that project&apos;s pushes and pulls. Pushing sends the
          project&apos;s files to GitHub, under GitHub&apos;s own terms.
          Unlinking deletes the token.
        </p>

        <p className="font-medium text-foreground">Technical and security data</p>
        <p>
          For each active session we record the IP address, browser, operating
          system, and approximate location, so you can review your sessions and
          spot one you do not recognise. We also keep an audit log of
          security-relevant events (sign-ins, failed sign-in attempts, account
          changes, deletions), which is what makes it possible to investigate if
          an account is compromised.
        </p>

        <p className="font-medium text-foreground">Usage counters</p>
        <p>
          Monthly totals of image conversions and PDF pages, used to enforce
          plan limits and to render your statistics page. These are counts, not
          copies of the content.
        </p>

        <p className="font-medium text-foreground">Payment data</p>
        <p>
          If you subscribe, Stripe handles the transaction. We store your Stripe
          customer and subscription identifiers, your plan, and invoice records.
          We never receive or store full card numbers.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Why we are allowed to process it">
        <p>
          Where the UK GDPR or EU GDPR applies, we rely on: performance of a
          contract, for everything needed to provide the service you signed up
          for; legitimate interests, for security logging, abuse prevention, and
          aggregate analytics; legal obligation, for retaining financial
          records; and consent, where we ask for it explicitly, which you can
          withdraw at any time.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Who else touches your data">
        <p>
          We use a small number of sub-processors. Each receives only what its
          function requires.
        </p>

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-surface/40 text-start">
                <th className="px-4 py-3 font-semibold text-foreground">
                  Provider
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Purpose
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Data involved
                </th>
              </tr>
            </thead>
            <tbody>
              {SUBPROCESSORS.map((p) => (
                <tr key={p.name} className="border-b last:border-0 align-top">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {p.name}
                  </td>
                  <td className="px-4 py-3">{p.purpose}</td>
                  <td className="px-4 py-3">{p.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          Two things worth being explicit about. First, Axya and the AI
          providers only ever receive what a request you started includes: the
          image, PDF, or audio clip you converted, or your message to the
          assistant and the project files sent with it. Opening the editor
          sends nothing. Second, we use these
          providers under terms that exclude your requests from model training,
          and we do not use your content for training either. Provider terms
          change; if that ever stops being true we will say so here and in the
          changelog before it takes effect.
        </p>
        <p>
          If none of that is acceptable for your data, self-host. The entire
          stack is MIT licensed, you can point it at your own AI keys or none at
          all, and no data leaves your infrastructure.
        </p>
      </LegalSection>

      <LegalSection n={5} title="How long it is kept">
        <LegalList
          items={[
            "Projects and uploads: until you delete them, or until 30 days after you delete your account.",
            "Deleted accounts: closed at once, then erased 30 days later. Billing records are kept, without your name or email address, as accounting law requires.",
            "Version history snapshots: 30 days, then deleted automatically. This is a convenience feature, not a backup, so keep your own copies.",
            "Sign-in codes: expire within minutes and are purged hourly.",
            "Sessions: until they expire or you revoke them; inactive sessions are cleared after 7 days.",
            "Security audit logs: retained beyond account deletion where needed to investigate abuse or meet a legal obligation.",
            "Invoices and financial records: as long as tax and accounting law requires, typically six to seven years.",
            "Encrypted backups: deleted content can persist in backups for up to 30 days before rotating out.",
          ]}
        />
      </LegalSection>

      <LegalSection n={6} title="Your rights">
        <p>
          Depending on where you live you may have the right to access, correct,
          delete, restrict, or object to processing of your personal data, and to
          receive it in a portable format. Two of these are built into the
          product rather than requiring a request:
        </p>
        <LegalList
          items={[
            "Export: Settings gives you a JSON file containing your account data, projects, and metadata.",
            "Deletion: Settings closes the account at once. You are signed out everywhere and its API keys stop working. Its content is erased 30 days later. It cannot be undone, so export first.",
          ]}
        />
        <p>
          For anything else, email{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:privacy@texer.org"
          >
            privacy@texer.org
          </a>
          . We aim to respond within 30 days. If you are in the UK or EU and are
          unhappy with our response, you may complain to your national data
          protection authority.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Cookies and analytics">
        <p>
          We set two essential cookies to keep you signed in. One holds your
          sign-in; it is HttpOnly, so no script on a page can read it. The
          other only tells the site that you are signed in. There are no
          advertising cookies and no third-party trackers.
        </p>
        <p>
          The marketing site uses a self-hosted Umami instance for aggregate
          page statistics. It sets no cookies, collects no cross-site
          identifier, and produces counts rather than profiles, which is why
          there is no cookie banner asking for your consent to it.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Security">
        <p>
          Data is encrypted in transit with TLS. At rest it is stored with
          providers that encrypt their storage and database volumes; we do not
          add a separate application-level encryption layer on top, and we say
          so because &ldquo;encrypted at rest&rdquo; on its own tends to imply
          more than it means. File access uses short-lived signed URLs rather
          than public links. There are no passwords to leak, and two-factor
          authentication is available in settings.
        </p>
        <p>
          What we do not have: a third-party certification such as SOC 2 or ISO
          27001. Those are audits of process documentation, and for a project of
          this size the cost is better spent on the controls themselves. The
          code is open, so the controls can be read rather than taken on trust.
        </p>
        <p>
          No system is perfectly secure. If we discover a breach affecting your
          personal data we will notify affected users and the relevant authority
          without undue delay, and within 72 hours where the GDPR requires it.
        </p>
        <p>
          Found a vulnerability? Please report it privately to{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:security@texer.org"
          >
            security@texer.org
          </a>{" "}
          rather than opening a public issue.
        </p>
      </LegalSection>

      <LegalSection n={9} title="International transfers and children">
        <p>
          Our sub-processors operate internationally, so your data may be
          processed outside your country. Where data leaves the UK or EEA we
          rely on adequacy decisions or Standard Contractual Clauses.
        </p>
        <p>
          The service is not directed at children under 13 (or under 16 where
          local law sets that threshold), and we do not knowingly collect their
          data. If you believe a child has created an account, contact us and we
          will remove it.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Changes and contact">
        <p>
          We will update this page when our practices change, and email
          registered users about anything material. The date at the top always
          reflects the current version.
        </p>
        <p>
          Privacy questions:{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:privacy@texer.org"
          >
            privacy@texer.org
          </a>
          . See also the{" "}
          <Link className="underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className="underline underline-offset-4" href="/refunds">
            Refund Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
