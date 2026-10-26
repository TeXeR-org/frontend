"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** The first free copy name: "Paper (copy)", then "Paper (copy 2)", "Paper (copy 3)". A copy of a copy counts from the original's name, so cloning "Paper (copy)" offers "Paper (copy 2)", not "Paper (copy) (copy)". Names are compared without regard to case. */
export function nextCopyName(title: string, taken: readonly string[]): string {
  const base = title.replace(/\s*\(copy(?: \d+)?\)$/i, "").trim() || title.trim();
  const used = new Set(taken.map((name) => name.trim().toLowerCase()));
  for (let n = 1; ; n++) {
    const name = n === 1 ? `${base} (copy)` : `${base} (copy ${n})`;
    if (!used.has(name.toLowerCase())) return name;
  }
}

interface CloneDialogProps {
  /** The item being cloned; null when closed. */
  source: { title?: string } | null;
  /** Every title in the list, so the name offered is not one already in use. */
  taken: readonly string[];
  /** What the list holds, singular, for the dialog's words ("project"). */
  noun: string;
  onCancel: () => void;
  /** Makes the copy under `name`; the dialog stays open, busy, until it settles. */
  onConfirm: (name: string) => Promise<void>;
}

/** Clone asks for the copy's name first: the next free "(copy)" name, already selected, so typing replaces it and Enter keeps it. */
export function CloneDialog({ source, taken, noun, onCancel, onConfirm }: CloneDialogProps) {
  // Null until the person types: the field shows the suggested name, worked out from the item, so it is there from the first frame.
  const [typed, setTyped] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const name = typed ?? (source ? nextCopyName(source.title ?? "", taken) : "");
  const trimmed = name.trim();
  const close = () => {
    setTyped(null);
    onCancel();
  };

  const submit = async () => {
    if (!trimmed || busy) return;
    setBusy(true);
    try {
      await onConfirm(trimmed);
      setTyped(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={!!source}
      onOpenChange={(open) => {
        if (!open && !busy) close();
      }}
    >
      <DialogContent
        className="@min-[40rem]:max-w-md"
        onOpenAutoFocus={(event) => {
          // The suggested name opens selected, ready to be typed over or kept with Enter.
          event.preventDefault();
          input.current?.focus();
          input.current?.select();
        }}
      >
        <DialogHeader>
          <DialogTitle>Clone {noun}</DialogTitle>
          <DialogDescription>
            A copy of “{source?.title}” with all its files. Name the copy.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="flex flex-col gap-4"
        >
          <Input ref={input} value={name} onChange={(event) => setTyped(event.target.value)} aria-label={`Name of the copy`} disabled={busy} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" disabled={!trimmed || busy}>
              {busy ? "Cloning…" : "Clone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
