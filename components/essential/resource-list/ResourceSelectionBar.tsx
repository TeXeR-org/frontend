"use client";

import { Button } from "@/components/ui/button";
import { Archive, Tag, Trash2, X } from "@/components/icons";

interface ResourceSelectionBarProps {
  /** The plural noun of the list as it reads in a sentence ("PDFs", "snips"), used as written. */
  itemNoun: string;
  /** How many are selected, shown or not. */
  selectedCount: number;
  /** How many of the selected the current search and filters hide. */
  hiddenCount: number;
  /** How many items the current search and filters show, and whether every one of them is selected. */
  shownCount: number;
  allShownSelected: boolean;
  onSelectShown: () => void;
  onClear: () => void;
  hasArchive: boolean;
  hasLabel: boolean;
  onBulkArchive: () => void;
  onBulkLabel: () => void;
  onBulkDelete: () => void;
  onDone: () => void;
  /** The bulk delete's label, for a list whose items are only taken off it. */
  deleteLabel?: string;
}

/**
 * The bar under the toolbar while items are being selected. The search and filters stay above it, and a selection lasts through any number of searches: search, select, search again, select more, then act on all of them at once.
 */
export function ResourceSelectionBar({
  itemNoun,
  selectedCount,
  hiddenCount,
  shownCount,
  allShownSelected,
  onSelectShown,
  onClear,
  hasArchive,
  hasLabel,
  onBulkArchive,
  onBulkLabel,
  onBulkDelete,
  onDone,
  deleteLabel,
}: ResourceSelectionBarProps) {
  const some = selectedCount > 0;
  return (
    <div role="region" aria-label="Selection" className="flex flex-wrap items-center gap-2 rounded-[var(--radius-card)] border border-line bg-surface px-3 py-2">
      <p className="me-auto flex min-w-0 flex-wrap items-baseline gap-x-2 type-base" aria-live="polite">
        <span className="font-medium">{some ? `${selectedCount} selected` : `Select ${itemNoun}`}</span>
        {hiddenCount > 0 && <span className="type-small text-muted-foreground">{hiddenCount} not shown by this search</span>}
      </p>
      {shownCount > 0 && !allShownSelected && (
        <Button variant="ghost" onClick={onSelectShown}>
          {shownCount === 1 ? "Select the one shown" : `Select all ${shownCount} shown`}
        </Button>
      )}
      {some && (
        <>
          <Button variant="ghost" onClick={onClear}>
            Clear
          </Button>
          {hasArchive && (
            <Button variant="outline" onClick={onBulkArchive}>
              <Archive aria-hidden />
              Archive
            </Button>
          )}
          {hasLabel && (
            <Button variant="outline" onClick={onBulkLabel}>
              <Tag aria-hidden />
              Label
            </Button>
          )}
          <Button variant={deleteLabel ? "outline" : "destructive"} onClick={onBulkDelete}>
            {deleteLabel ? <X aria-hidden /> : <Trash2 aria-hidden />}
            {deleteLabel ?? "Delete"}
          </Button>
        </>
      )}
      <Button variant="ghost" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}
