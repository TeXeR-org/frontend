"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Umami's recorder (recorder.js: session replays and click heatmaps, switched on, sampled, and masked from Umami's own settings), on the public pages only. A replay records the page as it is drawn, and inside the app that would be people's papers, projects, and account, so the app is never recorded:
 *
 *   - The recorder is loaded only on a page listed below. A page missing from the list is not recorded, which is the safe way to be wrong.
 *   - Once loaded it cannot be stopped, and moving into the app does not reload the page. So when the recorder has been loaded and the next page is not a public one, nothing of that page is drawn, and the browser loads it afresh; the fresh page has no recorder.
 */
const PUBLIC_PAGES = ["/features", "/pricing", "/about", "/contact", "/contribute", "/changelog", "/privacy", "/terms", "/refunds", "/docs", "/learn", "/library"];

function isPublic(pathname: string): boolean {
  return pathname === "/" || PUBLIC_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`));
}

declare global {
  interface Window {
    /** Set once the recorder has been put on the page; it stays until the page is loaded afresh. */
    __texerRecorder?: boolean;
  }
}

const RECORDER = {
  src: process.env.NEXT_PUBLIC_UMAMI_RECORDER_URL?.trim() || "",
  websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() || "",
};

export function RecordingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const recordable = !!RECORDER.src && isPublic(pathname);
  // Read while drawing, so a private page is held back in the same render that would have drawn it.
  const leaving = typeof window !== "undefined" && window.__texerRecorder === true && !isPublic(pathname);

  useEffect(() => {
    if (recordable) window.__texerRecorder = true;
  }, [recordable]);

  useLayoutEffect(() => {
    if (leaving) window.location.reload();
  }, [leaving]);

  return (
    <>
      {leaving ? null : children}
      {recordable && <Script id="umami-recorder" src={RECORDER.src} data-website-id={RECORDER.websiteId} strategy="afterInteractive" />}
    </>
  );
}
