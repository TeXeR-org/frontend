"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Trash } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { DataTable, asTime, type Column } from "@/components/ui/data-table";
import { Segmented } from "@/components/ui/segmented";
import { RelativeTime } from "@/components/ui/time";
import { oauthAPI, type ConnectedApp } from "@/lib/api";
import { MCP_URL } from "@/lib/site-urls";

type Tool = "claude-code" | "claude-ai" | "codex" | "copilot";

const TOOLS: { value: Tool; label: string }[] = [
  { value: "claude-code", label: "Claude Code" },
  { value: "claude-ai", label: "Claude app" },
  { value: "codex", label: "Codex" },
  { value: "copilot", label: "VS Code" },
];

/** How each tool adds TeXeR: a command to paste, or where to paste the address. */
function setup(tool: Tool): { text: string; steps: string } {
  switch (tool) {
    case "claude-code":
      return { text: `claude mcp add --transport http texer ${MCP_URL}`, steps: "Run this, then /mcp in Claude Code to sign in to TeXeR." };
    case "codex":
      return { text: `codex mcp add texer --url ${MCP_URL}`, steps: "Run this, then codex mcp login texer to sign in to TeXeR." };
    case "claude-ai":
      return { text: MCP_URL, steps: "In claude.ai or Claude Desktop: Customize, Connectors, Add custom connector, and paste this address." };
    case "copilot":
      return {
        text: JSON.stringify({ servers: { texer: { type: "http", url: MCP_URL } } }, null, 2),
        steps: "Add this to .vscode/mcp.json, or to your user mcp.json; Copilot asks you to sign in to TeXeR the first time.",
      };
  }
}

/**
 * Settings: use TeXeR from an AI tool on the person's own plan (Claude Code, the Claude apps, Codex, GitHub Copilot), through TeXeR's MCP server. How to add it to each tool, and the tools connected so far, each of which can be disconnected at once.
 */
export function ConnectedApps() {
  const [tool, setTool] = useState<Tool>("claude-code");
  const [apps, setApps] = useState<ConnectedApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    oauthAPI
      .getConnectedApps()
      .then((list) => live && setApps(list))
      .catch(() => undefined)
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const disconnect = async (app: ConnectedApp) => {
    try {
      await oauthAPI.disconnect(app.id);
      setApps((list) => list.filter((a) => a.id !== app.id));
      toast.success(`${app.app} disconnected`);
    } catch {
      toast.error(`Could not disconnect ${app.app}`);
    }
  };

  const { text, steps } = setup(tool);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI tools</CardTitle>
        <CardDescription>Use TeXeR from Claude Code, the Claude apps, Codex, or GitHub Copilot, with your own plan. A connected tool can open your projects as you can.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Segmented value={tool} onValueChange={setTool} options={TOOLS} label="AI tool" className="self-start" />
          <p className="type-base text-muted-foreground">{steps}</p>
          <div className="flex items-start gap-2 rounded-[var(--radius-card)] border border-line bg-surface p-3">
            <pre className="min-w-0 flex-1 overflow-x-auto font-mono type-small whitespace-pre text-foreground">{text}</pre>
            <CopyButton text={text} showLabel={false} label={tool === "claude-ai" ? "Copy the address" : "Copy"} />
          </div>
        </div>
        <DataTable
          label="Connected AI tools"
          loading={loading && 2}
          empty="No AI tools connected yet."
          framed={false}
          className="rounded-[var(--radius-card)] border border-line"
          rows={apps}
          rowKey={(app) => app.id}
          defaultSort={{ column: "connected", direction: "desc" }}
          columns={
            [
              {
                id: "app",
                header: "App",
                sortValue: (app) => app.app,
                cell: (app) => (
                  <span className="flex items-center gap-2">
                    <Sparkles aria-hidden className="size-4 text-muted-foreground" />
                    <span className="font-medium">{app.app}</span>
                  </span>
                ),
              },
              { id: "used", header: "Last used", sortValue: (app) => asTime(app.lastUsedAt), cell: (app) => <RelativeTime value={app.lastUsedAt} fallback="Never" className="text-muted-foreground" /> },
              { id: "connected", header: "Connected", sortValue: (app) => asTime(app.connectedAt), cell: (app) => <RelativeTime value={app.connectedAt} className="text-muted-foreground" /> },
              {
                id: "actions",
                header: "Actions",
                hideHeader: true,
                sortable: false,
                align: "end",
                cell: (app) => (
                  <Button variant="ghost" size="icon-sm" aria-label={`Disconnect ${app.app}`} title="Disconnect" onClick={() => void disconnect(app)}>
                    <Trash className="size-4 text-danger" />
                  </Button>
                ),
              },
            ] satisfies Column<ConnectedApp>[]
          }
        />
      </CardContent>
    </Card>
  );
}
