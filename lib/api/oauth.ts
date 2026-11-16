import { API_URL, handleResponse, apiFetch } from "./client";

/** An AI tool asking to connect, as the consent page shows it. */
export interface OAuthRequest {
  client: { name: string | null; id: string; uri: string | null };
  /** Where the browser goes back to: a host, or an app's own scheme. */
  redirectHost: string;
  scopes: string[];
}

/** An AI tool a person has connected. */
export interface ConnectedApp {
  id: number;
  app: string;
  clientId: string;
  connectedAt: string;
  lastUsedAt: string | null;
}

/** Connecting AI tools (Claude Code, claude.ai, Codex, Copilot) to TeXeR over MCP: the consent page's request and answer, and the connected apps in Settings. */
export const oauthAPI = {
  async getRequest(id: string): Promise<OAuthRequest> {
    return handleResponse(await apiFetch(`${API_URL}/oauth/requests/${encodeURIComponent(id)}`));
  },

  async decide(id: string, approve: boolean): Promise<{ redirectTo: string }> {
    return handleResponse(
      await apiFetch(`${API_URL}/oauth/requests/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve }),
      }),
    );
  },

  async getConnectedApps(): Promise<ConnectedApp[]> {
    return handleResponse(await apiFetch(`${API_URL}/oauth/grants`));
  },

  async disconnect(id: number): Promise<void> {
    await handleResponse(await apiFetch(`${API_URL}/oauth/grants/${id}`, { method: "DELETE" }));
  },
};
