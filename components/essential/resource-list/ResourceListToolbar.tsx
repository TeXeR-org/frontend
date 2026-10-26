"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Archive, LayoutGrid, List, Search } from "@/components/icons";

export type ResourceView = "list" | "grid"

interface ResourceListToolbarProps {
  /** The plural noun of the list as it reads in a sentence ("PDFs", "snips"), used as written. */
  itemNoun: string
  searchQuery: string
  onSearchChange: (value: string) => void
  customTags: string[]
  selectedTag: string
  onSelectedTagChange: (value: string) => void
  showArchived: boolean
  onToggleArchived: () => void
  hasArchive: boolean
  view: ResourceView
  onViewChange: (view: ResourceView) => void
  /** Drawn before the search. */
  start?: React.ReactNode
}

/** The kit's view toggle (Thry ui lists/ResourceList): two glyphs on one plate, each named by its tooltip, the chosen one lit. */
const segmented = "flex shrink-0 overflow-hidden rounded-[var(--radius)] border border-line bg-surface"
const segmentedButton = "inline-flex size-[var(--control-height)] items-center justify-center text-muted-foreground transition-[background-color,color] hover:text-foreground aria-pressed:bg-surface-hover aria-pressed:text-foreground"

/**
 * The list's search, label filter, archive toggle, and view toggle. It stays where it is while items are being selected (the selection bar sits under it), so a selection can be built up across several searches.
 */
export function ResourceListToolbar({
  itemNoun,
  searchQuery,
  onSearchChange,
  customTags,
  selectedTag,
  onSelectedTagChange,
  showArchived,
  onToggleArchived,
  hasArchive,
  view,
  onViewChange,
  start,
}: ResourceListToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      {start}
      <div className="relative flex-1">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label={`Search ${itemNoun}`}
          placeholder={`Search ${itemNoun}`}
          className="ps-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Custom labels filter: only when there are labels */}
      {customTags.length > 0 && (
        <Select value={selectedTag} onValueChange={onSelectedTagChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All labels</SelectItem>
            {customTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasArchive && (
        <Button variant={showArchived ? "default" : "outline"} onClick={onToggleArchived}>
          <Archive className="me-2 h-4 w-4" />
          {showArchived ? "Show active" : "Show archived"}
        </Button>
      )}

      <div className={segmented} role="group" aria-label="View">
        {(
          [
            { value: "list", label: "List view", icon: List },
            { value: "grid", label: "Grid view", icon: LayoutGrid },
          ] as const
        ).map(({ value, label, icon: Icon }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <button type="button" aria-label={label} aria-pressed={view === value} className={cn(segmentedButton)} onClick={() => onViewChange(value)}>
                <Icon aria-hidden className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
