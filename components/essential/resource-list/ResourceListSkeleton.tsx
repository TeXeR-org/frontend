"use client";

import type { ReactNode } from "react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/essential/layout/PageHeader";
import { cn } from "@/lib/utils";
import { ResourceListToolbar } from "./ResourceListToolbar";
import { useStoredView } from "./useStoredView";
import type { ResourcePreview } from "./types";

/** Each preview's box as ResourceListItem's callers draw it (projects, snips, PDFs), and how many rows fill a first screen of that list. */
const PREVIEW: Record<ResourcePreview, { box: string; rows: number }> = {
  icon: { box: "size-10", rows: 6 },
  thumb: { box: "size-32", rows: 4 },
  page: { box: "h-32 w-24", rows: 4 },
};

const TITLE_WIDTHS = ["38%", "52%", "30%", "46%", "34%", "42%"];

/** Rows in ResourceListItem's exact frame (the same border, radius, padding, gap, preview box, title line, time, and the actions button's space), so the list does not move when the items arrive. */
export function ResourceRowsSkeleton({ preview, label }: { preview: ResourcePreview; label: string }) {
  const { box, rows } = PREVIEW[preview];
  return (
    <div role="status" aria-label={label} className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="rounded-lg border border-line/60">
          <div className="flex items-center gap-4 p-4">
            <Skeleton className={cn("shrink-0 rounded-[var(--radius)]", box)} />
            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <SkeletonText className="min-w-0 flex-1 text-sm leading-tight" width={TITLE_WIDTHS[i % TITLE_WIDTHS.length]} />
              <SkeletonText className="w-[5.25rem] shrink-0 justify-end type-small" width="70%" />
              <span aria-hidden className="size-8 shrink-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Cards in ResourceGridCard's frame: the picture in its shape, then the title and the line under it. */
export function ResourceGridSkeleton({ coverRatio, label }: { coverRatio: "page" | "square"; label: string }) {
  return (
    <div role="status" aria-label={label} className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-card">
          <Skeleton className={cn("w-full rounded-none", coverRatio === "square" ? "aspect-square" : "aspect-[210/297]")} />
          <div className="flex flex-col gap-2 p-3">
            <SkeletonText className="type-base" width={TITLE_WIDTHS[i % TITLE_WIDTHS.length]} />
            <SkeletonText className="type-small" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

const noop = () => {};

/** A whole list page before its route has loaded: the real header (title, description, and the page's action), the real search bar, and the rows' skeleton. */
export function ResourceListSkeleton({ title, description, itemNoun, preview, action, archive = true }: { title: string; description: string; itemNoun: string; preview: ResourcePreview; action: ReactNode; archive?: boolean }) {
  // The view the list was left in, so the page does not switch from rows to cards when it arrives.
  const [view] = useStoredView(itemNoun);
  return (
    <Container className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6">
        <PageHeader title={title} description={description} actions={action} />
        <ResourceListToolbar
          itemNoun={itemNoun}
          searchQuery=""
          onSearchChange={noop}
          customTags={[]}
          selectedTag="all"
          onSelectedTagChange={noop}
          showArchived={false}
          onToggleArchived={noop}
          hasArchive={archive}
          view={view}
          onViewChange={noop}
        />
        {view === "grid" ? <ResourceGridSkeleton coverRatio={preview === "thumb" ? "square" : "page"} label={`Loading ${itemNoun}`} /> : <ResourceRowsSkeleton preview={preview} label={`Loading ${itemNoun}`} />}
      </div>
    </Container>
  );
}
