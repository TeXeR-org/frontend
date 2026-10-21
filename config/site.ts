import { SITE_URL } from "@/lib/site-urls";

const FORGE = process.env.NEXT_PUBLIC_FORGE_URL?.replace(/\/+$/, "") || "https://git.texer.org";

export const siteConfig = {
  name: "TeXeR",
  url: SITE_URL,
  // Drawn by app/og/[...path]/route.tsx, in the same look as the cards for Docs, Learn, and the Library.
  ogImage: `${SITE_URL}/og/site`,
  description:
    "The LaTeX workspace for the whole paper: handwriting and PDFs to LaTeX, real-time collaboration, track changes, a TikZ library, an AI assistant, and GitHub sync. Free for unlimited projects and collaborators.",
  links: {
    /** The mirror on GitHub. */
    github: "https://github.com/TeXeR-org",
    /** Our own Git server (Forgejo, ops/forgejo/README.md), where the source lives. NEXT_PUBLIC_FORGE_URL overrides it for a self-hosted copy. */
    forge: FORGE,
    /** The TeXeR organization on it: every repository. */
    source: `${FORGE}/texer`,
  },
  contact: {
    sales: "mailto:sales@texer.org",
    support: "mailto:contact@texer.org",
  },
}

export type SiteConfig = typeof siteConfig
