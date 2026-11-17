# TeXeR Frontend

Next.js 16 app at [texer.org](https://texer.org). The marketing site, the documentation, the TikZ and template library, and the editor itself.

Part of TeXeR alongside the [backend](https://github.com/texer-org/backend) and the [compiler](https://github.com/texer-org/compiler).

## What's in here

- **Editor.** CodeMirror 6 with LaTeX syntax highlighting, autocomplete across thousands of commands, live PDF preview, SyncTeX jump-to-source in both directions, an AI assistant that presents edits as accept/reject diffs, and real-time collaboration over Yjs. Shift+Space opens an insert palette of snippets and TikZ examples.
- **Conversion.** Upload handwriting, screenshots or PDFs and get editable LaTeX back.
- **Library.** A browsable tree of TikZ packages, each with rendered examples, and document templates grouped by category. Previews are prebuilt PNGs and PDFs served from object storage, with a live compile as fallback.
- **Docs.** MDX with a generated table of contents, Cmd+K search, and an API reference.
- **Marketing site and legal pages.** Homepage, pricing, terms, privacy, refunds.

## Requirements

- Node 20+
- The [backend](https://github.com/texer-org/backend) running, by default on `http://localhost:2161`

## Setup

```bash
npm install
# create .env.local, see below
npm run dev
```

The dev server runs on port `2160`. `postinstall` copies the pdf.js worker, the file icons, and the country flags into `public/`, and brings in the guides and lessons (see Content below).

## Environment

`.env.local`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_DOMAIN_NAME` | Required, for example `texer.org`. The site (`https://<domain>`), the API (`https://api.<domain>`), and the admin panel (`admin.<domain>`) come from it (`lib/site-urls.ts`). Under `npm run dev` the API is `http://localhost:2161` |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Optional. Umami's tracker, for example `https://t.texer.org/script.js`; it sends to its own host. Set with the website id, or neither |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Optional. The site's id in Umami |
| `NEXT_PUBLIC_UMAMI_RECORDER_URL` | Optional. Umami's recorder, for example `https://t.texer.org/recorder.js`: replays and heatmaps on the public pages only. Needs the two above |
| `NEXT_PUBLIC_FORGE_URL` | Optional. Our own Git server, for example `https://git.texer.org`. When set, the Contribute page says the source is self-hosted and mirrored to GitHub |
| `DOCS_REPO`, `LEARN_REPO`, `DOCS_REF`, `LEARN_REF`, `DOCS_DEPLOY_KEY`, `LEARN_DEPLOY_KEY` | Build only. Where the guides and lessons are cloned from when the sibling folders are absent. See Content |

Nothing else. Secrets live in the backend; this app holds none.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server (Turbopack) on 2160. Also keeps `content/` in step with the sibling `docs` and `learn` folders while you edit them |
| `npm run content` | Bring the guides and lessons in once (`scripts/sync-content.mjs`). Runs by itself before `dev` and `build` |
| `npm run build` | Production build. Also the typecheck gate |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Layout

```
app/
  (site)/          public pages: homepage, docs, library, pricing, legal
  (auth)/          login, signup
  (user)/          dashboard, projects, editor, snips, PDFs, settings
  admin/           the operators' panel (served at admin.<domain> in production)
components/
  editor/          CodeMirror editor, PDF preview, file tree, AI panel, TikZ canvas
  essential/       everything else, grouped by area (home, docs, library, legal, pdf, ...)
  ui/              shadcn primitives
lib/
  api/             typed client per backend module
  latex/           autocomplete, snippets, templates, indentation
  tikz/            the TikZ example library and its data
  docs-nav.ts      docs sidebar, search index, and ordering, read from content/docs.json
  library-nav.ts   library tree, search and prev/next
hooks/             collaboration, compile, editor state
proxy.ts           route protection, the www redirect, and the admin host (Next.js 16's middleware)
content/           generated: the guides and lessons, copied in from the docs and learn repositories
scripts/           postinstall, content sync, the dev wrapper
```

## Content

The guides (`/docs`) and the LaTeX lessons (`/learn`) are not in this repository. They are written in two others, `docs` and `learn`, and `scripts/sync-content.mjs` copies them into `content/` (generated, not committed), where two routes render them: `app/(site)/(info)/docs/[...slug]` and `app/(site)/learn/[slug]`. Each manual's sidebar, search, and overview are built from its `nav.json` and the pages' frontmatter.

- **Writing.** Clone `docs` and `learn` beside this folder. `npm run dev` reads them directly and reloads when a page is saved.
- **Building.** Without the sibling folders (on Railway), the build clones `DOCS_REPO` and `LEARN_REPO`. Public repositories need nothing else; a private one needs its read-only deploy key in `DOCS_DEPLOY_KEY` or `LEARN_DEPLOY_KEY`. `railpack.json` adds git and an SSH client to the build image for this.
- **Publishing.** A push to `main` in either repository sends a `content-updated` event here, and `.github/workflows/deploy-content.yml` deploys the site. It needs the `RAILWAY_TOKEN` secret and the `RAILWAY_SERVICE` variable.
- **What a page can use.** The components in `mdx-components.tsx`, by name. Pages cannot import or export.

## The admin panel

`app/admin` is the operators' panel: accounts, sessions, AI usage, the audit log, and system health. In development it is at `/admin`. In production it is at `admin.<domain>`, with nothing to set: `proxy.ts` serves the panel at the root of any host that begins with `admin.`, and sends `/admin` on the site's own domain there. Add the `admin.` domain to this service in Railway. The pages hold no secrets and decide nothing: every request is checked by the API, which lets in the root administrator (`ADMIN_EMAIL`, signing in with `ADMIN_PASSWORD`) and accounts whose administrator flag is on.

## A few things worth knowing

- **Route protection is `proxy.ts`**, not `middleware.ts`. Next.js 16 renamed it. It gates `/dashboard`, `/projects`, `/settings` and the rest on the presence of the auth cookie.
- **Security headers** including the CSP are set in `next.config.mjs`. `unsafe-eval` is granted in development only.
- **The design system is monochrome.** `primary` is near-black in light mode and near-white in dark. Colour is used only where it carries meaning.
- **Every non-auth page shares one container width**, `max-w-6xl`, via the `.container` utility in `globals.css`.
- **TikZ and template source is reindented at load time** by `lib/latex/format.ts`, so the browser, the insert palette and new projects all see consistently nested code regardless of how the source data was authored.

## License

[MIT](LICENSE)
