import type { Metadata } from "next";

// This page is a client component, which cannot name itself; the title is set here. A one-time request: nothing for a search engine.
export const metadata: Metadata = { title: "Connect an app", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
