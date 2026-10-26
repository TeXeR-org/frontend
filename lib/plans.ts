/**
 * The plans as the site shows them: the pricing page, its comparison table,
 * and Billing all read from here. The API enforces the same numbers from
 * backend/src/common/plans.ts, so change both together.
 *
 * Projects, collaborators, real-time editing, compiling, the TikZ studio, and
 * the API are the same on every plan, with no limits. Plans differ only in
 * what costs money to run: conversions, upload storage, and the AI models.
 */
export type PlanId = "free" | "pro" | "team";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Price per month, billed monthly. */
  monthly: number;
  /** Price per year, billed yearly. */
  yearly: number;
  featured?: boolean;
  /** What the plan's card lists. */
  highlights: string[];
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "For writing alone or together",
    monthly: 0,
    yearly: 0,
    highlights: [
      "Unlimited projects and collaborators",
      "Real-time editing, comments, and track changes",
      "Visual and code editing, spell check",
      "GitHub sync and DOI or arXiv references",
      "Axya, the AI assistant, with your own API key",
      "20 image snips a month",
      "40 PDF pages a month",
      "100 MB of uploads",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For a thesis, and everything after it",
    monthly: 7.99,
    yearly: 79.99,
    featured: true,
    highlights: [
      "Everything in Free",
      "300 image snips a month",
      "200 PDF pages a month",
      "5 GB of uploads",
      "Priority support",
    ],
  },
  {
    id: "team",
    name: "Team",
    tagline: "For labs and research groups",
    monthly: 19.99,
    yearly: 199.99,
    highlights: [
      "Everything in Pro",
      "Unlimited image snips",
      "2,000 PDF pages a month",
      "50 GB of uploads",
      "Dedicated support",
    ],
  },
];

export type ComparisonValue = boolean | string;

export const COMPARISON: { feature: string; free: ComparisonValue; pro: ComparisonValue; team: ComparisonValue }[] = [
  { feature: "Projects", free: "Unlimited", pro: "Unlimited", team: "Unlimited" },
  { feature: "Collaborators", free: "Unlimited", pro: "Unlimited", team: "Unlimited" },
  { feature: "Real-time editing", free: true, pro: true, team: true },
  { feature: "Comments, track changes, and chat", free: true, pro: true, team: true },
  { feature: "LaTeX editor and live preview", free: true, pro: true, team: true },
  { feature: "Visual editor", free: true, pro: true, team: true },
  { feature: "Spell check in seven languages", free: true, pro: true, team: true },
  { feature: "BibTeX, Biber, and indexes", free: true, pro: true, team: true },
  { feature: "Compile time per document", free: "Up to 100 s", pro: "Up to 100 s", team: "Up to 100 s" },
  { feature: "GitHub sync", free: true, pro: true, team: true },
  { feature: "References from DOI or arXiv", free: true, pro: true, team: true },
  { feature: "Full ZIP and arXiv import", free: true, pro: true, team: true },
  { feature: "TikZ library and visual studio", free: true, pro: true, team: true },
  { feature: "REST API", free: true, pro: true, team: true },
  { feature: "Self-hosting", free: true, pro: true, team: true },
  { feature: "Image to LaTeX", free: "20 / mo", pro: "300 / mo", team: "Unlimited" },
  { feature: "PDF to LaTeX", free: "40 pages / mo", pro: "200 pages / mo", team: "2,000 pages / mo" },
  { feature: "Upload storage", free: "100 MB", pro: "5 GB", team: "50 GB" },
  { feature: "AI assistant with your own API key", free: true, pro: true, team: true },
  { feature: "AI models included, no key needed", free: false, pro: "Coming later", team: "Coming later" },
  { feature: "Priority support", free: false, pro: true, team: true },
  { feature: "Dedicated support", free: false, pro: false, team: true },
];

/** Whole-percent saving of a year's billing over twelve monthly payments. */
export function yearlySaving(plan: Plan): number {
  if (!plan.monthly) return 0;
  return Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100);
}

/** The best saving on offer, for the yearly toggle. */
export const YEARLY_SAVING = Math.max(...PLANS.map(yearlySaving));

/** "$7.99", "$6.67", "$0". */
export function formatPrice(amount: number): string {
  return amount === 0 ? "$0" : `$${amount.toFixed(2)}`;
}
