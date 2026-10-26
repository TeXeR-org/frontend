"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, FolderOpen, ImageIcon, Upload, Loader2 } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { toast } from "sonner";

import {
  ResourceItem,
  ResourceListProps,
  ResourceItemCallbacks,
} from "./types";
import { ResourceGridCard, ResourceListItem } from "./ResourceListItem";
import { ResourceListToolbar } from "./ResourceListToolbar";
import { useStoredView } from "./useStoredView";
import { ResourceSelectionBar } from "./ResourceSelectionBar";
import { ResourceGridSkeleton, ResourceRowsSkeleton } from "./ResourceListSkeleton";
import { LabelDialog } from "./LabelDialog";
import { CloneDialog } from "./CloneDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { PageHeader, EmptyState } from "@/components/essential/layout/PageHeader";

/** The empty list's icon follows what the list holds: projects, images, or documents. */
const EMPTY_ICON = { icon: FolderOpen, thumb: ImageIcon, page: FileText } as const;

// Re-export types for backward compatibility
export type { ResourceItem, ResourceListProps } from "./types";

export function ResourceList<T extends ResourceItem>({
  items,
  isLoading,
  isUploading,
  title,
  itemNoun,
  preview,
  description,
  acceptFileType,
  fileTypeLabel,
  onUpload,
  onDelete,
  onArchive,
  onLabel,
  onRename,
  onItemClick,
  getPreviewUrl,
  renderItemCover,
  coverRatio = "page",
  formatFileSize,
  getMetadata,
  renderItemPreview,
  renderItemMetadata,
  renderItemPeople,
  getStatusBadge,
  renderHeaderActions,
  renderToolbarStart,
  removeLabel,
  empty,
  itemActions,
  tagColors = {},
  onClone,
  onExport,
}: ResourceListProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useStoredView(itemNoun);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState<boolean>(false);
  const [labelDialogIds, setLabelDialogIds] = useState<string[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [cloneSourceId, setCloneSourceId] = useState<string | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [deleteTargetEvent, setDeleteTargetEvent] =
    useState<React.MouseEvent | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ────────────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const isFileTypeAllowed = (file: File): boolean => {
    // Extensions, as the file input's accept takes them: ".tex,.zip".
    const extensions = acceptFileType.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.startsWith("."));
    if (extensions.length) {
      const name = file.name.toLowerCase();
      return extensions.some((e) => name.endsWith(e));
    }
    if (acceptFileType === "application/pdf") {
      return (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      );
    } else if (
      acceptFileType === "image/*" ||
      acceptFileType.startsWith("image/")
    ) {
      return (
        file.type.startsWith("image/") ||
        /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(file.name)
      );
    }
    return file.type === acceptFileType;
  };
  // Listen for file drops dispatched by the layout's DropZoneWrapper
  useEffect(() => {
    const handler = (e: Event) => {
      const file = (e as CustomEvent<File>).detail;
      if (file && isFileTypeAllowed(file)) {
        onUpload(file);
      } else if (file) {
        toast.error(`Only ${fileTypeLabel} files are supported`);
      }
    };
    window.addEventListener("texer:file-drop", handler);
    return () => window.removeEventListener("texer:file-drop", handler);
  }, [acceptFileType, fileTypeLabel, onUpload]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Selection handlers ───────────────────────────────────

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  /** Starts selecting with this item selected, at once (no animation to wait for); already selecting, it adds the item. */
  const handleSelectMode = (id?: string) => {
    setSelectMode(true);
    if (id) setSelectedIds((prev) => new Set(prev).add(id));
  };

  const handleExitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  // ── Bulk actions ─────────────────────────────────────────

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (removeLabel) {
      for (const id of selectedIds) await onDelete(id);
      handleExitSelectMode();
      return;
    }
    setDeleteTargetIds(Array.from(selectedIds));
    setDeleteTargetEvent(null);
    setIsDeleteDialogOpen(true);
  };

  const handleBulkArchive = async () => {
    if (!onArchive || selectedIds.size === 0) return;
    await onArchive(Array.from(selectedIds));
    if (selectMode) {
      setSelectedIds(new Set());
      setSelectMode(false);
    }
  };

  const handleBulkLabel = () => {
    if (selectedIds.size === 0) return;
    setLabelDialogIds(Array.from(selectedIds));
    setIsLabelDialogOpen(true);
  };

  // ── Label dialog ─────────────────────────────────────────

  const handleLabelDialog = (ids: string[]) => {
    setLabelDialogIds(ids);
    setIsLabelDialogOpen(true);
  };

  const handleAddTag = async (tag: string, color?: string) => {
    if (!onLabel || labelDialogIds.length === 0) return;
    try {
      await onLabel(labelDialogIds, tag, color);
      if (selectMode) {
        setSelectedIds(new Set());
        setSelectMode(false);
      }
    } catch (error) {
      console.error("Error adding label:", error);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!onLabel || labelDialogIds.length === 0) return;
    try {
      await onLabel(labelDialogIds, tag);
    } catch (error) {
      console.error("Error removing label:", error);
    }
  };

  const handleCancelLabelDialog = () => {
    setIsLabelDialogOpen(false);
    setLabelDialogIds([]);
  };

  // ── Rename ───────────────────────────────────────────────

  const handleStartRename = (item: T) => {
    setRenamingId(item.id);
    setRenameValue(item.title || "");
  };

  const handleSubmitRename = async (id: string) => {
    const trimmed = renameValue.trim();
    if (!trimmed || !onRename) {
      setRenamingId(null);
      return;
    }
    try {
      await onRename(id, trimmed);
      toast.success(`${One} renamed`);
    } catch (error) {
      toast.error(failure(error, `Could not rename the ${one}`));
    }
    setRenamingId(null);
  };

  // ── Item click ───────────────────────────────────────────

  const handleItemClick = (item: T, e?: React.MouseEvent) => {
    if (renamingId === item.id) return;
    if (selectMode) {
      e?.stopPropagation();
      handleToggleSelect(item.id);
    } else if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleItemDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (removeLabel) return void onDelete(id);
    setDeleteTargetIds([id]);
    setDeleteTargetEvent(e);
    setIsDeleteDialogOpen(true);
  };

  // What the list holds, one and many, for its messages: "projects" gives "Project deleted" and "3 projects deleted".
  const one = itemNoun.replace(/s$/, "");
  const One = one.charAt(0).toUpperCase() + one.slice(1);
  const failure = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);

  const handleConfirmClone = async (name: string) => {
    if (!cloneSourceId || !onClone) return;
    const toastId = toast.loading(`Cloning as “${name}”…`);
    try {
      await onClone(cloneSourceId, name);
      toast.success(`Cloned as “${name}”`, { id: toastId });
      setCloneSourceId(null);
    } catch (error) {
      console.error("Error cloning:", error);
      toast.error(failure(error, `Could not clone the ${one}`), { id: toastId });
    }
  };

  const handleConfirmDelete = async () => {
    const isBulk = deleteTargetIds.length > 1;
    try {
      for (const id of deleteTargetIds) {
        await onDelete(id);
      }
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        deleteTargetIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
      if (isBulk) {
        handleExitSelectMode();
      }
      // The one announcement of a delete: the page's handler stays quiet and throws on failure.
      toast.success(isBulk ? `${deleteTargetIds.length} ${itemNoun} deleted` : `${One} deleted`);
    } catch (error) {
      console.error("Error deleting item(s):", error);
      toast.error(failure(error, isBulk ? `Could not delete the ${itemNoun}` : `Could not delete the ${one}`));
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteTargetIds([]);
      setDeleteTargetEvent(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTargetIds([]);
    setDeleteTargetEvent(null);
  };

  // ── Filtering ────────────────────────────────────────────

  const customTags = Array.from(
    new Set(
      items
        .flatMap((item) => item.tags || [])
        .filter((tag) => tag !== "archived"),
    ),
  ).sort();

  const filteredItems = items.filter((item) => {
    const isArchived = item.tags?.includes("archived") || false;
    if (showArchived && !isArchived) return false;
    if (!showArchived && isArchived) return false;
    const matchesSearch = (item.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTag === "all" || item.tags?.includes(selectedTag) || false;
    return matchesSearch && matchesTag;
  });

  // ── Build item callbacks ─────────────────────────────────

  const itemCallbacks: ResourceItemCallbacks<T> = {
    selectMode,
    selectedIds,
    showArchived,
    renamingId,
    renameValue,
    onToggleSelect: handleToggleSelect,
    onItemClick: handleItemClick,
    onItemDelete: handleItemDelete,
    onSelectMode: handleSelectMode,
    onStartRename: handleStartRename,
    onSubmitRename: handleSubmitRename,
    onRenameValueChange: setRenameValue,
    onCancelRename: () => setRenamingId(null),
    onArchive: onArchive ? (ids) => onArchive(ids) : undefined,
    onLabel: onLabel ? (ids) => handleLabelDialog(ids) : undefined,
    // Clone asks for the copy's name first (CloneDialog).
    onClone: onClone ? (id) => setCloneSourceId(id) : undefined,
    onExport: onExport ? (id) => onExport(id) : undefined,
    onRenameAvailable: !!onRename,
    onLabelAvailable: !!onLabel,
    removeLabel,
    itemActions,
    renderItemPreview,
    renderItemCover,
    coverRatio,
    renderItemMetadata,
    renderItemPeople,
    getStatusBadge,
  };

  // The selection outlives searches and filters: what it holds that they hide is counted, and "Select all shown" adds to it.
  const shownIds = new Set(filteredItems.map((item) => item.id));
  const hiddenSelected = [...selectedIds].filter((id) => !shownIds.has(id)).length;
  const allShownSelected = filteredItems.length > 0 && filteredItems.every((item) => selectedIds.has(item.id));

  // ── Render ───────────────────────────────────────────────

  return (
    <Container className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6">
        <PageHeader
          title={title}
          description={description}
          actions={
            renderHeaderActions ? (
              renderHeaderActions()
            ) : (
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? <Loader2 className="animate-spin" aria-hidden /> : <Upload aria-hidden />}
                {isUploading ? "Uploading…" : `Upload ${fileTypeLabel}`}
              </Button>
            )
          }
        />
        <input type="file" ref={fileInputRef} className="hidden" accept={acceptFileType} onChange={handleFileSelect} />

        {/* Search, filters, and view: they stay while selecting, so a selection can grow across searches. */}
        <div className="flex flex-col gap-3">
          <ResourceListToolbar
            itemNoun={itemNoun}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            customTags={customTags}
            selectedTag={selectedTag}
            onSelectedTagChange={setSelectedTag}
            showArchived={showArchived}
            onToggleArchived={() => setShowArchived(!showArchived)}
            hasArchive={!!onArchive}
            view={view}
            onViewChange={setView}
            start={renderToolbarStart?.()}
          />
          {selectMode && (
            <ResourceSelectionBar
              itemNoun={itemNoun}
              selectedCount={selectedIds.size}
              hiddenCount={hiddenSelected}
              shownCount={filteredItems.length}
              allShownSelected={allShownSelected}
              onSelectShown={() => setSelectedIds((prev) => new Set([...prev, ...shownIds]))}
              onClear={() => setSelectedIds(new Set())}
              hasArchive={!!onArchive}
              hasLabel={!!onLabel}
              onBulkArchive={handleBulkArchive}
              onBulkLabel={handleBulkLabel}
              onBulkDelete={handleBulkDelete}
              onDone={handleExitSelectMode}
              deleteLabel={removeLabel}
            />
          )}
        </div>

        {/* Items List */}
        {isLoading ? (
          view === "grid" ? (
            <ResourceGridSkeleton coverRatio={coverRatio} label={`Loading ${itemNoun}`} />
          ) : (
            <ResourceRowsSkeleton preview={preview} label={`Loading ${itemNoun}`} />
          )
        ) : filteredItems.length === 0 && empty && !searchQuery ? (
          <EmptyState icon={EMPTY_ICON[preview]} title={empty.title} action={empty.action}>
            {empty.text}
          </EmptyState>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={EMPTY_ICON[preview]}
            title={searchQuery ? "Nothing matches that search" : `No ${itemNoun} yet`}
            action={
              !searchQuery && (
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload aria-hidden />
                  Upload {fileTypeLabel}
                </Button>
              )
            }
          >
            {searchQuery ? "Try another word, or clear the search." : `Upload your first ${fileTypeLabel} to get started.`}
          </EmptyState>
        ) : view === "grid" ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-4">
            {filteredItems.map((item) => (
              <ResourceGridCard key={item.id} item={item} previewUrl={getPreviewUrl?.(item) || null} metadata={getMetadata ? getMetadata(item) : null} callbacks={itemCallbacks} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const previewUrl = getPreviewUrl?.(item) || null;
              const metadata = getMetadata ? getMetadata(item) : null;
              return (
                <ResourceListItem
                  key={item.id}
                  item={item}
                  previewUrl={previewUrl}
                  metadata={metadata}
                  callbacks={itemCallbacks}
                />
              );
            })}
          </div>
        )}

        {/* Label Dialog */}
        <LabelDialog
          isOpen={isLabelDialogOpen}
          onOpenChange={(v) => {
            if (!v) handleCancelLabelDialog();
            else setIsLabelDialogOpen(true);
          }}
          currentTags={(
            items.find((i) => i.id === labelDialogIds[0])?.tags || []
          ).filter((t: string) => t !== "archived")}
          tagColors={tagColors}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />

        {/* Clone: name the copy first */}
        <CloneDialog
          source={items.find((i) => i.id === cloneSourceId) ?? null}
          taken={items.map((i) => i.title || "")}
          noun={one}
          onCancel={() => setCloneSourceId(null)}
          onConfirm={handleConfirmClone}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          itemCount={deleteTargetIds.length}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </Container>
  );
}
