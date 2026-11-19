"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "@/components/icons";
import { API_URL, apiFetch, projectsAPI } from "@/lib/api";
import { saveProjectThumbnail } from "@/lib/project-thumbnail";

/** Projects already looked at for a preview from their last compiled PDF, so a card asks once, not on every load. Kept in this browser, keyed by when the project last changed: a project edited since is looked at again. */
const LOOKED = "texer:preview-looked";
function looked(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LOOKED) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}
function markLooked(uid: string, updatedAt: string) {
  try {
    localStorage.setItem(LOOKED, JSON.stringify({ ...looked(), [uid]: updatedAt }));
  } catch {
    // Private storage off: it is looked at again next time.
  }
}

/** One at a time: a grid of old projects does not download all their PDFs at once. */
let queue: Promise<unknown> = Promise.resolve();
function backfill(uid: string): Promise<string | null> {
  const run = queue.then(async () => {
    const key = await projectsAPI.latestBuild(uid);
    if (!key) return null;
    const response = await apiFetch(`${API_URL}/projects/${uid}/pdf?key=${encodeURIComponent(key)}`);
    if (!response.ok) return null;
    return saveProjectThumbnail(uid, new Uint8Array(await response.arrayBuffer()), { force: true });
  });
  queue = run.catch(() => null);
  return run.catch(() => null);
}

/**
 * A project's card picture in the grid: the first page of its main document as it last compiled. The editor keeps that picture after each successful compile, so the grid only shows an image and never compiles. A project compiled before pictures were kept gets one once, from its last compiled PDF, made in this browser when its card first comes into view (editors only, since the picture is the project's). Without either, the project's icon.
 */
export function ProjectCover({ uid, thumbnailAt, updatedAt, canEdit }: { uid: string; thumbnailAt: string | null; updatedAt: string; canEdit: boolean }) {
  // The preview this card made from the last compiled PDF, when the list did not have one.
  const [made, setMade] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const at = thumbnailAt ?? made;

  useEffect(() => {
    if (at || !canEdit || looked()[uid] === updatedAt) return;
    const el = box.current;
    if (!el) return;
    let live = true;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      markLooked(uid, updatedAt);
      void backfill(uid).then((saved) => live && saved && setMade(saved));
    });
    observer.observe(el);
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [at, canEdit, uid, updatedAt]);

  return (
    <div ref={box} className="flex size-full items-center justify-center">
      {at && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element -- an image of the API's, with the person's sign-in; next/image would fetch it from the site's server instead.
        <img src={projectsAPI.thumbnailUrl(uid, at)} alt="" loading="lazy" decoding="async" className="size-full object-cover object-top" onError={() => setBroken(true)} />
      ) : (
        <FileText aria-hidden className="size-10 text-muted-foreground/60" />
      )}
    </div>
  );
}
