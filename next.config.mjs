import createMDX from "@next/mdx";

const isProd = process.env.NODE_ENV === "production";

/** A setting the site cannot run without: the build stops here, by name, rather than guessing an address. */
const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not set. Set it in the environment (see .env.example) and build again.`);
  return value;
};
// The site's domain; the API's address comes from it, as in lib/site-urls.ts.
const domain = required("NEXT_PUBLIC_DOMAIN_NAME").toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
const apiUrl = isProd ? `https://api.${domain}` : "http://localhost:2161";

/**
 * Content Security Policy.
 *
 * `unsafe-eval` is only granted in development, where Next.js needs it for
 * HMR and source maps. Nothing in our own code uses eval, and production
 * builds do not need it, so in production it is dropped. That closes the
 * largest hole in the policy: with eval allowed, a single reflected string is
 * arbitrary code.
 *
 * `unsafe-inline` for scripts remains. Next.js emits inline bootstrap scripts,
 * and removing it requires nonce plumbing through a middleware. Worth doing,
 * but a separate piece of work.
 */
/** The origin of an address in an environment variable, or nothing when it is unset or not a URL. */
const originOf = (value) => {
  try {
    return value ? new URL(value).origin : "";
  } catch {
    return "";
  }
};
// Umami (https://docs.umami.is/docs/tracker-configuration, /docs/replays, /docs/heatmaps), all optional: with none of it set the site has no analytics. The tracker (script.js) and the site's id go together. The recorder (recorder.js: replays and heatmaps, on the public pages only) is added "in addition to" the tracker, so it needs both. Each script sends to the host it is served from, so the policy allows exactly those hosts.
const umamiSet = ["NEXT_PUBLIC_UMAMI_SCRIPT_URL", "NEXT_PUBLIC_UMAMI_WEBSITE_ID"].filter((name) => process.env[name]?.trim());
if (umamiSet.length === 1) throw new Error(`Only ${umamiSet[0]} is set. Umami needs NEXT_PUBLIC_UMAMI_SCRIPT_URL and NEXT_PUBLIC_UMAMI_WEBSITE_ID together, or neither.`);
if (process.env.NEXT_PUBLIC_UMAMI_RECORDER_URL?.trim() && umamiSet.length < 2) throw new Error("NEXT_PUBLIC_UMAMI_RECORDER_URL is set without NEXT_PUBLIC_UMAMI_SCRIPT_URL and NEXT_PUBLIC_UMAMI_WEBSITE_ID.");
const umamiRecorderHost = originOf(process.env.NEXT_PUBLIC_UMAMI_RECORDER_URL);
const umamiHosts = [...new Set([originOf(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL), originOf(process.env.NEXT_PUBLIC_UMAMI_RECORDER_URL)].filter(Boolean))].join(" ");
// In development the admin panel can be opened at admin.localhost, where it talks to the API on that same name (lib/site-urls.ts).
const devLocalApi = isProd ? "" : " http://*.localhost:*";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}${umamiHosts ? ` ${umamiHosts}` : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // The API serves project images (previews, visual mode); in development
  // it is plain http on another port.
  `img-src 'self' data: blob: https: ${apiUrl}${devLocalApi}`,
  "font-src 'self' data:",
  // pdf.js runs in a worker served from public/
  "worker-src 'self' blob:",
  `connect-src 'self'${umamiHosts ? ` ${umamiHosts}` : ""} ws: wss: ${apiUrl}${devLocalApi}`,
  // Nobody may frame the site, except the Umami host when the recorder is on: its heatmap view shows the live page in a frame (docs.umami.is/docs/heatmaps).
  `frame-ancestors ${umamiRecorderHost ? `'self' ${umamiRecorderHost}` : "'none'"}`,
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  // `next dev` otherwise writes AGENTS.md and CLAUDE.md into the project.
  agentRules: false,

  // The admin panel can be opened at admin.localhost in development (proxy.ts maps that host onto app/admin).
  allowedDevOrigins: ["admin.localhost"],

  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  serverExternalPackages: [],

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // X-Frame-Options cannot name one host, so with the recorder on the policy's frame-ancestors decides alone, as Umami's heatmap docs ask.
          ...(umamiRecorderHost ? [] : [{ key: "X-Frame-Options", value: "DENY" }]),
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              // The microphone is allowed for this site only: dictation records with it. Everything else stays off.
              "camera=(), microphone=(self), geolocation=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // Named by string so the plugin also loads under Turbopack, which cannot take a function here. GFM gives the docs and lessons real tables.
  options: { remarkPlugins: [["remark-gfm"]] },
});

export default withMDX(config);
