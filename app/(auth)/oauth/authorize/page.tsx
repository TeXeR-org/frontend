"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText, FolderOpen, History, Play } from "@/components/icons";
import { AuthCard } from "@/components/essential/auth/AuthFrame";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { oauthAPI, type OAuthRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

/** What a connected tool can do, in the person's terms (the one scope, "texer"). */
const CAN = [
  { icon: FolderOpen, text: "See your projects and the ones shared with you, and create new ones" },
  { icon: FileText, text: "Read and change the files of projects you can edit" },
  { icon: Play, text: "Compile them and read the errors" },
];

/**
 * Where an AI tool (Claude Code, claude.ai, Codex, Copilot) sends a person to approve connecting to TeXeR: the OAuth consent page. The API holds the request (McpOAuthProvider.authorize); this page shows which app asks and where it will be sent back, and answers. Signed in only: the proxy sends anyone else to sign in and back here.
 */
function Consent() {
  const params = useSearchParams();
  const id = params.get("request") ?? "";
  const { user } = useAuth();
  const [request, setRequest] = useState<OAuthRequest | null>(null);
  const [error, setError] = useState<string | null>(id ? null : "This link is missing its request. Start connecting again from the app.");
  const [busy, setBusy] = useState<"allow" | "deny" | null>(null);

  useEffect(() => {
    if (!id) return;
    let live = true;
    oauthAPI
      .getRequest(id)
      .then((r) => live && setRequest(r))
      .catch((err: Error) => live && setError(err.message || "This request could not be read."));
    return () => {
      live = false;
    };
  }, [id]);

  const answer = async (approve: boolean) => {
    setBusy(approve ? "allow" : "deny");
    try {
      const { redirectTo } = await oauthAPI.decide(id, approve);
      window.location.assign(redirectTo);
    } catch (err) {
      setError((err as Error).message || "That did not go through. Start connecting again from the app.");
      setBusy(null);
    }
  };

  if (error) {
    return (
      <AuthCard title="This link has expired" description={error}>
        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard">Go to your dashboard</Link>
        </Button>
      </AuthCard>
    );
  }

  if (!request) {
    return (
      <AuthCard title="Connect an app">
        <div role="status" aria-label="Loading the request" className="flex flex-col gap-3">
          <SkeletonText width="80%" />
          <SkeletonText width="65%" />
          <SkeletonText width="70%" />
          <Skeleton className="mt-4 h-[var(--control-height)] w-full" />
        </div>
      </AuthCard>
    );
  }

  const app = request.client.name?.trim() || "An app";
  return (
    <AuthCard
      title={`Connect ${app}`}
      description={
        <>
          {app} wants to use TeXeR as <span className="font-medium text-foreground">{user?.email ?? "you"}</span>. Allow it only if you started connecting it just now.
        </>
      }
      footer={
        <>
          After you answer, you go back to <span className="font-mono text-foreground">{request.redirectHost}</span>. You can disconnect it at any time in{" "}
          <Link href="/settings" className="font-medium text-foreground underline underline-offset-4">
            Settings
          </Link>
          .
        </>
      }
    >
      <p className="type-small font-medium text-muted-foreground">It will be able to</p>
      <ul className="mt-3 flex flex-col gap-3">
        {CAN.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 type-base">
            <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            {text}
          </li>
        ))}
        <li className="flex items-start gap-3 type-base text-muted-foreground">
          <History aria-hidden className="mt-0.5 size-4 shrink-0" />
          Every change it makes is kept in the file&apos;s history, and shows live to anyone with the file open.
        </li>
      </ul>
      <div className="mt-8 flex gap-3">
        <Button type="button" variant="outline" className="flex-1" disabled={!!busy} onClick={() => void answer(false)}>
          {busy === "deny" ? "Declining…" : "Decline"}
        </Button>
        <Button type="button" className="flex-1" disabled={!!busy} onClick={() => void answer(true)}>
          {busy === "allow" ? "Connecting…" : "Allow"}
        </Button>
      </div>
    </AuthCard>
  );
}

export default function OAuthAuthorizePage() {
  return (
    <Suspense fallback={null}>
      <Consent />
    </Suspense>
  );
}
