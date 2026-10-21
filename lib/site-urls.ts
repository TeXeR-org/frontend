/**
 * Where everything TeXeR runs, from one setting, NEXT_PUBLIC_DOMAIN_NAME (texer.org), which next.config.mjs requires:
 *
 *   the site   https://<domain>
 *   the API    https://api.<domain>, or http://localhost:2161 under `next dev`, where the API runs on this machine
 *   the admin  https://admin.<domain>
 *   MCP        https://mcp.<domain>/mcp, or http://localhost:2161/mcp under `next dev` (the API serves it)
 */
export const DOMAIN_NAME = (process.env.NEXT_PUBLIC_DOMAIN_NAME ?? "")
  .trim()
  .toLowerCase()
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");

const configuredApiUrl = process.env.NODE_ENV === "production" ? `https://api.${DOMAIN_NAME}` : "http://localhost:2161";

/**
 * A page opened on a subdomain of localhost (admin.localhost:2160) reaches the API on that same name (admin.localhost:2161). Browsers count localhost and admin.localhost as different sites, so the sign-in cookie set by http://localhost:2161 is neither stored nor sent from a page on admin.localhost, and every request after signing in comes back 401. The same name on another port is the same site, and it reaches the same local server.
 */
function localSubdomainApiUrl(): string {
  if (typeof window === "undefined" || !window.location.hostname.endsWith(".localhost")) return configuredApiUrl;
  try {
    const url = new URL(configuredApiUrl);
    if (url.hostname !== "localhost") return configuredApiUrl;
    url.hostname = window.location.hostname;
    return url.origin;
  } catch {
    return configuredApiUrl;
  }
}

export const API_URL = localSubdomainApiUrl();

/** Where AI tools (Claude Code, claude.ai, Codex, Copilot) connect to TeXeR: the API's MCP server. */
export const MCP_URL = process.env.NODE_ENV === "production" ? `https://mcp.${DOMAIN_NAME}/mcp` : "http://localhost:2161/mcp";

/** The public site, for canonical links and the sitemap. */
export const SITE_URL = `https://${DOMAIN_NAME}`;

/** The host the operators' panel is served at. */
export const ADMIN_HOST = `admin.${DOMAIN_NAME}`;
